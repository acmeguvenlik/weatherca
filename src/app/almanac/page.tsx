'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ThermometerSnowflake,
  ThermometerSun,
  CloudRain,
  Snowflake,
  Wind,
  ShieldAlert,
  Flame,
  Clock,
  Compass,
  Search,
  ArrowUpDown,
  BookOpen,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Calendar,
  MapPin,
} from 'lucide-react';
import {
  CANADIAN_ALL_TIME_EXTREMES,
  PROVINCIAL_CLIMATE_PROFILES,
  CITY_CLIMATE_NORMALS,
  HISTORIC_CANADIAN_WEATHER_EVENTS,
  NationalExtremeRecord,
} from '@/data/canadian-climate-almanac';

type ExtremeCategory = 'ALL' | 'Cold' | 'Heat' | 'Snow' | 'Rain' | 'Wind' | 'Special';

export default function CanadianAlmanacPage() {
  const [activeCategory, setActiveCategory] = useState<ExtremeCategory>('ALL');
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('ON');

  // Comparator State
  const [city1Slug, setCity1Slug] = useState<string>('toronto');
  const [city2Slug, setCity2Slug] = useState<string>('vancouver');

  const filteredExtremes = CANADIAN_ALL_TIME_EXTREMES.filter(
    (item) => activeCategory === 'ALL' || item.category === activeCategory
  );

  const selectedProfile =
    PROVINCIAL_CLIMATE_PROFILES.find((p) => p.provinceCode === selectedProvinceCode) ||
    PROVINCIAL_CLIMATE_PROFILES[0];

  const city1 = CITY_CLIMATE_NORMALS.find((c) => c.slug === city1Slug) || CITY_CLIMATE_NORMALS[6];
  const city2 = CITY_CLIMATE_NORMALS.find((c) => c.slug === city2Slug) || CITY_CLIMATE_NORMALS[7];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Historical Climate Almanac & Extremes</span>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-950 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Environment and Climate Change Canada (ECCC) 1840–2026 Archive
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Canadian Climate Normals &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-teal-200">
              Historical Almanac
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Explore 186 years of verified Canadian atmospheric extremes, 30-year WMO climate normals, and legendary historical storm archives from the High Arctic to the Great Lakes.
          </p>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                All-Time Low
              </div>
              <div className="text-lg font-black text-white mt-0.5">-63.0 °C</div>
              <div className="text-[10px] text-slate-400">Snag, Yukon (1947)</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <ThermometerSun className="w-3.5 h-3.5 text-rose-400" />
                All-Time High
              </div>
              <div className="text-lg font-black text-white mt-0.5">+49.6 °C</div>
              <div className="text-[10px] text-slate-400">Lytton, BC (2021)</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                Max Snow Season
              </div>
              <div className="text-lg font-black text-white mt-0.5">2,446 cm</div>
              <div className="text-[10px] text-slate-400">Mt. Copeland, BC</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-amber-400" />
                Coldest Wind Chill
              </div>
              <div className="text-lg font-black text-white mt-0.5">-78.4 °C</div>
              <div className="text-[10px] text-slate-400">Kugaaruk, NU (1975)</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: National All-Time Extremes Showcase */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Canadian Weather Records
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              All-Time Meteorological Extremes
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {(['ALL', 'Cold', 'Heat', 'Snow', 'Rain', 'Wind', 'Special'] as ExtremeCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {cat === 'ALL' ? 'All Extremes' : cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Extremes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExtremes.map((record) => (
            <div
              key={record.title}
              className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl space-y-4 hover:border-amber-400/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-slate-200 border border-white/10">
                  {record.category}
                </span>
                <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {record.date}
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-medium">{record.title}</div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 group-hover:text-amber-300 transition-colors">
                  {record.value}
                </div>
                <div className="text-xs font-semibold text-sky-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{record.location}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                {record.context}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Interactive Provincial Climate Profiles */}
      <div className="rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              Geographic & Provincial Profiles
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Province-by-Province Climate Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any province or territory to review historical benchmark thresholds and normals.
            </p>
          </div>

          {/* Province Selector Dropdown / Pills */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProvinceCode}
              onChange={(e) => setSelectedProvinceCode(e.target.value)}
              aria-label="Select Canadian Province or Territory"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {PROVINCIAL_CLIMATE_PROFILES.map((p) => (
                <option key={p.provinceCode} value={p.provinceCode}>
                  {p.provinceName} ({p.provinceCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Province Profile Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-950/40 to-slate-900/60 border border-sky-500/20 space-y-4">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                PROVINCIAL REGION
              </span>
              <h3 className="text-2xl font-black text-white mt-2">{selectedProfile.provinceName}</h3>
              <p className="text-xs text-slate-300 mt-1 font-mono">{selectedProfile.climateZone}</p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Avg Frost-Free Growing Days:</span>
                <span className="font-bold text-white">{selectedProfile.avgFrostFreeDays} days</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Annual Sunshine Hours:</span>
                <span className="font-bold text-amber-300">{selectedProfile.annualSunshineHours} hrs</span>
              </div>
            </div>
          </div>

          {/* Historical High & Low */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 gap-4">
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <ThermometerSun className="w-4 h-4" />
                <span>All-Time Record High</span>
              </div>
              <div className="text-3xl font-black text-white">+{selectedProfile.recordHighC} °C</div>
              <div className="text-xs text-slate-300 font-medium">
                {selectedProfile.recordHighLocation}
              </div>
              <div className="text-[11px] font-mono text-slate-400">{selectedProfile.recordHighDate}</div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <ThermometerSnowflake className="w-4 h-4" />
                <span>All-Time Record Low</span>
              </div>
              <div className="text-3xl font-black text-white">{selectedProfile.recordLowC} °C</div>
              <div className="text-xs text-slate-300 font-medium">
                {selectedProfile.recordLowLocation}
              </div>
              <div className="text-[11px] font-mono text-slate-400">{selectedProfile.recordLowDate}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <Snowflake className="w-4 h-4" />
                <span>Greatest 24h Snowfall</span>
              </div>
              <div className="text-2xl font-black text-white">{selectedProfile.max24hSnowCm} cm</div>
              <div className="text-xs text-slate-300">{selectedProfile.max24hSnowLocation}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <CloudRain className="w-4 h-4" />
                <span>Greatest 24h Rainfall</span>
              </div>
              <div className="text-2xl font-black text-white">{selectedProfile.max24hRainMm} mm</div>
              <div className="text-xs text-slate-300">{selectedProfile.max24hRainLocation}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: 30-Year Climate Normals City Comparator */}
      <div className="rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            1991–2020 WMO Standard Baseline
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Canadian City Climate Normals Comparator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare official 30-year climate averages, annual snowfall, and frost dates between any two Canadian cities.
          </p>
        </div>

        {/* City Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">City 1</label>
            <select
              value={city1Slug}
              onChange={(e) => setCity1Slug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {CITY_CLIMATE_NORMALS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.city} ({c.provinceCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">City 2</label>
            <select
              value={city2Slug}
              onChange={(e) => setCity2Slug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {CITY_CLIMATE_NORMALS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.city} ({c.provinceCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Climate Metric (1991–2020 Normals)</th>
                <th className="py-3 px-4 font-bold text-sky-400 text-center">
                  {city1.city} ({city1.provinceCode})
                </th>
                <th className="py-3 px-4 font-bold text-teal-400 text-center">
                  {city2.city} ({city2.provinceCode})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/[0.03]">
                <td className="py-3.5 px-4 font-medium text-slate-200">Mean Annual Temperature</td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-white">
                  {city1.meanAnnualTempC} °C
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-white">
                  {city2.meanAnnualTempC} °C
                </td>
              </tr>
              <tr className="hover:bg-white/[0.03]">
                <td className="py-3.5 px-4 font-medium text-slate-200">Average July Daytime High</td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-rose-400">
                  {city1.meanJulyHighC} °C
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-rose-400">
                  {city2.meanJulyHighC} °C
                </td>
              </tr>
              <tr className="hover:bg-white/[0.03]">
                <td className="py-3.5 px-4 font-medium text-slate-200">Average January Overnight Low</td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-cyan-400">
                  {city1.meanJanLowC} °C
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-cyan-400">
                  {city2.meanJanLowC} °C
                </td>
              </tr>
              <tr className="hover:bg-white/[0.03]">
                <td className="py-3.5 px-4 font-medium text-slate-200">Average Annual Snowfall</td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-sky-300">
                  {city1.annualSnowfallCm} cm
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-sky-300">
                  {city2.annualSnowfallCm} cm
                </td>
              </tr>
              <tr className="hover:bg-white/[0.03]">
                <td className="py-3.5 px-4 font-medium text-slate-200">Annual Sunshine Duration</td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-amber-300">
                  {city1.annualSunshineHours} hrs/yr
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-amber-300">
                  {city2.annualSunshineHours} hrs/yr
                </td>
              </tr>
              <tr className="hover:bg-white/[0.03]">
                <td className="py-3.5 px-4 font-medium text-slate-200">Frost-Free Season Length</td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-emerald-400">
                  {city1.frostFreeDays} days
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-center text-emerald-400">
                  {city2.frostFreeDays} days
                </td>
              </tr>
              <tr className="hover:bg-white/[0.03]">
                <td className="py-3.5 px-4 font-medium text-slate-200">Typical First Fall Frost</td>
                <td className="py-3.5 px-4 text-center text-slate-300">{city1.firstFallFrostDate}</td>
                <td className="py-3.5 px-4 text-center text-slate-300">{city2.firstFallFrostDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: Legendary Canadian Weather Disasters */}
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Historic Meteorological Events
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Canada&apos;s Legendary Weather Catastrophes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Case studies of the defining atmospheric events that reshaped Canadian emergency preparedness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HISTORIC_CANADIAN_WEATHER_EVENTS.map((event) => (
            <div
              key={event.id}
              className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl space-y-4 hover:border-rose-400/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {event.type}
                </span>
                <span className="text-xs font-mono font-bold text-white">{event.year}</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-white">{event.title}</h3>
                <div className="text-xs text-sky-400 mt-0.5">{event.province}</div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>{event.impactSummary}</p>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 space-y-1">
                  <div>
                    <strong className="text-white">Meteorological Trigger:</strong>{' '}
                    {event.meteorologicalCause}
                  </div>
                  <div>
                    <strong className="text-amber-300">Measured Extremes:</strong>{' '}
                    {event.measuredExtremes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
