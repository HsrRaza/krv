"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "" };
    if (pass.length < 8)
      return { score: 1, label: "Too Short (Min 8 chars)", color: "text-rose-600 bg-rose-50" };

    let score = 1;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2)
      return { score: 2, label: "Medium Strength", color: "text-amber-700 bg-amber-50" };
    return { score: 3, label: "Strong Password", color: "text-emerald-700 bg-emerald-50" };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      setErrorMsg("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg("New password must be different from your current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Get current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        setErrorMsg("Session expired. Please log in again.");
        setTimeout(() => router.push("/admin/login"), 1500);
        return;
      }

      // 2. Re-authenticate current password before updating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        setErrorMsg("Current password is incorrect. Verification failed.");
        setSubmitting(false);
        return;
      }

      // 3. Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw new Error(
          updateError.message || "Failed to update password. Please try again."
        );
      }

      // 4. Invalidate other sessions (if supported)
      try {
        await supabase.auth.signOut({ scope: "others" });
      } catch {
        // Scope others signout is optional depending on session settings
      }

      setSuccessMsg(
        "Password changed successfully! Other active sessions have been invalidated."
      );

      // 5. Clear sensitive password fields from React state immediately
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error("Change password error:", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while updating your password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-[#18211f] text-white p-6 sm:p-8 rounded-2xl border border-[#34413c] shadow-lg">
        <div className="absolute inset-0 opacity-[0.1] bg-[linear-gradient(#d9b56d_1px,transparent_1px),linear-gradient(90deg,#d9b56d_1px,transparent_1px)] bg-size-[48px_48px]" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300 uppercase tracking-architectural">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Control Panel Security</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security & Change Password
          </h1>

          <p className="text-xs sm:text-sm text-[#c5cfca] max-w-2xl font-normal">
            Update your admin login password and manage credential security for KRV Builders.
          </p>
        </div>
      </div>

      {/* Change Password Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Change Account Password
            </h2>
            <p className="text-xs text-slate-500">
              Your password must be at least 8 characters long and differ from your current password.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            role="alert"
            aria-live="polite"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-3 animate-in fade-in"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold">Security Warning</div>
              <div className="font-medium mt-0.5">{errorMsg}</div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-start gap-3 animate-in fade-in"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-emerald-950">
                Password Updated Successfully
              </div>
              <div className="font-medium mt-0.5 leading-relaxed">
                {successMsg}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          {/* Current Password */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Current Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none cursor-pointer"
                aria-label={
                  showCurrentPassword ? "Hide current password" : "Show current password"
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="new-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
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
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none cursor-pointer"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Confirm New Password *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="confirm-new-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none cursor-pointer"
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

            {newPassword && confirmPassword && (
              <div className="mt-2 text-xs font-semibold flex items-center gap-1.5">
                {newPassword === confirmPassword ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    New passwords match
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    New passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying & Updating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
