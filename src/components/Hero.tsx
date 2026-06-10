import { useState, useEffect } from "react";
import { ProfileDetails, Project } from "../types";
import { getDirectImageUrl } from "../utils";
import { 
  ChevronDown, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Code2, 
  Mail, 
  Phone, 
  FileText, 
  Printer, 
  Circle, 
  Activity, 
  Clock, 
  Compass, 
  Layers, 
  Terminal 
} from "lucide-react";

interface HeroProps {
  profile: ProfileDetails;
  featuredProject: Project | undefined;
  onScrollTo: (id: string) => void;
  theme: "racing-red" | "emerald-green" | "cosmic-indigo" | "alabaster-gold";
  onThemeSelect: (newTheme: "racing-red" | "emerald-green" | "cosmic-indigo" | "alabaster-gold") => void;
}

export default function Hero({ 
  profile, 
  featuredProject, 
  onScrollTo, 
  theme, 
  onThemeSelect 
}: HeroProps) {
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const handlePrint = () => {
    window.print();
  };

  // Real-time dynamic Indian Standard Time clock
  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit" as const,
        minute: "2-digit" as const,
        second: "2-digit" as const
      };
      setCurrentTime(new Date().toLocaleTimeString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Professional Core Metrics data
  const metrics = [
    { title: "ML Models Trained", value: "20+", detail: "DeepFake classification pipelines" },
    { title: "Paper presentations", value: "Scopus", detail: "Crop Prediction Research" },
    { title: "Github Repositories", value: "40+", detail: "Active open-source contributions" },
    { title: "Framework Skills", value: "12+", detail: "Engines from React to PyTorch" }
  ];

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 overflow-hidden transition-colors duration-500"
    >
      
      {/* Dynamic ambient blurring background orb reflecting primary theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[160px] pointer-events-none transition-all duration-700" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* TEXT SPECIFICATIONS (LEFT SECTION) */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left select-none">
          
          {/* Active status indicator pill */}
          <div className="inline-flex items-center gap-2.5 bg-zinc-100 dark:bg-zinc-900 border border-glass-stroke px-4 py-2 mt-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="font-mono text-xs font-black uppercase tracking-widest text-primary">
              Active M.C.A. Scholar (LPU)
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-on-surface leading-none tracking-tighter uppercase">
              CRAFTING ADVANCED <br />
              <span className="text-primary">INTELLIGENCE</span>
            </h1>
            <p className="text-secondary font-body-lg text-md sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
              I am <strong className="text-on-surface font-bold">{profile.name}</strong>. A technical generalist developing computational machine learning pipelines, deepfake defense systems, and secure full-stack applications.
            </p>
          </div>

          {/* DYNAMIC SYSTEM DIAGNOSTICS DECK - Sachin inspired dashboard metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-50 dark:bg-[#050505] p-4 border border-glass-stroke select-text">
            
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] uppercase tracking-widest font-mono">Location</span>
              </div>
              <p className="text-[10px] font-mono text-on-surface truncate font-bold">SANGLI, MH, IN</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] uppercase tracking-widest font-mono">India Time</span>
              </div>
              <p className="text-[10px] font-mono text-on-surface font-bold tracking-wider">{currentTime || "09:39:00"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-mono">CMS Sync</span>
              </div>
              <p className="text-[10px] font-mono text-on-surface font-bold">100% ONLINE</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] uppercase tracking-widest font-mono">Lat/Lon</span>
              </div>
              <p className="text-[10px] font-mono text-on-surface truncate font-bold">16.85°N, 74.58°E</p>
            </div>

          </div>

          {/* SOCIALS & ACTIONS */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={() => onScrollTo("projects")}
              className="bg-on-surface text-surface bg-primary text-white border border-primary hover:border-primary-hover hover:bg-primary-hover px-7 py-3.5 font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer flex items-center gap-2 active:scale-95"
            >
              Analyze Pipelines
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsCVOpen(true)}
              className="border border-glass-stroke text-on-surface hover:bg-zinc-100 dark:hover:bg-zinc-900/40 px-7 py-3.5 font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <FileText className="w-4 h-4 text-primary" />
              Examine CV.md
            </button>
          </div>

          {/* Social icons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-zinc-450">
            {profile.github && (
              <a 
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full border border-glass-stroke bg-zinc-50 dark:bg-[#111] hover:scale-105"
                title="GitHub Core Directory"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin && (
              <a 
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full border border-glass-stroke bg-zinc-50 dark:bg-[#111] hover:scale-105"
                title="LinkedIn Core Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.twitter && (
              <a 
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full border border-glass-stroke bg-zinc-50 dark:bg-[#111] hover:scale-105"
                title="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {profile.leetcode && (
              <a 
                href={profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full border border-glass-stroke bg-zinc-50 dark:bg-[#111] hover:scale-105"
                title="LeetCode Profile"
              >
                <Code2 className="w-4 h-4" />
              </a>
            )}
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full border border-glass-stroke bg-zinc-50 dark:bg-[#111] hover:scale-105"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {profile.phone && (
              <a 
                href={`tel:${profile.phone}`}
                className="text-secondary hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full border border-glass-stroke bg-zinc-50 dark:bg-[#111] hover:scale-105"
                title="Call Direct"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

        {/* OPERATIONS COMMAND DECK (RIGHT SECTION) - Clean high-profile portrait presentation */}
        <div className="lg:col-span-6 relative group select-none">
          <div className="absolute inset-0 bg-primary/10 dark:bg-primary/15 blur-3xl opacity-65 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="relative bg-white dark:bg-[#070707] border border-glass-stroke p-5 md:p-6 shadow-2xl transition-all duration-500 hover:border-primary/55">
            
            {/* Visual Header */}
            <div className="w-full flex justify-between items-center pb-4 mb-4 border-b border-glass-stroke">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#9ca3af] font-black flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Verified Developer Identity
              </span>
              <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold">
                MCA SCHOLAR (LPU)
              </span>
            </div>

            {/* Profile Avatar Portrait Showcase */}
            <div className="relative mx-auto max-w-[280px] w-full aspect-[1/1] overflow-hidden bg-zinc-150 dark:bg-zinc-900 border border-glass-stroke mb-4 group/image shadow-lg">
              {profile.avatar ? (
                <img 
                  src={getDirectImageUrl(profile.avatar)} 
                  alt={profile.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/image:scale-103 transition-all duration-700" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-secondary">
                  <Code2 className="w-12 h-12 text-primary opacity-40 mb-2 animate-bounce" />
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Profile image not registered</span>
                </div>
              )}

              {/* Dynamic bottom absolute tag banner */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md px-3.5 py-3 border border-zinc-800/80 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-black text-xs text-white uppercase tracking-wider">
                    {profile.name}
                  </h3>
                  <p className="text-primary font-mono text-[8px] tracking-widest uppercase font-bold mt-0.5">
                    Full-Stack & ML Specialist
                  </p>
                </div>
                <div className="bg-primary/20 border border-primary text-primary px-2 py-1 text-[8px] font-mono tracking-widest uppercase font-bold">
                  ACTIVE CMS
                </div>
              </div>
            </div>

            {/* Structured Specifications Grid */}
            <div className="w-full grid grid-cols-2 gap-3 pt-2 text-[9px] uppercase font-mono">
              <div className="bg-zinc-50 dark:bg-[#111]/40 p-2.5 border border-glass-stroke">
                <span className="text-secondary block mb-1">Affiliation</span>
                <span className="text-on-surface font-bold truncate block">Lovely Professional Uni.</span>
              </div>
              <div className="bg-zinc-50 dark:bg-[#111]/40 p-2.5 border border-glass-stroke">
                <span className="text-secondary block mb-1">Core Focus</span>
                <span className="text-on-surface font-bold truncate block">Computer Applications</span>
              </div>
              <div className="bg-zinc-50 dark:bg-[#111]/40 p-2.5 border border-glass-stroke col-span-2">
                <span className="text-secondary block mb-1">Key Research Domain</span>
                <span className="text-on-surface font-bold block">DeepFake Defence & ML Classification Pipelines</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MECHANICAL METRICS COUNTER BOARD */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 mt-16 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/40 dark:bg-[#070707]/30 border border-glass-stroke p-6 backdrop-blur-sm">
          {metrics.map((metric, mi) => (
            <div key={mi} className="space-y-1 relative group">
              <span className="text-secondary font-mono text-[9px] uppercase tracking-widest font-black block">
                {metric.title}
              </span>
              <div className="font-display font-black text-3xl sm:text-4xl text-primary leading-none transition-colors duration-550 group-hover:text-primary-hover">
                {metric.value}
              </div>
              <p className="text-secondary font-sans text-[11px] leading-relaxed">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FLOAT CHEVRON SCROLL INDICATOR */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer print:hidden select-none" 
        onClick={() => onScrollTo("projects")}
      >
        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Scroll Details</span>
        <ChevronDown className="w-4 h-4 text-zinc-500 animate-bounce" />
      </div>

      {/* HIGH-FIDELITY BROWSE/PRINT CV MODAL */}
      {isCVOpen && (
        <div className="fixed inset-0 z-55 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto select-none">
          <div className="bg-white text-zinc-900 border border-glass-stroke w-full max-w-4xl p-6 md:p-10 rounded-none shadow-2xl relative max-h-[92vh] overflow-y-auto" id="printable-cv">
            
            {/* CV Modal Toolbar - Hidden during print */}
            <header className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-5 print:hidden select-none">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-display font-black text-sm uppercase tracking-wider text-zinc-800">
                  Interactive CV Generator
                </span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handlePrint}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-none flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button 
                  onClick={() => setIsCVOpen(false)}
                  className="border border-zinc-300 hover:border-zinc-500 text-zinc-600 px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-none cursor-pointer"
                >
                  Close CV
                </button>
              </div>
            </header>

            {/* Standard elegant printed paper format */}
            <div className="font-sans text-xs sm:text-sm text-zinc-850 space-y-8 select-text">
              
              {/* CV HEADER */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-zinc-800 pb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">{profile.name}</h2>
                  <p className="text-primary font-bold tracking-widest uppercase text-xs mt-1">
                    M.C.A. Scholar & Data Science / ML Specialist
                  </p>
                  <p className="text-zinc-600 text-xs mt-2 max-w-lg leading-relaxed">
                    {profile.longBio}
                  </p>
                </div>
                <div className="text-left sm:text-right font-mono text-xs text-zinc-600 space-y-1">
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone}</p>
                  <p><strong>Location:</strong> {profile.location}</p>
                  <p><strong>GitHub:</strong> prashantpatil4524</p>
                  <p><strong>LinkedIn:</strong> prashantpatil4524</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* CV RIGHT/LEFT SPECIFIC PANEL */}
                <div className="md:col-span-2 space-y-8 font-sans">
                  
                  {/* WORK EXPERIENCE */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider border-b border-zinc-200 pb-1">
                      Professional Experience
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <strong className="text-zinc-900 text-sm">Data Science & Machine Learning Intern</strong>
                          <span className="font-mono text-xs text-zinc-500">Jun 2024 - Aug 2024</span>
                        </div>
                        <p className="text-zinc-600 font-medium text-xs uppercase tracking-wider">
                          Maxgen Technologies Pvt. Ltd., Mumbai Office
                        </p>
                        <ul className="list-disc pl-4 mt-2 space-y-1.5 text-xs text-zinc-700 leading-relaxed">
                          <li>Engineered exploratory pipelines evaluating Mumbai properties using regression indices.</li>
                          <li>Trained linear models, random forests, and decision trees reaching high precision score metrics.</li>
                          <li>Visualized pricing variables and correlation matrices with Matplotlib and Seaborn dashboards.</li>
                          <li>Presented detailed analytical decks outlining localized recommendations to senior stakeholders.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* FEATURED PROJECTS */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider border-b border-zinc-200 pb-1">
                      Technical Projects
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <strong className="text-zinc-900 text-sm">DeepFake Detection System (Team capstone)</strong>
                          <span className="font-mono text-xs text-zinc-500">Feb - Apr 2026</span>
                        </div>
                        <p className="text-zinc-600 italic text-xs">Python, PyTorch, OpenCV, EfficientNet-B4, LSTM, FastAPI, React</p>
                        <p className="text-zinc-650 text-xs mt-1.5 leading-relaxed">
                          Architected an AI classification system (AUC ~0.96) processing spatial frames dynamically. Implemented facial boundaries using MTCNN and served secure docker containers with FastAPI.
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <strong className="text-zinc-900 text-sm">Agri Sense Crop Prediction System</strong>
                          <span className="font-mono text-xs text-zinc-500">Jan - May 2025</span>
                        </div>
                        <p className="text-zinc-600 italic text-xs">Python, Flask, Scikit-Learn, Pandas, Soil Chemistry Models</p>
                        <p className="text-zinc-650 text-xs mt-1.5 leading-relaxed">
                          Predictive agricultural model supporting custom organic recommendations based on nitrogen and potassium parameters. Scopus indexed paper presentation organized in Bangalore.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* CV RIGHT SIDEBAR EDUCATION & SKILLS */}
                <div className="space-y-8">
                  
                  {/* EDUCATION HISTORY */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider border-b border-zinc-200 pb-1">
                      Academic History
                    </h3>
                    <div className="space-y-4 text-xs">
                      <div>
                        <strong className="text-zinc-900 block font-bold">M.C.A. (Computer Applications)</strong>
                        <span className="text-zinc-600 block">Lovely Professional University</span>
                        <span className="text-zinc-500 block">2025 - 2027 | TGPA: 7.08</span>
                      </div>
                      <div>
                        <strong className="text-zinc-900 block font-bold">B.C.A. (Full Time)</strong>
                        <span className="text-zinc-600 block">Lovely Professional University</span>
                        <span className="text-zinc-500 block">2022 - 2025 | CGPA: 7.22</span>
                      </div>
                      <div>
                        <strong className="text-zinc-900 block font-bold">12th Science Stream</strong>
                        <span className="text-zinc-600 block">Willingdon College, Sangli</span>
                        <span className="text-zinc-500 block">2020 - 2022 | Grade: 50.67%</span>
                      </div>
                    </div>
                  </div>

                  {/* COGNITIVE SKILLS */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider border-b border-zinc-200 pb-1">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {["C++", "Python", "SQL", "Flask", "FastAPI", "ReactJS", "PyTorch", "Docker", "Git/Github", "Pandas", "Scikit-Learn", "Tableau", "Apache Spark"].map((sk) => (
                        <span key={sk} className="bg-zinc-100 text-zinc-800 text-[10px] px-2 py-0.5 border border-zinc-200 font-bold font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* EXTRA MILESTONES */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-zinc-900 tracking-wider border-b border-zinc-200 pb-1">
                      Milestones
                    </h3>
                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-650">
                      <li><strong>Tech Blitz '25:</strong> LPU Runner-Up in Web and AI category.</li>
                      <li><strong>LeetCode Solved:</strong> 72 active problems solved natively.</li>
                      <li><strong>IFERP Journal:</strong> Scopus Research Paper publication.</li>
                    </ul>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
