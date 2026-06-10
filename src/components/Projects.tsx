import { useState } from "react";
import { Project, Category } from "../types";
import { Info, ExternalLink, Calendar, Users, Cpu } from "lucide-react";

interface ProjectsProps {
  projects: Project[];
  categories: Category[];
}

export default function Projects({ projects, categories }: ProjectsProps) {
  const [selectedCat, setSelectedCat] = useState("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Filters projects based on selected scope
  const filtered = projects.filter(p => {
    if (selectedCat === "all") return p.isPublic;
    return p.isPublic && p.category === selectedCat;
  });

  return (
    <section id="projects" className="py-24 bg-transparent border-b border-glass-stroke relative z-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <header className="mb-16">
          <span className="text-primary font-label-md text-xs uppercase tracking-widest mb-3 block">Dynamic Gallery</span>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-on-surface mb-4 tracking-tighter uppercase">
            Featured Projects.
          </h2>
          <p className="text-secondary font-body-lg text-lg max-w-2xl leading-relaxed">
            Curated machine learning pipelines, high-performance web engineering, and visual data intelligence models.
          </p>
        </header>

        {/* CATEGORIES FILTERS */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-glass-stroke pb-6">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`font-label-md text-xs uppercase tracking-widest px-6 py-2.5 transition-all rounded-none cursor-pointer border ${
                selectedCat === c.id 
                  ? "border-primary text-white bg-primary dark:bg-primary/10 dark:text-primary" 
                  : "border-glass-stroke text-zinc-650 dark:text-zinc-400 hover:border-zinc-500 dark:hover:text-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* ASYMMETRICAL MOUNTED GALLERY GRID */}
        {filtered.length === 0 ? (
          <div className="p-16 border border-glass-stroke bg-white/5 dark:bg-black/5 text-center">
            <p className="text-zinc-500 font-code-sm uppercase font-bold">Selected registry contains no active builds.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, index) => {
              // Asynchronous rhythm styling
              const isLarge = index === 0 && filtered.length > 2;
              
              return (
                <div 
                  key={p.id}
                  className={`bg-white dark:bg-[#0A0A0A] border border-glass-stroke transition-all duration-300 hover:border-primary flex flex-col h-full group ${
                    isLarge ? "md:col-span-2" : ""
                  }`}
                >
                  {/* Card Thumbnail Image */}
                  <div className="relative overflow-hidden aspect-video bg-zinc-900 border-b border-glass-stroke">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 pointer-events-none" />
                    <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-[10px] text-zinc-400 px-2 py-0.5 border border-glass-stroke uppercase tracking-widest font-mono font-bold">
                      {p.version}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.slice(0, 4).map(t => (
                        <span 
                          key={t} 
                          className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 border border-glass-stroke text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-none font-bold"
                        >
                          {t}
                        </span>
                      ))}
                      {p.tags.length > 4 && (
                        <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-400 px-2 py-0.5 font-bold">
                          +{p.tags.length - 4}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-black text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors uppercase tracking-wide">
                      {p.title}
                    </h3>

                    {p.subtitle && (
                      <p className="text-primary font-mono text-xs tracking-wider uppercase mb-3">
                        {p.subtitle}
                      </p>
                    )}

                    <p className="text-secondary font-sans text-sm mb-6 flex-grow leading-relaxed">
                      {p.description}
                    </p>

                    <button 
                      onClick={() => setActiveProject(p)}
                      className="w-full bg-[#111] dark:bg-zinc-900 hover:bg-primary hover:text-white text-zinc-200 border border-glass-stroke py-3.5 transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center gap-1.5 font-mono text-xs uppercase tracking-widest font-bold"
                    >
                      <Info className="w-4 h-4" />
                      Inspect Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* FULL RECORD INSPECTION DIALOG MODAL */}
      {activeProject && (
        <div className="fixed inset-0 z-55 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0A] border border-glass-stroke w-full max-w-3xl p-6 md:p-8 rounded-none shadow-2xl relative overflow-y-auto max-h-[90vh] transition-all">
            
            <header className="flex justify-between items-start mb-6 border-b border-glass-stroke pb-4">
              <div>
                <span className="text-primary text-[10px] tracking-widest uppercase font-mono font-bold block mb-1">Portfolio System Registry</span>
                <h3 className="font-display font-black text-2xl md:text-3xl text-on-surface uppercase tracking-wider">{activeProject.title}</h3>
                {activeProject.subtitle && (
                  <p className="text-zinc-500 text-sm mt-0.5">{activeProject.subtitle}</p>
                )}
              </div>
              <button 
                onClick={() => setActiveProject(null)}
                className="text-zinc-500 hover:text-black dark:hover:text-white text-xs font-mono uppercase tracking-widest border border-glass-stroke px-3 py-1 cursor-pointer hover:border-zinc-500 transition-all rounded-none font-bold"
              >
                Close specs
              </button>
            </header>

            {/* Modal Body Container */}
            <div className="space-y-6">
              
              {/* Image banner inside modal */}
              <div className="w-full h-64 overflow-hidden bg-zinc-900 border border-glass-stroke">
                <img src={activeProject.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-90" />
              </div>

              {/* Grid with metadata details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-b border-glass-stroke pb-6 text-xs md:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 text-primary flex items-center justify-center border border-glass-stroke">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-widest text-[9px] block">Development timeline</span>
                    <strong className="text-on-surface block font-mono font-bold">{activeProject.date}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 text-primary flex items-center justify-center border border-glass-stroke">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-widest text-[9px] block">Engineering size</span>
                    <strong className="text-on-surface block font-mono font-bold">{activeProject.teamSize || "1"} Developer</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 text-primary flex items-center justify-center border border-glass-stroke">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-widest text-[9px] block">Engine version</span>
                    <strong className="text-on-surface block font-mono font-bold">{activeProject.version}</strong>
                  </div>
                </div>
              </div>

              {/* Descriptions & Specs */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-on-surface uppercase tracking-wider text-sm">System Specifications:</h4>
                <p className="text-secondary text-sm leading-relaxed whitespace-pre-line font-sans">
                  {activeProject.longDescription || activeProject.description}
                </p>
              </div>

              {/* Tech Stack Pills in Modal */}
              <div className="space-y-3 pt-4">
                <h4 className="font-display font-bold text-on-surface uppercase tracking-wider text-xs">Assigned Registry Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.tags.map(t => (
                    <span key={t} className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-900 border border-glass-stroke text-zinc-850 dark:text-zinc-200 px-3 py-1 font-bold">
                       {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons inside Modal */}
              {activeProject.projectLink && (
                <div className="pt-6 flex justify-end">
                  <a 
                    href={activeProject.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 font-mono text-xs uppercase tracking-widest hover:shadow-xl transition-all rounded-none flex items-center gap-2 cursor-pointer inline-flex font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Inspect Repository / Document
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
