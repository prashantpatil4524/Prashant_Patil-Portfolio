import mongoose, { Schema, Document } from "mongoose";

// --- ADMIN SCHEMAS ---
export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

// --- CONCRETE MESSAGE SCHEMA ---
export interface IMessage extends Document {
  id: string; // client-safe custom identifier (e.g., msg-123456)
  name: string;
  email: string;
  message: string;
  createdAt: string; // human readable string
  isRead: boolean;
}

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, required: true },
  isRead: { type: Boolean, default: false }
});

export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

// --- UNIFIED PORTFOLIO STATIC/CMS DATA SCHEMAS ---
export interface IPortfolio extends Document {
  profile: any;
  projects: any[];
  categories: any[];
  educations: any[];
  certifications: any[];
  experiences: any[];
  achievements: any[];
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>({
  profile: { type: Schema.Types.Mixed, required: true },
  projects: { type: [Schema.Types.Mixed], default: [] } as any,
  categories: { type: [Schema.Types.Mixed], default: [] } as any,
  educations: { type: [Schema.Types.Mixed], default: [] } as any,
  certifications: { type: [Schema.Types.Mixed], default: [] } as any,
  experiences: { type: [Schema.Types.Mixed], default: [] } as any,
  achievements: { type: [Schema.Types.Mixed], default: [] } as any,
  updatedAt: { type: Date, default: Date.now }
});

export const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
