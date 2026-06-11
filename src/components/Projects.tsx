import { useState, useEffect, useRef, useCallback } from "react";
import { Project, Category } from "../types";
import { Info, ExternalLink, Calendar, Users, Cpu } from "lucide-react";

interface ProjectsProps {
  projects: Project[];
  categories: Category[];
}

/* ═══════════════════════════════════════════════════════
   PARTICLE FIELD — Floating interconnected particles
   ═══════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Read theme primary color from CSS variable
    const getColor = (): [number, number, number] => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
      const m = raw.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
      return [227, 27, 35];
    };

    const count = window.innerWidth < 768 ? 40 : 80;

    interface Particle {
      x: number; y: number; vx: number; vy: number; size: number; alpha: number;
    }
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.parentElement?.addEventListener("mousemove", handleMouse);

    const connectDist = window.innerWidth < 768 ? 80 : 120;
    const mouseDist = 150;

    const render = () => {
      if (!ctx || width === 0) { animRef.current = requestAnimationFrame(render); return; }
      ctx.clearRect(0, 0, width, height);
      const [cr, cg, cb] = getColor();

      for (const p of particles) {
        // Mouse repel
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const md = Math.sqrt(dx * dx + dy * dy);
        if (md < mouseDist && md > 0) {
          const force = (mouseDist - md) / mouseDist * 0.015;
          p.vx += (dx / md) * force;
          p.vy += (dy / md) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.998;
        p.vy *= 0.998;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.alpha})`;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${p.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   3D TILT CARD WRAPPER — Perspective mouse tracking
   ═══════════════════════════════════════════════════════ */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (isTouchDevice || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`,
      transition: "transform 0.1s ease-out",
    });
  }, [isTouchDevice]);

  const handleLeave = useCallback(() => {
    setStyle({
      transform: "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)",
      transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    });
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={className} style={style}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PROJECTS SECTION
   ═══════════════════════════════════════════════════════ */
export default function Projects({ projects, categories }: ProjectsProps) {
  const [selectedCat, setSelectedCat] = useState("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = projects.filter(p => {
    if (selectedCat === "all") return p.isPublic;
    return p.isPublic && p.category === selectedCat;
  });

  // Intersection Observer for staggered card entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-project-id");
            if (id) setVisibleCards(prev => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const cards = document.querySelectorAll("[data-project-id]");
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 bg-transparent border-b border-glass-stroke relative z-10 transition-colors duration-500 overflow-hidden"
    >
      {/* Particle Field Background */}
      <ParticleField />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ─── HEADER ─── */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="glow-dot" />
            <span className="text-primary font-mono text-xs uppercase tracking-widest font-bold">Dynamic Gallery</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tighter uppercase gradient-text-animated">
            Featured Projects.
          </h2>
          <p className="text-secondary font-sans text-lg max-w-2xl leading-relaxed">
            Curated machine learning pipelines, high-performance web engineering, and visual data intelligence models.
          </p>
        </header>

        {/* ─── CATEGORY FILTERS ─── */}
        <div className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-glass-stroke relative">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`font-mono text-xs uppercase tracking-widest px-6 py-2.5 transition-all duration-300 cursor-pointer border relative overflow-hidden font-bold ${
                selectedCat === c.id
                  ? "border-primary text-white bg-primary/15 shadow-[0_0_20px_var(--glow-soft)]"
                  : "border-[var(--glass-border)] text-zinc-400 hover:border-primary/40 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {selectedCat === c.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_var(--glow-primary)]" />
              )}
              {c.name}
            </button>
          ))}
        </div>

        {/* ─── PROJECT GRID ─── */}
        {filtered.length === 0 ? (
          <div className="p-16 glass-card text-center">
            <p className="text-zinc-500 font-mono text-xs uppercase font-bold tracking-widest">
              Selected registry contains no active builds.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, index) => {
              const isLarge = index === 0 && filtered.length > 2;
              const isVisible = visibleCards.has(p.id);

              return (
                <TiltCard
                  key={p.id}
                  className={isLarge ? "md:col-span-2" : ""}
                >
                  <div
                    data-project-id={p.id}
                    className={`glass-card holo-shimmer corner-brackets flex flex-col h-full group ${
                      isVisible ? "" : "opacity-0"
                    }`}
                    style={{
                      animation: isVisible ? `floatUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s both` : "none",
                      willChange: "transform, opacity",
                    }}
                  >
                    {/* Card Thumbnail */}
                    <div className="relative overflow-hidden aspect-video bg-zinc-950 border-b border-[var(--glass-border)]">
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--glow-soft)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <span className="absolute top-4 right-4 glass-card text-[10px] text-zinc-300 px-2.5 py-1 uppercase tracking-widest font-mono font-bold border-none bg-black/50 backdrop-blur-md">
                        {p.version}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="p-8 flex flex-col flex-grow relative z-5">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tags.slice(0, 4).map((t, ti) => (
                          <span
                            key={t}
                            className="font-mono text-[10px] bg-white/[0.04] hover:bg-primary/10 border border-[var(--glass-border)] hover:border-primary/30 text-zinc-300 px-2.5 py-1 transition-all duration-300 font-bold"
                            style={{
                              animation: isVisible ? `tagPop 0.4s ease ${(index * 0.1) + (ti * 0.05) + 0.3}s both` : "none",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                        {p.tags.length > 4 && (
                          <span className="font-mono text-[10px] text-zinc-500 px-2 py-1 font-bold">
                            +{p.tags.length - 4}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-black text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors duration-300 uppercase tracking-wide">
                        {p.title}
                      </h3>

                      {p.subtitle && (
                        <p className="text-primary font-mono text-xs tracking-wider uppercase mb-3 flex items-center gap-2">
                          <span className="w-3 h-[1px] bg-primary inline-block" />
                          {p.subtitle}
                        </p>
                      )}

                      <p className="text-secondary font-sans text-sm mb-6 flex-grow leading-relaxed">
                        {p.description}
                      </p>

                      <button
                        onClick={() => setActiveProject(p)}
                        className="w-full bg-white/[0.03] hover:bg-primary/20 hover:shadow-[0_0_20px_var(--glow-soft)] text-zinc-200 hover:text-white border border-[var(--glass-border)] hover:border-primary/50 py-3.5 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest font-bold backdrop-blur-sm"
                      >
                        <Info className="w-4 h-4" />
                        Inspect Details
                      </button>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ INSPECTION MODAL ═══ */}
      {activeProject && (
        <div
          className="fixed inset-0 z-55 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setActiveProject(null); }}
        >
          <div
            className="glass-card scanlines w-full max-w-3xl p-0 shadow-[0_0_80px_var(--glow-soft)] relative overflow-y-auto max-h-[90vh]"
            style={{ animation: "modalEntry 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both" }}
          >
            {/* Neon edge accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_var(--glow-primary)]" />

            <div className="p-6 md:p-8">
              <header className="flex justify-between items-start mb-6 border-b border-[var(--glass-border)] pb-4">
                <div>
                  <span className="text-primary text-[10px] tracking-widest uppercase font-mono font-bold block mb-1 flex items-center gap-2">
                    <span className="glow-dot" style={{ width: 4, height: 4 }} />
                    Portfolio System Registry
                  </span>
                  <h3 className="font-display font-black text-2xl md:text-3xl text-on-surface uppercase tracking-wider">
                    {activeProject.title}
                  </h3>
                  {activeProject.subtitle && (
                    <p className="text-zinc-500 text-sm mt-0.5">{activeProject.subtitle}</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveProject(null)}
                  className="text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest border border-[var(--glass-border)] hover:border-primary/50 px-3 py-1.5 cursor-pointer transition-all font-bold hover:bg-primary/10 hover:shadow-[0_0_10px_var(--glow-soft)]"
                >
                  Close specs
                </button>
              </header>

              {/* Modal Body */}
              <div className="space-y-6">

                {/* Image banner */}
                <div className="w-full h-64 overflow-hidden border border-[var(--glass-border)] relative">
                  <img src={activeProject.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  {/* Holographic shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[holoSweep_4s_ease-in-out_infinite] pointer-events-none" style={{ backgroundSize: "200% 100%" }} />
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-b border-[var(--glass-border)] pb-6">
                  {[
                    { icon: Calendar, label: "Development timeline", value: activeProject.date },
                    { icon: Users, label: "Engineering size", value: `${activeProject.teamSize || "1"} Developer` },
                    { icon: Cpu, label: "Engine version", value: activeProject.version },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 glass-card p-3 border-none bg-white/[0.02]">
                      <div className="w-10 h-10 flex items-center justify-center border border-[var(--glass-border)] text-primary bg-primary/5">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-zinc-500 uppercase tracking-widest text-[9px] block font-mono">{item.label}</span>
                        <strong className="text-on-surface block font-mono text-sm font-bold">{item.value}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-on-surface uppercase tracking-wider text-sm flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-primary inline-block" />
                    System Specifications
                  </h4>
                  <p className="text-secondary text-sm leading-relaxed whitespace-pre-line font-sans">
                    {activeProject.longDescription || activeProject.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-3 pt-4">
                  <h4 className="font-display font-bold text-on-surface uppercase tracking-wider text-xs flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-primary inline-block" />
                    Assigned Registry Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map(t => (
                      <span key={t} className="font-mono text-[11px] bg-white/[0.04] border border-[var(--glass-border)] hover:border-primary/30 hover:bg-primary/10 text-zinc-200 px-3 py-1.5 transition-all duration-200 font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {activeProject.projectLink && (
                  <div className="pt-6 flex justify-end">
                    <a
                      href={activeProject.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/20 hover:bg-primary border border-primary/50 hover:border-primary text-white px-8 py-3.5 font-mono text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer font-bold hover:shadow-[0_0_30px_var(--glow-soft)]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Inspect Repository / Document
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom neon edge */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </div>
      )}
    </section>
  );
}
