'use client';

import React, { useState } from 'react';
import {
  Waves,
  Compass,
  Wind,
  Thermometer,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Info,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  CANADIAN_MARINE_STATIONS,
  MarineStation,
} from '@/data/canadian-marine-tides';

export function MarineTidesDashboard() {
  const [selectedStation, setSelectedStation] = useState<MarineStation>(CANADIAN_MARINE_STATIONS[0]);
  const [activeDay, setActiveDay] = useState<'today' | 'tomorrow'>('today');

  const tides = activeDay === 'today' ? selectedStation.todayTides : selectedStation.tomorrowTides;
  const highestTide = Math.max(...tides.map((t) => t.heightMeters));

  return (
    <div className="space-y-8">
      {/* Station Header Bar */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
            <Waves className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Canadian Hydrographic Service (CHS) Station
            </div>
            <h3 className="text-lg font-black text-white">{selectedStation.name}</h3>
            <span className="text-xs text-slate-400">
              {selectedStation.bodyOfWater} • {selectedStation.province} • Coordinates: {selectedStation.lat.toFixed(2)}°N, {Math.abs(selectedStation.lon).toFixed(2)}°W
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <select
            value={selectedStation.id}
            onChange={(e) => {
              const st = CANADIAN_MARINE_STATIONS.find((s) => s.id === e.target.value);
              if (st) setSelectedStation(st);
            }}
            className="w-full md:w-72 bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
          >
            {CANADIAN_MARINE_STATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.provinceCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Marine Telemetry Ribbons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tidal Range */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-cyan-400" /> Max Tidal Range
          </span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-1">
            {selectedStation.tidalRangeMeters} <span className="text-xs text-slate-400 font-semibold">m</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">{selectedStation.tidalRangeCategory}</div>
        </div>

        {/* Sea Surface Temp */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Sea Surface Temp (SST)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
            {selectedStation.currentWaterTempC}°C
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{(selectedStation.currentWaterTempC * 1.8 + 32).toFixed(1)}°F Surface Buoy</div>
        </div>

        {/* Swell & Wave Height */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-sky-400" /> Wave &amp; Swell Height
          </span>
          <div className="text-2xl sm:text-3xl font-black text-sky-300 mt-1">
            {selectedStation.waveHeightMeters} <span className="text-xs text-slate-400 font-semibold">m</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{selectedStation.swellPeriodSec}s Dominant Period</div>
        </div>

        {/* Marine Coastal Wind */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-teal-400" /> Coastal Wind
          </span>
          <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">
            {selectedStation.windSpeedKt} <span className="text-xs text-slate-400 font-semibold">kt</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Bearing {selectedStation.windDirection}</div>
        </div>
      </div>

      {/* Main Tidal Curve Visualizer & High/Low Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Animated Tidal Wave Graphic Curve */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-white">Semidiurnal Tidal Water Level Curve</h4>
              <span className="text-xs text-slate-400 font-mono">Relative to Chart Datum</span>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10 text-xs">
              <button
                onClick={() => setActiveDay('today')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeDay === 'today' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveDay('tomorrow')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeDay === 'tomorrow' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Graphical Tidal Waveform SVG */}
          <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-white/5 p-4 overflow-hidden">
            <svg viewBox="0 0 800 280" className="w-full h-auto max-h-[220px] select-none">
              <defs>
                <linearGradient id="tideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="40" x2="750" y2="40" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="50" y1="120" x2="750" y2="120" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="50" y1="200" x2="750" y2="200" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />

              {/* Tidal Sinusoidal Curve Path */}
              <path
                d="M 50 80 C 150 40, 200 220, 300 210 C 400 200, 450 50, 550 60 C 650 70, 700 220, 750 215 L 750 260 L 50 260 Z"
                fill="url(#tideGradient)"
              />
              <path
                d="M 50 80 C 150 40, 200 220, 300 210 C 400 200, 450 50, 550 60 C 650 70, 700 220, 750 215"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Peak and Trough Markers */}
              {tides.map((t, idx) => {
                const x = 120 + idx * 180;
                const isHigh = t.type === 'High Tide';
                const y = isHigh ? 60 : 210;

                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="6" fill={isHigh ? "#22d3ee" : "#38bdf8"} stroke="#ffffff" strokeWidth="2" />
                    <text x={x} y={isHigh ? y - 14 : y + 20} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                      {t.heightMeters}m ({t.time})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* High & Low Events Timeline Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tides.map((t, idx) => {
              const isHigh = t.type === 'High Tide';
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                    isHigh
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-slate-950/60 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-black uppercase tracking-wider flex items-center gap-1 ${isHigh ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {isHigh ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {t.type}
                    </span>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                  </div>

                  <div className="mt-2">
                    <div className="text-lg font-black text-white">{t.time}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {t.heightMeters}m <span className="text-[10px] text-slate-500">({t.heightFeet} ft)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Marine Advisory & Hydrographic Facts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Navigational Advisory
            </h4>

            {/* Advisory Alert */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Local Waters Warning
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedStation.marineAdvisory}
              </p>
            </div>

            {/* Notable Hydrographic Feature */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Hydrographic Profile
              </span>
              <p className="text-slate-400 leading-relaxed font-medium">
                {selectedStation.notableFeature}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
