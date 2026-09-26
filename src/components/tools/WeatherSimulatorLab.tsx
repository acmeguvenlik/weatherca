'use client';

import React, { useState } from 'react';
import {
  Zap,
  Sliders,
  RotateCcw,
  Sparkles,
  Flame,
  Snowflake,
  Wind,
  ShieldAlert,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface PresetScenario {
  id: string;
  name: string;
  year: string;
  location: string;
  description: string;
  surfaceTemp: number;
  dewPoint: number;
  midLevelTemp: number;
  windShearKt: number;
  capStrength: number;
}

const HISTORICAL_PRESETS: PresetScenario[] = [
  {
    id: 'edmonton-f4',
    name: '1987 Edmonton F4 "Black Friday" Tornado',
    year: '1987',
    location: 'Edmonton, Alberta',
    description: 'Extreme instability with explosive CAPE exceeding 3,800 J/kg and 55 kt directional shear generated Canada’s second deadliest tornado.',
    surfaceTemp: 28,
    dewPoint: 21,
    midLevelTemp: -18,
    windShearKt: 55,
    capStrength: 10,
  },
  {
    id: 'ice-storm-1998',
    name: '1998 Great Eastern Canada Ice Storm',
    year: '1998',
    location: 'Montreal & Eastern Ontario',
    description: 'Subtropical warm air aloft (+4°C at 1,500m) riding over a stagnant freezing surface wedge (-3°C) dropped 100mm of catastrophic freezing rain over 6 days.',
    surfaceTemp: -2,
    dewPoint: -2,
    midLevelTemp: 3,
    windShearKt: 35,
    capStrength: 80,
  },
  {
    id: 'heat-dome-2021',
    name: '2021 Pacific Northwest "Heat Dome"',
    year: '2021',
    location: 'Lytton, British Columbia',
    description: 'Omega block high-pressure cap compressed desert-dry airmass through adiabatic descent, reaching an all-time Canadian national record of +49.6°C.',
    surfaceTemp: 49,
    dewPoint: 8,
    midLevelTemp: -2,
    windShearKt: 10,
    capStrength: 95,
  },
  {
    id: 'polar-vortex-2023',
    name: '2023 Arctic Polar Vortex Outbreak',
    year: '2023',
    location: 'Saskatoon & Northern Prairies',
    description: 'Stratospheric polar vortex disruption plunged tropospheric Arctic air straight south, dropping surface temperatures to -42°C with -56 Wind Chill.',
    surfaceTemp: -40,
    dewPoint: -44,
    midLevelTemp: -48,
    windShearKt: 40,
    capStrength: 5,
  },
];

export function WeatherSimulatorLab() {
  const [surfaceTemp, setSurfaceTemp] = useState<number>(26);
  const [dewPoint, setDewPoint] = useState<number>(18);
  const [midLevelTemp, setMidLevelTemp] = useState<number>(-14);
  const [windShearKt, setWindShearKt] = useState<number>(45);
  const [capStrength, setCapStrength] = useState<number>(20);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('custom');

  // Meteorological Stability Calculations (Simplified real-world approximations)
  // CAPE formula approx based on parcel temperature excess
  const parcelLapse = (surfaceTemp - midLevelTemp) * 75;
  const moistureContribution = Math.max(0, dewPoint * 45);
  const capInhibition = capStrength * 12;
  const calculatedCape = Math.max(0, Math.round(parcelLapse + moistureContribution - capInhibition));

  // Lifted Index (approx: Environment Temp @ 500hPa - Parcel Temp @ 500hPa)
  const calculatedLI = Number(((midLevelTemp - (surfaceTemp - 32)) * -0.2).toFixed(1));

  // Severe Storm / Supercell Classification
  let stormPotential: string;
  let stormRiskColor: string;
  if (calculatedCape > 3000 && windShearKt >= 40) {
    stormPotential = 'Violent Supercells & Tornado Outbreak Threat';
    stormRiskColor = 'text-purple-400 bg-purple-500/20 border-purple-500/40';
  } else if (calculatedCape > 1800 && windShearKt >= 30) {
    stormPotential = 'Severe Thunderstorms, Large Hail & Damaging Winds';
    stormRiskColor = 'text-red-400 bg-red-500/20 border-red-500/40';
  } else if (calculatedCape > 800) {
    stormPotential = 'Scattered General Thunderstorms';
    stormRiskColor = 'text-amber-400 bg-amber-500/20 border-amber-500/40';
  } else if (surfaceTemp < 0 && midLevelTemp > 0) {
    stormPotential = 'Major Freezing Rain & Glaze Ice Threat';
    stormRiskColor = 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
  } else {
    stormPotential = 'Stable Atmosphere / Non-Severe';
    stormRiskColor = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
  }

  const applyPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setSurfaceTemp(preset.surfaceTemp);
    setDewPoint(preset.dewPoint);
    setMidLevelTemp(preset.midLevelTemp);
    setWindShearKt(preset.windShearKt);
    setCapStrength(preset.capStrength);
  };

  const resetCustom = () => {
    setSelectedPresetId('custom');
    setSurfaceTemp(26);
    setDewPoint(18);
    setMidLevelTemp(-14);
    setWindShearKt(45);
    setCapStrength(20);
  };

  return (
    <div className="space-y-8">
      {/* Scenario Presets Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Canadian Historical Disaster Replay Scenarios
          </h4>
          <button
            onClick={resetCustom}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Custom Lab
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HISTORICAL_PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-32 ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border-amber-500/50 shadow-xl'
                    : 'bg-slate-950/60 hover:bg-slate-800 border-white/5 text-slate-400'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400">{p.year} • {p.location}</span>
                  <h5 className={`text-xs font-black mt-1 leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {p.name}
                  </h5>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-2 mt-1">{p.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Interactive Sliders & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Atmospheric Sliders Console */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-sky-400" />
              Atmospheric Parameter Controls
            </h4>
            <span className="text-xs text-slate-400 font-mono">Thermodynamic Inputs</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Surface Temp Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Surface Air Temperature (T):</span>
                <span className="text-amber-300 font-mono text-sm">{surfaceTemp}°C</span>
              </div>
              <input
                type="range"
                min="-45"
                max="50"
                value={surfaceTemp}
                onChange={(e) => {
                  setSurfaceTemp(Number(e.target.value));
                  setSelectedPresetId('custom');
                }}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Dew Point Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Surface Dew Point (Td - Moisture):</span>
                <span className="text-teal-300 font-mono text-sm">{dewPoint}°C</span>
              </div>
              <input
                type="range"
                min="-50"
                max="28"
                value={dewPoint}
                onChange={(e) => {
                  setDewPoint(Number(e.target.value));
                  setSelectedPresetId('custom');
                }}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>

            {/* 500hPa Mid-Level Temp Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">500 hPa Mid-Tropospheric Temp (~5.5km):</span>
                <span className="text-cyan-300 font-mono text-sm">{midLevelTemp}°C</span>
              </div>
              <input
                type="range"
                min="-50"
                max="10"
                value={midLevelTemp}
                onChange={(e) => {
                  setMidLevelTemp(Number(e.target.value));
                  setSelectedPresetId('custom');
                }}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Wind Shear Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">0-6 km Bulk Wind Shear:</span>
                <span className="text-indigo-300 font-mono text-sm">{windShearKt} kt</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={windShearKt}
                onChange={(e) => {
                  setWindShearKt(Number(e.target.value));
                  setSelectedPresetId('custom');
                }}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Cap Strength Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Thermal Inversion Cap Strength (CIN):</span>
                <span className="text-purple-300 font-mono text-sm">{capStrength}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={capStrength}
                onChange={(e) => {
                  setCapStrength(Number(e.target.value));
                  setSelectedPresetId('custom');
                }}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Calculated Atmospheric Instability Engine */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Real-Time Instability Diagnostics
              </h4>
              <span className="text-xs text-emerald-400 font-bold font-mono">HRDPS Engine</span>
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {/* CAPE */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">CAPE (Potential Energy)</span>
                <div className="text-3xl font-black text-amber-400">
                  {calculatedCape.toLocaleString()} <span className="text-xs text-slate-400 font-semibold">J/kg</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {calculatedCape > 2500 ? 'Extreme Convective Fuel' : calculatedCape > 1000 ? 'Moderate Fuel' : 'Low / Nil'}
                </div>
              </div>

              {/* Lifted Index */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Lifted Index (LI)</span>
                <div className={`text-3xl font-black ${calculatedLI <= -6 ? 'text-purple-400' : calculatedLI <= -2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {calculatedLI > 0 ? `+${calculatedLI}` : calculatedLI}
                </div>
                <div className="text-[10px] text-slate-400">
                  {calculatedLI <= -6 ? 'Extremely Unstable' : calculatedLI <= -2 ? 'Unstable' : 'Stable'}
                </div>
              </div>
            </div>

            {/* Storm Threat Classification */}
            <div className={`p-4 rounded-2xl border space-y-1 ${stormRiskColor}`}>
              <div className="text-[10px] uppercase font-black tracking-wider opacity-80">
                Atmospheric Convective Outcome
              </div>
              <div className="text-base font-black">{stormPotential}</div>
            </div>

            {/* Scientific Explanation */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-xs text-slate-400 leading-relaxed">
              When surface parcel dewpoints ({dewPoint}°C) exceed mid-level environment temperatures ({midLevelTemp}°C), parcel buoyancy accelerates vertically. With {windShearKt} kt shear, rotating mesocyclones can develop.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
