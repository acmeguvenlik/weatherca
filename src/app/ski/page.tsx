'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Snowflake, Mountain, Wind, ChevronRight, Compass, ShieldAlert, ArrowUpDown, Layers, CheckCircle2 } from 'lucide-react';
import { CANADIAN_SKI_RESORTS, SkiResort } from '@/data/canadian-ski-resorts';
import { useUnit } from '@/context/UnitContext';

type ProvinceFilter = 'ALL' | 'BC' | 'AB' | 'QC' | 'ON';
type SortOption = 'snow24h' | 'baseDepth' | 'vertical' | 'openRuns';

export default function SkiIndexPage() {
  const [activeProvince, setActiveProvince] = useState<ProvinceFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('snow24h');
  const [searchQuery, setSearchQuery] = useState('');
  const { formatTemp } = useUnit();

  const filteredResorts = CANADIAN_SKI_RESORTS.filter((resort) => {
    const matchesProv = activeProvince === 'ALL' || resort.provinceCode === activeProvince;
    const matchesSearch =
      resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resort.mountainRange.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resort.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProv && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'snow24h') return b.snow.last24HoursCm - a.snow.last24HoursCm;
    if (sortBy === 'baseDepth') return b.snow.baseDepthCm - a.snow.baseDepthCm;
    if (sortBy === 'vertical') return b.verticalDropM - a.verticalDropM;
    if (sortBy === 'openRuns') return b.runs.open - a.runs.open;
    return 0;
  });

  const total24hPowder = CANADIAN_SKI_RESORTS.reduce((acc, r) => acc + r.snow.last24HoursCm, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Winter Sports</span>
        <span>/</span>
        <span className="text-slate-300">Ski Resorts & Snow Reports</span>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/70 to-indigo-950/60 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
            <Snowflake className="w-3.5 h-3.5 animate-spin text-cyan-300" />
            Live Canadian Mountain Weather & Snowpack Hub
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Canada Ski Resorts & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-200">Snow Report</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Live snow depths, 24-hour fresh powder reports, summit wind chill, open trails, and official Avalanche Canada bulletins for the premier alpine resorts across the Rockies, Coast Range, and Laurentians.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-slate-200">
              <Mountain className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-white">12 Premier Resorts</span> Tracked
            </div>
            <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2 text-cyan-200">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white">{total24hPowder} cm</span> Total 24h Snowfall
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        {/* Province Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {(['ALL', 'BC', 'AB', 'QC', 'ON'] as ProvinceFilter[]).map((prov) => {
            const label =
              prov === 'ALL'
                ? 'All Canada'
                : prov === 'BC'
                ? 'British Columbia'
                : prov === 'AB'
                ? 'Alberta'
                : prov === 'QC'
                ? 'Quebec'
                : 'Ontario';
            const isActive = activeProvince === prov;
            return (
              <button
                key={prov}
                onClick={() => setActiveProvince(prov)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search resort or range..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 w-44 sm:w-56"
          />

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort ski resorts"
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="snow24h" className="bg-slate-900 text-white">24h Snow (Highest)</option>
              <option value="baseDepth" className="bg-slate-900 text-white">Base Depth (Deepest)</option>
              <option value="vertical" className="bg-slate-900 text-white">Vertical Drop</option>
              <option value="openRuns" className="bg-slate-900 text-white">Open Runs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resorts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResorts.map((resort) => {
          const isDeepSnow = resort.snow.last24HoursCm >= 15;
          return (
            <Link
              key={resort.slug}
              href={`/ski/${resort.slug}`}
              className="group relative rounded-3xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-sky-500/40 p-6 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between"
            >
              {isDeepSnow && (
                <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-bold text-cyan-300 flex items-center gap-1 animate-pulse">
                  <Snowflake className="w-3 h-3" />
                  POWDER ALERT
                </div>
              )}

              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="text-[11px] font-bold tracking-wider uppercase text-sky-400">
                    {resort.province} • {resort.mountainRange}
                  </div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-sky-300 transition-colors mt-0.5">
                    {resort.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>Summit: {resort.summitElevationM}m</span>
                    <span>•</span>
                    <span>Drop: {resort.verticalDropM}m</span>
                  </div>
                </div>

                {/* Big Stats Row */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">24h Snow</div>
                    <div className="text-lg font-black text-cyan-300 mt-0.5">
                      +{resort.snow.last24HoursCm} <span className="text-xs font-normal">cm</span>
                    </div>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Base Depth</div>
                    <div className="text-lg font-black text-white mt-0.5">
                      {resort.snow.baseDepthCm} <span className="text-xs font-normal">cm</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Summit Temp</div>
                    <div className="text-lg font-black text-amber-300 mt-0.5">
                      {formatTemp(resort.weather.summitTempC)}
                    </div>
                  </div>
                </div>

                {/* Secondary Info */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Snow Quality:</span>
                    <span className="font-semibold text-emerald-300">{resort.snow.condition}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Lifts & Runs Open:</span>
                    <span className="font-medium text-white">
                      {resort.lifts.open}/{resort.lifts.total} lifts • {resort.runs.open}/{resort.runs.total} runs
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Avalanche Danger:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        resort.avalancheDanger.alpine === 'High' || resort.avalancheDanger.alpine === 'Extreme'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : resort.avalancheDanger.alpine === 'Considerable'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {resort.avalancheDanger.alpine} (Alpine)
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                <span>View Full Mountain Report</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
