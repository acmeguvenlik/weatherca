'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { useMounted } from '@/lib/useMounted';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const mounted = useMounted();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not mounted yet, render identical dark loading shell to guarantee 0 hydration mismatch
  if (!mounted) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans select-none antialiased">
        <div className="h-16 w-full bg-slate-950 border-b border-white/10 px-6 flex items-center justify-between" />
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-slate-950 border-r border-white/10 hidden md:block" />
          <main className="flex-1 p-8 space-y-8 bg-slate-950/60" />
        </div>
        <div className="h-9 w-full bg-slate-950 border-t border-white/10" />
      </div>
    );
  }

  // If not logged in or not admin/editor, render permission barrier
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-2xl shadow-2xl text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-rose-500/10">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Operations HQ Clearance Required</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access to the WeatherCA National Meteorological Command Center is restricted to verified officers and system administrators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              Sign In with Credentials
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans select-none antialiased">
      {/* 1. Dedicated Command Top Bar */}
      <AdminHeader onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)} />

      {/* 2. Middle Body: Fixed Sidebar + Scrollable Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        <AdminSidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 scrollbar-thin">
          <div className="max-w-7xl mx-auto w-full space-y-8">{children}</div>
        </main>
      </div>

      {/* 3. Dedicated Telemetry Bottom Bar */}
      <AdminFooter />
    </div>
  );
}


