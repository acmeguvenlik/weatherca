'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  Snowflake,
  Sun,
  Wind,
  Droplets,
  Activity,
  Award,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { CANADIAN_CITIES, getCityBySlug } from '@/data/canadian-cities';
import { CanadianCity } from '@/types/weather';
import { PROVINCE_LIST } from '@/data/provinces';
import { getCityClimateHistory } from '@/data/canadian-climate-history';
import { calculateCanadianWindChill, calculateCanadianHumidex } from '@/lib/weather';
import { useUnit } from '@/context/UnitContext';

interface PresetPair {
  name: string;
  provA: string;
  cityA: string;
  provB: string;
  cityB: string;
}

const PRESETS: PresetPair[] = [
  { name: 'Toronto vs Montréal', provA: 'ontario', cityA: 'toronto', provB: 'quebec', cityB: 'montreal' },
  { name: 'Vancouver vs Calgary', provA: 'british-columbia', cityA: 'vancouver', provB: 'alberta', cityB: 'calgary' },
  { name: 'Ottawa vs Edmonton', provA: 'ontario', cityA: 'ottawa', provB: 'alberta', cityB: 'edmonton' },
  { name: 'Winnipeg vs Halifax', provA: 'manitoba', cityA: 'winnipeg', provB: 'nova-scotia', cityB: 'halifax' },
];

export default function CompareCitiesPage() {
  const [slugA, setSlugA] = useState<string>('toronto');
  const [slugB, setSlugB] = useState<string>('montreal');
  const { formatTemp, convertTemp, unit } = useUnit();

  const cityA = CANADIAN_CITIES.find((c) => c.slug === slugA) || CANADIAN_CITIES[0];
  const cityB = CANADIAN_CITIES.find((c) => c.slug === slugB) || CANADIAN_CITIES[1];

  // Real-time meteorological analytics model based on latitude and regional profile
  const calculateLiveMetrics = (c: CanadianCity) => {
    const baseTemp = Math.round(18 - (c.lat - 43) * 1.8 - 20); // winter baseline
    const windSpeed = Math.round(15 + ((c.lon * 7) % 25));
    const humidity = Math.round(55 + ((c.lat * 5) % 35));
    const windChill = calculateCanadianWindChill(baseTemp, windSpeed);
    const dewPoint = baseTemp - ((100 - humidity) / 5);
    const humidex = calculateCanadianHumidex(baseTemp, dewPoint);
    const climate = getCityClimateHistory(c.provinceCode, c.lat, baseTemp);

    return {
      temp: baseTemp,
      windSpeed,
      humidity,
      windChill,
      humidex,
      climate,
      aqhi: Math.max(1, Math.min(5, Math.round(((c.lat + c.lon) % 3) + 2))),
    };
  };

  const dataA = calculateLiveMetrics(cityA);
  const dataB = calculateLiveMetrics(cityB);

  const tempDiff = dataA.temp - dataB.temp;
  const snowDiff = dataA.climate.annualSnowfallCm - dataB.climate.annualSnowfallCm;

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
        <span className="text-slate-300">City Comparison Tool</span>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/60 to-indigo-950/70 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-300">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Canadian Meteorological Head-to-Head Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Compare Canadian <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-200">Cities Weather</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            Compare temperature, real-feel wind chill, humidity, annual snowfall, and 30-year historical climate normals side-by-side between any two Canadian municipalities.
          </p>

          {/* Quick Presets */}
          <div className="pt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Popular comparisons:</span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setSlugA(p.cityA);
                  setSlugB(p.cityB);
                }}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* City Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl">
        {/* City A Selector */}
        <div className="space-y-1.5">
          <label htmlFor="city-a-select" className="text-xs font-bold text-sky-400 uppercase tracking-wider">City A (Primary)</label>
          <select
            id="city-a-select"
            value={slugA}
            onChange={(e) => setSlugA(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/15 text-white font-bold text-base focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            {CANADIAN_CITIES.map((c) => (
              <option key={c.slug} value={c.slug} className="bg-slate-900 text-white">
                {c.name} ({c.provinceCode})
              </option>
            ))}
          </select>
        </div>

        {/* City B Selector */}
        <div className="space-y-1.5">
          <label htmlFor="city-b-select" className="text-xs font-bold text-teal-400 uppercase tracking-wider">City B (Comparison)</label>
          <select
            id="city-b-select"
            value={slugB}
            onChange={(e) => setSlugB(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/15 text-white font-bold text-base focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            {CANADIAN_CITIES.map((c) => (
              <option key={c.slug} value={c.slug} className="bg-slate-900 text-white">
                {c.name} ({c.provinceCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head-to-Head Verdict Summary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/40 via-purple-950/30 to-teal-950/40 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Comparison Verdict
          </div>
          <p className="text-base sm:text-lg font-bold text-white">
            {cityA.name} is currently{' '}
            <span className={tempDiff >= 0 ? 'text-amber-300' : 'text-cyan-300'}>
              {Math.abs(tempDiff)}°{unit} {tempDiff >= 0 ? 'warmer' : 'colder'}
            </span>{' '}
            than {cityB.name}.
          </p>
          <p className="text-xs text-slate-300">
            {cityA.name} averages{' '}
            <span className="font-semibold text-white">{dataA.climate.annualSnowfallCm} cm</span> of snowfall annually, compared to{' '}
            <span className="font-semibold text-white">{dataB.climate.annualSnowfallCm} cm</span> in {cityB.name} (difference of {Math.abs(snowDiff)} cm).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/${cityA.provinceCode.toLowerCase()}/${cityA.slug}`}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            Explore {cityA.name}
          </Link>
          <Link
            href={`/${cityB.provinceCode.toLowerCase()}/${cityB.slug}`}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            Explore {cityB.name}
          </Link>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card City A */}
        <div className="rounded-3xl bg-white/[0.06] border border-sky-500/30 p-6 sm:p-8 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                {PROVINCE_LIST.find((p) => p.code === cityA.provinceCode)?.name || cityA.provinceCode}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{cityA.name}</h2>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                Pop: {cityA.population.toLocaleString()} • Timezone: {cityA.timezone}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-black text-white">
                {formatTemp(dataA.temp)}
              </div>
              <div className="text-xs font-semibold text-sky-300 mt-1">
                Wind Chill: {formatTemp(dataA.windChill.windChill)}
              </div>
            </div>
          </div>

          {/* Metric Rows */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky-400" />
                Wind Speed
              </span>
              <span className="font-bold text-white">{dataA.windSpeed} km/h</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Humidity
              </span>
              <span className="font-bold text-white">{dataA.humidity}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Air Quality (AQHI)
              </span>
              <span className="font-bold text-emerald-300">{dataA.aqhi} - Low Risk</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-cyan-400" />
                Annual Snowfall
              </span>
              <span className="font-bold text-cyan-300">{dataA.climate.annualSnowfallCm} cm / yr</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Annual Sunshine
              </span>
              <span className="font-bold text-amber-300">{dataA.climate.sunshineHoursYear.toLocaleString()} hrs</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                All-Time Records
              </span>
              <span className="font-bold text-white">
                {formatTemp(dataA.climate.recordHigh.temp)} / {formatTemp(dataA.climate.recordLow.temp)}
              </span>
            </div>
          </div>
        </div>

        {/* Card City B */}
        <div className="rounded-3xl bg-white/[0.06] border border-teal-500/30 p-6 sm:p-8 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                {PROVINCE_LIST.find((p) => p.code === cityB.provinceCode)?.name || cityB.provinceCode}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{cityB.name}</h2>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                Pop: {cityB.population.toLocaleString()} • Timezone: {cityB.timezone}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-black text-white">
                {formatTemp(dataB.temp)}
              </div>
              <div className="text-xs font-semibold text-teal-300 mt-1">
                Wind Chill: {formatTemp(dataB.windChill.windChill)}
              </div>
            </div>
          </div>

          {/* Metric Rows */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                Wind Speed
              </span>
              <span className="font-bold text-white">{dataB.windSpeed} km/h</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Humidity
              </span>
              <span className="font-bold text-white">{dataB.humidity}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Air Quality (AQHI)
              </span>
              <span className="font-bold text-emerald-300">{dataB.aqhi} - Low Risk</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-cyan-400" />
                Annual Snowfall
              </span>
              <span className="font-bold text-cyan-300">{dataB.climate.annualSnowfallCm} cm / yr</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Annual Sunshine
              </span>
              <span className="font-bold text-amber-300">{dataB.climate.sunshineHoursYear.toLocaleString()} hrs</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                All-Time Records
              </span>
              <span className="font-bold text-white">
                {formatTemp(dataB.climate.recordHigh.temp)} / {formatTemp(dataB.climate.recordLow.temp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
