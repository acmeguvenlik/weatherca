'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Snowflake, Flame, ArrowLeft, Calculator, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { calculateCanadianWindChill, calculateCanadianHumidex } from '@/lib/weather';
import { useUnit } from '@/context/UnitContext';

export default function CalculatorPage() {
  const [tempC, setTempC] = useState<number>(-12);
  const [windSpeed, setWindSpeed] = useState<number>(25);
  const [humidity, setHumidity] = useState<number>(65);
  const { unit, formatTemp, convertTemp } = useUnit();

  // Compute dew point approximation from Temp & Relative Humidity
  // Magnus formula approximation
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100);
  const dewPoint = Math.round(((b * alpha) / (a - alpha)) * 10) / 10;

  const windChillResult = calculateCanadianWindChill(tempC, windSpeed);
  const humidexResult = calculateCanadianHumidex(tempC, dewPoint);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Weather Tools</span>
        <span>/</span>
        <span className="text-slate-300">Wind Chill & Humidex Calculator</span>
      </div>

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-semibold text-sky-300 mb-3">
          <Calculator className="w-3.5 h-3.5" />
          Environment Canada Scientific Calculator
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Canadian Wind Chill & Humidex Calculator
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Official Environment and Climate Change Canada (ECCC) meteorological formulas. Calculate
          real-time wind cooling effects, frostbite danger thresholds, and summer heat discomfort indexes.
        </p>
      </div>

      {/* Interactive Controls & Live Sliders */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Input Weather Variables</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temperature Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Air Temperature</span>
              <span className="text-white font-mono font-bold text-base">
                {tempC}°C {unit === 'F' && <span className="text-sky-300 font-normal">({convertTemp(tempC)}°F)</span>}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={45}
              value={tempC}
              onChange={(e) => setTempC(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-50°C</span>
              <span>0°C</span>
              <span>+45°C</span>
            </div>
          </div>

          {/* Wind Speed Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Wind Velocity</span>
              <span className="text-white font-mono font-bold text-base">{windSpeed} km/h</span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              value={windSpeed}
              onChange={(e) => setWindSpeed(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 km/h (Calm)</span>
              <span>60 km/h (Gale)</span>
              <span>120 km/h</span>
            </div>
          </div>

          {/* Relative Humidity Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Relative Humidity</span>
              <span className="text-white font-mono font-bold text-base">{humidity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (Arid)</span>
              <span>50%</span>
              <span>100% (Saturated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wind Chill Calculation Result */}
        <div className="p-6 sm:p-8 rounded-3xl bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
              <Snowflake className="w-5 h-5" />
              <span>Canadian Wind Chill Index</span>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                windChillResult.riskLevel === 'Hazardous' || windChillResult.riskLevel === 'Extreme'
                  ? 'bg-red-500/30 text-red-200 border-red-500/50'
                  : windChillResult.riskLevel === 'High' || windChillResult.riskLevel === 'Moderate'
                  ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}
            >
              {windChillResult.riskLevel} Risk
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black text-white">
              {unit === 'F' ? convertTemp(windChillResult.windChill) : windChillResult.windChill}
            </span>
            <span className="text-2xl text-cyan-400 font-light">°{unit}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-1 text-slate-200">
            <div className="font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-cyan-300" />
              <span>Frostbite Timeline:</span>
            </div>
            <p>
              {windChillResult.frostbiteRiskMinutes
                ? `Exposed skin can freeze within approximately ${windChillResult.frostbiteRiskMinutes} minutes under these conditions.`
                : 'Frostbite risk is low for properly dressed individuals at this wind chill index.'}
            </p>
          </div>
        </div>

        {/* Humidex Calculation Result */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-950/30 border border-amber-500/30 backdrop-blur-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <Flame className="w-5 h-5" />
              <span>Canadian Humidex Scale</span>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                humidexResult.category === 'Dangerous'
                  ? 'bg-red-500/30 text-red-200 border-red-500/50'
                  : humidexResult.category === 'Great Discomfort'
                  ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {humidexResult.category}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black text-white">{humidexResult.humidex}</span>
            <span className="text-2xl text-amber-400 font-light">Index</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-1 text-slate-200">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Dew Point: {dewPoint}°C</span>
            </div>
            <p>
              {humidexResult.humidex >= 45
                ? 'Dangerous heat conditions. Avoid exertion. Heat stroke is highly probable.'
                : humidexResult.humidex >= 40
                ? 'Great discomfort. Drink abundant water and limit outdoor athletic activities.'
                : humidexResult.humidex >= 30
                ? 'Noticeable discomfort for most individuals. Wear breathable clothing.'
                : 'Comfortable conditions with minimal heat stress.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
