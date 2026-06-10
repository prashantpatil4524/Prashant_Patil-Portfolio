export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  category: string;
  date: string;
  tags: string[];
  image: string;
  version: string;
  isPublic: boolean;
  teamSize?: string;
  projectLink?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  proofLink?: string;
}

export interface ProfileDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  longBio: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  leetcode?: string;
  avatar?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  date: string;
  grade: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  details: string;
}
