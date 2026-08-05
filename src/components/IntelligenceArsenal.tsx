import { useEffect, useRef, useState, useCallback } from "react";
import { Certification, AchievementItem } from "../types";
import { Cpu, Award, Badge, ExternalLink } from "lucide-react";
import { sanitizeUrl } from "../utils";

interface ArsenalProps {
  certifications: Certification[];
  achievements: AchievementItem[];
}

/* ═══════════════════════════════════════════════════════
   NEURAL GRID — Hexagonal network particle system
   ═══════════════════════════════════════════════════════ */
function NeuralGrid() {
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

    const getColor = (): [number, number, number] => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
      const m = raw.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
      return [227, 27, 35];
    };

    // Grid-based nodes with slight randomization
    interface Node {
      baseX: number; baseY: number; x: number; y: number; vx: number; vy: number; phase: number;
    }
    const nodes: Node[] = [];
    const spacing = window.innerWidth < 768 ? 80 : 60;
    const cols = Math.ceil((width || 800) / spacing) + 1;
    const rows = Math.ceil((height || 600) / spacing) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offsetX = r % 2 === 0 ? 0 : spacing / 2;
        const baseX = c * spacing + offsetX + (Math.random() - 0.5) * 15;
        const baseY = r * spacing + (Math.random() - 0.5) * 15;
        nodes.push({
          baseX, baseY, x: baseX, y: baseY,
          vx: 0, vy: 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.parentElement?.addEventListener("mousemove", handleMouse);

    const connectDist = spacing * 1.5;
    const mouseInfluence = 120;
    let time = 0;

    const render = () => {
      if (!ctx || width === 0) { animRef.current = requestAnimationFrame(render); return; }
      ctx.clearRect(0, 0, width, height);
      const [cr, cg, cb] = getColor();
      time += 0.008;

      // Update nodes
      for (const n of nodes) {
        // Gentle drift
        const driftX = Math.sin(time + n.phase) * 3;
        const driftY = Math.cos(time * 0.7 + n.phase) * 3;

        // Mouse scatter
        const dx = n.x - mouseRef.current.x;
        const dy = n.y - mouseRef.current.y;
        const md = Math.sqrt(dx * dx + dy * dy);

        let targetX = n.baseX + driftX;
        let targetY = n.baseY + driftY;

        if (md < mouseInfluence && md > 0) {
          const force = (mouseInfluence - md) / mouseInfluence;
          targetX += (dx / md) * force * 25;
          targetY += (dy / md) * force * 25;
        }

        n.x += (targetX - n.x) * 0.08;
        n.y += (targetY - n.y) * 0.08;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const dx = n.x - mouseRef.current.x;
        const dy = n.y - mouseRef.current.y;
        const md = Math.sqrt(dx * dx + dy * dy);
        const nearMouse = md < mouseInfluence;
        const size = nearMouse ? 2.5 : 1.2;
        const alpha = nearMouse ? 0.6 : 0.2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fill();

        if (nearMouse) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, size * 4, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, size * 4);
          grad.addColorStop(0, `rgba(${cr},${cg},${cb},0.2)`);
          grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = grad;
          ctx.fill();
        }
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
      style={{ opacity: 0.6 }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   ANIMATED ENTRY WRAPPER — IntersectionObserver driven
   ═══════════════════════════════════════════════════════ */
function AnimateIn({ children, animation = "floatUp", delay = 0, className = "" }: {
  children: React.ReactNode; animation?: string; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? undefined : 0,
        animation: visible ? `${animation} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s both` : "none",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN INTELLIGENCE ARSENAL SECTION
   ═══════════════════════════════════════════════════════ */
export default function IntelligenceArsenal({ certifications, achievements }: ArsenalProps) {
  
  const skillCategories = [
    {
      title: "Core Languages",
      skills: ["C++", "Python", "R", "SQL", "JavaScript", "HTML/CSS"]
    },
    {
      title: "Frameworks & ML",
      skills: ["PyTorch", "TensorFlow", "Keras", "FastAPI", "Flask", "Pandas", "NumPy", "Scikit-Learn", "Matplotlib", "Seaborn"]
    },
    {
      title: "Infrastructure & Tools",
      skills: ["MySQL", "Tableau", "Jupyter Notebook", "Docker", "Git/GitHub", "Apache Spark", "Power BI", "Google Colab"]
    },
    {
      title: "Analytical Core",
      skills: ["Project Management", "Problem Solving", "Data Wrangling", "Machine Learning pipelines", "Computer Vision"]
    }
  ];

  return (
    <section id="certifications" className="py-24 bg-transparent border-b border-glass-stroke relative z-10 transition-colors duration-500 overflow-hidden">
      {/* Neural Grid Background */}
      <NeuralGrid />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ─── HEADER ─── */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="glow-dot" />
            <span className="text-primary font-mono text-xs uppercase tracking-widest font-bold">Logical Keys</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tighter uppercase gradient-text-animated">
            Intelligence Arsenal.
          </h2>
          <p className="text-secondary font-sans text-lg max-w-2xl leading-relaxed">
            A comprehensive overview of programming competencies, verified academic certifications, and hackathon milestones.
          </p>
        </header>

        {/* ─── SKILLS ARSENAL ─── */}
        <div className="mb-20">
          <AnimateIn animation="floatUp" delay={0}>
            <h3 className="font-display font-black text-2xl text-on-surface uppercase tracking-wider mb-8 flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center border border-primary/30 bg-primary/5">
                <Cpu className="w-4 h-4 text-primary" />
              </div>
              Technical Arsenal
            </h3>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((cat, ci) => (
              <AnimateIn key={ci} animation="floatUp" delay={ci * 0.1}>
                <div className="glass-card corner-brackets scanlines p-8 flex flex-col justify-start h-full group hover:shadow-[0_0_40px_var(--glow-soft)]">
                  <h4 className="font-display font-black text-sm uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_6px_var(--glow-primary)] inline-block" />
                    {cat.title}
                  </h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, si) => (
                      <span
                        key={si}
                        className="font-mono text-xs bg-white/[0.03] hover:bg-primary/15 hover:border-primary/40 hover:text-white hover:shadow-[0_0_12px_var(--glow-soft)] border border-[var(--glass-border)] text-zinc-300 px-3 py-1.5 transition-all duration-300 font-bold cursor-default"
                        style={{
                          animation: `tagPop 0.4s ease ${(ci * 0.1) + (si * 0.04) + 0.3}s both`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>

        {/* ─── CREDENTIALS & ACHIEVEMENTS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-[var(--glass-border)]">
          
          {/* ─── VERIFIED CERTIFICATIONS ─── */}
          <div className="space-y-8">
            <AnimateIn animation="slideInLeft" delay={0}>
              <h3 className="font-display font-black text-2xl text-on-surface uppercase tracking-wider mb-6 flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center border border-primary/30 bg-primary/5">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                Verified Credentials
              </h3>
            </AnimateIn>

            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <AnimateIn key={cert.id} animation="slideInLeft" delay={0.1 + index * 0.08}>
                  <div className="glass-card holo-shimmer p-6 relative group transition-all duration-400 hover:shadow-[0_0_30px_var(--glow-soft)]">
                    {/* Left neon accent line */}
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-primary via-primary/30 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_4px_var(--glow-primary)]" />
                        <span className="text-primary font-mono text-[10px] tracking-widest uppercase font-bold">
                          {cert.date}
                        </span>
                      </div>
                      <h4 className="font-display font-black text-md text-on-surface uppercase group-hover:text-primary transition-colors duration-300">
                        {cert.title}
                      </h4>
                      <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1 font-bold">
                        Issuer: {cert.issuer}
                      </p>
                    </div>

                    {cert.proofLink && (
                      <div className="mt-4 pl-4 flex">
                        <a
                          href={sanitizeUrl(cert.proofLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-widest bg-white/[0.03] hover:bg-primary/20 hover:shadow-[0_0_12px_var(--glow-soft)] text-zinc-200 uppercase border border-[var(--glass-border)] hover:border-primary/40 transition-all duration-300 px-4 py-2 font-bold"
                        >
                          <ExternalLink className="w-3 h-3 text-primary" />
                          Verify Credential
                        </a>
                      </div>
                    )}

                    {/* Verified holographic stamp */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center" style={{ animation: "neonPulse 2s ease infinite" }}>
                        <Award className="w-4 h-4 text-primary/40" />
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>

          {/* ─── SCHOLASTIC MILESTONES ─── */}
          <div className="space-y-8">
            <AnimateIn animation="slideInRight" delay={0}>
              <h3 className="font-display font-black text-2xl text-on-surface uppercase tracking-wider mb-6 flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center border border-primary/30 bg-primary/5">
                  <Badge className="w-4 h-4 text-primary" />
                </div>
                Scholastic Milestones
              </h3>
            </AnimateIn>

            <div className="space-y-4">
              {achievements.map((ach, index) => (
                <AnimateIn key={ach.id || index} animation="slideInRight" delay={0.1 + index * 0.08}>
                  <div className="glass-card p-6 relative group transition-all duration-400 hover:shadow-[0_0_30px_var(--glow-soft)]">
                    {/* Trophy glow icon */}
                    <div className="absolute top-4 right-4 pointer-events-none transition-all duration-500 opacity-10 group-hover:opacity-40">
                      <div style={{ animation: "neonPulse 3s ease infinite" }}>
                        <Award className="w-10 h-10 text-primary" />
                      </div>
                    </div>

                    <h4 className="font-display font-black text-md text-on-surface uppercase mb-2 group-hover:text-primary transition-colors duration-300 pr-12">
                      {ach.title}
                    </h4>
                    <p className="text-secondary font-sans text-sm leading-relaxed">
                      {ach.details}
                    </p>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
