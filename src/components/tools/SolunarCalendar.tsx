'use client';

import React, { useState } from 'react';
import {
  Compass,
  Fish,
  Moon,
  Sun,
  Clock,
  Sparkles,
  MapPin,
  TrendingUp,
  Waves,
  Calendar,
  Info,
} from 'lucide-react';
import {
  calculateSolunarForecast,
  CANADIAN_FISHING_HOTSPOTS,
  FishingHotspot,
} from '@/lib/solunar';

export function SolunarCalendar() {
  const [selectedHotspot, setSelectedHotspot] = useState<FishingHotspot>(CANADIAN_FISHING_HOTSPOTS[0]);
  const [forecastDays] = useState(7);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const forecast = calculateSolunarForecast(forecastDays);
  const currentDay = forecast[activeDayIndex] || forecast[0];

  return (
    <div className="space-y-8">
      {/* Hotspot Location Selector Bar */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Fish className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              Selected Canadian Waters
            </div>
            <h3 className="text-lg font-black text-white">{selectedHotspot.name}</h3>
            <span className="text-xs text-slate-400">
              {selectedHotspot.province} • {selectedHotspot.type} • Coordinates: {selectedHotspot.lat.toFixed(2)}°N, {Math.abs(selectedHotspot.lon).toFixed(2)}°W
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <select
            value={selectedHotspot.id}
            onChange={(e) => {
              const spot = CANADIAN_FISHING_HOTSPOTS.find((s) => s.id === e.target.value);
              if (spot) setSelectedHotspot(spot);
            }}
            className="w-full md:w-64 bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
          >
            {CANADIAN_FISHING_HOTSPOTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.provinceCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 7-Day Solunar Timeline Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecast.map((day, idx) => {
          const isSelected = idx === activeDayIndex;
          return (
            <button
              key={day.date}
              onClick={() => setActiveDayIndex(idx)}
              className={`p-3.5 rounded-2xl border transition-all text-left relative overflow-hidden flex flex-col justify-between h-36 ${
                isSelected
                  ? 'bg-gradient-to-b from-emerald-500/20 via-slate-900 to-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-500/10 scale-102'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-white/10 text-slate-400'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-black uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {day.dayOfWeek}
                  </span>
                  <span className="text-base">{day.moonPhaseIcon}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{day.date.split(',')[0]}</div>
              </div>

              {/* Solunar Activity Rating Score */}
              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-xl font-black ${
                      day.activityScore >= 85
                        ? 'text-emerald-400'
                        : day.activityScore >= 70
                        ? 'text-sky-400'
                        : day.activityScore >= 50
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.activityScore}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">/100</span>
                </div>
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-wide block truncate ${
                    day.activityScore >= 85
                      ? 'text-emerald-300'
                      : day.activityScore >= 70
                      ? 'text-sky-300'
                      : 'text-slate-400'
                  }`}
                >
                  {day.activityRating}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day In-Depth Solunar & Feeding Windows Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 4 Major & Minor Feeding Windows */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Peak Wildlife &amp; Fish Activity Windows
                </span>
                <h4 className="text-xl font-black text-white mt-0.5">
                  {currentDay.dayOfWeek} - {currentDay.date}
                </h4>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black">
                Activity Score: {currentDay.activityScore}% ({currentDay.activityRating})
              </div>
            </div>

            {/* Feeding Windows Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Major 1 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-950/80 to-slate-950 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Major Window 1 (Overhead)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    Peak Bite
                  </span>
                </div>
                <div className="text-lg font-black text-white">{currentDay.majorPeriod1}</div>
                <p className="text-[11px] text-slate-400">
                  Moon directly overhead. Maximum gravitational alignment triggers intense feeding activity in predatory fish.
                </p>
              </div>

              {/* Major 2 */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-950/80 to-slate-950 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Major Window 2 (Underfoot)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    Peak Bite
                  </span>
                </div>
                <div className="text-lg font-black text-white">{currentDay.majorPeriod2}</div>
                <p className="text-[11px] text-slate-400">
                  Moon directly underfoot on opposite side of Earth. Secondary prolonged 2-hour feeding window.
                </p>
              </div>

              {/* Minor 1 */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Minor Window 1 (Moonrise)
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">1 Hour Window</span>
                </div>
                <div className="text-base font-extrabold text-white">{currentDay.minorPeriod1}</div>
                <p className="text-[11px] text-slate-400">
                  Coincides with lunar crest above horizon. Heightened strike rate along shallow dropoffs.
                </p>
              </div>

              {/* Minor 2 */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Minor Window 2 (Moonset)
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">1 Hour Window</span>
                </div>
                <div className="text-base font-extrabold text-white">{currentDay.minorPeriod2}</div>
                <p className="text-[11px] text-slate-400">
                  Lunar transit setting past western horizon. Excellent topwater bite opportunity.
                </p>
              </div>
            </div>

            {/* Hotspot Tactical Advice */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Angler Strategy for {selectedHotspot.name}:</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {selectedHotspot.seasonalAdvice}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Astronomy & Water Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3">
              <Moon className="w-4 h-4 text-indigo-400" />
              Lunar &amp; Solar Ephemeris
            </h4>

            {/* Moon Phase Details */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-slate-950 border border-indigo-500/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{currentDay.moonPhaseIcon}</div>
                <div>
                  <div className="text-sm font-black text-white">{currentDay.moonPhaseName}</div>
                  <div className="text-xs text-slate-400">Illumination: {currentDay.moonIlluminationPct}%</div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-400">Moonrise: <span className="text-white font-bold">{currentDay.moonRise}</span></div>
                <div className="text-slate-400">Moonset: <span className="text-white font-bold">{currentDay.moonSet}</span></div>
              </div>
            </div>

            {/* Sun Times */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-950 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="text-sm font-black text-white">Solar Daylight Window</div>
                  <div className="text-xs text-slate-400">Dawn &amp; Dusk Crepuscular Feeding</div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-400">Sunrise: <span className="text-white font-bold">{currentDay.sunRise}</span></div>
                <div className="text-slate-400">Sunset: <span className="text-white font-bold">{currentDay.sunSet}</span></div>
              </div>
            </div>

            {/* Target Species for this Waterbody */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Target Species
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedHotspot.dominantSpecies.map((species) => (
                  <span
                    key={species}
                    className="px-2.5 py-1 rounded-xl bg-slate-950 border border-white/10 text-xs font-semibold text-emerald-300"
                  >
                    🐟 {species}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
