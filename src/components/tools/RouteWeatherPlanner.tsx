'use client';

import React, { useState } from 'react';
import {
  Car,
  Compass,
  MapPin,
  AlertTriangle,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Camera,
  Navigation,
} from 'lucide-react';

interface RouteSegment {
  name: string;
  elevationMeters: number;
  distanceFromStartKm: number;
  expectedTempC: number;
  roadCondition: 'Bare Dry' | 'Wet Pavement' | 'Snow Packed / Slush' | 'Black Ice Hazard';
  weatherDesc: string;
  webcamTitle: string;
  webcamUrl: string;
}

interface CanadianHighwayRoute {
  id: string;
  name: string;
  highwayNumber: string;
  totalDistanceKm: number;
  estimatedDriveTime: string;
  highestElevationMeters: number;
  province: string;
  segments: RouteSegment[];
}

const CANADIAN_ROUTES: CanadianHighwayRoute[] = [
  {
    id: 'route-coquihalla',
    name: 'Vancouver to Kelowna (Coquihalla Hwy 5)',
    highwayNumber: 'BC Hwy 1 & Hwy 5',
    totalDistanceKm: 395,
    estimatedDriveTime: '4h 15m',
    highestElevationMeters: 1244,
    province: 'British Columbia',
    segments: [
      { name: 'Vancouver / Abbotsford', elevationMeters: 15, distanceFromStartKm: 0, expectedTempC: 16, roadCondition: 'Bare Dry', weatherDesc: 'Overcast skies, calm', webcamTitle: 'Hwy 1 at Mt. Lehman', webcamUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80' },
      { name: 'Hope Flood Gate', elevationMeters: 42, distanceFromStartKm: 140, expectedTempC: 13, roadCondition: 'Bare Dry', weatherDesc: 'Light drizzle at mountain base', webcamTitle: 'Hope Scale Interchange', webcamUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80' },
      { name: 'Coquihalla Summit & Great Bear Snowshed', elevationMeters: 1244, distanceFromStartKm: 215, expectedTempC: -1, roadCondition: 'Snow Packed / Slush', weatherDesc: 'Alpine flurries & blowing snow', webcamTitle: 'Coquihalla Summit West', webcamUrl: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=600&q=80' },
      { name: 'Merritt & Pennask Summit', elevationMeters: 595, distanceFromStartKm: 290, expectedTempC: 7, roadCondition: 'Wet Pavement', weatherDesc: 'Scattered rain showers', webcamTitle: 'Hwy 97C at Pennask', webcamUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kelowna / Okanagan Valley', elevationMeters: 344, distanceFromStartKm: 395, expectedTempC: 18, roadCondition: 'Bare Dry', weatherDesc: 'Sunny intervals', webcamTitle: 'William R. Bennett Bridge', webcamUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'route-transcanada-rockies',
    name: 'Calgary to Lake Louise & Golden (Trans-Canada Hwy 1)',
    highwayNumber: 'Trans-Canada Hwy 1',
    totalDistanceKm: 265,
    estimatedDriveTime: '3h 10m',
    highestElevationMeters: 1627,
    province: 'Alberta & BC',
    segments: [
      { name: 'Calgary West', elevationMeters: 1048, distanceFromStartKm: 0, expectedTempC: 19, roadCondition: 'Bare Dry', weatherDesc: 'Sunny, breezy westerly wind', webcamTitle: 'Hwy 1 at COP', webcamUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80' },
      { name: 'Canmore & Dead Man’s Flats', elevationMeters: 1309, distanceFromStartKm: 100, expectedTempC: 14, roadCondition: 'Bare Dry', weatherDesc: 'Clear mountain vista', webcamTitle: 'Three Sisters Viewpoint', webcamUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80' },
      { name: 'Banff National Park Gate', elevationMeters: 1383, distanceFromStartKm: 128, expectedTempC: 12, roadCondition: 'Bare Dry', weatherDesc: 'Partly cloudy, cool breeze', webcamTitle: 'Banff East Gate', webcamUrl: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kicking Horse Pass / Lake Louise', elevationMeters: 1627, distanceFromStartKm: 185, expectedTempC: 2, roadCondition: 'Black Ice Hazard', weatherDesc: 'Cold mountain pass, shaded frost', webcamTitle: 'Kicking Horse Pass Alberta Gate', webcamUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
      { name: 'Golden (Columbia Valley)', elevationMeters: 800, distanceFromStartKm: 265, expectedTempC: 15, roadCondition: 'Bare Dry', weatherDesc: 'Sunny, valley thermal warmth', webcamTitle: 'Hwy 1 Canyon Bridge', webcamUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'route-hwy401-ontario',
    name: 'Toronto to Montréal (Hwy 401 & Aut 20)',
    highwayNumber: 'ON Hwy 401 & QC Aut 20',
    totalDistanceKm: 540,
    estimatedDriveTime: '5h 20m',
    highestElevationMeters: 180,
    province: 'Ontario & Quebec',
    segments: [
      { name: 'Toronto (Scarborough / Pickering)', elevationMeters: 85, distanceFromStartKm: 0, expectedTempC: 22, roadCondition: 'Bare Dry', weatherDesc: 'Sunny and warm', webcamTitle: 'Hwy 401 at Brock Rd', webcamUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80' },
      { name: 'Cobourg & Port Hope', elevationMeters: 90, distanceFromStartKm: 110, expectedTempC: 21, roadCondition: 'Bare Dry', weatherDesc: 'Clear, Lake Ontario breeze', webcamTitle: 'Hwy 401 at County Rd 28', webcamUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kingston & 1000 Islands', elevationMeters: 95, distanceFromStartKm: 260, expectedTempC: 20, roadCondition: 'Bare Dry', weatherDesc: 'Breezy southwest 25 km/h', webcamTitle: 'Hwy 401 at Division St', webcamUrl: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=600&q=80' },
      { name: 'Cornwall / Ontario-Quebec Border', elevationMeters: 65, distanceFromStartKm: 430, expectedTempC: 19, roadCondition: 'Wet Pavement', weatherDesc: 'Passing showers', webcamTitle: 'Hwy 401 at Brookdale Ave', webcamUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
      { name: 'Montréal (Île Perrot & Turcot)', elevationMeters: 40, distanceFromStartKm: 540, expectedTempC: 21, roadCondition: 'Bare Dry', weatherDesc: 'Sunny, pleasant', webcamTitle: 'Aut 20 at Pont Mercier', webcamUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    ],
  },
];

export function RouteWeatherPlanner() {
  const [selectedRoute, setSelectedRoute] = useState<CanadianHighwayRoute>(CANADIAN_ROUTES[0]);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);

  const activeSegment = selectedRoute.segments[activeSegmentIndex] || selectedRoute.segments[0];

  return (
    <div className="space-y-8">
      {/* Route Selector Ribbon */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
              Selected Canadian Corridor
            </div>
            <h3 className="text-lg font-black text-white">{selectedRoute.name}</h3>
            <span className="text-xs text-slate-400">
              {selectedRoute.highwayNumber} • {selectedRoute.totalDistanceKm} km • Est: {selectedRoute.estimatedDriveTime} • Max Elev: {selectedRoute.highestElevationMeters}m
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <select
            value={selectedRoute.id}
            onChange={(e) => {
              const r = CANADIAN_ROUTES.find((x) => x.id === e.target.value);
              if (r) {
                setSelectedRoute(r);
                setActiveSegmentIndex(0);
              }
            }}
            className="w-full md:w-80 bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner"
          >
            {CANADIAN_ROUTES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segment Stepper Timeline Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {selectedRoute.segments.map((seg, idx) => {
          const isSelected = idx === activeSegmentIndex;
          const isHazard = seg.roadCondition.includes('Ice') || seg.roadCondition.includes('Snow');

          return (
            <button
              key={idx}
              onClick={() => setActiveSegmentIndex(idx)}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-36 relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-950 border-sky-500/60 shadow-xl'
                  : 'bg-slate-950/60 hover:bg-slate-800 border-white/5 text-slate-400'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-slate-400">KM {seg.distanceFromStartKm}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isHazard ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {seg.expectedTempC}°C
                  </span>
                </div>
                <h5 className={`text-xs font-black mt-1 line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {seg.name}
                </h5>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-mono">Elev: {seg.elevationMeters}m</div>
                <span className={`text-[10px] font-bold block truncate ${isHazard ? 'text-red-400' : 'text-slate-400'}`}>
                  {seg.roadCondition}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Segment In-Depth Telemetry & Webcam Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Telemetry & Safety Status */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                Segment Telemetry
              </span>
              <h4 className="text-xl font-black text-white mt-0.5">{activeSegment.name}</h4>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black border ${
                activeSegment.roadCondition.includes('Ice') || activeSegment.roadCondition.includes('Snow')
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {activeSegment.roadCondition}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Surface Temp</span>
              <div className="text-xl font-black text-white">{activeSegment.expectedTempC}°C</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Altitude</span>
              <div className="text-xl font-black text-sky-300">{activeSegment.elevationMeters} m</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Sky Condition</span>
              <div className="text-xs font-bold text-white mt-1 truncate">{activeSegment.weatherDesc}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-sky-400" />
              <span>Driver Highway Advisory:</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              {activeSegment.expectedTempC <= 0
                ? 'Road surface is below freezing point. Severe risk of black ice formation on bridge decks and shaded mountain curves. Reduce driving speed by at least 20 km/h.'
                : 'Pavement conditions optimal with dry traction. Maintain standard safe highway following distance.'}
            </p>
          </div>
        </div>

        {/* Right: Live Pass Camera Feed */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-400" />
                Live Provincial Road Camera
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">Live Feed</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-white/10">
              <img
                src={activeSegment.webcamUrl}
                alt={activeSegment.webcamTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-slate-950/80 text-[10px] font-bold text-white backdrop-blur-md">
                {activeSegment.webcamTitle}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            Camera image refreshed via Ministry of Transportation &amp; Infrastructure
          </div>
        </div>
      </div>
    </div>
  );
}
