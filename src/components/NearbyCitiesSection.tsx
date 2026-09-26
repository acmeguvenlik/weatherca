import React from 'react';
import Link from 'next/link';
import { MapPin, Navigation, ArrowUpRight } from 'lucide-react';
import { CanadianCity } from '@/types/weather';

interface NearbyCitiesSectionProps {
  currentCityName: string;
  provinceSlug: string;
  provinceName: string;
  nearbyCities: CanadianCity[];
}

export const NearbyCitiesSection: React.FC<NearbyCitiesSectionProps> = ({
  currentCityName,
  provinceSlug,
  provinceName,
  nearbyCities,
}) => {
  if (!nearbyCities || nearbyCities.length === 0) return null;

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm shadow-sm">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Nearby Regional Stations & Towns
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Corridor weather stations and neighboring municipalities in {provinceName}
            </p>
          </div>
        </div>
        <Link
          href={`/${provinceSlug}`}
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
        >
          <span>All {provinceName} Hubs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {nearbyCities.map((c) => (
          <Link
            key={c.slug}
            href={`/${provinceSlug}/${c.slug}`}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-purple-400/40 dark:hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/5 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors truncate">
                {c.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {c.provinceCode}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Station #{c.slug.slice(0, 5).toUpperCase()}</span>
              </span>
              <span className="font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                Forecast →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
