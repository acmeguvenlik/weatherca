'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  Moon,
  Eye,
  Camera,
  Layers,
  ArrowLeft,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface AuroraCity {
  city: string;
  territory: string;
  lat: number;
  cloudCoverTonightPercent: number;
  viewingScore: 'Exceptional' | 'High' | 'Moderate' | 'Low' | 'Obscured';
  bestTime: string;
  darkSkyPreserve: boolean;
  notes: string;
}

const AURORA_CITIES: AuroraCity[] = [
  {
    city: 'Yellowknife',
    territory: 'Northwest Territories',
    lat: 62.454,
    cloudCoverTonightPercent: 12,
    viewingScore: 'Exceptional',
    bestTime: '11:00 PM – 2:30 AM',
    darkSkyPreserve: true,
    notes: 'Directly under the auroral oval. Crystal clear sub-arctic skies tonight.',
  },
  {
    city: 'Whitehorse',
    territory: 'Yukon',
    lat: 60.7212,
    cloudCoverTonightPercent: 25,
    viewingScore: 'High',
    bestTime: '11:30 PM – 3:00 AM',
    darkSkyPreserve: false,
    notes: 'Low humidity and stable atmosphere over the Yukon valley.',
  },
  {
    city: 'Churchill',
    territory: 'Manitoba',
    lat: 58.7684,
    cloudCoverTonightPercent: 30,
    viewingScore: 'High',
    bestTime: '10:45 PM – 2:00 AM',
    darkSkyPreserve: true,
    notes: 'Hudson Bay coastline provides open northern horizon without light pollution.',
  },
  {
    city: 'Jasper (Dark Sky Preserve)',
    territory: 'Alberta',
    lat: 52.8737,
    cloudCoverTonightPercent: 18,
    viewingScore: 'High',
    bestTime: '12:00 AM – 3:30 AM',
    darkSkyPreserve: true,
    notes: 'World second-largest dark sky preserve. Zero light interference.',
  },
  {
    city: 'Fort McMurray',
    territory: 'Alberta',
    lat: 56.7264,
    cloudCoverTonightPercent: 40,
    viewingScore: 'Moderate',
    bestTime: '11:15 PM – 2:45 AM',
    darkSkyPreserve: false,
    notes: 'Patchy cloud cover drifting south from Lake Athabasca.',
  },
  {
    city: 'Dawson City',
    territory: 'Yukon',
    lat: 64.0601,
    cloudCoverTonightPercent: 15,
    viewingScore: 'Exceptional',
    bestTime: '10:30 PM – 2:00 AM',
    darkSkyPreserve: true,
    notes: 'Midnight Dome overlook provides a 360-degree panorama of dancing green ribbons.',
  },
  {
    city: 'Iqaluit',
    territory: 'Nunavut',
    lat: 63.7467,
    cloudCoverTonightPercent: 55,
    viewingScore: 'Moderate',
    bestTime: '11:00 PM – 2:00 AM',
    darkSkyPreserve: false,
    notes: 'Frobisher Bay marine cloud patches intermittent between midnight hours.',
  },
];

export default function AuroraPage() {
  const [currentKp, setCurrentKp] = useState<number>(4.3);

  const getStormLevel = (kp: number) => {
    if (kp < 2) return { text: 'Quiet Geomagnetic Field', color: 'text-slate-400', badge: 'Kp 0-2' };
    if (kp < 3) return { text: 'Unsettled Conditions', color: 'text-sky-300', badge: 'Kp 2-3' };
    if (kp < 4.5) return { text: 'Active Geomagnetic Field', color: 'text-emerald-400', badge: 'Kp 4' };
    if (kp < 6) return { text: 'Minor Geomagnetic Storm (G1)', color: 'text-amber-400', badge: 'G1 Storm' };
    if (kp < 7) return { text: 'Moderate Storm (G2)', color: 'text-orange-400', badge: 'G2 Storm' };
    return { text: 'Strong to Severe Storm (G3+)', color: 'text-rose-400', badge: 'G3+ Storm' };
  };

  const getVisibilityLatitude = (kp: number) => {
    if (kp < 2) return '66°N (Arctic Circle & Far North)';
    if (kp < 3) return '62°N (Yellowknife, Dawson, Whitehorse)';
    if (kp < 4) return '58°N (Fort McMurray, Churchill, Peace River)';
    if (kp < 5) return '54°N (Edmonton, Prince George, Saskatoon)';
    if (kp < 6) return '50°N (Calgary, Regina, Winnipeg, Thunder Bay)';
    return '45°N and below (Toronto, Ottawa, Montreal, Vancouver)';
  };

  const status = getStormLevel(currentKp);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Weather Tools</span>
        <span>/</span>
        <span className="text-slate-300">Northern Lights (Aurora Borealis) Tracker</span>
      </div>

      {/* Hero Banner with Aurora Ambience */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/40 to-cyan-950/50 border border-emerald-500/20 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Canadian Auroral Oval Live Forecast
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Northern Lights <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">(Aurora Borealis)</span> Tracker
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-time planetary Kp-index, geomagnetic storm tracking, and tonight&apos;s sky cloud cover index for Canada&apos;s premier dark sky preserves and northern auroral oval destinations.
          </p>
        </div>
      </div>

      {/* Kp-Index Interactive Gauge & Storm Scale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Kp Gauge Card */}
        <div className="lg:col-span-2 rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Planetary K-Index</div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">Geomagnetic Activity Index</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${status.color} bg-white/5 border-white/10`}>
                {status.badge}
              </span>
            </div>
          </div>

          {/* Big Kp Display */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-center sm:text-left">
              <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400">
                {currentKp.toFixed(1)}
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">Scale: 0.0 (Calm) to 9.0 (Extreme)</div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className={`text-base sm:text-lg font-bold ${status.color}`}>
                {status.text}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                Southern viewing boundary tonight reaches down to approximately{' '}
                <strong className="text-white">{getVisibilityLatitude(currentKp)}</strong>.
              </div>
            </div>
          </div>

          {/* Kp Planetary Storm Level Selector */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Planetary Kp Storm Index:</span>
              <span className="text-emerald-300 font-mono font-bold">Kp {currentKp.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.1"
              value={currentKp}
              onChange={(e) => setCurrentKp(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Quiet)</span>
              <span>3 (Unsettled)</span>
              <span>5 (G1 Storm)</span>
              <span>7 (G3 Storm)</span>
              <span>9 (Extreme)</span>
            </div>
          </div>
        </div>

        {/* Viewing Window Advice */}
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Clock className="w-4 h-4" />
              Peak Viewing Window
            </div>

            <h3 className="text-xl font-bold text-white">Tonight&apos;s Prime Window</h3>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
              <div className="text-2xl font-extrabold text-white">10:30 PM – 3:00 AM</div>
              <div className="text-xs text-slate-300 mt-1">Local Magnetic Midnight (~1:15 AM) is peak intensity</div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-slate-400" />
                <span>Moon Phase: Waning Crescent (Ideal dark sky)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dark Sky Preserves: Maximum clarity</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400">
            Tip: Allow your eyes 20 minutes to adapt to total darkness without looking at phone screens.
          </div>
        </div>
      </div>

      {/* Canadian Aurora Destinations Sky Report */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Tonight&apos;s Canadian Aurora Hotspots & Cloud Cover
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live night sky clarity forecast across Canada&apos;s sub-arctic and mountain dark sky preserves
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AURORA_CITIES.map((item) => {
            const isExceptional = item.viewingScore === 'Exceptional';
            return (
              <div
                key={item.city}
                className="rounded-3xl bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 p-6 transition-all duration-300 backdrop-blur-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {item.territory} ({item.lat.toFixed(1)}°N)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isExceptional
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {item.viewingScore}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white">{item.city}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.notes}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Cloud Cover</div>
                      <div className="text-base font-black text-cyan-300 mt-0.5">
                        {item.cloudCoverTonightPercent}%
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Best Window</div>
                      <div className="text-xs font-bold text-white mt-1 truncate">
                        {item.bestTime}
                      </div>
                    </div>
                  </div>
                </div>

                {item.darkSkyPreserve && (
                  <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-300 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Official UNESCO / RASC Dark Sky Sanctuary
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Photography & Cold Weather Advice */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-sky-400" />
          <span>Aurora Photography & Sub-Zero Safety Guide</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              Camera Settings
            </div>
            <p className="text-slate-400 leading-relaxed">
              Use manual mode: Wide aperture (f/1.4 - f/2.8), ISO 1600-3200, shutter speed 2-8 seconds depending on aurora movement speed. Use a heavy tripod.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Battery Conservation
            </div>
            <p className="text-slate-400 leading-relaxed">
              Sub-arctic Canadian winter cold (-30°C) drains lithium-ion batteries rapidly. Keep spare batteries in inside jacket pockets next to body warmth.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Sub-Zero Clothing
            </div>
            <p className="text-slate-400 leading-relaxed">
              Thermal base layer, fleece mid-layer, windproof down parka, insulated sub-zero boots, and balaclava. Standing still in snow chills you much faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
