import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

// Fallback JWT secret generated on server startup for high security if JWT_SECRET environment key is not specified.
const DEFAULT_JWT_SECRET = crypto.randomBytes(32).toString("hex");

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 10) {
    return DEFAULT_JWT_SECRET;
  }
  return secret;
}

// 🔐 SECURITY RULE: Rate limiting for Admin authentication login route
// Max 10 attempts per 15 minutes to block brute-force scanners
export const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                 // Limit each IP to 10 requests per windowMs
  message: { 
    error: "Too many login attempts from this source. Please wait 15 minutes before retrying." 
  },
  standardHeaders: true,   // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,    // Disable the `X-RateLimit-*` headers
});

// Custom authorization interface for Express Request
export interface AuthenticatedRequest extends Request {
  adminEmail?: string;
}

// 🔑 JWT Verification Middleware
export function verifyAdminToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied: Bearer Authorization token is missing." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { email: string };
    req.adminEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid/Expired Authorization session. Please re-authenticate." });
  }
}
