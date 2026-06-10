import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Check } from "lucide-react";
import { ContactMessage, ProfileDetails } from "../types";

interface ContactProps {
  profile: ProfileDetails;
  onSendMessage: (msg: Omit<ContactMessage, "id" | "createdAt" | "isRead">) => void;
}

export default function Contact({ profile, onSendMessage }: ContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsLoading(true);

    setTimeout(() => {
      onSendMessage({
        name,
        email,
        message
      });
      setIsSubmitted(true);
      setIsLoading(false);

      // Reset form variables
      setName("");
      setEmail("");
      setMessage("");

      // Fade out success notification after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 700);

  };

  return (
    <section id="contact" className="py-24 bg-transparent relative z-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        <header className="mb-16">
          <span className="text-primary font-mono text-xs uppercase tracking-widest mb-3 block font-bold">Secured Connection</span>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-on-surface mb-4 tracking-tighter uppercase">
            Let's Collaborate.
          </h2>
          <p className="text-secondary font-body-lg text-lg max-w-2xl leading-relaxed">
            Submit your queries or project invites directly into the CMS. Responses will be delivered within 24 operational hours.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* SECURED CHANNELS PANEL */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/50 dark:bg-[#0A0A0A]/50 border border-glass-stroke p-8 md:p-10 rounded-none backdrop-blur-sm">
              <h3 className="font-display font-black text-xl text-on-surface mb-6 uppercase tracking-wider">
                Direct Channels
              </h3>

              <div className="space-y-6">
                <a 
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-4 text-secondary hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 border border-glass-stroke flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Email Secure Link</span>
                    <strong className="text-sm text-on-surface font-mono font-bold block select-all">{profile.email}</strong>
                  </div>
                </a>

                <a 
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-4 text-secondary hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 border border-glass-stroke flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Mobile Link</span>
                    <strong className="text-sm text-on-surface font-mono font-bold block select-all">{profile.phone}</strong>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-zinc-650 dark:text-zinc-400">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 border border-glass-stroke flex items-center justify-center text-primary">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Operations Hub</span>
                    <span className="text-sm text-on-surface font-sans font-medium block">{profile.location}</span>
                  </div>
                </div>
              </div>

              {/* SOCIAL CHANNELS */}
              <div className="mt-8 pt-8 border-t border-glass-stroke">
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold">Remote Keyrings</h4>
                <div className="flex gap-3">
                  {profile.github && (
                    <a 
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-glass-stroke bg-zinc-100 dark:bg-zinc-900 hover:border-primary text-secondary hover:text-primary transition-all rounded-none"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a 
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-glass-stroke bg-zinc-100 dark:bg-zinc-900 hover:border-primary text-secondary hover:text-primary transition-all rounded-none"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECURED FORM PANEL */}
          <div className="lg:col-span-3">
            <div className="bg-white/50 dark:bg-[#0A0A0A]/50 border border-glass-stroke p-8 md:p-10 rounded-none backdrop-blur-sm relative overflow-hidden">
              <h3 className="font-display font-black text-xl text-on-surface mb-6 uppercase tracking-wider">
                Direct Transmission
              </h3>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500 text-green-600 dark:text-green-400 rounded-none font-mono text-xs flex items-center gap-3 animate-fade-in font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  Sync success. Your query has been delivered directly into Prashant's CMS inbox!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-zinc-550 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-widest mb-2 font-bold" htmlFor="name">
                    Name Ident
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Foster"
                    className="w-full bg-white dark:bg-[#111] border border-glass-stroke focus:border-primary focus:ring-0 text-on-surface font-sans py-3 px-4 outline-none transition-all rounded-none placeholder-zinc-300 dark:placeholder-zinc-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-zinc-550 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-widest mb-2" htmlFor="email">
                    Relay Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. liam@workspace.co"
                    className="w-full bg-white dark:bg-[#111] border border-glass-stroke focus:border-primary focus:ring-0 text-on-surface font-sans py-3 px-4 outline-none transition-all rounded-none placeholder-zinc-300 dark:placeholder-zinc-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-zinc-550 dark:text-zinc-450 font-mono text-[10px] uppercase tracking-widest mb-2" htmlFor="msg">
                    Transmission Content
                  </label>
                  <textarea
                    id="msg"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Project briefs, specifications, or contact proposals..."
                    className="w-full bg-white dark:bg-[#111] border border-glass-stroke focus:border-primary focus:ring-0 text-on-surface font-sans py-3 px-4 outline-none transition-all rounded-none placeholder-zinc-300 dark:placeholder-zinc-800 text-sm font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center gap-2 font-bold select-none active:scale-95"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Dispatch Connection
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
