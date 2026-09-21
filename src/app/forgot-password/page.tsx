"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const supabase = createClient();

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    if (cooldown > 0) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const redirectToUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: redirectToUrl,
        }
      );

      if (error) {
        // Handle specific rate limits or API connection errors
        const isRateLimit =
          error.status === 429 ||
          error.message.toLowerCase().includes("rate limit") ||
          error.message.toLowerCase().includes("over_email_send_rate_limit");

        if (isRateLimit) {
          setErrorMsg(
            "Email send rate limit exceeded. Please wait a few minutes before trying again."
          );
          setLoading(false);
          return;
        }
      }

      // To prevent account enumeration attacks, show a generic success message
      setSuccessMsg(
        "If an account exists for this email, a password reset link has been sent. Please check your inbox and spam folder."
      );
      setCooldown(60);
    } catch (err: unknown) {
      console.error("Password reset error:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to request password reset."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 flex items-center justify-center p-4">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-3 font-sans">
          <div className="relative h-20 w-24 inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2.5 border border-slate-200 shadow-xl shadow-slate-200/50 ring-8 ring-white/70 mx-auto">
            <div className="absolute inset-2 rounded-xl border border-amber-100 pointer-events-none" />
            <img
              src="/logo.png"
              alt="KRV Builders Logo"
              className="relative h-full w-full object-contain max-h-14"
            />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            Reset Admin Password
          </h1>
          <p className="font-sans font-medium text-xs text-slate-600">
            Enter your email address to receive a secure recovery link
          </p>
        </div>

        {/* Card Container */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 font-sans">
          {/* Error Banner */}
          {errorMsg && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-3 animate-in fade-in"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold">Reset Request Error</div>
                <div className="font-medium mt-0.5">{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div
              role="status"
              aria-live="polite"
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-start gap-3 animate-in fade-in"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-emerald-950">
                  Reset Link Dispatched
                </div>
                <div className="font-medium mt-0.5 leading-relaxed">
                  {successMsg}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Registered Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="forgot-email"
                  type="email"
                  required
                  placeholder="admin@krvbuilders.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm tracking-wide shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Send className="w-4 h-4 text-amber-200" />
                  <span>Resend link in {cooldown}s</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Login Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-amber-600 transition font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Login</span>
            </Link>

            <span className="text-[11px] text-slate-500">
              KRV Builders © 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
