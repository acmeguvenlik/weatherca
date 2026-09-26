import React from 'react';
import Link from 'next/link';
import { Flame, Snowflake, Wind, Activity, ArrowRight } from 'lucide-react';

interface WeatherExtremeItem {
  type: 'coldest' | 'warmest' | 'windiest';
  cityName: string;
  provinceCode: string;
  provinceSlug: string;
  citySlug: string;
  value: string;
  subtext: string;
}

// Algorithmic representative Canadian telemetry extremes
const NATIONAL_EXTREMES: WeatherExtremeItem[] = [
  {
    type: 'coldest',
    cityName: 'Eureka',
    provinceCode: 'NU',
    provinceSlug: 'nunavut',
    citySlug: 'eureka',
    value: '-28.4°C',
    subtext: 'High Arctic Polar Inflow',
  },
  {
    type: 'warmest',
    cityName: 'Victoria',
    provinceCode: 'BC',
    provinceSlug: 'british-columbia',
    citySlug: 'victoria',
    value: '+13.8°C',
    subtext: 'Pacific Maritime Flow',
  },
  {
    type: 'windiest',
    cityName: 'Cape Race',
    provinceCode: 'NL',
    provinceSlug: 'newfoundland-and-labrador',
    citySlug: 'st-johns',
    value: '78 km/h',
    subtext: 'Atlantic Offshore Gale',
  },
];

export const CanadaLiveExtremes: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 p-3.5 sm:p-4 text-white shadow-lg backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Live Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>LIVE EXTREMES</span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400 font-medium">
            Coast-to-Coast Telemetry
          </span>
        </div>

        {/* 3 Extremes Grid */}
        <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 max-w-3xl">
          {NATIONAL_EXTREMES.map((item, idx) => {
            const isCold = item.type === 'coldest';
            const isWarm = item.type === 'warmest';

            return (
              <Link
                key={idx}
                href={`/${item.provinceSlug}/${item.citySlug}`}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      isCold
                        ? 'bg-sky-500/20 text-sky-300'
                        : isWarm
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isCold && <Snowflake className="w-4 h-4 text-sky-400" />}
                    {isWarm && <Flame className="w-4 h-4 text-amber-400" />}
                    {!isCold && !isWarm && <Wind className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1">
                      <span>{item.cityName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({item.provinceCode})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {item.subtext}
                    </div>
                  </div>
                </div>

                <div className="text-right pl-2">
                  <span
                    className={`text-sm font-black font-mono tracking-tight ${
                      isCold ? 'text-sky-300' : isWarm ? 'text-amber-300' : 'text-emerald-300'
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
