import React, { useState } from "react";
import { Lock, Eye, EyeOff, User, ArrowLeft } from "lucide-react";

interface AdminLoginProps {
  onSuccess: (token: string, email: string) => void;
  onCancel: () => void;
}

export default function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailInput, password }),
      });

      // Safely parse JSON — if Vercel returns an HTML error page, don't crash
      let data: any = {};
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response from API:", text.slice(0, 200));
        throw new Error("API server is unavailable. Please check Vercel environment variables (MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD).");
      }

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Correct parameters required.");
      }

      // Pass JWT Token and email back to root app
      onSuccess(data.token, data.email);
    } catch (err: any) {
      setError(err.message || "Network error. Failed to communicate with login authority.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 relative">
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-container/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Cancel button */}
      <button 
        onClick={onCancel}
        className="absolute top-8 left-8 text-secondary hover:text-white flex items-center gap-2 font-label-md text-sm transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Return to Portfolio
      </button>

      <div className="w-full max-w-md bg-surface border border-glass-stroke p-8 md:p-10 rounded-none shadow-2xl relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-container/20 text-primary-container border border-primary-container/30 mb-4 rounded-none">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase">CMS Gate</h2>
          <p className="text-secondary font-label-md text-xs mt-2 uppercase tracking-widest opacity-60">Authorize Platform Control</p>
        </div>

        {error && (
          <div className="bg-error-container/20 border border-error-container text-red-400 p-4 mb-6 rounded-none font-code-sm text-xs break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-secondary font-label-md text-xs uppercase tracking-widest mb-2" htmlFor="emailInput">
              Admin Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-60">
                <User className="w-4 h-4" />
              </span>
              <input
                id="emailInput"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="prashantpatil4524@gmail.com"
                className="w-full bg-surface-container-lowest border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-3 pl-12 pr-4 outline-none transition-all rounded-none placeholder-secondary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-secondary font-label-md text-xs uppercase tracking-widest mb-2" htmlFor="password">
              Security Token / Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-60">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-glass-stroke focus:border-primary-container focus:ring-0 text-white font-body-md py-3 pl-12 pr-12 outline-none transition-all rounded-none placeholder-secondary/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary-container hover:bg-racing-red-hover text-white font-label-md text-xs tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Validate Authorization"
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-glass-stroke pt-6 text-center">
          <p className="text-[10px] text-secondary opacity-60 uppercase tracking-widest font-mono">
            🛡️ DATABASE SECURED ADMIN ACCESS
          </p>
          <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed max-w-xs mx-auto">
            Authorized session uses hashed salt credentials loaded from Atlas MongoDB configuration.
          </p>
        </div>
      </div>
    </div>
  );
}
