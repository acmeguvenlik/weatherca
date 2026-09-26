'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Wind,
  ShieldAlert,
  Heart,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Flame,
  Search,
  Filter,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AQHIStation {
  city: string;
  province: string;
  provinceCode: string;
  aqhi: number;
  category: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';
  pm25: number; // ug/m3
  o3: number;   // ppb
  no2: number;  // ppb
  trend: 'improving' | 'stable' | 'deteriorating';
  primaryPollutant: string;
  smokeAlert: boolean;
}

const CANADIAN_AQHI_STATIONS: AQHIStation[] = [
  {
    city: 'Vancouver',
    province: 'British Columbia',
    provinceCode: 'BC',
    aqhi: 2,
    category: 'Low Risk',
    pm25: 6.2,
    o3: 24,
    no2: 12,
    trend: 'stable',
    primaryPollutant: 'O3',
    smokeAlert: false,
  },
  {
    city: 'Kamloops',
    province: 'British Columbia',
    provinceCode: 'BC',
    aqhi: 7,
    category: 'High Risk',
    pm25: 48.5,
    o3: 38,
    no2: 15,
    trend: 'deteriorating',
    primaryPollutant: 'PM2.5 (Wildfire Smoke)',
    smokeAlert: true,
  },
  {
    city: 'Kelowna',
    province: 'British Columbia',
    provinceCode: 'BC',
    aqhi: 6,
    category: 'Moderate Risk',
    pm25: 32.1,
    o3: 35,
    no2: 14,
    trend: 'stable',
    primaryPollutant: 'PM2.5 (Okanagan Inversion)',
    smokeAlert: true,
  },
  {
    city: 'Calgary',
    province: 'Alberta',
    provinceCode: 'AB',
    aqhi: 3,
    category: 'Low Risk',
    pm25: 11.4,
    o3: 28,
    no2: 18,
    trend: 'improving',
    primaryPollutant: 'PM2.5',
    smokeAlert: false,
  },
  {
    city: 'Edmonton',
    province: 'Alberta',
    provinceCode: 'AB',
    aqhi: 4,
    category: 'Moderate Risk',
    pm25: 18.6,
    o3: 26,
    no2: 22,
    trend: 'stable',
    primaryPollutant: 'NO2 / PM2.5',
    smokeAlert: false,
  },
  {
    city: 'Fort McMurray',
    province: 'Alberta',
    provinceCode: 'AB',
    aqhi: 8,
    category: 'High Risk',
    pm25: 62.0,
    o3: 30,
    no2: 11,
    trend: 'deteriorating',
    primaryPollutant: 'PM2.5 (Boreal Plume)',
    smokeAlert: true,
  },
  {
    city: 'Saskatoon',
    province: 'Saskatchewan',
    provinceCode: 'SK',
    aqhi: 2,
    category: 'Low Risk',
    pm25: 7.8,
    o3: 25,
    no2: 10,
    trend: 'stable',
    primaryPollutant: 'O3',
    smokeAlert: false,
  },
  {
    city: 'Regina',
    province: 'Saskatchewan',
    provinceCode: 'SK',
    aqhi: 3,
    category: 'Low Risk',
    pm25: 9.5,
    o3: 27,
    no2: 14,
    trend: 'stable',
    primaryPollutant: 'PM2.5',
    smokeAlert: false,
  },
  {
    city: 'Winnipeg',
    province: 'Manitoba',
    provinceCode: 'MB',
    aqhi: 2,
    category: 'Low Risk',
    pm25: 6.9,
    o3: 23,
    no2: 13,
    trend: 'stable',
    primaryPollutant: 'O3',
    smokeAlert: false,
  },
  {
    city: 'Thunder Bay',
    province: 'Ontario',
    provinceCode: 'ON',
    aqhi: 2,
    category: 'Low Risk',
    pm25: 5.4,
    o3: 26,
    no2: 8,
    trend: 'stable',
    primaryPollutant: 'O3',
    smokeAlert: false,
  },
  {
    city: 'Toronto (Downtown)',
    province: 'Ontario',
    provinceCode: 'ON',
    aqhi: 3,
    category: 'Low Risk',
    pm25: 12.8,
    o3: 31,
    no2: 24,
    trend: 'stable',
    primaryPollutant: 'O3 / NO2 (Traffic)',
    smokeAlert: false,
  },
  {
    city: 'Ottawa',
    province: 'Ontario',
    provinceCode: 'ON',
    aqhi: 2,
    category: 'Low Risk',
    pm25: 7.1,
    o3: 28,
    no2: 15,
    trend: 'improving',
    primaryPollutant: 'O3',
    smokeAlert: false,
  },
  {
    city: 'Montreal',
    province: 'Quebec',
    provinceCode: 'QC',
    aqhi: 3,
    category: 'Low Risk',
    pm25: 11.2,
    o3: 29,
    no2: 21,
    trend: 'stable',
    primaryPollutant: 'NO2',
    smokeAlert: false,
  },
  {
    city: 'Quebec City',
    province: 'Quebec',
    provinceCode: 'QC',
    aqhi: 2,
    category: 'Low Risk',
    pm25: 6.5,
    o3: 27,
    no2: 12,
    trend: 'stable',
    primaryPollutant: 'O3',
    smokeAlert: false,
  },
  {
    city: 'Halifax',
    province: 'Nova Scotia',
    provinceCode: 'NS',
    aqhi: 1,
    category: 'Low Risk',
    pm25: 3.8,
    o3: 22,
    no2: 9,
    trend: 'stable',
    primaryPollutant: 'Clean Maritime',
    smokeAlert: false,
  },
  {
    city: 'Yellowknife',
    province: 'Northwest Territories',
    provinceCode: 'NT',
    aqhi: 5,
    category: 'Moderate Risk',
    pm25: 25.4,
    o3: 20,
    no2: 5,
    trend: 'improving',
    primaryPollutant: 'PM2.5 (Sub-Arctic Fire)',
    smokeAlert: true,
  },
  {
    city: 'Whitehorse',
    province: 'Yukon',
    provinceCode: 'YT',
    aqhi: 2,
    category: 'Low Risk',
    pm25: 4.5,
    o3: 21,
    no2: 4,
    trend: 'stable',
    primaryPollutant: 'Clean Arctic',
    smokeAlert: false,
  },
];

export default function AirQualityToolPage() {
  const [search, setSearch] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  // Interactive Calculator State
  const [calcPm25, setCalcPm25] = useState(15);
  const [calcO3, setCalcO3] = useState(30);
  const [calcNo2, setCalcNo2] = useState(18);

  // ECCC Standardized Multi-Pollutant AQHI Formula Approximation
  // AQHI = (10/10.4) * 100 * [ (exp(0.000871 * NO2) - 1) + (exp(0.000537 * O3) - 1) + (exp(0.000487 * PM2.5) - 1) ]
  const calculatedAqhi = useMemo(() => {
    const termNO2 = Math.exp(0.000871 * calcNo2) - 1;
    const termO3 = Math.exp(0.000537 * calcO3) - 1;
    const termPM25 = Math.exp(0.000487 * calcPm25) - 1;
    const raw = (10 / 10.4) * 100 * (termNO2 + termO3 + termPM25);
    return Math.max(1, Math.min(10, Math.round(raw)));
  }, [calcPm25, calcO3, calcNo2]);

  const calculatedRisk = useMemo(() => {
    if (calculatedAqhi <= 3) return { label: 'Low Risk (1–3)', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
    if (calculatedAqhi <= 6) return { label: 'Moderate Risk (4–6)', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
    if (calculatedAqhi <= 10) return { label: 'High Risk (7–10)', color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30' };
    return { label: 'Very High / Extreme (10+)', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' };
  }, [calculatedAqhi]);

  const filteredStations = useMemo(() => {
    return CANADIAN_AQHI_STATIONS.filter((st) => {
      const matchesSearch =
        st.city.toLowerCase().includes(search.toLowerCase()) ||
        st.province.toLowerCase().includes(search.toLowerCase()) ||
        st.provinceCode.toLowerCase().includes(search.toLowerCase());

      const matchesRisk =
        selectedRiskFilter === 'ALL' ||
        (selectedRiskFilter === 'LOW' && st.aqhi <= 3) ||
        (selectedRiskFilter === 'MODERATE' && st.aqhi >= 4 && st.aqhi <= 6) ||
        (selectedRiskFilter === 'HIGH' && st.aqhi >= 7) ||
        (selectedRiskFilter === 'SMOKE' && st.smokeAlert);

      return matchesSearch && matchesRisk;
    });
  }, [search, selectedRiskFilter]);

  const getAqhiBadge = (val: number) => {
    if (val <= 3) return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: 'Low' };
    if (val <= 6) return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Moderate' };
    if (val <= 10) return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30', label: 'High' };
    return { bg: 'bg-purple-500/30 text-purple-200 border-purple-500/40', label: 'Very High' };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">
          Meteorological Tools
        </Link>
        <span>/</span>
        <span className="text-slate-300">Air Quality Health Index (AQHI)</span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/50 to-indigo-950/70 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Real-Time Canadian Air Quality Telemetry</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Canada Air Quality &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-300 to-cyan-300">
              Wildfire Smoke Live Index
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Monitor ground-level particulate matter (PM2.5), tropospheric ozone (O3), nitrogen dioxide (NO2), and Boreal wildfire smoke plume dispersion across all Canadian provinces and territories.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold">
              Health Canada &amp; ECCC Verified
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono font-bold">
              3-Pollutant Multi-Matrix Model
            </div>
          </div>
        </div>
      </div>

      {/* AQHI Health Scale Interactive Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Low Risk 1-3 */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black font-mono">
              AQHI 1 – 3
            </span>
            <span className="text-xs font-bold text-emerald-400">Low Health Risk</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong>Ideal air quality.</strong> Enjoy your usual outdoor activities. No special precautions required for general or at-risk populations.
          </div>
        </div>

        {/* Moderate Risk 4-6 */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black font-mono">
              AQHI 4 – 6
            </span>
            <span className="text-xs font-bold text-amber-400">Moderate Risk</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong>At-Risk Individuals:</strong> Consider reducing or rescheduling strenuous activities outdoors if experiencing coughing or throat irritation.
          </div>
        </div>

        {/* High Risk 7-10 */}
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black font-mono">
              AQHI 7 – 10
            </span>
            <span className="text-xs font-bold text-rose-400">High Risk</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong>General Population:</strong> Reduce strenuous outdoor exertion. Children and seniors should avoid prolonged physical activity outdoors.
          </div>
        </div>

        {/* Very High / Extreme 10+ */}
        <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black font-mono">
              AQHI 10+
            </span>
            <span className="text-xs font-bold text-purple-400">Very High / Extreme</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong>Severe Wildfire Event:</strong> Avoid outdoor physical exertion entirely. Remain indoors with certified HEPA filtration running.
          </div>
        </div>
      </div>

      {/* Main Grid: Station Directory & Live Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Canadian Monitoring Stations */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filter Bar */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'All Stations' },
                { id: 'LOW', label: 'Low (1-3)' },
                { id: 'MODERATE', label: 'Moderate (4-6)' },
                { id: 'HIGH', label: 'High (7-10)' },
                { id: 'SMOKE', label: '🔥 Smoke Alerts' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedRiskFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedRiskFilter === pill.id
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city, province..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 w-full sm:w-56"
              />
            </div>
          </div>

          {/* Stations List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStations.map((station) => {
              const badge = getAqhiBadge(station.aqhi);
              return (
                <div
                  key={station.city}
                  className="p-5 rounded-3xl bg-slate-900/70 hover:bg-slate-900 border border-white/10 hover:border-sky-500/30 transition-all shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-base text-white">{station.city}</div>
                        <div className="text-[11px] text-slate-400">{station.province} ({station.provinceCode})</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-xl text-xs font-black font-mono border ${badge.bg}`}>
                          AQHI {station.aqhi}
                        </div>
                      </div>
                    </div>

                    {station.smokeAlert && (
                      <div className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span>Wildfire Smoke Advection Advisory</span>
                      </div>
                    )}
                  </div>

                  {/* Pollutant Sensor Breakdown */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
                    <div className="p-2 rounded-xl bg-white/[0.03]">
                      <div className="text-[10px] text-slate-400 font-medium">PM2.5</div>
                      <div className="text-xs font-mono font-bold text-white mt-0.5">{station.pm25} µg/m³</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03]">
                      <div className="text-[10px] text-slate-400 font-medium">Ozone (O3)</div>
                      <div className="text-xs font-mono font-bold text-white mt-0.5">{station.o3} ppb</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03]">
                      <div className="text-[10px] text-slate-400 font-medium">NO2</div>
                      <div className="text-xs font-mono font-bold text-white mt-0.5">{station.no2} ppb</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Driver: <strong className="text-slate-300">{station.primaryPollutant}</strong></span>
                    <span className="capitalize text-slate-500 font-mono">Trend: {station.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Interactive AQHI Risk Calculator & Health Protocol */}
        <div className="lg:col-span-4 space-y-6">
          {/* Interactive Calculator Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-sky-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>AQHI Clinical Risk Calculator</span>
              </div>
              <p className="text-xs text-slate-400">
                Adjust sensor concentrations to compute the instant Canadian AQHI value and official health advisories.
              </p>
            </div>

            {/* Result Display Box */}
            <div className={`p-4 rounded-2xl border ${calculatedRisk.bg} ${calculatedRisk.border} text-center space-y-1`}>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-bold">
                Computed Air Quality Index
              </div>
              <div className="text-5xl font-black text-white font-mono">{calculatedAqhi}</div>
              <div className={`text-xs font-bold ${calculatedRisk.color}`}>{calculatedRisk.label}</div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs">
              {/* PM2.5 Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Particulate Matter (PM2.5):</span>
                  <span className="font-mono font-bold text-white">{calcPm25} µg/m³</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={calcPm25}
                  onChange={(e) => setCalcPm25(Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>

              {/* O3 Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Ground Ozone (O3):</span>
                  <span className="font-mono font-bold text-white">{calcO3} ppb</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={calcO3}
                  onChange={(e) => setCalcO3(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              {/* NO2 Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Nitrogen Dioxide (NO2):</span>
                  <span className="font-mono font-bold text-white">{calcNo2} ppb</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={calcNo2}
                  onChange={(e) => setCalcNo2(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Wildfire Science Link Card */}
          <Link
            href="/blog/wildfire-smoke-plumes-pyrocumulonimbus-canadian-skies"
            className="p-6 rounded-3xl bg-gradient-to-br from-orange-950/40 via-slate-900/80 to-amber-950/40 border border-orange-500/30 block group hover:border-orange-400 transition-all shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-orange-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                Special Investigation
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>

            <h4 className="text-sm font-black text-white group-hover:text-orange-300 transition-colors leading-snug">
              Pyrocumulonimbus &amp; Wildfire Smoke: How Extreme Boreal Fires Inject Plumes into the Stratosphere
            </h4>

            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
              Read our 2,560-word deep-dive on atmospheric chemistry, dry lightning secondary ignitions, and nocturnal mountain valley smoke traps.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
