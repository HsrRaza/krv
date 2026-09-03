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
    <div className="min-h-screen bg-stone-50 text-slate-900 flex flex-col">
      {/* Top Navigation Shell */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Brand Logo Header */}
            <Link href="/admin/projects" className="flex items-center gap-3 group">
              <div className="h-10 w-auto flex items-center justify-center overflow-hidden rounded-xl bg-white p-1 border border-slate-200 shadow-sm group-hover:scale-105 transition">
                <img src="/logo.png" alt="KRV Admin Logo" className="h-full w-auto object-contain max-h-8" />
              </div>
              <div>
                <div className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>KRV Admin Portal</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Pro
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Ramanagara Digital Control Panel
                </div>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-slate-200">
              <Link
                href="/admin/projects"
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  pathname.startsWith("/admin/projects")
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FolderKanban className="w-4 h-4 text-amber-600" />
                <span>Projects Manager</span>
              </Link>

              <Link
                href="/admin/gallery"
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  pathname.startsWith("/admin/gallery")
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
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
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-700 bg-stone-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>{userEmail}</span>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-bold text-xs transition flex items-center gap-1.5"
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
