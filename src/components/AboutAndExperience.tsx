import { ProfileDetails, EducationItem, ExperienceItem } from "../types";
import { GraduationCap, Briefcase } from "lucide-react";
import { getDirectImageUrl } from "../utils";

interface AboutProps {
  profile: ProfileDetails;
  educations: EducationItem[];
  experiences: ExperienceItem[];
}

export default function AboutAndExperience({ profile, educations, experiences }: AboutProps) {
  return (
    <section id="about" className="py-24 bg-transparent border-b border-glass-stroke relative z-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <header className="mb-16">
          <span className="text-primary font-mono text-xs uppercase tracking-widest mb-3 block font-bold">Engineering Narrative</span>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-on-surface mb-4 tracking-tighter uppercase">
            Architectural Bio.
          </h2>
          <p className="text-secondary font-body-lg text-lg max-w-2xl leading-relaxed">
            Academics, internship reports, and technical milestones framing my engineering journey.
          </p>
        </header>

        {/* PROFILE STORY BIOGRAPHY */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20 items-stretch">
          
          <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
            <h3 className="font-display font-black text-2xl text-primary uppercase tracking-wider">
              My Core Story
            </h3>
            <p className="text-secondary font-sans text-md sm:text-lg leading-relaxed">
              {profile.longBio}
            </p>
            <div className="border-l-4 border-primary pl-6 py-2 bg-zinc-100/50 dark:bg-zinc-900/10">
              <p className="text-secondary italic font-sans text-sm md:text-md">
                "Driven by systematic precision and creative solutions. Whether it's training Deep Learning models or optimizing web rendering, my priority is high-performance reliability."
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 relative bg-white dark:bg-[#0A0A0A] border border-glass-stroke p-8 flex flex-col justify-center items-center overflow-hidden min-h-[300px]">
            <div className="absolute inset-x-0 -top-12 h-24 bg-gradient-to-b from-primary/10 to-transparent blur-xl pointer-events-none" />
            
            {/* Real high contrast professional avatar overlay */}
            <div className="w-36 h-36 border border-glass-stroke overflow-hidden mb-4 max-w-xs relative rounded-none shadow-md">
              <img 
                src={getDirectImageUrl(profile.avatar) || "https://lh3.googleusercontent.com/aida-public/AB6AXuDVZ0xcBJsgUoB2TpB2yVaJ8rzAUSgcj9ugD0sE_-nohH7TZKntf5JrKzClYsvWBH93RfnIJP5RAmrAnOy8qjiWO6EzUZo998ylK8qgPNaWD9RxR3hzIOsZ8F8Jt19eNKeMnsmDVBByTMraOcn_3lVQiEz6eToXl2h6KC7A28bvn3xqWgACr9kK94i6yGK8wQPzlkpMGsS_cDijqt32QlI7A7DwPCsargxxvHg9moJks6uemeReIbZlAa6rJiFBydjfz05mDRy1WBB8"} 
                alt="Prashant Portrait" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale hover:grayscale-0 duration-500 hover:scale-[1.05] transition-all"
              />
            </div>
            
            <h4 className="font-display font-black text-lg text-on-surface uppercase tracking-wider">{profile.name}</h4>
            <p className="text-primary font-mono text-[11px] font-black tracking-widest uppercase mt-1">LPU MCA Scholar</p>
            <p className="text-zinc-500 font-mono text-[10px] mt-2 select-all font-bold">SHA-256 Key validated</p>
          </div>

        </div>

        {/* CHRONOLOGY: TIMELINE GRID FOR EXPERIENCE & EDUCATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* PROFESSIONAL TIMELINE */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-glass-stroke pb-4 mb-6">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="font-display font-black text-xl text-on-surface uppercase tracking-wider">
                Experience Index
              </h3>
            </div>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={exp.id || index} className="relative pl-6 border-l border-primary">
                  <div className="absolute w-3 h-3 bg-primary left-[-6px] top-1.5" />
                  <span className="text-primary font-mono text-[10px] uppercase tracking-widest font-black block mb-1">
                    {exp.period}
                  </span>
                  <h4 className="font-display font-black text-lg text-on-surface uppercase tracking-normal">
                    {exp.role}
                  </h4>
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider mb-4 font-bold">
                    {exp.company}
                  </p>
                  <ul className="space-y-3.5 list-none pr-4">
                    {exp.bullets.map((bullet, bi) => (
                      <li key={bi} className="text-secondary font-sans text-sm leading-relaxed relative pl-4">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ACADEMICS TIMELINE */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-glass-stroke pb-4 mb-6">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h3 className="font-display font-black text-xl text-on-surface uppercase tracking-wider">
                Academics Registry
              </h3>
            </div>

            <div className="space-y-8">
              {educations.map((edu) => (
                <div key={edu.id} className="relative pl-6 border-l border-glass-stroke hover:border-primary transition-colors">
                  <div className="absolute w-3 h-3 bg-zinc-450 dark:bg-zinc-800 border border-glass-stroke left-[-6.5px] top-1.5" />
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest block mb-1">
                    {edu.date}
                  </span>
                  <h4 className="font-display font-black text-md text-on-surface uppercase tracking-normal">
                    {edu.degree}
                  </h4>
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider mb-2 font-bold">
                    {edu.institution}
                  </p>
                  <span className="inline-block bg-primary/10 text-primary border border-primary/25 font-mono text-[11px] px-2.5 py-1 font-bold">
                    {edu.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
