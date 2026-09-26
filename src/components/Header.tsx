'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Radio,
  Compass,
  ShieldAlert,
  Sparkles,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { SearchModal } from './SearchModal';
import { useUnit } from '@/context/UnitContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useAIChat } from '@/context/AIChatContext';
import { useMounted } from '@/lib/useMounted';

export const Header: React.FC = () => {
  const mounted = useMounted();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { language, toggleLanguage, t } = useLanguage();
  const { unit, toggleUnit } = useUnit();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openChat } = useAIChat();

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200 shadow-sm">
        {/* =========================================================================
            TOPBAR: Compact Info & Utility Ribbon (Height ~34px)
           ========================================================================= */}
        <div className="w-full bg-slate-100/90 dark:bg-slate-900/80 border-b border-slate-200/70 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Major Canadian Hubs Quick Links (Horizontally scrollable on mobile) */}
            <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[11px] sm:text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] shrink-0">
                Major Hubs:
              </span>
              <div className="flex items-center gap-2.5 shrink-0 font-medium">
                <Link
                  href="/ontario/toronto"
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Toronto
                </Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link
                  href="/quebec/montreal"
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Montréal
                </Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link
                  href="/british-columbia/vancouver"
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Vancouver
                </Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <Link
                  href="/alberta/calgary"
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Calgary
                </Link>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                <Link
                  href="/alberta/edmonton"
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors hidden sm:inline"
                >
                  Edmonton
                </Link>
                <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
                <Link
                  href="/ontario/ottawa"
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors hidden md:inline"
                >
                  Ottawa
                </Link>
                <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">•</span>
                <Link
                  href="/nova-scotia/halifax"
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors hidden lg:inline"
                >
                  Halifax
                </Link>
                <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">•</span>
                <Link
                  href="/manitoba/winnipeg"
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors hidden lg:inline"
                >
                  Winnipeg
                </Link>
              </div>
            </div>

            {/* Right: Telemetry & Global Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-xs">
              {/* Telemetry Status Indicator */}
              <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>ECCC HRDPS 2.5km Live</span>
              </div>

              <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>

              {/* Temperature Unit Switcher (°C / °F) */}
              <button
                onClick={toggleUnit}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors"
                title="Toggle Celsius / Fahrenheit"
              >
                <span className={unit === 'C' ? 'text-sky-600 dark:text-sky-400 font-black' : 'opacity-40'}>
                  °C
                </span>
                <span className="opacity-30">/</span>
                <span className={unit === 'F' ? 'text-sky-600 dark:text-sky-400 font-black' : 'opacity-40'}>
                  °F
                </span>
              </button>

              {/* Language Switcher (EN / FR) */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors"
                title="Toggle English / Français"
              >
                <Globe className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span>{language}</span>
              </button>

              {/* Dark / Light Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1 rounded-lg bg-slate-200/70 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark or Light Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-600 hover:-rotate-12 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            NAVBAR: Main Navigation & Primary Controls (Spacious & Clear)
           ========================================================================= */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-3">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-4 lg:gap-8 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600 flex items-center justify-center text-base sm:text-lg shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
                🍁
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                    Weather<span className="text-sky-600 dark:text-sky-400">CA</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                    2026
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide hidden sm:block -mt-1">
                  National Meteorological Network
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-[15px] font-bold text-slate-700 dark:text-slate-200">
              <Link
                href="/"
                className="px-3 py-2 rounded-xl hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {t('nav_canada')}
              </Link>
              <Link
                href="/provinces"
                className="px-3 py-2 rounded-xl hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {t('nav_provinces')}
              </Link>
              <Link
                href="/radar"
                className="px-3 py-2 rounded-xl hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <Radio className="w-4 h-4 text-sky-500 animate-pulse" />
                <span>{t('nav_radar')}</span>
              </Link>
              <Link
                href="/ski"
                className="px-3 py-2 rounded-xl hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <span className="text-sm">⛷️</span>
                <span>{t('nav_ski')}</span>
              </Link>
              <Link
                href="/blog"
                className="px-3 py-2 rounded-xl hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/alerts"
                className="px-3 py-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5 font-bold"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>{t('nav_alerts')}</span>
              </Link>

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  onBlur={() => setTimeout(() => setIsToolsOpen(false), 200)}
                  className="px-3 py-2 rounded-xl hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4 text-sky-500" />
                  <span>{t('nav_tools')}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {isToolsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                    <Link
                      href="/tools/wildfire-smoke"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      🔥 Wildfire &amp; Smoke Tracker
                    </Link>
                    <Link
                      href="/tools/solunar"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    >
                      🎣 Solunar &amp; Fishing Forecast
                    </Link>
                    <Link
                      href="/tools/aviation"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                    >
                      ✈️ Aviation METAR / TAF
                    </Link>
                    <Link
                      href="/tools/agriculture"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                    >
                      🌾 Agriculture &amp; GDD Index
                    </Link>
                    <Link
                      href="/tools/travel-briefing"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      🖨️ Travel Briefing PDF Studio
                    </Link>
                    <Link
                      href="/tools/marine-tides"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                    >
                      🌊 Marine &amp; Coastal Tides
                    </Link>
                    <Link
                      href="/tools/route-planner"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                    >
                      🚗 Route Weather Planner
                    </Link>
                    <Link
                      href="/tools/weather-lab"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                    >
                      ⚡ Atmospheric Simulator Lab
                    </Link>
                    <Link
                      href="/tools/offline-hub"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    >
                      🌲 National Parks Offline Hub
                    </Link>
                    <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />
                    <Link
                      href="/tools/calculator"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-sky-600 dark:hover:text-white transition-colors"
                    >
                      🧮 {t('nav_calculator')}
                    </Link>
                    <Link
                      href="/tools/compare"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-sky-600 dark:hover:text-white transition-colors"
                    >
                      ⚖️ {t('nav_compare')}
                    </Link>
                    <Link
                      href="/tools/aurora"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-sky-600 dark:hover:text-white transition-colors"
                    >
                      🌌 {t('nav_aurora')}
                    </Link>
                    <Link
                      href="/highways"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-sky-600 dark:hover:text-white transition-colors"
                    >
                      🛣️ Mountain Passes &amp; Cams
                    </Link>
                    <Link
                      href="/tools/widget"
                      className="block px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-sky-600 dark:hover:text-white transition-colors"
                    >
                      🧩 Weather Widget Studio
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Section: Prominent Search, AI Copilot & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger (Responsive width on all devices) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-between gap-2.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-xs w-auto sm:w-52 lg:w-64 group shadow-sm"
              title="Quick Search Canada (⌘K)"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform shrink-0" />
                <span className="hidden sm:inline truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                  Search Canada weather...
                </span>
              </div>
              <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/15 shadow-xs shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* AI Copilot Button */}
            <button
              onClick={() => openChat()}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:via-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-95 transition-all group"
              title="Open Aurora AI Canadian Meteorological Copilot"
            >
              <Sparkles className="w-4 h-4 text-yellow-200 group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline font-extrabold tracking-wide">AI Copilot</span>
              <span className="md:hidden font-extrabold">AI</span>
            </button>

            {/* User Account / Sign In */}
            {mounted && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 hover:border-purple-400 flex items-center justify-center text-sm transition-colors"
                  title={user.name}
                >
                  {user.avatar || '🍁'}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-white/10">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-purple-600 dark:text-purple-300 font-mono uppercase font-bold">
                        {user.role}
                      </div>
                    </div>

                    <Link
                      href="/account"
                      className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      👤 My Account & Hubs
                    </Link>

                    {(user.role === 'admin' || user.role === 'editor') && (
                      <Link
                        href="/admin"
                        className="block px-3.5 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-300 hover:bg-purple-500/15 transition-colors"
                      >
                        👑 HQ Command Center
                      </Link>
                    )}

                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-bold text-sky-600 dark:text-sky-300 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 max-h-[calc(100dvh-5rem)] overflow-y-auto">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-sky-500" />
                <span>Search Canada city, radar, pass...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-slate-500 border border-slate-300 dark:border-white/15">
                ⌘K
              </kbd>
            </button>

            {/* Primary Mobile Links */}
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors flex items-center gap-2"
              >
                <span>🍁</span>
                <span>{t('nav_canada')}</span>
              </Link>
              <Link
                href="/provinces"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors flex items-center gap-2"
              >
                <span>🗺️</span>
                <span>{t('nav_provinces')}</span>
              </Link>
              <Link
                href="/radar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-sky-500 animate-pulse" />
                <span>{t('nav_radar')}</span>
              </Link>
              <Link
                href="/ski"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors flex items-center gap-2"
              >
                <span>⛷️</span>
                <span>{t('nav_ski')}</span>
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors flex items-center gap-2"
              >
                <span>📰</span>
                <span>Blog & Science</span>
              </Link>
              <Link
                href="/alerts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>{t('nav_alerts')}</span>
              </Link>
            </div>

            {/* Meteorological Tools */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Meteorological Tools
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <Link
                  href="/tools/calculator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  🧮 Wind Chill & Humidex
                </Link>
                <Link
                  href="/tools/compare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  ⚖️ City Comparison
                </Link>
                <Link
                  href="/tools/aurora"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  🌌 Aurora Live Oval
                </Link>
                <Link
                  href="/tools/wildfire-smoke"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-red-500 dark:text-red-400"
                >
                  🔥 Wildfire &amp; Smoke
                </Link>
                <Link
                  href="/tools/solunar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-emerald-500 dark:text-emerald-400"
                >
                  🎣 Solunar &amp; Fishing
                </Link>
                <Link
                  href="/tools/aviation"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-sky-500 dark:text-sky-400"
                >
                  ✈️ Aviation METAR
                </Link>
                <Link
                  href="/tools/agriculture"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-amber-500 dark:text-amber-400"
                >
                  🌾 Agriculture &amp; GDD
                </Link>
                <Link
                  href="/tools/travel-briefing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-indigo-500 dark:text-indigo-400"
                >
                  🖨️ Travel PDF Studio
                </Link>
                <Link
                  href="/tools/marine-tides"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-cyan-500 dark:text-cyan-400"
                >
                  🌊 Marine &amp; Tides
                </Link>
                <Link
                  href="/tools/route-planner"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-sky-500 dark:text-sky-400"
                >
                  🚗 Route Planner
                </Link>
                <Link
                  href="/tools/weather-lab"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-amber-500 dark:text-amber-400"
                >
                  ⚡ Weather Lab
                </Link>
                <Link
                  href="/tools/offline-hub"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-emerald-500 dark:text-emerald-400"
                >
                  🌲 Offline Parks Hub
                </Link>
                <Link
                  href="/tools/calculator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  🧮 Wind Chill / Humidex
                </Link>
                <Link
                  href="/tools/compare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  ⚖️ City Comparison
                </Link>
                <Link
                  href="/tools/aurora"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  🌌 Aurora Live Oval
                </Link>
                <Link
                  href="/highways"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  🛣️ Mountain Pass Cams
                </Link>
                <Link
                  href="/tools/widget"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  🧩 Embed Widgets
                </Link>
              </div>
            </div>

            {/* Mobile Actions: AI Launch + Theme & Language */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openChat();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
                <span>Launch Aurora AI Copilot</span>
              </button>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={toggleUnit}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 text-center"
                >
                  Unit: {unit === 'C' ? '°Celsius' : '°Fahrenheit'}
                </button>

                <button
                  onClick={toggleLanguage}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 text-center"
                >
                  Lang: {language === 'EN' ? 'English' : 'Français'}
                </button>

                <button
                  onClick={toggleTheme}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                  <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
              </div>

              {mounted && !user && (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full block py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-center text-xs font-bold text-sky-600 dark:text-sky-300"
                >
                  Sign In to WeatherCA Account
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
