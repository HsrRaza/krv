"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Building2, Lock, Mail, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.session) {
      router.push("/admin/projects");
      router.refresh();
      return;
    }

    // Fallback/direct verification for designated admin credentials
    if (
      email.trim().toLowerCase() === "krvbuildersndevelopers@gmail.com" &&
      password === "Krv@123"
    ) {
      document.cookie = "krv_admin_session=true; path=/; max-age=86400";
      router.push("/admin/projects");
      router.refresh();
      return;
    }

    setErrorMsg(error?.message || "Invalid login credentials.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 flex items-center justify-center p-4">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-3 font-sans">
          <div className="h-16 w-auto inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2 border border-slate-200 shadow-xl shadow-slate-200/50 mx-auto">
            <img src="/logo.png" alt="KRV Builders Logo" className="h-full w-auto object-contain max-h-12" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            KRV Builders & Developers — Admin Portal
          </h1>
          <p className="font-sans font-medium text-xs text-slate-600">
            Authenticated Site Management & Infrastructure Suite
          </p>
        </div>

        {/* Card Container */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 font-sans">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold">Authentication Error</div>
                <div className="font-medium mt-0.5">{errorMsg}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@krvbuilders.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm tracking-wide shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
            Authorized Personnel Only • KRV Builders & Developers © 2026
          </div>
        </div>
      </div>
    </div>
  );
}
