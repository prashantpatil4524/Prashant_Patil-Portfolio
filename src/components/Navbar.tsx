import { Lock, Linkedin, Twitter, Mail, Phone, Github, Code2 } from "lucide-react";
import { ProfileDetails } from "../types";
import { getDirectImageUrl, sanitizeUrl } from "../utils";

interface NavbarProps {
  profile: ProfileDetails;
  isAdminLoggedIn: boolean;
  onEnterAdmin: () => void;
  onScrollTo: (sectionId: string) => void;
  activeSection: string;
  theme: "racing-red" | "emerald-green" | "cosmic-indigo" | "alabaster-gold" | "obsidian-gold";
  onThemeChange: (newTheme: "racing-red" | "emerald-green" | "cosmic-indigo" | "alabaster-gold" | "obsidian-gold") => void;
}

export default function Navbar({
  profile,
  isAdminLoggedIn,
  onEnterAdmin,
  onScrollTo,
  activeSection,
  theme,
  onThemeChange
}: NavbarProps) {

  const themesList = [
    { id: "racing-red", name: "Redline Red", colorClass: "bg-red-600 border-red-400" },
    { id: "emerald-green", name: "Hacker Green", colorClass: "bg-emerald-500 border-emerald-350" },
    { id: "cosmic-indigo", name: "Cosmic Indigo", colorClass: "bg-indigo-600 border-indigo-400" },
    { id: "alabaster-gold", name: "Luxury Alabaster", colorClass: "bg-amber-100 border-amber-400" },
    { id: "obsidian-gold", name: "Obsidian Gold", colorClass: "bg-yellow-500 border-yellow-300" }
  ] as const;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-glass-stroke transition-all duration-500">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
        
        {/* BRAND LOGO */}
        <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => onScrollTo("home")}>
          <div className="w-10 h-10 border border-glass-stroke bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex-shrink-0">
            <img 
              src={getDirectImageUrl(profile?.avatar) || "https://lh3.googleusercontent.com/aida-public/AB6AXuDVZ0xcBJsgUoB2TpB2yVaJ8rzAUSgcj9ugD0sE_-nohH7TZKntf5JrKzClYsvWBH93RfnIJP5RAmrAnOy8qjiWO6EzUZo998ylK8qgPNaWD9RxR3hzIOsZ8F8Jt19eNKeMnsmDVBByTMraOcn_3lVQiEz6eToXl2h6KC7A28bvn3xqWgACr9kK94i6yGK8wQPzlkpMGsS_cDijqt32QlI7A7DwPCsargxxvHg9moJks6uemeReIbZlAa6rJiFBydjfz05mDRy1WBB8"} 
              alt="Prashant Portrait" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <div className="font-display font-black text-sm tracking-wider text-black dark:text-white uppercase leading-none">
              Prashant Patil
            </div>
            <p className="text-[9px] text-primary uppercase tracking-widest font-mono font-bold mt-1">M.C.A. Scholar</p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onScrollTo("home")}
            className={`font-label-md text-xs uppercase tracking-widest transition-all cursor-pointer ${
              activeSection === "home" 
                ? "text-primary font-bold border-b-2 border-primary pb-1" 
                : "text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => onScrollTo("projects")}
            className={`font-label-md text-xs uppercase tracking-widest transition-all cursor-pointer ${
              activeSection === "projects" 
                ? "text-primary font-bold border-b-2 border-primary pb-1" 
                : "text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Projects
          </button>
          <button 
            onClick={() => onScrollTo("about")}
            className={`font-label-md text-xs uppercase tracking-widest transition-all cursor-pointer ${
              activeSection === "about" 
                ? "text-primary font-bold border-b-2 border-primary pb-1" 
                : "text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            About
          </button>
          <button 
            onClick={() => onScrollTo("certifications")}
            className={`font-label-md text-xs uppercase tracking-widest transition-all cursor-pointer ${
              activeSection === "certifications" 
                ? "text-primary font-bold border-b-2 border-primary pb-1" 
                : "text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Credentials
          </button>
          <button 
            onClick={() => onScrollTo("contact")}
            className={`font-label-md text-xs uppercase tracking-widest transition-all cursor-pointer ${
              activeSection === "contact" 
                ? "text-primary font-bold border-b-2 border-primary pb-1" 
                : "text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Contact
          </button>
        </div>

        {/* TRANSITIONAL UTILS AREA */}
        <div className="flex items-center gap-4">
          
          {/* CONTACT & SOCIAL SYMBOLS GROUP sticky top corner */}
          <div className="hidden lg:flex items-center gap-4 border-r border-[#eaeaea] dark:border-zinc-800 pr-4 text-zinc-550 dark:text-zinc-400">
            {profile?.linkedin && (
              <a href={sanitizeUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all duration-300 hover:scale-115" title="LinkedIn Profile">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile?.twitter && (
              <a href={sanitizeUrl(profile.twitter)} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all duration-300 hover:scale-115" title="Twitter Profile">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {profile?.github && (
              <a href={sanitizeUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all duration-300 hover:scale-115" title="GitHub Directory">
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.leetcode && (
              <a href={sanitizeUrl(profile.leetcode)} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all duration-300 hover:scale-115" title="LeetCode Profile">
                <Code2 className="w-4 h-4" />
              </a>
            )}
            {profile?.email && (
              <a href={sanitizeUrl(`mailto:${profile.email}`)} className="hover:text-primary transition-all duration-300 hover:scale-115" title="Send Email">
                <Mail className="w-4 h-4" />
              </a>
            )}
            {profile?.phone && (
              <a href={sanitizeUrl(`tel:${profile.phone}`)} className="hover:text-primary transition-all duration-300 hover:scale-115" title="Call Direct">
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* THEME PICKER (4 COLOR DOT INTEGRATOR) */}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 border border-glass-stroke p-1 px-1.5 rounded-none">
            <span className="text-[9px] uppercase font-mono text-zinc-400 tracking-wider hidden sm:inline mr-1">Theme</span>
            {themesList.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`w-4 h-4 rounded-full border cursor-pointer transition-all ${t.colorClass} ${
                  theme === t.id 
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-black scale-110" 
                    : "opacity-45 hover:opacity-100"
                }`}
                title={`Switch to ${t.name}`}
              />
            ))}
          </div>

          {/* ADMIN CONSOLE GATEWAY TRIGGER */}
          <button 
            onClick={onEnterAdmin}
            className="px-4 py-2 border border-primary/30 hover:border-primary bg-transparent text-black dark:text-white text-xs font-label-md uppercase tracking-wider transition-all duration-300 rounded-none cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md"
          >
            <Lock className="w-3 h-3 text-primary" />
            {isAdminLoggedIn ? "CMS" : "Admin"}
          </button>
        </div>

      </div>
    </nav>
  );
}
