import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calculator, Snowflake, Flame, Activity, ShieldCheck, ArrowLeft, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meteorological Methodology & Scientific Formulas | WeatherCA',
  description: 'Official Environment Canada scientific formulas for Wind Chill Index, Canadian Humidex, Dew Point calculations, and Air Quality Health Index (AQHI).',
};

export default function MethodologyPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Scientific Methodology & Atmospheric Formulas</span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/60 to-indigo-950/70 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
          <BookOpen className="w-3.5 h-3.5" />
          Environment and Climate Change Canada (ECCC) Standards
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Meteorological <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-200">Methodology & Formulas</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          WeatherCA is engineered according to the official equations established by Environment Canada, the Meteorological Service of Canada (MSC), and Health Canada.
        </p>
      </div>

      {/* Section 1: Canadian Wind Chill */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-lg">
          <Snowflake className="w-5 h-5 text-cyan-400" />
          <h2>1. Canadian Wind Chill Index (T_wc)</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Introduced in 2001 by Environment Canada in cooperation with the US National Weather Service, the modern Wind Chill formula calculates convective heat loss from human skin based on wind speed measured at standard anemometer height (10 meters aloft):
        </p>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
          T_wc = 13.12 + 0.6215 * T_air - 11.37 * (V_10)^0.16 + 0.3965 * T_air * (V_10)^0.16
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <div>• <strong>T_air</strong> = Air temperature in degrees Celsius (°C)</div>
          <div>• <strong>V_10</strong> = Wind speed in kilometers per hour (km/h) measured at 10 meters</div>
        </div>

        <div className="pt-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Frostbite Threshold Timelines</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="font-bold text-amber-300">-28 to -39 Wind Chill</div>
              <div className="text-slate-400 mt-0.5">Risk of frostbite within 10 to 30 minutes</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="font-bold text-rose-300">-40 to -47 Wind Chill</div>
              <div className="text-slate-400 mt-0.5">Frostbite occurs within 5 to 10 minutes</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="font-bold text-red-400">-48 and Below</div>
              <div className="text-slate-400 mt-0.5">Severe danger: skin freezes in under 2 to 5 minutes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Canadian Humidex */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-lg">
          <Flame className="w-5 h-5 text-amber-400" />
          <h2>2. Canadian Humidex (H)</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Developed in 1965 by Canadian meteorologists J.M. Masterton and F.A. Richardson, the Humidex is a dimensionless index indicating perceived summer warmth by incorporating atmospheric vapor pressure:
        </p>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto">
          Humidex = T_air + (5 / 9) * (e - 10)
        </div>

        <p className="text-xs text-slate-300">
          Where vapor pressure <strong>e</strong> (in millibars / hPa) is derived from the dew point temperature:
        </p>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-amber-200 overflow-x-auto">
          e = 6.11 * 10 ^ ((7.5 * T_dew) / (237.3 + T_dew))
        </div>
      </div>

      {/* Section 3: AQHI */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-lg">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2>3. Air Quality Health Index (AQHI)</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Canada’s AQHI differs from the US AQI by measuring the combined multi-pollutant health risk from ozone (O3), fine particulate matter (PM2.5), and nitrogen dioxide (NO2) based on excess mortality epidemiology:
        </p>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto">
          AQHI = (10 / 10.4) * 100 * [ (exp(0.000871 * NO2) - 1) + (exp(0.000537 * O3) - 1) + (exp(0.000487 * PM2.5) - 1) ]
        </div>
      </div>
    </div>
  );
}
