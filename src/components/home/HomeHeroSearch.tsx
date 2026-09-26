'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Navigation, Sparkles } from 'lucide-react';
import { SearchModal } from '@/components/SearchModal';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { getProvinceByCode } from '@/data/provinces';

export const HomeHeroSearch: React.FC = () => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setIsSearchOpen(true);
      return;
    }
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearestCity = CANADIAN_CITIES[0];
        let minDistance = Infinity;

        for (const city of CANADIAN_CITIES) {
          const dLat = (city.lat - latitude) * (Math.PI / 180);
          const dLon = (city.lon - longitude) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude * (Math.PI / 180)) *
              Math.cos(city.lat * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = 6371 * c;

          if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
          }
        }

        setIsLocating(false);
        const prov = getProvinceByCode(nearestCity.provinceCode);
        const provSlug = prov ? prov.slug : nearestCity.provinceCode.toLowerCase();
        router.push(`/${provSlug}/${nearestCity.slug}`);
      },
      () => {
        setIsLocating(false);
        setIsSearchOpen(true);
      },
      { timeout: 8000 }
    );
  };

  const quickPicks = [
    { name: 'Toronto', slug: 'toronto', prov: 'ontario' },
    { name: 'Montréal', slug: 'montreal', prov: 'quebec' },
    { name: 'Vancouver', slug: 'vancouver', prov: 'british-columbia' },
    { name: 'Calgary', slug: 'calgary', prov: 'alberta' },
    { name: 'Whistler', slug: 'whistler', prov: 'british-columbia' },
    { name: 'Banff', slug: 'banff', prov: 'alberta' },
    { name: 'Ottawa', slug: 'ottawa', prov: 'ontario' },
    { name: 'Halifax', slug: 'halifax', prov: 'nova-scotia' },
  ];

  return (
    <>
      <div className="w-full max-w-2xl space-y-3">
        {/* Main Search Bar Trigger Box */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
          
          <div
            onClick={() => setIsSearchOpen(true)}
            className="relative cursor-pointer flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/15 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl transition-all group-hover:border-sky-400/80"
          >
            <div className="flex items-center gap-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors flex-1 min-w-0">
              <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="text-xs sm:text-sm truncate text-slate-500 dark:text-slate-400">
                Search any Canadian city, town, airport or postal code (e.g. M5V, Banff, Calgary)...
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGeolocation();
                }}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/15 dark:hover:bg-sky-500/25 border border-sky-200 dark:border-sky-500/30 text-xs font-bold text-sky-700 dark:text-sky-300 transition-all"
                title="Use Current Location"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">GPS</span>
              </button>

              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 shadow-xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Quick Location Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Trending:
          </span>
          {quickPicks.map((pick) => (
            <button
              key={pick.slug}
              type="button"
              onClick={() => router.push(`/${pick.prov}/${pick.slug}`)}
              className="px-2.5 py-1 rounded-xl bg-white/70 hover:bg-white dark:bg-white/5 dark:hover:bg-white/15 border border-slate-200/80 hover:border-sky-300 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 transition-all shrink-0 shadow-xs"
            >
              {pick.name}
            </button>
          ))}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
