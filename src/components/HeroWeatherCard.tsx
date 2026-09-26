'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Wind,
  Droplets,
  Eye,
  AlertTriangle,
  Flame,
  Snowflake,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { CityWeatherForecast } from '@/types/weather';
import { WeatherIcon } from './WeatherIcons';
import { getWeatherConditionInfo } from '@/lib/weather';
import { useUnit } from '@/context/UnitContext';

interface HeroWeatherCardProps {
  forecast: CityWeatherForecast;
}

export const HeroWeatherCard: React.FC<HeroWeatherCardProps> = ({ forecast }) => {
  const { city, province, current, daily, airQuality, alerts } = forecast;
  const { unit, convertTemp } = useUnit();
  const cond = getWeatherConditionInfo(current.weatherCode, current.isDay);
  const today = daily[0];

  // Localized city time
  const localTimeStr = new Date().toLocaleTimeString('en-US', {
    timeZone: city.timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="w-full space-y-4">
      {/* Severe Weather Alert Banner (Environment Canada) */}
      {alerts && alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-xl flex items-start gap-3.5 text-amber-900 dark:text-amber-200 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2">
              <span>{alerts[0].headline}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 dark:bg-amber-500/30 border border-amber-500/30 dark:border-amber-500/40 text-amber-800 dark:text-amber-200">
                Official Alert
              </span>
            </div>
            <p className="text-xs text-amber-950/80 dark:text-amber-200/90 leading-relaxed">{alerts[0].description}</p>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl p-6 sm:p-8 lg:p-10 transition-all hover:border-slate-300 dark:hover:border-white/20">
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Column: Location & Temperature */}
          <div className="space-y-4">
            {/* Breadcrumb / Location info */}
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 tracking-wide">
              <Link href="/" className="hover:underline">
                Canada
              </Link>
              <span>/</span>
              <Link href={`/${province.slug}`} className="hover:underline">
                {province.name} ({province.code})
              </Link>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                {city.name}
                {city.isCapital && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 self-center">
                    Provincial Capital
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Local Time: {localTimeStr}
                </span>
                <span>•</span>
                <span>Elevation: {city.elevation ?? 85}m</span>
                <span>•</span>
                <span>Station: MSC Automated Radar</span>
              </div>
            </div>

            {/* Giant Temperature & Condition */}
            <div className="flex items-center gap-5 sm:gap-8 pt-2">
              <div className="flex items-baseline">
                <span className="text-6xl sm:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                  {convertTemp(current.temperature)}
                </span>
                <span className="text-3xl sm:text-5xl font-light text-sky-600 dark:text-sky-400 -translate-y-6 sm:-translate-y-8">
                  °{unit}
                </span>
              </div>

              <div className="space-y-1.5 border-l border-slate-200 dark:border-white/10 pl-5 sm:pl-8">
                <div className="flex items-center gap-2.5">
                  <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={32} />
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {cond.condition}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-3">
                  <span>
                    Feels like{' '}
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {convertTemp(current.apparentTemperature)}°{unit}
                    </strong>
                  </span>
                  {today && (
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                        <ArrowUp className="w-3 h-3" />
                        {convertTemp(today.temperatureMax)}°
                      </span>
                      <span className="text-sky-600 dark:text-sky-400 font-medium flex items-center">
                        <ArrowDown className="w-3 h-3" />
                        {convertTemp(today.temperatureMin)}°
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Canadian Specific Flagship Badges */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {/* Wind Chill Card (Canada Winter Standard) */}
            {current.temperature <= 0 ? (
              <div className="p-4 rounded-2xl bg-cyan-50/90 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/20 backdrop-blur-md flex items-center gap-3 min-w-[240px]">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-300">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-cyan-700 dark:text-cyan-300/80 font-medium uppercase tracking-wider">
                    Canadian Wind Chill
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {convertTemp(current.windChill ?? current.temperature)}°{unit}
                  </div>
                  <div className="text-[11px] text-cyan-600/80 dark:text-cyan-200/70">
                    {current.frostbiteRiskMinutes
                      ? `⚠️ Frostbite risk in ~${current.frostbiteRiskMinutes} min`
                      : 'Low frostbite risk'}
                  </div>
                </div>
              </div>
            ) : (
              /* Humidex Card (Canada Summer Standard) */
              <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 backdrop-blur-md flex items-center gap-3 min-w-[240px]">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-amber-700 dark:text-amber-300/80 font-medium uppercase tracking-wider">
                    Canadian Humidex
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {current.humidex ?? current.temperature}
                  </div>
                  <div className="text-[11px] text-amber-600/80 dark:text-amber-200/70">
                    {current.humidexCategory ?? 'Comfortable'}
                  </div>
                </div>
              </div>
            )}

            {/* Canadian AQHI Badge */}
            <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 backdrop-blur-md flex items-center gap-3 min-w-[240px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-sm">
                {airQuality?.aqhi ?? 2}
              </div>
              <div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300/80 font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <span>Canada AQHI Index</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {airQuality?.aqhiRiskLevel ?? 'Low Risk'}
                </div>
                <div className="text-[11px] text-emerald-600/80 dark:text-emerald-200/70 truncate max-w-[170px]">
                  Ideal for outdoor activities
                </div>
              </div>
            </div>

            {/* Live Canadian Precipitation Radar Button */}
            <Link
              href={`/${province.slug}/${city.slug}/radar`}
              className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25 border border-sky-200 dark:border-sky-500/30 backdrop-blur-md flex items-center justify-between text-xs font-semibold text-sky-700 dark:text-sky-200 hover:text-sky-900 dark:hover:text-white transition-all group"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                View Live Precipitation Radar
              </span>
              <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
