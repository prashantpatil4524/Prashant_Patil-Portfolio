import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin, Portfolio } from "./models";

// Import raw initial data for auto-seeding if Database starts empty
import { 
  initialProfile,
  initialCategories,
  initialProjects,
  initialEducation,
  initialCertifications,
  initialExperiences,
  initialAchievements
} from "../src/mockData";

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️  [DB] MONGO_URI environment variable is missing.");
    console.warn("⚠️  [DB] Running in transient mode. Data edits will not persist to MongoDB Atlas.");
    return false;
  }

  try {
    // Enable Mongoose strictQuery for neat schema parsing
    mongoose.set("strictQuery", true);
    
    await mongoose.connect(uri, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });
    console.log("🚀 [DB] Verified connectivity to MongoDB Atlas.");
    
    // Auto-seed Admin and Portfolio
    await seedAdmin();
    await seedPortfolio();
    
    return true;
  } catch (error) {
    console.error("❌ [DB] Error, connection to MongoDB Atlas failed:", error);
    return false;
  }
}

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "prashantpatil4524@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
    
    const count = await Admin.countDocuments();
    if (count === 0) {
      console.log(`👤 [DB] Admin account not found. Generating secure credential for ${adminEmail}...`);
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(adminPassword, salt);
      
      const newAdmin = new Admin({
        email: adminEmail,
        passwordHash
      });
      await newAdmin.save();
      console.log("✅ [DB] Secure Admin credentials successfully synchronized.");
    } else {
      // In case admin password was updated in env, let's sync state
      const existing = await Admin.findOne({ email: adminEmail.toLowerCase() } as any);
      if (existing) {
        // We can check if we want to force sync, but simply maintaining existing is standard secure practice.
        console.log(`👤 [DB] Core authorized Admin account validated: ${adminEmail}`);
      }
    }
  } catch (err) {
    console.error("❌ [DB] Admin seeding routine encountered an issue:", err);
  }
}

async function seedPortfolio() {
  try {
    const count = await Portfolio.countDocuments();
    if (count === 0) {
      console.log("📦 [DB] Portfolio CMS starts empty. Deploying initial seed content from mockData.ts...");
      const seeded = new Portfolio({
        profile: initialProfile,
        projects: initialProjects,
        categories: initialCategories,
        educations: initialEducation,
        certifications: initialCertifications,
        experiences: initialExperiences,
        achievements: initialAchievements
      });
      await seeded.save();
      console.log("✅ [DB] Portfolio seed document created successfully.");
    } else {
      console.log("📦 [DB] Portfolio assets successfully resolved.");
    }
  } catch (err) {
    console.error("❌ [DB] Portfolio seeding routine encountered an issue:", err);
  }
}
