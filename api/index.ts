import express, { Request, Response } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import { connectToDatabase } from "../server/db";
import { Admin, Portfolio, Message } from "../server/models";
import { authLimit, verifyAdminToken, getJwtSecret, AuthenticatedRequest } from "../server/auth";

import {
  initialProfile,
  initialCategories,
  initialProjects,
  initialEducation,
  initialCertifications,
  initialExperiences,
  initialAchievements,
} from "../src/mockData";

// In-memory fallback (lives for the duration of a serverless invocation)
let memoryPortfolio = {
  profile: initialProfile,
  projects: initialProjects,
  categories: initialCategories,
  educations: initialEducation,
  certifications: initialCertifications,
  experiences: initialExperiences,
  achievements: initialAchievements,
};
let memoryMessages: any[] = [];
let isDbConnected = false;
let dbInitialized = false;

// Singleton DB connection — avoid reconnecting on every invocation
async function ensureDb() {
  if (!dbInitialized) {
    isDbConnected = await connectToDatabase();
    dbInitialized = true;
  }
}

const app = express();

app.set("trust proxy", 1);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cors());

app.get("/api/ping", (req: Request, res: Response) => {
  res.json({ message: "pong", dbInitialized, isDbConnected });
});

// ── Middleware: ensure DB is connected before handling any request ──
app.use(async (_req, _res, next) => {
  await ensureDb();
  next();
});

// ── GET PORTFOLIO ──────────────────────────────────────────────────
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
          achievements: data.achievements,
        });
      }
    }
    return res.json(memoryPortfolio);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch portfolio.", fallback: memoryPortfolio });
  }
});

// ── UPDATE PORTFOLIO ───────────────────────────────────────────────
app.put("/api/portfolio", verifyAdminToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { profile, projects, categories, educations, certifications, experiences, achievements } = req.body;

    if (isDbConnected) {
      let doc = await Portfolio.findOne();
      if (!doc) {
        doc = new Portfolio({ profile, projects, categories, educations, certifications, experiences, achievements });
      } else {
        doc.profile = profile;
        doc.projects = projects;
        doc.categories = categories;
        doc.educations = educations;
        doc.certifications = certifications;
        doc.experiences = experiences;
        doc.achievements = achievements;
        doc.updatedAt = new Date();
        doc.markModified("profile");
        doc.markModified("projects");
        doc.markModified("categories");
        doc.markModified("educations");
        doc.markModified("certifications");
        doc.markModified("experiences");
        doc.markModified("achievements");
      }
      await doc.save();
      return res.json({ message: "Portfolio updated in Atlas Database.", data: doc });
    } else {
      memoryPortfolio = { profile, projects, categories, educations, certifications, experiences, achievements };
      return res.json({ message: "Portfolio updated in server memory.", data: memoryPortfolio });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server failed to save changes." });
  }
});

// ── CONTACT MESSAGES ───────────────────────────────────────────────
app.post("/api/messages", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All contact form fields are required." });
    }

    const id = `msg-${Date.now()}`;
    const createdAt =
      new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " at " +
      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const messageObject = { id, name, email, message, createdAt, isRead: false };

    if (isDbConnected) {
      const newMsg = new Message(messageObject);
      await newMsg.save();
    } else {
      memoryMessages.push(messageObject);
    }

    return res.status(201).json({ message: "Inquiry recorded.", data: messageObject });
  } catch (err) {
    return res.status(500).json({ error: "Failed to transmit message." });
  }
});

app.get("/api/messages", verifyAdminToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (isDbConnected) {
      const list = await Message.find().sort({ _id: -1 });
      return res.json(list);
    }
    return res.json([...memoryMessages].reverse());
  } catch (err) {
    return res.status(500).json({ error: "Failed to query messages." });
  }
});

app.delete("/api/messages/:id", verifyAdminToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      await Message.deleteOne({ id });
      return res.json({ message: "Message deleted." });
    } else {
      memoryMessages = memoryMessages.filter((m) => m.id !== id);
      return res.json({ message: "Message deleted from memory." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete message." });
  }
});

// ── AUTH ───────────────────────────────────────────────────────────
app.get("/api/auth/verify", verifyAdminToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ valid: true, email: req.adminEmail });
});

app.post("/api/auth/login", authLimit, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let adminDoc: any = null;

    if (isDbConnected) {
      adminDoc = await Admin.findOne({ email: normalizedEmail } as any);
    }

    // Fallback: check env credentials when DB is unavailable or admin not yet seeded
    if (!adminDoc) {
      const envEmail = (process.env.ADMIN_EMAIL || "prashantpatil4524@gmail.com").toLowerCase();
      const envPass = process.env.ADMIN_PASSWORD || "admin12345";
      if (normalizedEmail === envEmail) {
        const isEnvMatch = await bcrypt.compare(password, await bcrypt.hash(envPass, 12));
        // Direct string comparison as fallback since we can't store hash across invocations
        if (password === envPass) {
          const token = jwt.sign({ email: envEmail }, getJwtSecret(), { expiresIn: "7d" });
          return res.json({ message: "Authentication successful.", token, email: envEmail });
        }
      }
      return res.status(401).json({ error: "Invalid credential parameters. Please verify and try again." });
    }

    const isMatch = await bcrypt.compare(password, adminDoc.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credential parameters. Please verify and try again." });
    }

    const token = jwt.sign({ email: adminDoc.email }, getJwtSecret(), { expiresIn: "7d" });
    return res.json({ message: "Authentication successful.", token, email: adminDoc.email });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ error: "Internal Auth Failure." });
  }
});

// Export for Vercel serverless
export default app;
