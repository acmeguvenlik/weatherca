'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  ExternalLink,
  LogOut,
  Menu,
  Sun,
  Moon,
  Shield,
  Radio,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface AdminHeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout, broadcastAlert } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [utcTime, setUtcTime] = useState<string>('');
  const [estTime, setEstTime] = useState<string>('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setUtcTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + 'Z'
      );
      setEstTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/Toronto',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' EST'
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4 z-40 shrink-0 select-none shadow-lg shadow-black/40">
      {/* Brand & Command Identity */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 via-purple-700 to-indigo-800 flex items-center justify-center text-xl shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
            🍁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">
                WEATHER<span className="text-purple-400">CA</span>
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold tracking-wider">
                OPS HQ
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wide -mt-0.5 hidden xs:block">
              Canadian Meteorological Operations & Command
            </div>
          </div>
        </Link>
      </div>

      {/* Center: Mission Dual Clocks & National Threat Matrix Indicator */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Mission Time Clocks */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-300 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-white font-bold">{utcTime || '00:00:00Z'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-300 font-semibold">{estTime || '00:00:00 EST'}</span>
        </div>

        {/* National Threat Defcon Badge */}
        <Link
          href="/admin/alerts"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
            broadcastAlert && broadcastAlert.active
              ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
              : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              broadcastAlert && broadcastAlert.active ? 'bg-red-400 animate-ping' : 'bg-emerald-400'
            }`}
          />
          <span className="text-slate-400 uppercase font-bold text-[10px]">THREAT LEVEL:</span>
          <span className="font-black">
            {broadcastAlert && broadcastAlert.active
              ? 'ELEVATED (ALERT ACTIVE)'
              : 'DEFCON 4 (NORMAL WATCH)'}
          </span>
        </Link>
      </div>

      {/* Right: Actions, Theme Switcher & Operator Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>

        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>Live Public Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* Operator Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 pl-2 sm:pl-3 border-l border-white/10">
          <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-base shadow-sm">
            {user?.avatar || '🍁'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-extrabold text-white truncate max-w-[130px]">
              {user?.name || 'Duty Commander'}
            </div>
            <div className="text-[10px] text-purple-400 font-mono uppercase font-bold tracking-wider">
              {user?.role || 'operator'} • VERIFIED
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
            title="Secure Logout from HQ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

