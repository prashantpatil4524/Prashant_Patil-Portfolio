import { useState, useEffect } from "react";
import { Project, Category, ContactMessage, ProfileDetails, EducationItem, Certification, ExperienceItem, AchievementItem } from "./types";
import { 
  initialProfile, 
  initialCategories, 
  initialProjects, 
  initialEducation, 
  initialCertifications,
  initialExperiences,
  initialAchievements
} from "./mockData";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutAndExperience from "./components/AboutAndExperience";
import IntelligenceArsenal from "./components/IntelligenceArsenal";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import ShaderBackground from "./components/ShaderBackground";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  
  // CORE DATABASE STATE ENGINE
  const [profile, setProfile] = useState<ProfileDetails>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [educations, setEducations] = useState<EducationItem[]>(initialEducation);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // APPLICATION ROUTING / VIEW STATE / SECURITY TOKEN
  const [viewMode, setViewMode] = useState<"portfolio" | "login" | "admin" >("portfolio");
  const [activeSection, setActiveSection] = useState("home");
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem("admin_token"));

  // DYNAMIC 4-THEMES STATE (LOADS & PERSISTS CHOSEN MODE)
  const [theme, setTheme] = useState<"racing-red" | "emerald-green" | "cosmic-indigo" | "alabaster-gold">("racing-red");

  // LOAD PORTFOLIO & VERIFY SESSION ON BOOT
  useEffect(() => {
    // 1. Fetch live CMS portfolio state from Express MongoDB API
    const loadPortfolioData = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (response.ok) {
          const data = await response.json();
          if (data.profile) setProfile(data.profile);
          if (data.projects) setProjects(data.projects);
          if (data.categories) setCategories(data.categories);
          if (data.educations) setEducations(data.educations);
          if (data.certifications) setCertifications(data.certifications);
          if (data.experiences) setExperiences(data.experiences);
          if (data.achievements) setAchievements(data.achievements);
        } else {
          loadFromLocalFallback();
        }
      } catch (err) {
        console.warn("⚠️ Mode: Backend unavailable or offline. Falling back to local/static seed.");
        loadFromLocalFallback();
      }
    };

    const loadFromLocalFallback = () => {
      try {
        const storedProfile = localStorage.getItem("cms_profile");
        if (storedProfile) setProfile(JSON.parse(storedProfile));

        const storedProjects = localStorage.getItem("cms_projects");
        if (storedProjects) setProjects(JSON.parse(storedProjects));

        const storedCategories = localStorage.getItem("cms_categories");
        if (storedCategories) setCategories(JSON.parse(storedCategories));

        const storedEducations = localStorage.getItem("cms_educations");
        if (storedEducations) setEducations(JSON.parse(storedEducations));

        const storedCertifications = localStorage.getItem("cms_certifications");
        if (storedCertifications) setCertifications(JSON.parse(storedCertifications));

        const storedExperiences = localStorage.getItem("cms_experiences");
        if (storedExperiences) setExperiences(JSON.parse(storedExperiences));

        const storedAchievements = localStorage.getItem("cms_achievements");
        if (storedAchievements) setAchievements(JSON.parse(storedAchievements));
      } catch (e) {
        console.error("Local storage parse error:", e);
      }
    };

    // 2. Load Theme Setup from local browser preference
    try {
      const storedTheme = localStorage.getItem("portfolio_theme");
      if (storedTheme && ["racing-red", "emerald-green", "cosmic-indigo", "alabaster-gold"].includes(storedTheme)) {
        setTheme(storedTheme as any);
      }
    } catch (e) {
      console.error("Theme load error:", e);
    }

    loadPortfolioData();
  }, []);

  // LOAD INCOMING MESSAGES FOR AUTHENTICATED ADMIN
  useEffect(() => {
    if (!adminToken) return;

    const verifyTokenAndLoadMessages = async () => {
      try {
        // Validate token integrity
        const verifyResp = await fetch("/api/auth/verify", {
          headers: { "Authorization": `Bearer ${adminToken}` }
        });
        
        if (!verifyResp.ok) {
          // Token expired or invalid, log out gracefully
          handleLogout();
          return;
        }

        // Fetch user message inquiries
        const msgResp = await fetch("/api/messages", {
          headers: { "Authorization": `Bearer ${adminToken}` }
        });
        if (msgResp.ok) {
          const list = await msgResp.json();
          setMessages(list);
        }
      } catch (err) {
        console.error("Auth session verifier failure:", err);
      }
    };

    verifyTokenAndLoadMessages();
  }, [adminToken]);

  // SYNCHRONIZE ACTIVE THEME WITH THE DOCUMENT ELEMENT CLASSES
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "alabaster-gold") {
      root.classList.remove("dark");
      root.style.backgroundColor = "#fafaf5";
    } else {
      root.classList.add("dark");
      root.style.backgroundColor = "#070707";
    }
  }, [theme]);

  // THEME CHANGER COORD
  const handleThemeChange = (newTheme: "racing-red" | "emerald-green" | "cosmic-indigo" | "alabaster-gold") => {
    setTheme(newTheme);
    localStorage.setItem("portfolio_theme", newTheme);
  };

  // 🛡️ RE-USABLE SECURE PORTFOLIO SYNCHRONIZER HANDLER
  const syncPortfolioChanges = async (updates: {
    profile?: ProfileDetails;
    projects?: Project[];
    categories?: Category[];
    educations?: EducationItem[];
    certifications?: Certification[];
    experiences?: ExperienceItem[];
    achievements?: AchievementItem[];
  }) => {
    // Construct single request body using direct updates merged with active state
    const mergedState = {
      profile: updates.profile !== undefined ? updates.profile : profile,
      projects: updates.projects !== undefined ? updates.projects : projects,
      categories: updates.categories !== undefined ? updates.categories : categories,
      educations: updates.educations !== undefined ? updates.educations : educations,
      certifications: updates.certifications !== undefined ? updates.certifications : certifications,
      experiences: updates.experiences !== undefined ? updates.experiences : experiences,
      achievements: updates.achievements !== undefined ? updates.achievements : achievements
    };

    // Keep localStorage in sync for visitor convenience and offline previewing
    if (updates.profile !== undefined) localStorage.setItem("cms_profile", JSON.stringify(updates.profile));
    if (updates.projects !== undefined) localStorage.setItem("cms_projects", JSON.stringify(updates.projects));
    if (updates.categories !== undefined) localStorage.setItem("cms_categories", JSON.stringify(updates.categories));
    if (updates.educations !== undefined) localStorage.setItem("cms_educations", JSON.stringify(updates.educations));
    if (updates.certifications !== undefined) localStorage.setItem("cms_certifications", JSON.stringify(updates.certifications));
    if (updates.experiences !== undefined) localStorage.setItem("cms_experiences", JSON.stringify(updates.experiences));
    if (updates.achievements !== undefined) localStorage.setItem("cms_achievements", JSON.stringify(updates.achievements));

    if (!adminToken) return;

    try {
      const response = await fetch("/api/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(mergedState)
      });
      if (!response.ok) {
        console.error("Backend CMS sync returned non-OK status:", response.status);
      }
    } catch (err) {
      console.error("Database connection failure. Unable to submit CMS sync payload:", err);
    }
  };

  // PERSISTENCE SYNC ACTION OVERLAYS
  const handleUpdateProfile = (newProfile: ProfileDetails) => {
    setProfile(newProfile);
    syncPortfolioChanges({ profile: newProfile });
  };

  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    syncPortfolioChanges({ projects: newProjects });
  };

  const handleUpdateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    syncPortfolioChanges({ categories: newCategories });
  };

  const handleUpdateEducations = (newEducations: EducationItem[]) => {
    setEducations(newEducations);
    syncPortfolioChanges({ educations: newEducations });
  };

  const handleUpdateCertifications = (newCertifications: Certification[]) => {
    setCertifications(newCertifications);
    syncPortfolioChanges({ certifications: newCertifications });
  };

  const handleUpdateExperiences = (newExperiences: ExperienceItem[]) => {
    setExperiences(newExperiences);
    syncPortfolioChanges({ experiences: newExperiences });
  };

  const handleUpdateAchievements = (newAchievements: AchievementItem[]) => {
    setAchievements(newAchievements);
    syncPortfolioChanges({ achievements: newAchievements });
  };

  const handleSendMessage = async (newMsg: Omit<ContactMessage, "id" | "createdAt" | "isRead">) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMsg)
      });

      if (response.ok) {
        const data = await response.json();
        const msgObject = data.data;
        setMessages(prev => [msgObject, ...prev]);
      } else {
        // Safe Client-fallback in case Express is not live or connected to DB
        const id = `msg-${Date.now()}`;
        const createdAt = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
        const fallbackMsg: ContactMessage = { ...newMsg, id, createdAt, isRead: false };
        setMessages(prev => [fallbackMsg, ...prev]);
      }
    } catch (err) {
      console.warn("Contact endpoint error. Proceeding with client state backup.");
      const id = `msg-${Date.now()}`;
      const createdAt = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      const fallbackMsg: ContactMessage = { ...newMsg, id, createdAt, isRead: false };
      setMessages(prev => [fallbackMsg, ...prev]);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      if (adminToken) {
        await fetch(`/api/messages/${msgId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${adminToken}` }
        });
      }
    } catch (err) {
      console.error("Failed to delete message on Atlas database:", err);
    }
    // Update local state is crucial
    setMessages(prev => prev.filter(m => m.id !== msgId));
  };

  const handleMarkMessageRead = (msgId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) return { ...m, isRead: true };
      return m;
    }));
  };

  // PORTFOLIO SCROLL ANIMATION ASSISTANCE
  const handleScrollToSection = (sectionId: string) => {
    setViewMode("portfolio");
    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Observe active section scroll positions
  useEffect(() => {
    if (viewMode !== "portfolio") return;

    const sections = ["home", "projects", "about", "certifications", "contact"];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      }, { threshold: 0.25 });

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(obs => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [viewMode, projects]);

  // LOGIN FLOW COORDINATOR
  const handleLoginSuccess = (token: string, email: string) => {
    setAdminToken(token);
    localStorage.setItem("admin_token", token);
    setViewMode("admin");
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("admin_token");
    setViewMode("portfolio");
  };

  // Render the core highlight project for preview
  const leadProject = projects.find(p => p.isPublic) || projects[0];

  return (
    <div className="font-sans antialiased bg-surface text-on-surface transition-all duration-500 overflow-x-hidden min-h-screen">
      
      {/* Liquid WebGL Glow Simulation Backdrop */}
      <ShaderBackground theme={theme} />

      {/* CORE ROUTING WORKSPACE */}
      {viewMode === "portfolio" && (
        <div className="relative z-10">
          <Navbar 
            profile={profile}
            isAdminLoggedIn={viewMode === "admin"}
            onEnterAdmin={() => setViewMode("login")}
            onScrollTo={handleScrollToSection}
            activeSection={activeSection}
            theme={theme}
            onThemeChange={handleThemeChange}
          />
          <main className="pt-8">
            <Hero 
              profile={profile} 
              featuredProject={leadProject}
              onScrollTo={handleScrollToSection} 
              theme={theme}
              onThemeSelect={handleThemeChange}
            />
            <Projects 
              projects={projects} 
              categories={categories} 
            />
            <AboutAndExperience 
              profile={profile} 
              educations={educations} 
              experiences={experiences}
            />
            <IntelligenceArsenal 
              certifications={certifications} 
              achievements={achievements}
            />
            <Contact 
              profile={profile} 
              onSendMessage={handleSendMessage} 
            />
          </main>
          
          <footer className="py-12 border-t border-glass-stroke text-center font-mono text-[10px] text-zinc-500 select-none bg-white/40 dark:bg-black/60">
            <p className="uppercase tracking-widest font-black text-black dark:text-zinc-400">
              © {new Date().getFullYear()} {profile.name}. All systems operational.
            </p>
            <p className="uppercase tracking-wider mt-2 opacity-50">
              Coded in Liquid Metal Apex Sandbox • SHA-256 Validated
            </p>
          </footer>
        </div>
      )}

      {viewMode === "login" && (
        <AdminLogin 
          onSuccess={handleLoginSuccess} 
          onCancel={() => setViewMode("portfolio")} 
        />
      )}

      {viewMode === "admin" && (
        <AdminPanel 
          profile={profile}
          projects={projects}
          categories={categories}
          educations={educations}
          certifications={certifications}
          experiences={experiences}
          achievements={achievements}
          messages={messages}
          onUpdateProfile={handleUpdateProfile}
          onUpdateProjects={handleUpdateProjects}
          onUpdateCategories={handleUpdateCategories}
          onUpdateEducations={handleUpdateEducations}
          onUpdateCertifications={handleUpdateCertifications}
          onUpdateExperiences={handleUpdateExperiences}
          onUpdateAchievements={handleUpdateAchievements}
          onLogout={handleLogout}
          onDeleteMessage={handleDeleteMessage}
          onMarkMessageRead={handleMarkMessageRead}
        />
      )}

    </div>
  );
}
