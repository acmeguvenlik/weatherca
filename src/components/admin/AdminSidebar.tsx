'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radar,
  AlertTriangle,
  Users,
  FileText,
  Layers,
  Globe,
  SlidersHorizontal,
  Settings as SettingsIcon,
  Terminal,
  ChevronRight,
  Lock,
  X,
  Radio,
  Activity,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { allUsers, broadcastAlert } = useAuth();

  const NAV_SECTIONS = [
    {
      title: 'Operations & Dispatch',
      links: [
        {
          href: '/admin',
          label: 'Tactical Overview',
          icon: LayoutDashboard,
          badge: 'LIVE',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        },
        {
          href: '/admin/alerts',
          label: 'Emergency Dispatch',
          icon: AlertTriangle,
          badge: broadcastAlert && broadcastAlert.active ? 'ACTIVE' : undefined,
          badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse',
        },
        {
          href: '/admin/stations',
          label: 'Radar Towers (31)',
          icon: Radar,
          badge: 'S-BAND',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        },
      ],
    },
    {
      title: 'Publishing & Architecture',
      links: [
        {
          href: '/admin/blog',
          label: 'Press & Bulletins',
          icon: FileText,
        },
        {
          href: '/admin/pages',
          label: 'CMS Route Matrix',
          icon: Layers,
        },
        {
          href: '/admin/sitemap',
          label: 'Sitemap Protocol',
          icon: Globe,
          badge: '5 SHARDS',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        },
        {
          href: '/admin/seo',
          label: 'SEO & Meta Engine',
          icon: SlidersHorizontal,
        },
      ],
    },
    {
      title: 'Monetization & Revenue',
      links: [
        {
          href: '/admin/ads',
          label: 'Ad Units & Monetization',
          icon: Megaphone,
          badge: 'CPM $3.85',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        },
      ],
    },
    {
      title: 'Governance & Security',
      links: [
        {
          href: '/admin/users',
          label: 'Personnel Registry',
          icon: Users,
          badge: String(allUsers.length),
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        },
        {
          href: '/admin/settings',
          label: 'Global Configuration',
          icon: SettingsIcon,
        },
        {
          href: '/admin/logs',
          label: 'Security & Audit Logs',
          icon: Terminal,
          badge: '256-BIT',
          badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-50 md:z-auto w-64 bg-slate-950/95 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between shrink-0 select-none transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header on mobile drawer */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍁</span>
            <span className="text-sm font-black text-white">OPS HQ MENU</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Stack */}
        <div className="p-4 space-y-6 overflow-y-auto scrollbar-thin">
          {NAV_SECTIONS.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400 px-3 py-1">
                {sec.title}
              </div>
              <nav className="space-y-1">
                {sec.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                          }`}
                        />
                        <span>{link.label}</span>
                      </div>

                      {link.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border font-extrabold ${link.badgeColor}`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Security Clearance Block */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-slate-950 border border-purple-500/20 space-y-2 shadow-inner">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
              <Lock className="w-3 h-3" />
              <span>Clearance Level Alpha</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All commands and emergency broadcasts are logged to the federal audit trail.
            </p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-slate-950/80">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>KERNEL: v2026.4.1</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              ONLINE
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors group cursor-pointer"
          >
            <span>Exit HQ to Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </aside>
    </>
  );
};

