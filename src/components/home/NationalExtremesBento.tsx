'use client';

import React from 'react';
import Link from 'next/link';
import {
  ThermometerSnowflake,
  ThermometerSun,
  Sparkles,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Radio,
  Eye,
} from 'lucide-react';
import { useUnit } from '@/context/UnitContext';

interface NationalExtremesBentoProps {
  coldest: {
    cityName: string;
    provinceCode: string;
    provinceSlug: string;
    citySlug: string;
    temp: number;
    windChill: number;
  };
  warmest: {
    cityName: string;
    provinceCode: string;
    provinceSlug: string;
    citySlug: string;
    temp: number;
    humidex?: number;
  };
  activeAlertsCount: number;
}

export const NationalExtremesBento: React.FC<NationalExtremesBentoProps> = ({
  coldest,
  warmest,
  activeAlertsCount,
}) => {
  const { unit, convertTemp } = useUnit();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {/* 1. Coldest Spot in Canada */}
      <Link
        href={`/${coldest.provinceSlug}/${coldest.citySlug}`}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-50/90 via-white to-sky-50/80 dark:from-cyan-950/40 dark:via-slate-900/60 dark:to-slate-950 border border-cyan-200/80 dark:border-cyan-500/25 p-5 sm:p-6 backdrop-blur-xl shadow-md hover:shadow-xl dark:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>National Cold Spot</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-300 dark:border-cyan-500/30">
            {coldest.provinceCode}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
            {coldest.cityName}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-cyan-700 dark:text-cyan-300">
              {convertTemp(coldest.temp)}°{unit}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Chill: {convertTemp(coldest.windChill)}°
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-cyan-200/60 dark:border-white/10 flex items-center justify-between text-xs text-cyan-800 dark:text-cyan-300/80">
          <span>Sub-zero Arctic air mass</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </Link>

      {/* 2. Warmest Spot in Canada */}
      <Link
        href={`/${warmest.provinceSlug}/${warmest.citySlug}`}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-slate-950 border border-amber-200/80 dark:border-amber-500/25 p-5 sm:p-6 backdrop-blur-xl shadow-md hover:shadow-xl dark:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
            <ThermometerSun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>National Warm Spot</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-500/30">
            {warmest.provinceCode}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
            {warmest.cityName}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
              +{convertTemp(warmest.temp)}°{unit}
            </span>
            {warmest.humidex && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Humidex: {warmest.humidex}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-white/10 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300/80">
          <span>Temperate coastal breeze</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </Link>

      {/* 3. Aurora Borealis & ECCC Alerts Dispatch */}
      <Link
        href="/tools/aurora"
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/80 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-950 border border-emerald-200/80 dark:border-emerald-500/25 p-5 sm:p-6 backdrop-blur-xl shadow-md hover:shadow-xl dark:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
            <span>Aurora Borealis Tonight</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/30">
            Kp 4.2 Active
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
            High Subarctic Oval
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
            Elevated coronal solar activity over YK, NWT &amp; Northern Alberta.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-white/10 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300/80">
          <span>View Northern Lights Map</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </Link>
    </div>
  );
};
