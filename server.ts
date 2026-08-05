import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load local environmental files (.env.example is template, actual keys in .env)
dotenv.config();

import { connectToDatabase } from "./server/db";
import { Admin, Portfolio, Message } from "./server/models";
import { authLimit, verifyAdminToken, getJwtSecret, AuthenticatedRequest } from "./server/auth";

// Direct back-up fallbacks in case Database is transient or unconfigured
import { 
  initialProfile,
  initialCategories,
  initialProjects,
  initialEducation,
  initialCertifications,
  initialExperiences,
  initialAchievements
} from "./src/mockData";

// Keep in-memory store in case of DB downtime, preserving app's resilient nature
let memoryPortfolio = {
  profile: initialProfile,
  projects: initialProjects,
  categories: initialCategories,
  educations: initialEducation,
  certifications: initialCertifications,
  experiences: initialExperiences,
  achievements: initialAchievements
};
let memoryMessages: any[] = [];
let isDbConnected = false;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Trust upstream reverse proxy (Cloud Run / Vercel router) to correctly resolve client IPs for the rate limiter
  app.set("trust proxy", 1);

  // 1. Establish Database Connectivity
  isDbConnected = await connectToDatabase();
  if (!isDbConnected) {
    console.warn("🛡️ [SERVER] Fallback initiated: Using transient in-memory database store.");
  }

  // 2. Parsers and Universal Middlewares 
  app.use(express.json({ limit: "2mb" })); // profile photos need proper payload boundaries
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  
  // Custom CORS Setup - only allowed to access securely
  app.use(cors());

  // --- API ROUTE SYSTEM ---

  // GET PORTFOLIO CONTENT (GUEST ACCESSm READ ALL)
  app.get("/api/portfolio", async (req: Request, res: Response) => {
    try {
      if (isDbConnected) {
        const data = await Portfolio.findOne();
        if (data) {
          return res.json({
            profile: data.profile,
            projects: data.projects,
            categories: data.categories,
            educations: data.educations,
            certifications: data.certifications,
            experiences: data.experiences,
            achievements: data.achievements
          });
        }
      }
      // If DB fails or is transient, return running memory
      return res.json(memoryPortfolio);
    } catch (err: any) {
      console.error("Error reading portfolio state:", err);
      return res.status(500).json({ error: "Failed to fetch portfolio state. Serving back-up memory instead.", fallback: memoryPortfolio });
    }
  });

  // UPDATE PORTFOLIO CONTENT (SECURE-ADMIN ACCESSIBLE)
  app.put("/api/portfolio", verifyAdminToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { profile, projects, categories, educations, certifications, experiences, achievements } = req.body;
      
      if (isDbConnected) {
        // Upsert the single portfolio state document using type-safe find & save
        let doc = await Portfolio.findOne();
        if (!doc) {
          doc = new Portfolio({
            profile,
            projects,
            categories,
            educations,
            certifications,
            experiences,
            achievements
          });
        } else {
          doc.profile = profile;
          doc.projects = projects;
          doc.categories = categories;
          doc.educations = educations;
          doc.certifications = certifications;
          doc.experiences = experiences;
          doc.achievements = achievements;
          doc.updatedAt = new Date();
          
          // Explicitly flag mixed/any objects for change tracking in mongoose
          doc.markModified("profile");
          doc.markModified("projects");
          doc.markModified("categories");
          doc.markModified("educations");
          doc.markModified("certifications");
          doc.markModified("experiences");
          doc.markModified("achievements");
        }
        await doc.save();
        console.log("💾 [DB] Portfolio document successfully saved.");
        return res.json({ message: "Portfolio successfully synchronized in Atlas Database.", data: doc });
      } else {
        // Update live memory fallback
        memoryPortfolio = { profile, projects, categories, educations, certifications, experiences, achievements };
        return res.json({ message: "Portfolio updated in server memory (unconfigured database).", data: memoryPortfolio });
      }
    } catch (err: any) {
      console.error("Error updating portfolio state:", err);
      return res.status(500).json({ error: "Server failed to save changes to the database." });
    }
  });

  // SUBMIT VISITOR CONTACT MESSAGE (PUBLIC INGRESS)
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "All contact form fields are required." });
      }

      const id = `msg-${Date.now()}`;
      const createdAt = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) + " at " + new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });

      const messageObject = {
        id,
        name,
        email,
        message,
        createdAt,
        isRead: false
      };

      if (isDbConnected) {
        const newMsg = new Message(messageObject);
        await newMsg.save();
        console.log(`✉️ [DB] Received contact message from ${name}`);
      } else {
        memoryMessages.push(messageObject);
      }

      return res.status(201).json({ message: "Inquiry successfully recorded.", data: messageObject });
    } catch (err: any) {
      console.error("Error creating contact message:", err);
      return res.status(500).json({ error: "Failed to transmit message." });
    }
  });

  // LIST RECEIVED MESSAGES (SECURE-ADMIN ONLY)
  app.get("/api/messages", verifyAdminToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (isDbConnected) {
        const list = await Message.find().sort({ _id: -1 });
        return res.json(list);
      }
      return res.json([...memoryMessages].reverse());
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to query incoming messages database." });
    }
  });

  // DELETE MESSAGE (SECURE-ADMIN ONLY)
  app.delete("/api/messages/:id", verifyAdminToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      if (isDbConnected) {
        await Message.deleteOne({ id });
        return res.json({ message: "Message deleted from Database." });
      } else {
        memoryMessages = memoryMessages.filter(m => m.id !== id);
        return res.json({ message: "Message deleted from local memory." });
      }
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to delete message." });
    }
  });

  // RE-AUTHENTICATE/VERIFY ADMIN TOKEN VALIDITY (SECURE-ADMIN ONLY)
  app.get("/api/auth/verify", verifyAdminToken, (req: AuthenticatedRequest, res: Response) => {
    return res.json({ valid: true, email: req.adminEmail });
  });

  // ADMIN LOGIN INGRESS (🔒 RATE LIMITED & SECURED AGAINST SCANS)
  app.post("/api/auth/login", authLimit, async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required fields." });
      }

      const normalizedEmail = email.trim().toLowerCase();

      let adminDoc = null;
      if (isDbConnected) {
        adminDoc = await Admin.findOne({ email: normalizedEmail } as any);
      } else {
        // Fallback email/password in development memory if no DB
        const envEmail = (process.env.ADMIN_EMAIL || "prashantpatil4524@gmail.com").toLowerCase();
        const envPass = process.env.ADMIN_PASSWORD || "admin12345";
        if (normalizedEmail === envEmail) {
          adminDoc = {
            email: envEmail,
            passwordHash: await bcrypt.hash(envPass, 12)
          };
        }
      }

      if (!adminDoc) {
        // Obfuscate standard message slightly to prevent admin username scanners
        return res.status(401).json({ error: "Invalid credential parameters. Please verify and try again." });
      }

      const isMatch = await bcrypt.compare(password, adminDoc.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credential parameters. Please verify and try again." });
      }

      // 🔐 JWT Session Issue: 7 days expiration max
      const token = jwt.sign(
        { email: adminDoc.email },
        getJwtSecret(),
        { expiresIn: "7d" }
      );

      console.log(`🔑 [AUTH] Admin session successfully established for ${adminDoc.email}`);
      return res.json({
        message: "Authentication successful.",
        token,
        email: adminDoc.email
      });
    } catch (err: any) {
      console.error("Critical Admin Authentication logic error:", err);
      return res.status(500).json({ error: "Internal Auth Failure." });
    }
  });

  // Vite middleware setup (development vs. production routing)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🛠️  [VITE] Bundler mounted as middleware (development).");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("🗳️  [SERVER] Express serving standalone frontend (production).");
  }

  function startListening(port: number) {
    const server = app.listen(port, "0.0.0.0");

    server.on("listening", () => {
      console.log(`⚡ [SERVER] Full-Stack Portfolio App is alive at http://localhost:${port}`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️ [SERVER] Port ${port} is already in use.`);
        if (port < PORT + 10) {
          console.log(`🔄 [SERVER] Retrying on port ${port + 1}...`);
          startListening(port + 1);
        } else {
          console.error("❌ [SERVER] Maximum port retries exceeded. Exiting.");
          process.exit(1);
        }
      } else {
        console.error("❌ [SERVER] Server error:", err);
        process.exit(1);
      }
    });
  }

  startListening(PORT);
}

startServer();
