import React, { useState } from "react";
import { getDirectImageUrl } from "../utils";
import { 
  Project, 
  Category, 
  ContactMessage, 
  ProfileDetails, 
  EducationItem, 
  Certification,
  ExperienceItem,
  AchievementItem
} from "../types";
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderLock, 
  UserCircle, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Power, 
  Activity, 
  Cloud, 
  FileCode, 
  Save, 
  ExternalLink,
  MessageSquare,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Award,
  Globe
} from "lucide-react";

interface AdminPanelProps {
  profile: ProfileDetails;
  projects: Project[];
  categories: Category[];
  educations: EducationItem[];
  certifications: Certification[];
  experiences: ExperienceItem[];
  achievements: AchievementItem[];
  messages: ContactMessage[];
  onUpdateProfile: (p: ProfileDetails) => void;
  onUpdateProjects: (p: Project[]) => void;
  onUpdateCategories: (c: Category[]) => void;
  onUpdateEducations: (e: EducationItem[]) => void;
  onUpdateCertifications: (c: Certification[]) => void;
  onUpdateExperiences: (e: ExperienceItem[]) => void;
  onUpdateAchievements: (a: AchievementItem[]) => void;
  onLogout: () => void;
  onDeleteMessage: (msgId: string) => void;
  onMarkMessageRead: (msgId: string) => void;
}

type AdminTab = "dashboard" | "projects" | "categories" | "profile" | "messages" | "education-experience" | "certifications-milestones";

export default function AdminPanel({
  profile,
  projects,
  categories,
  educations,
  certifications,
  experiences,
  achievements,
  messages,
  onUpdateProfile,
  onUpdateProjects,
  onUpdateCategories,
  onUpdateEducations,
  onUpdateCertifications,
  onUpdateExperiences,
  onUpdateAchievements,
  onLogout,
  onDeleteMessage,
  onMarkMessageRead
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Project Modal States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Project Form States
  const [projTitle, setProjTitle] = useState("");
  const [projSubtitle, setProjSubtitle] = useState("");
  const [projCategory, setProjCategory] = useState("");
  const [projDate, setProjDate] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projLongDescription, setProjLongDescription] = useState("");
  const [projTags, setProjTags] = useState("");
  const [projImage, setProjImage] = useState("");
  const [projVersion, setProjVersion] = useState("");
  const [projIsPublic, setProjIsPublic] = useState(true);
  const [projTeamSize, setProjTeamSize] = useState("");
  const [projLink, setProjLink] = useState("");

  // Category State
  const [newCategoryName, setNewCategoryName] = useState("");

  // Alert State
  const [alertMsg, setAlertMsg] = useState("");

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  // Open Add Project Modal
  const openAddModal = () => {
    setEditingProject(null);
    setProjTitle("");
    setProjSubtitle("");
    setProjCategory(categories[1]?.id || "web");
    setProjDate(new Date().getFullYear().toString());
    setProjDescription("");
    setProjLongDescription("");
    setProjTags("");
    setProjImage("https://lh3.googleusercontent.com/aida-public/AB6AXuAAxsruh3QWeb2XQZC_8Vma2E6kuwi9GdUu3cx2Iqz3jVppTZw163lE7b5V4EdtZS3qMCFV8rVRIUTWsQfZpMM0S3dtFcUn-UhQJJlyY-ieiYclZbFfgiP9-S-OQJFj3tlvsfZsHld0q8X4BUpNuYrtwyS6YjzsiBxeE07GOfQxEyd8S0Kq_cAPHw_HQtIuQ5AeCG55qTGZr9xgWMZjaz3_b8gTwzjbaN7aKWgMNUOfXo50PG9vDzUVxaRWhbAdwwYGLOyv_UiNY8jo");
    setProjVersion("v1.0.0");
    setProjIsPublic(true);
    setProjTeamSize("1");
    setProjLink("");
    setIsProjectModalOpen(true);
  };

  // Open Edit Project Modal
  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setProjTitle(p.title);
    setProjSubtitle(p.subtitle || "");
    setProjCategory(p.category);
    setProjDate(p.date);
    setProjDescription(p.description);
    setProjLongDescription(p.longDescription || "");
    setProjTags(p.tags.join(", "));
    setProjImage(p.image);
    setProjVersion(p.version);
    setProjIsPublic(p.isPublic);
    setProjTeamSize(p.teamSize || "1");
    setProjLink(p.projectLink || "");
    setIsProjectModalOpen(true);
  };

  // Save Project Handler
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;

    const tagsArray = projTags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (editingProject) {
      // Edit mode
      const updated = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            title: projTitle,
            subtitle: projSubtitle,
            category: projCategory,
            date: projDate,
            description: projDescription,
            longDescription: projLongDescription,
            tags: tagsArray,
            image: projImage,
            version: projVersion,
            isPublic: projIsPublic,
            teamSize: projTeamSize,
            projectLink: projLink
          };
        }
        return p;
      });
      onUpdateProjects(updated);
      triggerAlert("Project successfully updated.");
    } else {
      // Add mode
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: projTitle,
        subtitle: projSubtitle,
        category: projCategory,
        date: projDate,
        description: projDescription,
        longDescription: projLongDescription,
        tags: tagsArray,
        image: projImage,
        version: projVersion,
        isPublic: projIsPublic,
        teamSize: projTeamSize,
        projectLink: projLink
      };
      onUpdateProjects([newProj, ...projects]);
      triggerAlert("New project published to portfolio.");
    }
    setIsProjectModalOpen(false);
  };

  // Delete Project Handler
  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const filtered = projects.filter(p => p.id !== id);
      onUpdateProjects(filtered);
      triggerAlert("Project permanently removed.");
    }
  };

  // Toggle Project Visibility
  const toggleVisibility = (p: Project) => {
    const updated = projects.map(item => {
      if (item.id === p.id) {
        return { ...item, isPublic: !item.isPublic };
      }
      return item;
    });
    onUpdateProjects(updated);
    triggerAlert(`Project visibility set to ${!p.isPublic ? "Public" : "Private"}.`);
  };

  // Add Category Helper
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    const cleanName = newCategoryName.trim();
    const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    
    if (categories.some(c => c.id === id)) {
      triggerAlert("Category already exists.");
      return;
    }

    onUpdateCategories([...categories, { id, name: cleanName }]);
    setNewCategoryName("");
    triggerAlert("Category scope registered.");
  };

  // Delete Category Helper
  const handleDeleteCategory = (catId: string) => {
    if (catId === "all" || catId === "web" || catId === "ml") {
      triggerAlert("System core categories cannot be deleted.");
      return;
    }
    if (confirm("Delete this category? Projects in this category will load globally.")) {
      const updated = categories.filter(c => c.id !== catId);
      onUpdateCategories(updated);
      triggerAlert("Category scope deleted.");
    }
  };

  // Profile Form states initialized from props
  const [perfName, setPerfName] = useState(profile.name);
  const [perfBio, setPerfBio] = useState(profile.bio);
  const [perfLongBio, setPerfLongBio] = useState(profile.longBio);
  const [perfEmail, setPerfEmail] = useState(profile.email);
  const [perfPhone, setPerfPhone] = useState(profile.phone);
  const [perfLocation, setPerfLocation] = useState(profile.location);
  const [perfGithub, setPerfGithub] = useState(profile.github || "");
  const [perfLinkedin, setPerfLinkedin] = useState(profile.linkedin || "");
  const [perfTwitter, setPerfTwitter] = useState(profile.twitter || "");
  const [perfLeetcode, setPerfLeetcode] = useState(profile.leetcode || "");
  const [perfAvatar, setPerfAvatar] = useState(profile.avatar || "");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: perfName,
      bio: perfBio,
      longBio: perfLongBio,
      email: perfEmail,
      phone: perfPhone,
      location: perfLocation,
      github: perfGithub,
      linkedin: perfLinkedin,
      twitter: perfTwitter,
      leetcode: perfLeetcode,
      avatar: perfAvatar
    });
    triggerAlert("Profile system details successfully synced.");
  };

  // Filter projects by search query
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const unreadMessagesCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen bg-black text-on-surface flex flex-col md:flex-row relative">
      
      {/* Dynamic Transient UI Banner Alert */}
      {alertMsg && (
        <div className="fixed top-8 right-8 z-50 bg-[#e31b23] text-white px-6 py-4 font-label-md text-xs tracking-widest uppercase rounded-none border border-white/20 shadow-2xl animate-bounce">
          {alertMsg}
        </div>
      )}

      {/* ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0A0A0A] border-b md:border-b-0 md:border-r border-glass-stroke flex flex-col py-8 flex-shrink-0">
        <div className="px-6 mb-10">
          <h1 className="font-display font-black text-xl text-primary-container tracking-wider uppercase">CMS Panel</h1>
          <p className="text-secondary font-label-md text-[10px] uppercase tracking-widest mt-1 opacity-60">Prashant's Admin</p>
        </div>

        <nav className="flex-grow space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-label-md text-sm transition-all text-left border-l-4 rounded-none cursor-pointer ${
              activeTab === "dashboard" 
                ? "bg-[#1f1f1f] border-primary-container text-white" 
                : "border-transparent text-secondary hover:bg-[#131313] hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-primary-container" />
            Overview
          </button>

          <button 
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-label-md text-sm transition-all text-left border-l-4 rounded-none cursor-pointer ${
              activeTab === "projects" 
                ? "bg-[#1f1f1f] border-primary-container text-white" 
                : "border-transparent text-secondary hover:bg-[#131313] hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4 text-primary-container" />
            Projects ({projects.length})
          </button>

          <button 
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-label-md text-sm transition-all text-left border-l-4 rounded-none cursor-pointer ${
              activeTab === "categories" 
                ? "bg-[#1f1f1f] border-primary-container text-white" 
                : "border-transparent text-secondary hover:bg-[#131313] hover:text-white"
            }`}
          >
            <FolderLock className="w-4 h-4 text-primary-container" />
            Categories
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-label-md text-sm transition-all text-left border-l-4 rounded-none cursor-pointer ${
              activeTab === "profile" 
                ? "bg-[#1f1f1f] border-primary-container text-white" 
                : "border-transparent text-secondary hover:bg-[#131313] hover:text-white"
            }`}
          >
            <UserCircle className="w-4 h-4 text-primary-container" />
            Profile CMS
          </button>

          <button 
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center justify-between px-6 py-3.5 font-label-md text-sm transition-all text-left border-l-4 rounded-none cursor-pointer ${
              activeTab === "messages" 
                ? "bg-[#1f1f1f] border-primary-container text-white" 
                : "border-transparent text-secondary hover:bg-[#131313] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary-container" />
              Inbound Form
            </span>
            {unreadMessagesCount > 0 && (
              <span className="bg-[#e31b23] text-white text-[10px] font-black px-2 py-0.5 rounded-none font-code-sm">
                {unreadMessagesCount} NEW
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("education-experience")}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-label-md text-sm transition-all text-left border-l-4 rounded-none cursor-pointer ${
              activeTab === "education-experience" 
                ? "bg-[#1f1f1f] border-primary-container text-white" 
                : "border-transparent text-secondary hover:bg-[#131313] hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-primary-container" />
            Edu & Experience
          </button>

          <button 
            onClick={() => setActiveTab("certifications-milestones")}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-label-md text-sm transition-all text-left border-l-4 rounded-none cursor-pointer ${
              activeTab === "certifications-milestones" 
                ? "bg-[#1f1f1f] border-primary-container text-white" 
                : "border-transparent text-secondary hover:bg-[#131313] hover:text-white"
            }`}
          >
            <Award className="w-4 h-4 text-primary-container" />
            Cert & Milestones
          </button>
        </nav>

        {/* LOGOUT + AVATAR FOOTER */}
        <div className="px-4 mt-auto border-t border-glass-stroke pt-6">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-none bg-zinc-800 border border-glass-stroke overflow-hidden flex-shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxT4O3IDtRAB1zJuFmwcS_9lAR6Qr20nz_Fr198CWJXuRjsM7JQgJihFqjbfcJVEWcAwO9qdeyjgTkZ9xIuO_q3fp1W7QaP0L8-_YqP9fxCkuE87zzyAzaoD3y5UwnYYUkucCoCOMvLzTW8pg76zs2SfDkPxiC7X9o1_8U_fF-yX5nEIx2v9CiI6AyEvn3_IC_r7tVcr_YPa41mbgaZwQQLblnLmIQ1Qyb4I591ZaGYrLn9y7Z5gOjVVHLeUvcSjxTzKE_6DaEE0va" 
                alt="Admin Face" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-xs text-white truncate">{profile.name}</p>
              <p className="text-[9px] text-[#e31b23] uppercase tracking-wider font-code-sm font-bold">Lead Dev / Root</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-3 border border-glass-stroke hover:bg-[#e31b23]/10 hover:border-[#e31b23] text-[#e31b23] font-label-md text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
          >
            <Power className="w-3.5 h-3.5" />
            Deauthorize
          </button>
        </div>
      </aside>

      {/* CORE WORKSPACE CONTENT AREA */}
      <main className="flex-grow p-6 md:p-10 lg:p-12 overflow-y-auto">
        
        {/* HEADER BRANDING */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-glass-stroke">
          <div>
            <h2 className="font-display font-black text-3xl text-white tracking-widest uppercase">{activeTab} Dashboard</h2>
            <p className="text-secondary font-body-md text-sm mt-1">Configure Prashant's real-time portfolio data fields.</p>
          </div>
          <div className="flex items-center gap-4 bg-[#0A0A0A] border border-glass-stroke px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e31b23]"></span>
            </span>
            <span className="font-code-sm text-xs font-black tracking-widest uppercase text-white">Live Operations Mode</span>
          </div>
        </header>

        {/* METRICS ROW */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#0A0A0A] border border-glass-stroke p-6 hover:border-primary-container/20 transition-colors">
            <p className="text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">Total Projects</p>
            <h3 className="font-display text-3xl font-black text-white">{projects.length}</h3>
            <p className="text-[10px] text-green-400 font-code-sm mt-1">▲ Sync Completed</p>
          </div>
          <div className="bg-[#0A0A0A] border border-glass-stroke p-6 hover:border-primary-container/20 transition-colors">
            <p className="text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">Platform Views (30D)</p>
            <h3 className="font-display text-3xl font-black text-white">12,840</h3>
            <p className="text-[10px] text-green-400 font-code-sm mt-1">▲ 14% high traffic</p>
          </div>
          <div className="bg-[#0A0A0A] border border-glass-stroke p-6 hover:border-primary-container/20 transition-colors">
            <p className="text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">Form Submissions</p>
            <h3 className="font-display text-3xl font-black text-white">{messages.length}</h3>
            <p className="text-[10px] text-zinc-500 font-code-sm mt-1">{unreadMessagesCount} unread / pending</p>
          </div>
          <div className="bg-[#0A0A0A] border border-glass-stroke p-6 hover:border-primary-container/20 transition-colors flex flex-col justify-between">
            <p className="text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1">Infrastructure Load</p>
            <div className="w-full bg-zinc-900 h-2 mt-1">
              <div className="bg-[#e31b23] h-full" style={{ width: "32%" }}></div>
            </div>
            <p className="text-[9px] text-zinc-500 font-code-sm mt-1">Docker Nodes Online</p>
          </div>
        </section>

        {/* TAB WORKSPACE ROUTER */}

        {/* 1. OVERVIEW / DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Activity lists */}
            <div className="lg:col-span-2 bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider">Recent Workspace Activity</h3>
                <button 
                  onClick={() => setActiveTab("projects")}
                  className="font-label-md text-xs text-primary-container hover:underline hover:text-red-400 cursor-pointer"
                >
                  Manage All
                </button>
              </div>

              <div className="space-y-4">
                {projects.slice(0, 4).map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#111] border border-glass-stroke hover:border-zinc-800 transition-colors gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 border border-glass-stroke overflow-hidden flex-shrink-0">
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-label-md text-sm text-white">{p.title}</h4>
                        <p className="text-[10px] text-secondary font-code-sm">{p.date} • {p.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 ${
                        p.isPublic 
                          ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                          : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      }`}>
                        {p.isPublic ? "Public" : "Draft / Private"}
                      </span>
                      <button 
                        onClick={() => openEditModal(p)}
                        className="p-1 px-2 border border-glass-stroke text-secondary hover:text-white hover:border-zinc-500 transition-colors rounded-none text-xs cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-6">
              <div className="bg-[#0A0A0A] border border-glass-stroke p-6">
                <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider mb-5">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={openAddModal}
                    className="w-full bg-primary-container hover:bg-racing-red-hover text-white py-3 px-4 font-label-md text-xs uppercase tracking-widest hover:shadow-2xl active:scale-95 transition-all outline-none rounded-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    ADD NEW PROJECT
                  </button>
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className="w-full border border-glass-stroke hover:bg-[#111] text-secondary hover:text-white py-3 px-4 font-label-md text-xs uppercase tracking-widest transition-all rounded-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserCircle className="w-4 h-4 text-primary-container" />
                    UPDATE PROFILE DATA
                  </button>
                </div>
              </div>

              {/* Real-time contact inbound feed widget */}
              <div className="bg-[#0A0A0A] border border-glass-stroke p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-label-md text-xs uppercase tracking-widest text-[#e31b23]">Inbound Inbox</h4>
                  <span className="font-code-sm text-[10px] text-zinc-500 uppercase">{messages.length} Total</span>
                </div>
                {messages.length === 0 ? (
                  <p className="text-secondary font-code-sm text-xs opacity-60 text-center py-6">No workspace inquiries found.</p>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {messages.slice(0, 3).map(m => (
                      <div key={m.id} className="p-3 bg-[#111] border border-glass-stroke relative group">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className="font-label-md text-[11px] text-white truncate max-w-[120px]">{m.name}</p>
                          <span className="font-code-sm text-[9px] text-zinc-500">{m.createdAt}</span>
                        </div>
                        <p className="text-secondary text-xs truncate max-w-full font-body-md mb-2">{m.message}</p>
                        <div className="flex justify-end gap-2 shrink-0">
                          {!m.isRead && (
                            <button 
                              onClick={() => onMarkMessageRead(m.id)}
                              className="text-[9px] font-bold text-green-400 hover:underline cursor-pointer"
                            >
                              Mark Read
                            </button>
                          )}
                          <button 
                            onClick={() => onDeleteMessage(m.id)}
                            className="text-[9px] font-bold text-red-500 hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {messages.length > 0 && (
                  <button 
                    onClick={() => setActiveTab("messages")}
                    className="w-full text-center text-[10px] text-primary-container hover:underline uppercase tracking-widest mt-4 font-label-md cursor-pointer block"
                  >
                    View All Messages ({unreadMessagesCount} unread)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. PROJECTS TAB (GRID VIEW + SYSTEM CONTROLS) */}
        {activeTab === "projects" && (
          <div className="bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 font-label-md text-xs tracking-widest uppercase transition-all rounded-none cursor-pointer ${
                    selectedCategory === "all" 
                      ? "bg-[#e31b23] text-white" 
                      : "bg-[#111] border border-glass-stroke text-secondary hover:text-white"
                  }`}
                >
                  All
                </button>
                {categories.filter(c => c.id !== "all").map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-4 py-2 font-label-md text-xs tracking-widest uppercase transition-all rounded-none cursor-pointer ${
                      selectedCategory === c.id 
                        ? "bg-[#e31b23] text-white" 
                        : "bg-[#111] border border-glass-stroke text-secondary hover:text-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="relative max-w-xs w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary opacity-60">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Query codebase..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 pl-10 pr-4 outline-none transition-all rounded-none placeholder-secondary/30 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="font-code-sm text-xs text-secondary">Showing {filteredProjects.length} of {projects.length} repository records</p>
              <button 
                onClick={openAddModal}
                className="bg-primary-container hover:bg-racing-red-hover text-white px-4 py-2.5 font-label-md text-xs uppercase tracking-widest hover:shadow-xl active:scale-95 transition-all outline-none rounded-none cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>

            {/* Project List Database Table */}
            <div className="border border-glass-stroke overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-zinc-900 border-b border-glass-stroke text-secondary font-label-md tracking-wider uppercase text-[10px]">
                    <th className="p-4 pl-6">Profile Record</th>
                    <th className="p-4">Category System</th>
                    <th className="p-4">Time Period</th>
                    <th className="p-4">Network Scope</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-stroke">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-secondary font-code-sm opacity-60">
                        No projects matched your filtering criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map(p => (
                      <tr key={p.id} className="hover:bg-[#111] transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 border border-glass-stroke overflow-hidden flex-shrink-0">
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-label-md text-white text-sm">{p.title}</p>
                              <span className="font-code-sm text-[10px] text-secondary block">{p.version} • {p.teamSize ? `Team: ${p.teamSize}` : "Solo"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-zinc-800 text-secondary font-code-sm text-[11px] px-2.5 py-1 border border-glass-stroke uppercase">
                            {categories.find(c => c.id === p.category)?.name || p.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-body-md text-xs text-secondary">{p.date}</p>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleVisibility(p)}
                            className={`flex items-center gap-2 cursor-pointer transition-colors ${
                              p.isPublic ? "text-green-400" : "text-yellow-500"
                            }`}
                          >
                            {p.isPublic ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span className="uppercase text-[9px] tracking-widest font-black">Public</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4" />
                                <span className="uppercase text-[9px] tracking-widest font-black">Private</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(p)}
                              className="p-2 border border-glass-stroke text-secondary hover:text-white hover:border-zinc-500 transition-all rounded-none cursor-pointer"
                              title="Edit parameters"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-2 border border-glass-stroke hover:border-[#e31b23] text-secondary hover:text-red-400 transition-all rounded-none cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
              <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider mb-6">Existing Scopes</h3>
              <div className="divide-y divide-glass-stroke border border-glass-stroke">
                {categories.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-4 bg-[#111] hover:bg-zinc-900 transition-colors">
                    <div>
                      <p className="font-label-md text-sm text-white">{c.name}</p>
                      <code className="text-[10px] text-zinc-500 select-all font-mono font-bold">Scope Mapping URI: {c.id}</code>
                    </div>
                    {c.id !== "all" && c.id !== "web" && c.id !== "ml" ? (
                      <button 
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-2 border border-glass-stroke hover:border-[#e31b23] text-secondary hover:text-red-400 transition-all rounded-none cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[9px] font-black tracking-widest uppercase border border-glass-stroke px-2 py-1 text-zinc-500 font-code-sm">
                        Immune System Core
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Create Scope Category */}
            <div>
              <form onSubmit={handleAddCategory} className="bg-[#0A0A0A] border border-glass-stroke p-6">
                <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider mb-4">Register Scope</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="catName">
                      Category Name
                    </label>
                    <input 
                      id="catName"
                      type="text" 
                      required
                      placeholder="e.g. Artificial Intelligence"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none placeholder-secondary/30"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary-container hover:bg-racing-red-hover text-white py-3 px-4 font-label-md text-xs uppercase tracking-widest transition-all rounded-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    REGISTER SCOPE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider mb-6 border-b border-glass-stroke pb-4">Personal Identifiers</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                    Professional Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={perfName}
                    onChange={(e) => setPerfName(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                    Contact Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    value={perfEmail}
                    onChange={(e) => setPerfEmail(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                    Phone Verification
                  </label>
                  <input 
                    type="text" 
                    required
                    value={perfPhone}
                    onChange={(e) => setPerfPhone(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                    Geographical Location
                  </label>
                  <input 
                    type="text" 
                    required
                    value={perfLocation}
                    onChange={(e) => setPerfLocation(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                    GitHub Profile Link
                  </label>
                  <input 
                    type="url" 
                    value={perfGithub}
                    onChange={(e) => setPerfGithub(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                    LinkedIn Portfolio Link
                  </label>
                  <input 
                    type="url" 
                    value={perfLinkedin}
                    onChange={(e) => setPerfLinkedin(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                    Twitter / X Profile Link
                  </label>
                  <input 
                    type="url" 
                    value={perfTwitter}
                    onChange={(e) => setPerfTwitter(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                    LeetCode Profile Link
                  </label>
                  <input 
                    type="url" 
                    value={perfLeetcode}
                    onChange={(e) => setPerfLeetcode(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                  />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-[#111]/30 p-4 border border-glass-stroke/50">
                  <div className="md:col-span-3">
                    <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                      Profile Picture / Avatar Image URL
                    </label>
                    <input 
                      type="url" 
                      value={perfAvatar}
                      onChange={(e) => setPerfAvatar(e.target.value)}
                      className="w-full bg-black border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                    />
                    <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                      <strong className="text-primary uppercase font-bold">Google Drive support active:</strong> Paste any Google Drive link here! Make sure your file sharing in Google Drive is set to <strong className="text-white">"Anyone with the link can view"</strong> so the image renders properly.
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-1.5 border border-glass-stroke bg-zinc-950 aspect-square w-20 h-20 mx-auto md:mx-0 overflow-hidden">
                    {perfAvatar ? (
                      <img 
                        src={getDirectImageUrl(perfAvatar)} 
                        alt="Avatar Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).alt = 'Invalid Link';
                        }}
                      />
                    ) : (
                      <span className="text-[8px] text-zinc-650 text-center font-mono uppercase">Preview</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                  Brief Pitch / Summary (Used in subtitles)
                </label>
                <input 
                  type="text" 
                  required
                  value={perfBio}
                  onChange={(e) => setPerfBio(e.target.value)}
                  className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none"
                />
              </div>

              <div>
                <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5">
                  Long Biography (Intro Story)
                </label>
                <textarea 
                  rows={4}
                  required
                  value={perfLongBio}
                  onChange={(e) => setPerfLongBio(e.target.value)}
                  className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2.5 px-4 outline-none transition-all rounded-none font-sans text-xs"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  className="bg-primary-container hover:bg-racing-red-hover text-white px-8 py-3.5 font-label-md text-xs uppercase tracking-widest hover:shadow-2xl active:scale-95 transition-all outline-none rounded-none cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  SYNC ALL SYSTEM ARSENAL KEYS
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. INBOUND MESSAGE BOX TAB */}
        {activeTab === "messages" && (
          <div className="bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
            <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider mb-6">Contact Form Inbox</h3>
            {messages.length === 0 ? (
              <div className="p-12 text-center text-secondary font-code-sm opacity-60">
                No user inquiries are currently saved to the workspace database.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={`p-6 border transition-colors ${
                    m.isRead 
                      ? "bg-zinc-900/50 border-glass-stroke" 
                      : "bg-[#111] border-[#e31b23]"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-glass-stroke pb-3 mb-4">
                      <div>
                        <h4 className="font-label-md text-sm text-white">{m.name}</h4>
                        <a href={`mailto:${m.email}`} className="text-secondary hover:text-[#e31b23] text-xs font-mono select-all block mt-0.5">{m.email}</a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-code-sm text-xs text-zinc-500">{m.createdAt}</span>
                        {!m.isRead && (
                          <span className="bg-[#e31b23]/15 text-[#e31b23] text-[9px] font-black border border-[#e31b23]/40 px-2 py-0.5 rounded-none font-code-sm tracking-widest uppercase">
                            UNREAD
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap font-body-md mb-4">{m.message}</p>
                    <div className="flex justify-end gap-3">
                      {!m.isRead && (
                        <button 
                          onClick={() => onMarkMessageRead(m.id)}
                          className="px-3 py-1.5 border border-glass-stroke hover:bg-green-500/10 hover:border-green-500 text-green-400 font-label-md text-[10px] uppercase tracking-widest rounded-none cursor-pointer transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteMessage(m.id)}
                        className="px-3 py-1.5 border border-glass-stroke hover:bg-red-500/10 hover:border-[#e31b23] text-[#e31b23] font-label-md text-[10px] uppercase tracking-widest rounded-none cursor-pointer transition-colors"
                      >
                        Delete Inbound
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. EDUCATION & EXPERIENCE MANAGEMENT TAB */}
        {activeTab === "education-experience" && (
          <div className="space-y-12">
            
            {/* EDUCATION SUB-SECTION */}
            <div className="bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-4">
                <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-container" />
                  Educations Timeline
                </h3>
              </div>
              
              {/* Form to Add New Education */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const institution = (form.elements.namedItem("eduInst") as HTMLInputElement).value;
                const degree = (form.elements.namedItem("eduDegree") as HTMLInputElement).value;
                const date = (form.elements.namedItem("eduDate") as HTMLInputElement).value;
                const grade = (form.elements.namedItem("eduGrade") as HTMLInputElement).value;
                
                onUpdateEducations([
                  ...educations,
                  { id: `edu-${Date.now()}`, institution, degree, date, grade }
                ]);
                form.reset();
                triggerAlert("New Education block spawned.");
              }} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-[#111] p-5 border border-glass-stroke">
                <div className="md:col-span-4 text-xs font-mono font-black text-primary uppercase tracking-widest mb-1">
                  Spawn New Education Entry
                </div>
                <div>
                  <input name="eduInst" placeholder="Lovely Professional University" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                </div>
                <div>
                  <input name="eduDegree" placeholder="Master of Computer Applications" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                </div>
                <div>
                  <input name="eduDate" placeholder="2024 - 2026" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                </div>
                <div>
                  <input name="eduGrade" placeholder="CGPA: 8.5" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button type="submit" className="px-5 py-2.5 bg-[#e31b23] text-white font-label-md text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all font-black cursor-pointer flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add Education Record
                  </button>
                </div>
              </form>

              {/* Education List */}
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start bg-black/45 border border-glass-stroke p-5">
                    <div>
                      <h4 className="text-white uppercase font-black text-md tracking-wider">{edu.degree}</h4>
                      <p className="text-primary font-mono text-xs font-bold mt-1 uppercase">{edu.institution}</p>
                      <div className="flex gap-4 mt-2 text-[10px] uppercase font-mono text-secondary">
                        <span>Period: {edu.date}</span>
                        <span>Performance: {edu.grade}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        onUpdateEducations(educations.filter(x => x.id !== edu.id));
                        triggerAlert("Education record purged.");
                      }}
                      className="px-2.5 py-1.5 border border-glass-stroke hover:bg-[#e31b23]/10 hover:border-[#e31b23] text-[#e31b23] font-label-md text-[9px] uppercase tracking-widest cursor-pointer transition-all"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPERIENCES SUB-SECTION */}
            <div className="bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-4">
                <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-container" />
                  Professional Experience Index
                </h3>
              </div>

              {/* Form to Add New Experience */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const company = (form.elements.namedItem("expCompany") as HTMLInputElement).value;
                const role = (form.elements.namedItem("expRole") as HTMLInputElement).value;
                const period = (form.elements.namedItem("expPeriod") as HTMLInputElement).value;
                const bulletsRaw = (form.elements.namedItem("expBullets") as HTMLTextAreaElement).value;
                
                const bullets = bulletsRaw.split("\n").map(b => b.trim()).filter(b => b.length > 0);

                onUpdateExperiences([
                  ...experiences,
                  { id: `exp-${Date.now()}`, company, role, period, bullets }
                ]);
                form.reset();
                triggerAlert("New Experience parameters compiled.");
              }} className="space-y-4 mb-8 bg-[#111] p-5 border border-glass-stroke text-xs">
                <div className="text-xs font-mono font-black text-primary uppercase tracking-widest mb-1">
                  Deploy New Experience Record
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="expCompany" placeholder="Maxgen Technologies Pvt. Ltd." required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                  <input name="expRole" placeholder="Data Science & ML Intern" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                  <input name="expPeriod" placeholder="Jun 2024 - Aug 2024" required className="w-full bg-[#111] border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                </div>
                <div>
                  <label className="block text-secondary font-mono text-[9px] uppercase tracking-widest mb-1">Bullet Achievements (One item per line)</label>
                  <textarea name="expBullets" rows={3} placeholder="Cleaned real estate datasets...&#10;Built ML models using Scikit-Learn..." required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-5 py-2.5 bg-[#e31b23] text-white font-label-md text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all font-black cursor-pointer flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Deploy Experience Record
                  </button>
                </div>
              </form>

              {/* Experiences List */}
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex justify-between items-start bg-black/45 border border-glass-stroke p-5">
                    <div className="flex-grow pr-4">
                      <h4 className="text-white uppercase font-black text-md tracking-wider">{exp.role}</h4>
                      <p className="text-primary font-mono text-xs font-bold mt-1 uppercase">{exp.company} ({exp.period})</p>
                      <ul className="list-disc pl-4 mt-2 space-y-1.5 text-zinc-400 font-sans text-xs">
                        {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                    <button 
                      onClick={() => {
                        onUpdateExperiences(experiences.filter(x => x.id !== exp.id));
                        triggerAlert("Experience item deleted.");
                      }}
                      className="px-2.5 py-1.5 border border-glass-stroke hover:bg-[#e31b23]/10 hover:border-[#e31b23] text-[#e31b23] font-label-md text-[9px] uppercase tracking-widest cursor-pointer transition-all flex-shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 7. CERTIFICATIONS & SCHOLASTIC MILESTONES TAB */}
        {activeTab === "certifications-milestones" && (
          <div className="space-y-12">
            
            {/* CERTIFICATIONS MANAGEMENT */}
            <div className="bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-4">
                <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-container" />
                  Credentials & Certifications
                </h3>
              </div>

              {/* Form to Add New Certification */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem("certName") as HTMLInputElement).value;
                const issuer = (form.elements.namedItem("certIssuer") as HTMLInputElement).value;
                const date = (form.elements.namedItem("certDate") as HTMLInputElement).value;
                const proofLink = (form.elements.namedItem("certProof") as HTMLInputElement).value;
                
                onUpdateCertifications([
                  ...certifications,
                  { id: `cert-${Date.now()}`, title, issuer, date, proofLink }
                ]);
                form.reset();
                triggerAlert("Verified certificate synced.");
              }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-[#111] p-5 border border-glass-stroke text-xs">
                <div className="md:col-span-3 text-xs font-mono font-black text-primary uppercase tracking-widest mb-1">
                  Authenticate New Certification
                </div>
                <input name="certName" placeholder="Machine Learning & Deep Learning Specialization" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                <input name="certIssuer" placeholder="Coursera / Stanford University" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                <input name="certDate" placeholder="Feb 2026 - Mar 2026" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                <div className="md:col-span-3">
                  <input name="certProof" placeholder="https://example.com/credential/proof-link (Optional link to certificate/PDF)" className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                </div>
                
                <div className="md:col-span-3 flex justify-end">
                  <button type="submit" className="px-5 py-2.5 bg-[#e31b23] text-white font-label-md text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all font-black cursor-pointer flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Deploy Certificate
                  </button>
                </div>
              </form>

              {/* Certifications List */}
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start bg-black/45 border border-glass-stroke p-5">
                    <div>
                      <h4 className="text-white uppercase font-black text-sm tracking-widest">{cert.title}</h4>
                      <p className="text-primary font-mono text-[10px] font-black mt-1 uppercase">{cert.issuer}</p>
                      <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider mt-1 font-bold">Issued: {cert.date}</p>
                      {cert.proofLink && (
                        <p className="mt-2 text-[10px] font-mono text-zinc-400">
                          Proof Link: <a href={cert.proofLink} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-white break-all">{cert.proofLink}</a>
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        onUpdateCertifications(certifications.filter(x => x.id !== cert.id));
                        triggerAlert("Certificate records cleared.");
                      }}
                      className="px-2.5 py-1.5 border border-glass-stroke hover:bg-[#e31b23]/10 hover:border-[#e31b23] text-[#e31b23] font-label-md text-[9px] uppercase tracking-widest cursor-pointer transition-all"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MILESTONES MANAGEMENT */}
            <div className="bg-[#0A0A0A] border border-glass-stroke p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-4">
                <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-container" />
                  Scholastic Milestones & Achievements
                </h3>
              </div>

              {/* Form to Add New Milestone */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem("achTitle") as HTMLInputElement).value;
                const details = (form.elements.namedItem("achDetails") as HTMLInputElement).value;
                
                onUpdateAchievements([
                  ...achievements,
                  { id: `ach-${Date.now()}`, title, details }
                ]);
                form.reset();
                triggerAlert("Scholastic milestone declared.");
              }} className="space-y-4 mb-8 bg-[#111] p-5 border border-glass-stroke text-xs">
                <div className="text-xs font-mono font-black text-primary uppercase tracking-widest mb-1">
                  Log Scholastic Achievement
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="achTitle" placeholder="Coding Ninjas Hackathon Runner-Up" required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                  <input name="achDetails" placeholder="Runner-Up in a 24-hour engineering sprint held at LPU showcasing ML pipeline." required className="w-full bg-black border border-glass-stroke text-white py-2 px-3 text-xs outline-none focus:border-primary-container" />
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="px-5 py-2.5 bg-[#e31b23] text-white font-label-md text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all font-black cursor-pointer flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Declare Milestone
                  </button>
                </div>
              </form>

              {/* Milestones List */}
              <div className="space-y-4">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex justify-between items-start bg-black/45 border border-glass-stroke p-5">
                    <div className="pr-4">
                      <h4 className="text-white uppercase font-black text-sm tracking-wider">{ach.title}</h4>
                      <p className="text-secondary font-sans text-xs leading-relaxed mt-2">{ach.details}</p>
                    </div>
                    <button 
                      onClick={() => {
                        onUpdateAchievements(achievements.filter(x => x.id !== ach.id));
                        triggerAlert("Milestone deleted.");
                      }}
                      className="px-2.5 py-1.5 border border-glass-stroke hover:bg-[#e31b23]/10 hover:border-[#e31b23] text-[#e31b23] font-label-md text-[9px] uppercase tracking-widest cursor-pointer transition-all flex-shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 6. COMPREHENSIVE ADD/EDIT PROJECT OVERLAY MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0A0A] border border-glass-stroke w-full max-w-2xl p-6 md:p-8 rounded-none shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-4">
              <h3 className="font-display font-black text-xl text-white tracking-widest uppercase">
                {editingProject ? "Compile Params" : "Spawn New Record"}
              </h3>
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="text-secondary hover:text-white transition-colors cursor-pointer font-label-md text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pTitle">
                    Project Heading
                  </label>
                  <input 
                    id="pTitle"
                    type="text" 
                    required
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g. Nexus Ledger AI"
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none placeholder-secondary/20"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pSub">
                    Teaser Subtitle
                  </label>
                  <input 
                    id="pSub"
                    type="text" 
                    value={projSubtitle}
                    onChange={(e) => setProjSubtitle(e.target.value)}
                    placeholder="e.g. Distributed ledger spatial networks"
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none placeholder-secondary/20"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pCategory">
                    Category Scope
                  </label>
                  <select 
                    id="pCategory"
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full bg-[#111] border border-glass-stroke text-white font-body-md py-2.5 px-3 outline-none transition-all rounded-none"
                  >
                    {categories.filter(c => c.id !== "all").map(c => (
                      <option key={c.id} value={c.id} className="bg-black text-white">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pDate">
                    Timeline Date
                  </label>
                  <input 
                    id="pDate"
                    type="text" 
                    value={projDate}
                    onChange={(e) => setProjDate(e.target.value)}
                    placeholder="e.g. Feb - Apr 2026"
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none placeholder-secondary/20"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pVersion">
                    Engine Version Tag
                  </label>
                  <input 
                    id="pVersion"
                    type="text" 
                    value={projVersion}
                    onChange={(e) => setProjVersion(e.target.value)}
                    placeholder="e.g. v2.4.0"
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none placeholder-secondary/20"
                  />
                </div>
                <div>
                  <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pTeam">
                    Team Size
                  </label>
                  <input 
                    id="pTeam"
                    type="text" 
                    value={projTeamSize}
                    onChange={(e) => setProjTeamSize(e.target.value)}
                    placeholder="e.g. 5, or Solo"
                    className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none placeholder-secondary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pTags">
                  Tech Stack / Tags (Comma separated list)
                </label>
                <input 
                  id="pTags"
                  type="text" 
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  placeholder="Python, PyTorch, React, Docker"
                  className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none placeholder-secondary/20"
                />
              </div>

              <div>
                <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pImg">
                  Thumbnail Image Hotlink URL
                </label>
                <input 
                  id="pImg"
                  type="text" 
                  value={projImage}
                  onChange={(e) => setProjImage(e.target.value)}
                  placeholder="https://lh3.googleusercontent.com/..."
                  className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none placeholder-secondary/20 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pLink">
                  GitHub Repository / Live Link URL
                </label>
                <input 
                  id="pLink"
                  type="text" 
                  value={projLink}
                  onChange={(e) => setProjLink(e.target.value)}
                  placeholder="https://github.com/prashantpatil4524/..."
                  className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none placeholder-secondary/20 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pDesc">
                  Short Description
                </label>
                <textarea 
                  id="pDesc"
                  rows={2}
                  required
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  placeholder="Keep it concise for card highlights"
                  className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-secondary font-label-md text-[10px] uppercase tracking-widest mb-1.5" htmlFor="pLong">
                  Comprehensive Specifications / Readme Description
                </label>
                <textarea 
                  id="pLong"
                  rows={4}
                  value={projLongDescription}
                  onChange={(e) => setProjLongDescription(e.target.value)}
                  placeholder="Full technical analysis, features list, metrics models..."
                  className="w-full bg-[#111] border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-2 px-3 outline-none transition-all rounded-none font-sans text-xs"
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="pIsPub"
                  checked={projIsPublic}
                  onChange={(e) => setProjIsPublic(e.target.checked)}
                  className="text-primary bg-zinc-900 border-glass-stroke focus:ring-0"
                />
                <label htmlFor="pIsPub" className="text-secondary font-label-md text-xs uppercase tracking-widest cursor-pointer select-none">
                  Publish Globally Instantly
                </label>
              </div>

              <button 
                type="submit"
                className="w-full h-12 bg-primary-container hover:bg-racing-red-hover text-white font-label-md text-xs tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center"
              >
                COMPILE & SYNC RECORD
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
