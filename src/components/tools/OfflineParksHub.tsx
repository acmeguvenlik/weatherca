'use client';

import React, { useState, useEffect } from 'react';
import {
  Mountain,
  Download,
  Wifi,
  WifiOff,
  CheckCircle2,
  Trees,
  Radio,
  Clock,
  Compass,
  Sparkles,
} from 'lucide-react';

interface NationalParkWeather {
  id: string;
  name: string;
  province: string;
  provinceCode: string;
  elevationMeters: number;
  currentTempC: number;
  overnightLowC: number;
  condition: string;
  uvIndex: number;
  trailHazard: string;
  emergencyFrequencies: string;
  lastCached?: string;
}

const CANADIAN_PARKS: NationalParkWeather[] = [
  {
    id: 'park-banff',
    name: 'Banff National Park (Lake Minnewanka & Moraine)',
    province: 'Alberta',
    provinceCode: 'AB',
    elevationMeters: 1400,
    currentTempC: 14,
    overnightLowC: 2,
    condition: 'Crisp Mountain Breeze / Clear',
    uvIndex: 5,
    trailHazard: 'Moderate bear activity in Bow Valley; alpine ridge wind gusts up to 50 km/h.',
    emergencyFrequencies: 'Parks Canada Warden Dispatch: 149.080 MHz VHF / Satellite SOS channel 16',
  },
  {
    id: 'park-jasper',
    name: 'Jasper National Park & Icefields Parkway',
    province: 'Alberta',
    provinceCode: 'AB',
    elevationMeters: 1060,
    currentTempC: 13,
    overnightLowC: 1,
    condition: 'Sunny Intervals',
    uvIndex: 4,
    trailHazard: 'Athabasca Glacier moraine loose scree; rapid afternoon thunderstorm development.',
    emergencyFrequencies: 'Jasper Dispatch VHF 149.200 MHz / Satellite PLB active',
  },
  {
    id: 'park-algonquin',
    name: 'Algonquin Provincial Park (Canoe Lake)',
    province: 'Ontario',
    provinceCode: 'ON',
    elevationMeters: 450,
    currentTempC: 20,
    overnightLowC: 9,
    condition: 'Calm Waters / Mild',
    uvIndex: 6,
    trailHazard: 'Evening mosquito/blackfly swarms; portage mud sections along Opeongo.',
    emergencyFrequencies: 'Ontario Provincial Police Wilderness Line: 1-888-310-1122 / VHF Ch 68',
  },
  {
    id: 'park-gros-morne',
    name: 'Gros Morne National Park (Tablelands & Fjord)',
    province: 'Newfoundland and Labrador',
    provinceCode: 'NL',
    elevationMeters: 806,
    currentTempC: 12,
    overnightLowC: 4,
    condition: 'Brisk Atlantic Fog Clearing',
    uvIndex: 4,
    trailHazard: 'Sudden maritime squalls over Western Brook Pond gorge; exposed subarctic tundra.',
    emergencyFrequencies: 'Coast Guard & Parks Warden VHF Marine Ch 16 / 149.080 MHz',
  },
  {
    id: 'park-pacific-rim',
    name: 'Pacific Rim National Park Reserve (West Coast Trail)',
    province: 'British Columbia',
    provinceCode: 'BC',
    elevationMeters: 50,
    currentTempC: 15,
    overnightLowC: 8,
    condition: 'Coastal Rainforest Mist',
    uvIndex: 3,
    trailHazard: 'Slippery wooden boardwalk ladders and tidal surge surge traps at Tsusiat Falls.',
    emergencyFrequencies: 'Victoria Coast Guard Radio VHF Ch 16 / 83A',
  },
];

export function OfflineParksHub() {
  const [cachedParks, setCachedParks] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weatherca_offline_parks');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  const [isOffline, setIsOffline] = useState(false);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const cachePark = (park: NationalParkWeather) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    const next = { ...cachedParks, [park.id]: timestamp };
    setCachedParks(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('weatherca_offline_parks', JSON.stringify(next));
      localStorage.setItem(`weatherca_park_data_${park.id}`, JSON.stringify({ ...park, lastCached: timestamp }));
    }
    setSavedSuccessId(park.id);
    setTimeout(() => setSavedSuccessId(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Offline Status Ribbon */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>National Parks Offline Wilderness Forecast Cache</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PWA Ready
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pre-load mountain weather and emergency frequencies before losing cell reception on trail
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOffline ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
              <Wifi className="w-3.5 h-3.5" />
              <span>Live Cell Network Online</span>
            </div>
          )}
        </div>
      </div>

      {/* Parks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CANADIAN_PARKS.map((park) => {
          const isCached = !!cachedParks[park.id];
          const cachedTime = cachedParks[park.id];

          return (
            <div
              key={park.id}
              className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col justify-between space-y-4 group hover:border-emerald-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      {park.province}
                    </span>
                    <h4 className="text-base font-black text-white mt-0.5 leading-tight">{park.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-mono font-bold text-slate-400 shrink-0">
                    {park.elevationMeters}m
                  </span>
                </div>

                {/* Weather Metrics */}
                <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Temperature</span>
                    <div className="text-lg font-black text-white mt-0.5">
                      {park.currentTempC}°C <span className="text-[11px] text-slate-400 font-normal">/ {park.overnightLowC}°C low</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Trail Condition</span>
                    <div className="text-xs font-bold text-emerald-300 mt-1 truncate">{park.condition}</div>
                  </div>
                </div>

                {/* Trail Hazard Notes */}
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-300 space-y-1">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                    ⚠️ Wilderness Safety Advisory
                  </span>
                  <p className="leading-relaxed">{park.trailHazard}</p>
                </div>

                {/* Emergency Radio Frequency */}
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5 text-[10px] text-slate-400 font-mono mt-2 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{park.emergencyFrequencies}</span>
                </div>
              </div>

              {/* Cache Button & Status */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                {isCached ? (
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Cached ({cachedTime})
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium">Not yet cached</span>
                )}

                <button
                  onClick={() => cachePark(park)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{savedSuccessId === park.id ? 'Saved!' : 'Save Offline'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
