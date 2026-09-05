"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  FolderKanban,
  ImageIcon,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "admin@krvbuilders.com");
      }
    }
    checkUser();
  }, [pathname]);

  const isLoginPage = pathname === "/admin/login";

  const handleSignOut = async () => {
    document.cookie = "krv_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f4f1eb] text-slate-900 flex flex-col">
      {/* Top Navigation Shell */}
      <header className="bg-[#18211f] text-white border-b border-[#34413c] sticky top-0 z-40 shadow-lg shadow-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Brand Logo Header */}
            <Link href="/admin/projects" className="flex items-center gap-3 group">
              <div className="relative h-10 w-14 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1.5 border border-white/20 shadow-sm ring-2 ring-amber-300/15 group-hover:-translate-y-0.5 group-hover:shadow-md transition">
                <div className="absolute inset-1 rounded border border-amber-100 pointer-events-none" />
                <img src="/logo.png" alt="KRV Admin Logo" className="relative h-full w-full object-contain max-h-8" />
              </div>
              <div>
                <div className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                  <span>KRV Admin Portal</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-300/25">
                    Pro
                  </span>
                </div>
                <div className="text-xs text-[#aab7b0] font-medium">
                  Ramanagara Digital Control Panel
                </div>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <Link
                href="/admin/projects"
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  pathname.startsWith("/admin/projects")
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-[#c5cfca] hover:text-white hover:bg-white/10"
                }`}
              >
                <FolderKanban className="w-4 h-4 text-amber-600" />
                <span>Projects Manager</span>
              </Link>

              <Link
                href="/admin/gallery"
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  pathname.startsWith("/admin/gallery")
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-[#c5cfca] hover:text-white hover:bg-white/10"
                }`}
              >
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>Gallery Showcase</span>
              </Link>
            </nav>
          </div>

          {/* User Email & Sign Out */}
          <div className="flex items-center gap-4">
            {userEmail && (
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#dbe5df] bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>{userEmail}</span>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-[#dbe5df] hover:bg-rose-500/15 hover:text-rose-200 hover:border-rose-300/30 font-bold text-xs transition flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center border-t border-slate-200 px-4 py-2 bg-stone-50 gap-2">
          <Link
            href="/admin/projects"
            className={`flex-1 text-center py-2 rounded-lg text-xs font-bold ${
              pathname.startsWith("/admin/projects")
                ? "bg-amber-600 text-white"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            Projects
          </Link>
          <Link
            href="/admin/gallery"
            className={`flex-1 text-center py-2 rounded-lg text-xs font-bold ${
              pathname.startsWith("/admin/gallery")
                ? "bg-amber-600 text-white"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            Gallery Manager
          </Link>
        </div>
      </header>

      {/* Main Content View */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
