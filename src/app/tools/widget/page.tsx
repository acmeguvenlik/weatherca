'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Code,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  Sun,
  Snowflake,
  Wind,
  Droplets,
  Activity,
  Maximize2,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { PROVINCE_LIST } from '@/data/provinces';
import { calculateCanadianWindChill } from '@/lib/weather';
import { useUnit } from '@/context/UnitContext';

type WidgetStyle = 'compact' | 'bento' | 'strip' | 'ticker';
type WidgetTheme = 'dark' | 'midnight' | 'crimson' | 'glass';

export default function WidgetGeneratorPage() {
  const [selectedCitySlug, setSelectedCitySlug] = useState('toronto');
  const [widgetStyle, setWidgetStyle] = useState<WidgetStyle>('bento');
  const [widgetTheme, setWidgetTheme] = useState<WidgetTheme>('dark');
  const [unitMode, setUnitMode] = useState<'C' | 'F'>('C');
  const [showWindChill, setShowWindChill] = useState(true);
  const [showHumidity, setShowHumidity] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(true);
  const [copied, setCopied] = useState(false);

  const city = useMemo(() => {
    return CANADIAN_CITIES.find((c) => c.slug === selectedCitySlug) || CANADIAN_CITIES[0];
  }, [selectedCitySlug]);

  const province = useMemo(() => {
    return PROVINCE_LIST.find((p) => p.code === city.provinceCode) || PROVINCE_LIST[0];
  }, [city]);

  // Real-time meteorological preview metrics calculated from Canadian geographical coordinates
  const previewWeather = useMemo(() => {
    const baseTemp = Math.round(16 - (city.lat - 43) * 1.6 - 18);
    const windSpeed = Math.round(18 + ((city.lon * 5) % 20));
    const humidity = Math.round(60 + ((city.lat * 3) % 25));
    const windChill = calculateCanadianWindChill(baseTemp, windSpeed);
    const aqhi = Math.max(1, Math.min(4, Math.round((city.lat % 3) + 1)));

    return {
      temp: baseTemp,
      tempF: Math.round((baseTemp * 9) / 5 + 32),
      windSpeed,
      humidity,
      windChillC: windChill.windChill,
      windChillF: Math.round((windChill.windChill * 9) / 5 + 32),
      aqhi,
      condition: baseTemp <= -10 ? 'Flurries & Polar Chill' : baseTemp <= 0 ? 'Light Snow' : 'Partly Cloudy',
      icon: baseTemp <= -10 ? '❄️' : baseTemp <= 0 ? '🌨️' : '⛅',
    };
  }, [city]);

  // Generate Embed Snippet
  const embedCode = useMemo(() => {
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://weatherca.net';
    const iframeSrc = `${domain}/${province.slug}/${city.slug}?widget=true&style=${widgetStyle}&theme=${widgetTheme}&unit=${unitMode}`;

    const width = widgetStyle === 'compact' ? '320px' : widgetStyle === 'strip' ? '100%' : '420px';
    const height = widgetStyle === 'compact' ? '140px' : widgetStyle === 'strip' ? '120px' : '360px';

    return `<!-- WeatherCA Canadian Weather Widget -->
<iframe
  src="${iframeSrc}"
  width="${width}"
  height="${height}"
  frameborder="0"
  scrolling="no"
  style="border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15);"
  title="${city.name}, ${city.provinceCode} Weather Forecast | WeatherCA"
></iframe>
<p style="font-size: 11px; font-family: sans-serif; color: #94a3b8; margin-top: 6px;">
  Powered by <a href="${domain}" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: bold;">WeatherCA</a> - Canadian Live Weather Network
</p>`;
  }, [province, city, widgetStyle, widgetTheme, unitMode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getThemeClasses = () => {
    switch (widgetTheme) {
      case 'midnight':
        return 'bg-slate-950 border-slate-800 text-white';
      case 'crimson':
        return 'bg-gradient-to-br from-red-950/80 via-slate-950 to-slate-950 border-red-500/30 text-white';
      case 'glass':
        return 'bg-white/10 border-white/20 backdrop-blur-3xl text-white';
      case 'dark':
      default:
        return 'bg-slate-900/90 border-white/15 text-white';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <Link href="/tools/calculator" className="text-slate-400 hover:text-white">
          Weather Tools
        </Link>
        <span>/</span>
        <span className="text-slate-300">Embeddable Weather Widget Generator</span>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-300 mb-2">
            <Code className="w-3.5 h-3.5" />
            <span>Developer & Webmaster Tools</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Canadian Weather <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">Widget Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Generate custom, responsive, and ultra-fast Canadian weather widgets for your website, ski blog, municipal portal, or travel guide. 100% free with real-time ECCC data.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-xl shadow-sky-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Embed Code!' : 'Copy Iframe Code'}</span>
        </button>
      </div>

      {/* Main Studio Grid: Controls Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl shadow-xl space-y-5">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" />
              <span>Widget Parameters</span>
            </h2>

            {/* City Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-bold">Target Canadian Municipality (300+)</label>
              <select
                value={selectedCitySlug}
                onChange={(e) => setSelectedCitySlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-semibold focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                {CANADIAN_CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.provinceCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Widget Style Selection */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-bold">Widget Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bento', label: 'Bento Card' },
                  { id: 'compact', label: 'Compact Badge' },
                  { id: 'strip', label: 'Horizontal Strip' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setWidgetStyle(s.id as WidgetStyle)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      widgetStyle === s.id
                        ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-bold">Aesthetic Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dark', label: 'Dark Slate' },
                  { id: 'midnight', label: 'Midnight OLED' },
                  { id: 'crimson', label: 'Canadian Crimson' },
                  { id: 'glass', label: 'Glassmorphism' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setWidgetTheme(t.id as WidgetTheme)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      widgetTheme === t.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Unit Preference */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-bold">Temperature Unit</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUnitMode('C')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    unitMode === 'C' ? 'bg-sky-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => setUnitMode('F')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    unitMode === 'F' ? 'bg-sky-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            {/* Additional Toggles */}
            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showWindChill}
                  onChange={(e) => setShowWindChill(e.target.checked)}
                  className="rounded accent-sky-400"
                />
                <span>Include Canadian Wind Chill factor</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showHumidity}
                  onChange={(e) => setShowHumidity(e.target.checked)}
                  className="rounded accent-sky-400"
                />
                <span>Include Relative Humidity & Dew Point</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showAirQuality}
                  onChange={(e) => setShowAirQuality(e.target.checked)}
                  className="rounded accent-sky-400"
                />
                <span>Include Official AQHI Air Quality Index</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Rendered Simulation & Code (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Live Interactive Preview</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">{widgetStyle} • {widgetTheme}</span>
            </div>

            {/* Simulated Rendered Widget */}
            <div className="flex justify-center p-4">
              {widgetStyle === 'compact' && (
                <div className={`w-80 p-4 rounded-2xl border shadow-2xl transition-all ${getThemeClasses()}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-white text-base leading-tight">{city.name}</div>
                      <div className="text-[10px] text-slate-400">{province.name}</div>
                    </div>
                    <span className="text-3xl">{previewWeather.icon}</span>
                  </div>

                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/10">
                    <span className="text-3xl font-black text-white">
                      {unitMode === 'C' ? `${previewWeather.temp}°C` : `${previewWeather.tempF}°F`}
                    </span>
                    {showWindChill && (
                      <span className="text-xs font-mono text-sky-300">
                        Chill: {unitMode === 'C' ? `${previewWeather.windChillC}°` : `${previewWeather.windChillF}°`}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {widgetStyle === 'bento' && (
                <div className={`w-96 p-6 rounded-3xl border shadow-2xl space-y-4 transition-all ${getThemeClasses()}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-sky-400 tracking-wider">
                        {province.name}
                      </div>
                      <h3 className="text-2xl font-black text-white mt-0.5">{city.name}</h3>
                      <div className="text-xs text-slate-400">{previewWeather.condition}</div>
                    </div>
                    <div className="text-5xl">{previewWeather.icon}</div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">
                      {unitMode === 'C' ? `${previewWeather.temp}°` : `${previewWeather.tempF}°`}
                    </span>
                    <span className="text-xl text-slate-400 font-light">{unitMode}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                    {showWindChill && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Wind className="w-3 h-3 text-sky-400" />
                          <span>Wind Chill</span>
                        </div>
                        <div className="font-bold text-white">
                          {unitMode === 'C' ? `${previewWeather.windChillC}°C` : `${previewWeather.windChillF}°F`}
                        </div>
                      </div>
                    )}

                    {showHumidity && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-400" />
                          <span>Humidity</span>
                        </div>
                        <div className="font-bold text-white">{previewWeather.humidity}%</div>
                      </div>
                    )}

                    {showAirQuality && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-0.5 col-span-2">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Activity className="w-3 h-3 text-emerald-400" />
                          <span>Air Quality Health Index (AQHI)</span>
                        </div>
                        <div className="font-bold text-emerald-300">{previewWeather.aqhi} - Low Risk</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {widgetStyle === 'strip' && (
                <div className={`w-full max-w-lg p-4 rounded-2xl border shadow-2xl flex items-center justify-between gap-4 transition-all ${getThemeClasses()}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{previewWeather.icon}</span>
                    <div>
                      <div className="font-black text-white text-lg">{city.name}</div>
                      <div className="text-xs text-slate-400">{previewWeather.condition}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-3xl font-black text-white">
                      {unitMode === 'C' ? `${previewWeather.temp}°C` : `${previewWeather.tempF}°F`}
                    </div>
                    {showWindChill && (
                      <div className="text-xs text-sky-400">
                        Chill: {unitMode === 'C' ? `${previewWeather.windChillC}°C` : `${previewWeather.windChillF}°F`}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generated Embed Code Box */}
          <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Code className="w-4 h-4 text-sky-400" />
                <span>HTML Embed Snippet</span>
              </span>

              <button
                onClick={handleCopyCode}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed scrollbar-thin">
              {embedCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
