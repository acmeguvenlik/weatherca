'use client';

import React, { useState } from 'react';
import {
  Sprout,
  Thermometer,
  Droplets,
  Sun,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { CANADIAN_AGRI_ZONES, AgriZone } from '@/data/canadian-agriculture';

export function AgricultureDashboard() {
  const [selectedZone, setSelectedZone] = useState<AgriZone>(CANADIAN_AGRI_ZONES[0]);
  const [gddBase, setGddBase] = useState<'base5' | 'base10'>('base5');

  const currentGdd = gddBase === 'base5' ? selectedZone.gddBase5Accumulated : selectedZone.gddBase10Accumulated;
  const gddDiff = selectedZone.gddBase5Accumulated - selectedZone.historicalGddAverage;

  return (
    <div className="space-y-8">
      {/* Zone Selector Ribbon */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Selected Agricultural Region
            </div>
            <h3 className="text-lg font-black text-white">{selectedZone.name}</h3>
            <span className="text-xs text-slate-400">
              {selectedZone.province} • Lat: {selectedZone.lat.toFixed(2)}°N, Lon: {Math.abs(selectedZone.lon).toFixed(2)}°W
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <select
            value={selectedZone.id}
            onChange={(e) => {
              const zone = CANADIAN_AGRI_ZONES.find((z) => z.id === e.target.value);
              if (zone) setSelectedZone(zone);
            }}
            className="w-full md:w-72 bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
          >
            {CANADIAN_AGRI_ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.provinceCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vital Agronomic Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Frost Risk */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-sky-400" /> Overnight Frost Threat
          </span>
          <div
            className={`text-2xl font-black mt-1 ${
              selectedZone.frostRiskLevel === 'Severe Frost Threat'
                ? 'text-red-400'
                : selectedZone.frostRiskLevel === 'Moderate Warning'
                ? 'text-amber-400'
                : selectedZone.frostRiskLevel === 'Low Risk'
                ? 'text-sky-300'
                : 'text-emerald-400'
            }`}
          >
            {selectedZone.frostRiskLevel}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Min Night Temp: <strong>{selectedZone.minOvernightForecastC}°C</strong>
          </div>
        </div>

        {/* GDD Units */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Season GDD Units</span>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 text-[10px]">
              <button
                onClick={() => setGddBase('base5')}
                className={`px-1.5 py-0.5 rounded font-bold ${
                  gddBase === 'base5' ? 'bg-amber-500 text-white' : 'text-slate-400'
                }`}
              >
                Base 5°C
              </button>
              <button
                onClick={() => setGddBase('base10')}
                className={`px-1.5 py-0.5 rounded font-bold ${
                  gddBase === 'base10' ? 'bg-amber-500 text-white' : 'text-slate-400'
                }`}
              >
                Base 10°C
              </button>
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">
            {currentGdd.toLocaleString()} <span className="text-xs text-slate-400 font-normal">GDD</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {gddDiff >= 0 ? `+${gddDiff} units above 30-yr normal` : `${gddDiff} units below normal`}
          </div>
        </div>

        {/* Soil Temp */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Soil Temp (10 cm Depth)
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {selectedZone.currentSoilTemp10cmC}°C
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Root zone thermal profile</div>
        </div>

        {/* Soil Moisture */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-400" /> Available Soil Moisture
          </span>
          <div className="text-2xl font-black text-sky-300 mt-1">
            {selectedZone.soilMoisturePct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-semibold">{selectedZone.moistureStatus}</div>
        </div>
      </div>

      {/* Deep Dive Agronomy Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Crop Staging & Recommendations */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Phenology &amp; Crop Development Staging
            </h4>

            {/* Stage Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Vegetative / Reproductive Stage:
              </span>
              <div className="text-sm font-bold text-white leading-relaxed">
                {selectedZone.cropStageStatus}
              </div>
            </div>

            {/* Agronomy Guidance */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-950 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase">
                <Info className="w-4 h-4" /> Field Operations &amp; Agronomy Action Plan
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {selectedZone.agronomyRecommendation}
              </p>
            </div>

            {/* Primary Crops Tag Cloud */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Regional Specialty Crops Monitored
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedZone.primaryCrops.map((crop) => (
                  <span
                    key={crop}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-semibold text-amber-300"
                  >
                    🌾 {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: GDD Accumulation Benchmark */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              Thermal Unit Benchmark
            </h4>

            {/* Progress Visualization */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Current GDD:</span>
                <span className="text-amber-300">{selectedZone.gddBase5Accumulated} units</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${Math.min((selectedZone.gddBase5Accumulated / 2000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 GDD (Germination)</span>
                <span>2,000 GDD (Full Maturity)</span>
              </div>
            </div>

            {/* Historical Average Comparison */}
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>30-Year Climate Norm:</span>
                <span className="text-white font-bold">{selectedZone.historicalGddAverage} GDD</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Pace Deviation:</span>
                <span className={gddDiff >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {gddDiff >= 0 ? `+${gddDiff} Ahead` : `${gddDiff} Behind`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
