import { Certification, AchievementItem } from "../types";
import { Cpu, Award, Badge, ExternalLink } from "lucide-react";

interface ArsenalProps {
  certifications: Certification[];
  achievements: AchievementItem[];
}

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
    <section id="certifications" className="py-24 bg-transparent border-b border-glass-stroke relative z-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <header className="mb-16">
          <span className="text-primary font-mono text-xs uppercase tracking-widest mb-3 block font-bold">Logical Keys</span>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-on-surface mb-4 tracking-tighter uppercase">
            Intelligence Arsenal.
          </h2>
          <p className="text-secondary font-body-lg text-lg max-w-2xl leading-relaxed">
            A comprehensive overview of programming competencies, verified academic certifications, and hackathon milestones.
          </p>
        </header>

        {/* SKILLS ARSENAL CLASSIFICATION */}
        <div className="mb-20">
          <h3 className="font-display font-black text-2xl text-on-surface uppercase tracking-wider mb-8 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-primary" />
            Technical Arsenal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((cat, ci) => (
              <div key={ci} className="bg-white dark:bg-[#0A0A0A] border border-glass-stroke p-8 flex flex-col justify-start relative select-none">
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-primary" />
                <div className="absolute top-0 left-0 w-[1px] h-8 bg-primary" />
                
                <h4 className="font-display font-black text-sm uppercase tracking-widest text-primary mb-6">
                  {cat.title}
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, si) => (
                    <span 
                      key={si}
                      className="font-mono text-xs bg-zinc-100 dark:bg-[#111] hover:bg-primary/10 hover:border-primary/30 border border-glass-stroke text-zinc-850 dark:text-zinc-300 px-3 py-1.5 transition-all text-left font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOUBLE COLUMN: CREDENTIALS & ACHIEVEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-glass-stroke">
          
          {/* VERIFIED ACADEMIC CERTIFICATIONS */}
          <div className="space-y-8">
            <h3 className="font-display font-black text-2xl text-on-surface uppercase tracking-wider mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" />
              Verified Credentials
            </h3>

            <div className="space-y-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-white/50 dark:bg-[#060606]/30 border border-glass-stroke hover:border-primary transition-all p-6 relative group flex flex-col justify-between">
                  <div>
                    <span className="text-primary font-mono text-[10px] tracking-widest uppercase font-bold block mb-1">
                      {cert.date}
                    </span>
                    <h4 className="font-display font-black text-md text-on-surface uppercase">
                      {cert.title}
                    </h4>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1 font-bold">
                      Issuer: {cert.issuer}
                    </p>
                  </div>
                  {cert.proofLink && (
                    <div className="mt-4 flex">
                      <a 
                        href={cert.proofLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-widest bg-zinc-900 hover:bg-primary dark:bg-black hover:text-white text-zinc-100 uppercase border border-glass-stroke transition-all px-3 py-1.5 font-bold rounded-none"
                      >
                        <ExternalLink className="w-3 h-3 text-primary-container group-hover:text-white" />
                        Verify Credential
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HACKATHONS & SCHOLASTIC MILESTONES */}
          <div className="space-y-8">
            <h3 className="font-display font-black text-2xl text-on-surface uppercase tracking-wider mb-6 flex items-center gap-3">
              <Badge className="w-6 h-6 text-primary" />
              Scholastic Milestones
            </h3>

            <div className="space-y-6">
              {achievements.map((ach, index) => (
                <div key={ach.id || index} className="bg-white/50 dark:bg-[#060606]/30 border border-glass-stroke hover:border-primary transition-all p-6 relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 pointer-events-none">
                    <Award className="w-12 h-12 text-primary" />
                  </div>
                  <h4 className="font-display font-black text-md text-on-surface uppercase mb-2">
                    {ach.title}
                  </h4>
                  <p className="text-secondary font-sans text-sm leading-relaxed">
                    {ach.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
