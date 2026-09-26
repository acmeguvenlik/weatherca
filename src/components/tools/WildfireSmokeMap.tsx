'use client';

import React, { useState } from 'react';
import {
  Flame,
  Wind,
  ShieldAlert,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Compass,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  CANADIAN_WILDFIRES,
  SMOKE_FORECAST_ZONES,
  WildfireIncident,
} from '@/data/canadian-wildfires';

export function WildfireSmokeMap() {
  const [selectedFire, setSelectedFire] = useState<WildfireIncident | null>(CANADIAN_WILDFIRES[0]);
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [forecastHour, setForecastHour] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Interactive timeline simulation
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setForecastHour((prev) => (prev >= 48 ? 0 : prev + 6));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const filteredFires = CANADIAN_WILDFIRES.filter((fire) => {
    if (selectedProvince !== 'ALL' && fire.provinceCode !== selectedProvince) return false;
    if (filterStatus !== 'ALL' && fire.status !== filterStatus) return false;
    return true;
  });

  const totalActiveHectares = CANADIAN_WILDFIRES.reduce((acc, f) => acc + f.hectares, 0);
  const outOfControlCount = CANADIAN_WILDFIRES.filter((f) => f.status === 'out-of-control').length;

  return (
    <div className="space-y-8">
      {/* Top Banner & National Wildfire Stat Tracker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-500/10 via-slate-900/50 to-slate-900 border border-red-500/20 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-1">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Active Incidents</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{CANADIAN_WILDFIRES.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            {outOfControlCount} Out of Control
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/50 to-slate-900 border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <Activity className="w-4 h-4 text-amber-500" />
            <span>Total Area Burned</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {(totalActiveHectares / 1000).toFixed(1)}k <span className="text-xs text-slate-400 font-semibold">ha</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">~{(totalActiveHectares * 0.01).toFixed(0)} km² tracked</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-slate-900/50 to-slate-900 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
            <Wind className="w-4 h-4 text-purple-400" />
            <span>Peak PM2.5 Concentration</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300">
            185 <span className="text-xs text-slate-400 font-semibold">µg/m³</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Northern BC Smoke Plume</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-slate-900/50 to-slate-900 border border-sky-500/20 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <span>Evacuation Alerts</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {CANADIAN_WILDFIRES.filter((f) => f.evacuationStatus !== 'none').length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> CWFIS &amp; FireSmoke CA Feed
          </div>
        </div>
      </div>

      {/* Main Map & Interactive Simulation Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 border border-white/10 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          {/* Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 z-10 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Canada Live Fire &amp; Smoke Dispersion
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-wider border border-red-500/30">
                +{forecastHour}h Model
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 text-xs">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="bg-slate-800 border border-white/10 text-white rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Canada</option>
                <option value="BC">British Columbia</option>
                <option value="AB">Alberta</option>
                <option value="SK">Saskatchewan</option>
                <option value="ON">Ontario</option>
                <option value="QC">Quebec</option>
                <option value="NT">NWT</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800 border border-white/10 text-white rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="out-of-control">Out of Control</option>
                <option value="being-held">Being Held</option>
                <option value="under-control">Under Control</option>
              </select>
            </div>
          </div>

          {/* Graphical Map Representation of Canada */}
          <div className="relative flex-1 w-full my-4 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-white/5 overflow-hidden flex items-center justify-center p-4">
            {/* Animated atmospheric smoke haze layers */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
              style={{
                background: `radial-gradient(ellipse at 35% 45%, rgba(220, 38, 38, ${0.15 + (forecastHour / 48) * 0.1}), transparent 60%),
                             radial-gradient(ellipse at 42% 50%, rgba(245, 158, 11, ${0.2 + (forecastHour / 48) * 0.15}), transparent 50%),
                             radial-gradient(ellipse at 60% 65%, rgba(168, 85, 247, 0.1), transparent 50%)`,
              }}
            />

            {/* Geographical SVG Grid Background */}
            <svg viewBox="0 0 1000 550" className="w-full h-auto max-h-[380px] drop-shadow-lg select-none">
              <defs>
                <linearGradient id="smokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
                </linearGradient>
                <filter id="smokeBlur">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>

              {/* Approximate Canadian Landmass Path Silhouette */}
              <path
                d="M 120 180 Q 250 140 400 150 Q 550 120 700 160 Q 820 180 900 280 Q 860 380 750 420 Q 620 440 500 450 Q 350 460 200 430 Q 130 380 120 280 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.9"
              />

              {/* Dynamic Simulated Smoke Plumes expanding with forecastHour */}
              <ellipse
                cx={280 + forecastHour * 2.2}
                cy={220 + forecastHour * 0.8}
                rx={60 + forecastHour * 1.8}
                ry={35 + forecastHour * 1.2}
                fill="url(#smokeGradient)"
                filter="url(#smokeBlur)"
                className="transition-all duration-700 opacity-70"
              />
              <ellipse
                cx={360 + forecastHour * 1.8}
                cy={250 + forecastHour * 1.1}
                rx={70 + forecastHour * 1.5}
                ry={40 + forecastHour * 0.9}
                fill="url(#smokeGradient)"
                filter="url(#smokeBlur)"
                className="transition-all duration-700 opacity-60"
              />

              {/* Render Wildfire Pins */}
              {filteredFires.map((fire) => {
                // Map lat/lon coordinates to SVG canvas space (approximate Canada projection)
                // lon: -140 (west) to -55 (east) -> map to x: 100 to 900
                // lat: 65 (north) to 42 (south) -> map to y: 120 to 460
                const x = ((fire.lon - -140) / ( -55 - -140 )) * 800 + 100;
                const y = ((65 - fire.lat) / ( 65 - 42 )) * 340 + 120;
                const isSelected = selectedFire?.id === fire.id;

                return (
                  <g
                    key={fire.id}
                    onClick={() => setSelectedFire(fire)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing radius circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 18 : 12}
                      fill={fire.status === 'out-of-control' ? '#ef4444' : fire.status === 'being-held' ? '#f59e0b' : '#10b981'}
                      fillOpacity={isSelected ? 0.35 : 0.2}
                      className={fire.status === 'out-of-control' ? 'animate-ping' : ''}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 9 : 6}
                      fill={fire.status === 'out-of-control' ? '#ef4444' : fire.status === 'being-held' ? '#f59e0b' : '#10b981'}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    {/* Tooltip text */}
                    <text
                      x={x + 12}
                      y={y + 4}
                      fill="#f8fafc"
                      fontSize={isSelected ? "11" : "9"}
                      fontWeight={isSelected ? "bold" : "600"}
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {fire.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md text-[10px] space-y-1 text-slate-300">
              <div className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">Status Legend</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Out of Control</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Being Held</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Under Control</span>
              </div>
            </div>
          </div>

          {/* Timeline Playback Bar */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Smoke Dispersion'}</span>
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setForecastHour(0);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset Timeline"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Slider */}
            <div className="flex-1 w-full max-w-md flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold shrink-0">Now</span>
              <input
                type="range"
                min="0"
                max="48"
                step="6"
                value={forecastHour}
                onChange={(e) => setForecastHour(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="text-xs text-sky-400 font-bold shrink-0">+{forecastHour}h Forecast</span>
            </div>
          </div>
        </div>

        {/* Detail Panel: Selected Incident & Smoke Exposure */}
        <div className="lg:col-span-4 space-y-4">
          {selectedFire ? (
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                    Incident ID: {selectedFire.id}
                  </div>
                  <h4 className="text-lg font-black text-white leading-tight mt-0.5">{selectedFire.name}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedFire.province}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                    selectedFire.status === 'out-of-control'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : selectedFire.status === 'being-held'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {selectedFire.status.replace(/-/g, ' ')}
                </span>
              </div>

              {/* Vital Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Estimated Size</span>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {selectedFire.hectares.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ha</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Fire Danger Rating</span>
                  <div
                    className={`text-base font-extrabold mt-0.5 ${
                      selectedFire.dangerRating === 'Extreme'
                        ? 'text-red-400'
                        : selectedFire.dangerRating === 'Very High'
                        ? 'text-amber-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {selectedFire.dangerRating}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Plume PM2.5</span>
                  <div className="text-base font-extrabold text-purple-300 mt-0.5">
                    {selectedFire.pm25Level} <span className="text-xs text-slate-400 font-normal">µg/m³</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Local AQHI Risk</span>
                  <div className="text-base font-extrabold text-red-400 mt-0.5">
                    {selectedFire.aqhiRating}/10+
                  </div>
                </div>
              </div>

              {/* Settlement Proximity & Stage */}
              <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Closest Community:</span>
                  <span className="font-bold text-white">
                    {selectedFire.closestSettlement} (~{selectedFire.distanceKm} km)
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Tactical Stage:</span>
                  <span className="font-medium text-slate-200">{selectedFire.stageOfControl}</span>
                </div>
              </div>

              {/* Evacuation Alert Bar if active */}
              {selectedFire.evacuationStatus !== 'none' && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs font-medium ${
                    selectedFire.evacuationStatus === 'order'
                      ? 'bg-red-500/15 border-red-500/40 text-red-200'
                      : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block">
                      Evacuation {selectedFire.evacuationStatus === 'order' ? 'Order Active' : 'Alert In Effect'}
                    </span>
                    <span className="text-[11px] opacity-90">
                      Residents in proximity to {selectedFire.closestSettlement} must remain prepared for rapid evacuation.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 text-center text-slate-400 text-sm">
              Select an incident on the map to inspect live fire telemetry.
            </div>
          )}

          {/* Regional Smoke Outlook Quick Zones */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-3">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              Regional Smoke Risk Outlook
            </h4>
            <div className="space-y-2">
              {SMOKE_FORECAST_ZONES.slice(0, 3).map((zone) => (
                <div
                  key={zone.id}
                  className="p-3 rounded-2xl bg-slate-950/50 border border-white/5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{zone.region}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        zone.currentAQHI >= 7
                          ? 'bg-red-500/20 text-red-300'
                          : zone.currentAQHI >= 4
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      AQHI {zone.currentAQHI} ({zone.advisoryLevel})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{zone.healthRecommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
