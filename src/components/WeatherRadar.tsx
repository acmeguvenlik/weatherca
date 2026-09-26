'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  ZoomIn,
  ZoomOut,
  Radio,
  Maximize2,
  Minimize2,
  Wind,
  CloudRain,
  Eye,
  Sliders,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface WeatherRadarProps {
  lat: number;
  lon: number;
  cityName: string;
  provinceCode: string;
  initialLayer?: 'radar' | 'wildfire' | 'snow' | 'clouds' | 'lightning' | 'velocity';
}

export const WeatherRadar: React.FC<WeatherRadarProps> = ({
  lat,
  lon,
  cityName,
  provinceCode,
  initialLayer = 'radar',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'radar' | 'wildfire' | 'snow' | 'clouds' | 'lightning' | 'velocity'>(initialLayer);
  const [timelineStep, setTimelineStep] = useState(4); // 0 to 5
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1200); // 1200ms default
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRangeRings, setShowRangeRings] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showEchoLegend, setShowEchoLegend] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const timeLabels = ['-2h', '-90m', '-60m', '-30m', 'Live', '+30m Extrapolated'];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimelineStep((prev) => (prev + 1) % 6);
    }, playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.35, 2.4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.35, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-3xl bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950 p-4' : 'relative'
      }`}
    >
      {/* Radar Header Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <span>{cityName} Live Doppler Radar</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MSC Dual-Pol
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {cityName}, {provinceCode} • Lat: {lat.toFixed(2)}° N, Lon: {Math.abs(lon).toFixed(2)}° W • Sweep 10m
            </p>
          </div>
        </div>

        {/* Layer Selector & Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Layer tabs */}
          <div className="flex items-center flex-wrap p-1 rounded-xl bg-white/5 border border-white/10 text-xs gap-1">
            <button
              onClick={() => setActiveLayer('radar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeLayer === 'radar'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Precip (dBZ)
            </button>
            <button
              onClick={() => setActiveLayer('wildfire')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeLayer === 'wildfire'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/25 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 Smoke &amp; PM2.5
            </button>
            <button
              onClick={() => setActiveLayer('snow')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeLayer === 'snow'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ❄️ Snow Depth
            </button>
            <button
              onClick={() => setActiveLayer('lightning')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeLayer === 'lightning'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Lightning
            </button>
            <button
              onClick={() => setActiveLayer('clouds')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeLayer === 'clouds'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ Satellite IR
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-slate-300">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-400 min-w-[34px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-lg text-[10px] font-bold hover:bg-white/10 hover:text-white text-slate-400"
              title="Reset Zoom"
            >
              1:1
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Map View with Animated Radar Overlay */}
      <div
        className={`relative w-full bg-slate-950 overflow-hidden select-none transition-all duration-300 ${
          isFullscreen ? 'h-[calc(100vh-160px)]' : 'h-[440px] sm:h-[520px]'
        }`}
      >
        {/* Radar Map Canvas Background with simulated satellite topography */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out filter contrast-125 brightness-90"
          style={{
            transform: `scale(${zoomLevel})`,
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.45) 0%, rgba(2, 6, 23, 0.95) 100%), url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        {/* Dynamic Storm Layer dependent on activeLayer */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-1000 ease-out"
          style={{
            transform: `scale(${zoomLevel * (1 + timelineStep * 0.03)}) translate(${
              timelineStep * 6 - 15
            }px, -${timelineStep * 4 - 10}px)`,
          }}
        >
          {/* Layer 1: Reflectivity (dBZ Precipitation) */}
          {activeLayer === 'radar' && (
            <div className="absolute inset-0 opacity-75 mix-blend-screen">
              {/* Rain bands */}
              <div className="absolute top-[32%] left-[42%] w-60 h-60 rounded-full bg-gradient-to-tr from-emerald-500/50 via-teal-400/40 to-yellow-400/35 blur-3xl animate-pulse" />
              {/* Severe storm core with heavy rain & snow */}
              <div className="absolute top-[36%] left-[48%] w-36 h-36 rounded-full bg-gradient-to-br from-amber-400/60 via-red-500/50 to-purple-600/40 blur-2xl" />
              {/* Leading edge squall line */}
              <div className="absolute top-[22%] left-[58%] w-72 h-44 rounded-full bg-gradient-to-l from-cyan-400/40 via-blue-500/30 to-transparent blur-3xl" />
              {/* Secondary shower pocket */}
              <div className="absolute top-[52%] left-[30%] w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-400/30 to-cyan-500/20 blur-2xl" />
            </div>
          )}

          {/* Layer 2: Wildfire Smoke & PM2.5 Plume */}
          {activeLayer === 'wildfire' && (
            <div className="absolute inset-0 opacity-80 mix-blend-screen">
              <div className="absolute top-[26%] left-[38%] w-80 h-80 rounded-full bg-gradient-to-tr from-amber-600/60 via-red-600/50 to-purple-800/40 blur-3xl animate-pulse" />
              <div className="absolute top-[32%] left-[45%] w-48 h-48 rounded-full bg-red-600/70 blur-2xl" />
              <div className="absolute top-[18%] left-[55%] w-96 h-48 rounded-full bg-gradient-to-r from-orange-500/40 via-amber-600/30 to-transparent blur-3xl" />
            </div>
          )}

          {/* Layer 3: Snow Depth & Winter Accumulation */}
          {activeLayer === 'snow' && (
            <div className="absolute inset-0 opacity-85 mix-blend-screen">
              <div className="absolute top-[20%] left-[30%] w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-400/50 via-blue-500/40 to-indigo-600/30 blur-3xl" />
              <div className="absolute top-[28%] left-[44%] w-56 h-56 rounded-full bg-white/60 blur-2xl" />
              <div className="absolute top-[48%] left-[25%] w-64 h-64 rounded-full bg-cyan-300/40 blur-3xl" />
            </div>
          )}

          {/* Layer 4: Real-time Lightning Strike Clusters */}
          {activeLayer === 'lightning' && (
            <div className="absolute inset-0">
              {/* Flashing lightning flash circles */}
              <div className="absolute top-[34%] left-[46%] w-8 h-8 rounded-full bg-yellow-300 shadow-[0_0_25px_#facc15] animate-ping" />
              <div className="absolute top-[38%] left-[52%] w-6 h-6 rounded-full bg-amber-400 shadow-[0_0_20px_#fbbf24] animate-pulse" />
              <div className="absolute top-[28%] left-[60%] w-7 h-7 rounded-full bg-yellow-200 shadow-[0_0_30px_#fef08a] animate-ping" />
              <div className="absolute top-[45%] left-[38%] w-5 h-5 rounded-full bg-amber-300 shadow-[0_0_15px_#fcd34d] animate-pulse" />
            </div>
          )}

          {/* Layer 5: Base Velocity (Doppler Winds) */}
          {activeLayer === 'velocity' && (
            <div className="absolute inset-0 opacity-80 mix-blend-screen">
              {/* Inbound winds (greens/cyans) */}
              <div className="absolute top-[30%] left-[35%] w-72 h-72 rounded-full bg-gradient-to-r from-emerald-500/60 via-cyan-400/50 to-transparent blur-2xl" />
              {/* Outbound winds (reds/oranges) */}
              <div className="absolute top-[30%] left-[50%] w-72 h-72 rounded-full bg-gradient-to-l from-rose-500/60 via-amber-400/50 to-transparent blur-2xl" />
              {/* Velocity Couplet Shear Zone */}
              <div className="absolute top-[35%] left-[47%] w-16 h-16 rounded-full bg-white/40 blur-md animate-ping opacity-50" />
            </div>
          )}

          {/* Layer 6: Satellite IR Clouds */}
          {activeLayer === 'clouds' && (
            <div className="absolute inset-0 opacity-70 mix-blend-screen">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-400/20 via-sky-300/30 to-indigo-300/25 blur-3xl" />
              <div className="absolute top-[20%] left-[25%] w-[500px] h-[300px] rounded-full bg-white/30 blur-3xl" />
              <div className="absolute top-[40%] left-[45%] w-[400px] h-[350px] rounded-full bg-cyan-200/25 blur-3xl" />
            </div>
          )}
        </div>

        {/* Radar Range Rings & Crosshairs */}
        {showRangeRings && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* 75 km inner ring */}
            <div
              className="rounded-full border border-sky-400/25 transition-all duration-300"
              style={{ width: `${140 * zoomLevel}px`, height: `${140 * zoomLevel}px` }}
            />
            {/* 150 km middle ring */}
            <div
              className="rounded-full border border-sky-400/20 transition-all duration-300 absolute"
              style={{ width: `${280 * zoomLevel}px`, height: `${280 * zoomLevel}px` }}
            />
            {/* 250 km outer Doppler limit ring */}
            <div
              className="rounded-full border border-white/10 transition-all duration-300 absolute"
              style={{ width: `${420 * zoomLevel}px`, height: `${420 * zoomLevel}px` }}
            />
            {/* Doppler Crosshairs */}
            <div className="absolute w-full h-[1px] bg-white/[0.04]" />
            <div className="absolute h-full w-[1px] bg-white/[0.04]" />

            {/* Range annotations */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-sky-400" />
              <span>Doppler Beam: 250 km Radius</span>
            </div>
          </div>
        )}

        {/* Center Station / City Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-sky-400 animate-ping absolute opacity-60" />
            <div className="w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white shadow-xl relative z-10" />
          </div>
          <div className="mt-1.5 px-3 py-1 rounded-lg bg-slate-950/90 border border-sky-400/30 text-white font-bold text-xs shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{cityName}, {provinceCode}</span>
          </div>
        </div>

        {/* Compass Cardinal Points */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-500 pointer-events-none">
          N 0°
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-500 pointer-events-none">
          S 180°
        </div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 pointer-events-none">
          W 270°
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 pointer-events-none">
          E 90°
        </div>

        {/* Dynamic Legend Panel */}
        {showEchoLegend && (
          <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-slate-950/85 border border-white/10 backdrop-blur-md text-[11px] text-slate-300 max-w-xs shadow-xl">
            {activeLayer === 'radar' && (
              <>
                <div className="font-semibold text-white mb-1.5 flex items-center justify-between">
                  <span>Precipitation Reflectivity (dBZ)</span>
                  <span className="text-[10px] text-slate-400 font-mono">MSC 5.6 GHz</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] mb-1.5">
                  <span className="w-4 h-2 rounded-sm bg-blue-400" title="10-20 dBZ (Light Drizzle / Flurries)" />
                  <span className="w-4 h-2 rounded-sm bg-emerald-400" title="20-30 dBZ (Moderate Rain)" />
                  <span className="w-4 h-2 rounded-sm bg-yellow-400" title="30-40 dBZ (Heavy Rain)" />
                  <span className="w-4 h-2 rounded-sm bg-amber-500" title="40-50 dBZ (Very Heavy / Squall)" />
                  <span className="w-4 h-2 rounded-sm bg-red-600" title="50-60 dBZ (Torrential / Hail)" />
                  <span className="w-4 h-2 rounded-sm bg-purple-600" title="60+ dBZ (Severe Thunderstorm)" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Flurries / Drizzle</span>
                  <span>Heavy Snow / Hail</span>
                </div>
              </>
            )}

            {activeLayer === 'wildfire' && (
              <>
                <div className="font-semibold text-white mb-1.5 flex items-center justify-between">
                  <span>Wildfire Smoke &amp; PM2.5 (µg/m³)</span>
                  <span className="text-[10px] text-red-400 font-mono">FireSmoke CA</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] mb-1.5">
                  <span className="w-4 h-2 rounded-sm bg-yellow-400" title="10-25 µg/m³ (Moderate)" />
                  <span className="w-4 h-2 rounded-sm bg-amber-500" title="25-50 µg/m³ (Unhealthy for sensitive)" />
                  <span className="w-4 h-2 rounded-sm bg-red-600" title="50-100 µg/m³ (Unhealthy)" />
                  <span className="w-4 h-2 rounded-sm bg-purple-700" title="100+ µg/m³ (Hazardous Plume)" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Light Haze</span>
                  <span>Hazardous Plume</span>
                </div>
              </>
            )}

            {activeLayer === 'snow' && (
              <>
                <div className="font-semibold text-white mb-1.5 flex items-center justify-between">
                  <span>Snow Depth &amp; Accumulation (cm)</span>
                  <span className="text-[10px] text-cyan-400 font-mono">SNODAS Model</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] mb-1.5">
                  <span className="w-4 h-2 rounded-sm bg-blue-300" title="5-15 cm" />
                  <span className="w-4 h-2 rounded-sm bg-cyan-400" title="15-40 cm" />
                  <span className="w-4 h-2 rounded-sm bg-blue-600" title="40-80 cm" />
                  <span className="w-4 h-2 rounded-sm bg-indigo-700" title="80-150 cm" />
                  <span className="w-4 h-2 rounded-sm bg-white" title="150+ cm Deep Pack" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>5 cm Dusting</span>
                  <span>150+ cm Deep Pack</span>
                </div>
              </>
            )}

            {activeLayer === 'lightning' && (
              <>
                <div className="font-semibold text-white mb-1.5 flex items-center justify-between">
                  <span>Canadian Lightning Detection Network</span>
                  <span className="text-[10px] text-yellow-400 font-mono">CLDN Feed</span>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping" />
                  <span>Cloud-to-Ground Strikes in last 15 mins</span>
                </div>
              </>
            )}

            {activeLayer === 'velocity' && (
              <>
                <div className="font-semibold text-white mb-1.5 flex items-center justify-between">
                  <span>Radial Wind Velocity (km/h)</span>
                  <span className="text-[10px] text-amber-400 font-mono">Shear Detection</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] mb-1.5">
                  <span className="w-4 h-2 rounded-sm bg-emerald-500" title="Inbound (-60 km/h)" />
                  <span className="w-4 h-2 rounded-sm bg-cyan-400" title="Inbound (-20 km/h)" />
                  <span className="w-4 h-2 rounded-sm bg-slate-400" title="Zero relative" />
                  <span className="w-4 h-2 rounded-sm bg-amber-400" title="Outbound (+20 km/h)" />
                  <span className="w-4 h-2 rounded-sm bg-rose-500" title="Outbound (+60 km/h)" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400">Towards Radar</span>
                  <span className="text-rose-400">Away from Radar</span>
                </div>
              </>
            )}

            {activeLayer === 'clouds' && (
              <>
                <div className="font-semibold text-white mb-1">GOES Infrared Cloud Temperature</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Warm Low Stratus</span>
                  <span>Cold Deep Cirrus (-60°C)</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Playback & Timeline Controls */}
      <div className="p-4 bg-slate-950/90 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Play/Pause Button & Frame indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center transition-colors shadow-lg shadow-sky-500/20 shrink-0"
            title={isPlaying ? 'Pause radar loop' : 'Play radar loop'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{timeLabels[timelineStep]}</span>
              {timelineStep === 4 && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {timelineStep === 5 ? 'High-Res Nowcast Extrapolation' : `Frame ${timelineStep + 1} of 6`}
            </div>
          </div>

          {/* Speed Toggle */}
          <div className="ml-auto md:ml-2 flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px]">
            <button
              onClick={() => setPlaybackSpeed(1800)}
              className={`px-2 py-1 rounded font-mono ${
                playbackSpeed === 1800 ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              0.5x
            </button>
            <button
              onClick={() => setPlaybackSpeed(1200)}
              className={`px-2 py-1 rounded font-mono ${
                playbackSpeed === 1200 ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1.0x
            </button>
            <button
              onClick={() => setPlaybackSpeed(700)}
              className={`px-2 py-1 rounded font-mono ${
                playbackSpeed === 700 ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2.0x
            </button>
          </div>
        </div>

        {/* Interactive Step Slider */}
        <div className="flex items-center gap-1.5 w-full md:w-auto justify-center overflow-x-auto py-1">
          {timeLabels.map((lbl, idx) => (
            <button
              key={lbl}
              onClick={() => {
                setTimelineStep(idx);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                timelineStep === idx
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 ring-1 ring-white/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Ring & Legend Toggles */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button
            onClick={() => setShowRangeRings(!showRangeRings)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
              showRangeRings
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Rings
          </button>
          <button
            onClick={() => setShowEchoLegend(!showEchoLegend)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
              showEchoLegend
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Legend
          </button>
        </div>
      </div>
    </div>
  );
};
