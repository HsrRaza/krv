"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loadingSession, setLoadingSession] = useState(true);
  const [isRecoverySession, setIsRecoverySession] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // Listen for recovery session or Auth state change
  useEffect(() => {
    let mounted = true;

    async function checkAuthSession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (mounted) {
          if (data?.session) {
            setIsRecoverySession(true);
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (mounted) {
          setLoadingSession(false);
        }
      }
    }

    // Subscribe to auth state changes (e.g. PASSWORD_RECOVERY event)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        if (event === "PASSWORD_RECOVERY" || session) {
          setIsRecoverySession(true);
        }
        setLoadingSession(false);
      }
    });

    checkAuthSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Compute password strength hint
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "" };
    if (pass.length < 8) return { score: 1, label: "Too Short", color: "text-rose-600 bg-rose-50" };

    let score = 1;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 2, label: "Medium", color: "text-amber-700 bg-amber-50" };
    return { score: 3, label: "Strong", color: "text-emerald-700 bg-emerald-50" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify both fields.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw new Error(
          error.message || "Failed to update password. Please try again."
        );
      }

      setSuccessMsg(
        "Your password has been reset successfully! Signing you out and redirecting to login..."
      );

      // Sign user out to ensure clean login with new credentials
      await supabase.auth.signOut();

      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to update password. Please request a new reset link."
      );
    } finally {
      setSubmitting(false);
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
            Create New Password
          </h1>
          <p className="font-sans font-medium text-xs text-slate-600">
            Set your new secure password for KRV Builders Admin Portal
          </p>
        </div>

        {/* Card Container */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 font-sans">
          {/* Loading Session State */}
          {loadingSession ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              <span className="text-xs font-semibold">
                Verifying recovery security link...
              </span>
            </div>
          ) : !isRecoverySession ? (
            /* Invalid or Expired Session State */
            <div className="space-y-5 text-center py-2 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Invalid or Expired Reset Link
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  The password recovery session is invalid or has expired. Please request a new password reset link.
                </p>
              </div>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md shadow-amber-600/20"
              >
                <span>Request New Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Form view */
            <>
              {errorMsg && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-3 animate-in fade-in"
                >
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold">Password Reset Error</div>
                    <div className="font-medium mt-0.5">{errorMsg}</div>
                  </div>
                </div>
              )}

              {successMsg && (
                <div
                  role="status"
                  aria-live="polite"
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-start gap-3 animate-in fade-in"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-emerald-950">
                      Success!
                    </div>
                    <div className="font-medium mt-0.5 leading-relaxed">
                      {successMsg}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="new-password"
                      className="block text-xs font-medium uppercase tracking-wider text-slate-700"
                    >
                      New Password *
                    </label>
                    {strength.label && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${strength.color}`}
                      >
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Match Status */}
                {password && confirmPassword && (
                  <div className="text-[11px] font-semibold flex items-center gap-1.5">
                    {password === confirmPassword ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Passwords do not match
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !!successMsg}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm tracking-wide shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center">
                <Link
                  href="/admin/login"
                  className="text-xs text-slate-600 hover:text-amber-600 font-semibold transition"
                >
                  Back to Admin Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
