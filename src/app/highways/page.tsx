'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  AlertTriangle,
  Snowflake,
  Wind,
  Eye,
  ShieldCheck,
  ExternalLink,
  Camera,
  Layers,
  Thermometer,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Info,
  Car,
} from 'lucide-react';
import {
  CANADIAN_MOUNTAIN_PASSES,
  WINTER_TIRE_LAWS,
  MountainPass,
} from '@/data/canadian-highways';

type ProvFilter = 'ALL' | 'BC' | 'AB' | 'ON' | 'QC' | 'NS' | 'YT';

export default function CanadianHighwaysPage() {
  const [selectedProv, setSelectedProv] = useState<ProvFilter>('ALL');
  const [conditionFilter, setConditionFilter] = useState<string>('ALL');
  const [selectedPassForModal, setSelectedPassForModal] = useState<MountainPass | null>(null);

  const filteredPasses = CANADIAN_MOUNTAIN_PASSES.filter((p) => {
    const matchesProv = selectedProv === 'ALL' || p.provinceCode === selectedProv;
    const matchesCond = conditionFilter === 'ALL' || p.roadCondition === conditionFilter;
    return matchesProv && matchesCond;
  });

  const criticalConditionsCount = CANADIAN_MOUNTAIN_PASSES.filter(
    (p) => p.roadCondition === 'Whiteout Blizzard' || p.roadCondition === 'Chains Required' || p.roadCondition === 'Black Ice Risk'
  ).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Highway & Mountain Pass Weather</span>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/60 to-slate-950 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
            <Car className="w-3.5 h-3.5 text-cyan-400" />
            Trans-Canada Highway & Mountain Pass Weather Dispatch
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Canadian Highway &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-200">
              Mountain Pass Conditions
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-time road surface temperatures, black ice detection, summit snowfall rates, avalanche hazards, and commercial tire chain alerts across the Coquihalla, Rogers Pass, Icefields Parkway, and Trans-Canada snowbelts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-slate-200">
              <Compass className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-white">10 Major Summits</span> Monitored
            </div>
            {criticalConditionsCount > 0 && (
              <div className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="font-bold text-white">{criticalConditionsCount} Severe Driving Alerts</span> Active
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        {/* Province Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {(['ALL', 'BC', 'AB', 'ON', 'QC', 'NS', 'YT'] as ProvFilter[]).map((prov) => {
            const label =
              prov === 'ALL'
                ? 'All Regions'
                : prov === 'BC'
                ? 'British Columbia'
                : prov === 'AB'
                ? 'Alberta'
                : prov === 'ON'
                ? 'Ontario'
                : prov === 'QC'
                ? 'Quebec'
                : prov === 'NS'
                ? 'Nova Scotia'
                : 'Yukon / North';
            const isActive = selectedProv === prov;
            return (
              <button
                key={prov}
                onClick={() => setSelectedProv(prov)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Condition Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 whitespace-nowrap">Condition:</span>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Conditions</option>
            <option value="Whiteout Blizzard">Whiteout Blizzard</option>
            <option value="Chains Required">Chains Required</option>
            <option value="Black Ice Risk">Black Ice Risk</option>
            <option value="Snow Packed">Snow Packed</option>
            <option value="Partly Icy">Partly Icy</option>
            <option value="Bare Dry">Bare Dry</option>
          </select>
        </div>
      </div>

      {/* Mountain Passes & Highway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPasses.map((pass) => {
          const isExtreme =
            pass.roadCondition === 'Whiteout Blizzard' ||
            pass.roadCondition === 'Chains Required' ||
            pass.roadCondition === 'Black Ice Risk';

          return (
            <div
              key={pass.id}
              className={`rounded-3xl bg-white/[0.05] border p-6 backdrop-blur-xl transition-all space-y-5 flex flex-col justify-between ${
                isExtreme
                  ? 'border-rose-500/40 shadow-xl shadow-rose-950/20'
                  : 'border-white/10 hover:border-sky-400/40'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-sky-300 border border-white/10">
                      {pass.highwayNumber} • {pass.provinceCode}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1.5 leading-snug">{pass.name}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap shrink-0 border ${
                      pass.roadCondition === 'Whiteout Blizzard'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                        : pass.roadCondition === 'Chains Required'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : pass.roadCondition === 'Black Ice Risk'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {pass.roadCondition}
                  </span>
                </div>

                {/* Warning notice if any */}
                {pass.warningNotice && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{pass.warningNotice}</span>
                  </div>
                )}

                {/* Webcam Preview Strip */}
                <div
                  onClick={() => setSelectedPassForModal(pass)}
                  className="relative h-36 w-full rounded-2xl overflow-hidden border border-white/10 cursor-pointer group"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${pass.webcamUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300">
                    <span className="font-mono flex items-center gap-1">
                      <Camera className="w-3 h-3 text-sky-400" />
                      {pass.webcamLocation}
                    </span>
                    <span className="text-white font-bold group-hover:underline">Expand View</span>
                  </div>
                </div>

                {/* Temperature & Road Sensor Telemetry */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                    <div className="text-[10px] text-slate-400">Ambient Air Temp</div>
                    <div className="text-base font-black text-white font-mono">
                      {pass.currentTempC > 0 ? `+${pass.currentTempC}` : pass.currentTempC} °C
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                    <div className="text-[10px] text-slate-400">Road Surface Sensor</div>
                    <div
                      className={`text-base font-black font-mono ${
                        pass.roadSurfaceTempC <= 0 ? 'text-cyan-300' : 'text-emerald-400'
                      }`}
                    >
                      {pass.roadSurfaceTempC > 0 ? `+${pass.roadSurfaceTempC}` : pass.roadSurfaceTempC} °C
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                    <div className="text-[10px] text-slate-400">Summit Snow 24h</div>
                    <div className="text-sm font-bold text-sky-300 font-mono">
                      {pass.snow24hCm > 0 ? `+${pass.snow24hCm} cm` : 'Trace'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                    <div className="text-[10px] text-slate-400">Peak Wind Gust</div>
                    <div className="text-sm font-bold text-amber-300 font-mono">
                      {pass.windGustKmH} km/h
                    </div>
                  </div>
                </div>

                {/* Elevation & Avalanche Status */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-3">
                  <span>
                    Summit: <strong className="text-white">{pass.elevationM} m</strong> ({pass.elevationFt} ft)
                  </span>
                  <span>
                    Avalanche Hazard:{' '}
                    <strong
                      className={
                        pass.avalancheRisk === 'High'
                          ? 'text-rose-400'
                          : pass.avalancheRisk === 'Considerable'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {pass.avalancheRisk}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Official 511 Dispatch Button */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <a
                  href={pass.officialAgencyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Official {pass.officialAgency} Feed</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {pass.chainLawActive && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Chains Mandated
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: Black Ice Sensor Science */}
      <div className="rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Understanding Road Temperature vs Ambient Air
            </h2>
            <p className="text-xs text-slate-400">
              Why 2°C on your car dashboard thermometer does not guarantee an unfrozen road.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300 leading-relaxed">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">Radiational Ground Cooling</h4>
            <p>
              On clear, calm winter nights, asphalt releases heat directly into the atmosphere faster than the surrounding air can replenish it. Even if ambient air registers +2°C, road surface temperatures often drop to -3°C.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">Thermal Inversion in Mountain Passes</h4>
            <p>
              Cold, dense Arctic air sinks into the lowest canyons and shaded bridge decks (e.g., Coquihalla Snowshed, Fraser Canyon). Elevated bridge decks freeze first because cold air circulates both above and underneath.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">Freezing Rain Glaze (Verglas)</h4>
            <p>
              When a warm Pacific airmass rides over an Arctic ground inversion, rain drops stay liquid aloft but flash-freeze instantaneously upon striking sub-zero pavement, producing invisible black ice.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Provincial Winter Tire Laws */}
      <div className="rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Canadian Transport Regulations
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Provincial Winter Tire Laws & Mandates
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ensure your vehicle is legally compliant before driving across Canadian provincial borders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WINTER_TIRE_LAWS.map((law) => (
            <div
              key={law.provinceCode}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-white">{law.provinceName}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    law.isMandatory
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-white/10 text-slate-400 border border-white/10'
                  }`}
                >
                  {law.isMandatory ? 'Mandatory' : 'Voluntary'}
                </span>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div>
                  <strong className="text-slate-400">Legal Window:</strong>
                  <div className="text-white font-medium">{law.legalPeriod}</div>
                </div>
                <div>
                  <strong className="text-slate-400">Minimum Tread:</strong>
                  <div className="text-white font-medium">{law.treadDepthMin}</div>
                </div>
                <div>
                  <strong className="text-slate-400">Certified Symbol:</strong>
                  <div className="text-sky-300 font-mono text-[11px]">{law.symbolRequired}</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 border-t border-white/5 pt-2 leading-relaxed">
                {law.finesSummary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Webcam Inspection Modal */}
      {selectedPassForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                  {selectedPassForModal.highwayNumber} • {selectedPassForModal.officialAgency}
                </span>
                <h3 className="text-lg font-black text-white">{selectedPassForModal.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPassForModal(null)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-white/10">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedPassForModal.webcamUrl})` }}
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 border border-white/10 text-xs font-mono text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Feed • Elevation {selectedPassForModal.elevationM}m</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
              <span>{selectedPassForModal.webcamLocation}</span>
              <a
                href={selectedPassForModal.officialAgencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Open {selectedPassForModal.officialAgency} Live Camera Feed</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
