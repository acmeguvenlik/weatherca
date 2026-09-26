'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WeatherAtmosphere } from '@/components/WeatherAtmosphere';
import { BroadcastBanner } from '@/components/BroadcastBanner';
import { WeatherAIChatModal } from '@/components/WeatherAIChatModal';
import { useAIChat } from '@/context/AIChatContext';
import { Sparkles } from 'lucide-react';

export const MainLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith('/admin');
  const { isOpen, openChat } = useAIChat();

  // When inside the Admin / Operations HQ, render without the public header/footer/atmosphere
  if (isAdminArea) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">{children}</div>;
  }

  // Public portal experience
  return (
    <>
      <BroadcastBanner />
      <WeatherAtmosphere theme="clear-day" />
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />

      {/* Floating AI Chat Assistant Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => openChat()}
          className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all border border-white/20 backdrop-blur-md"
          aria-label="Ask Aurora Weather AI Copilot"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-yellow-200 group-hover:rotate-12 transition-transform animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="tracking-wide hidden sm:inline">Ask Aurora AI</span>
          <span className="sm:hidden font-extrabold">AI</span>
        </button>
      )}

      {/* Global Meteorological AI Copilot Modal */}
      <WeatherAIChatModal />
    </>
  );
};
