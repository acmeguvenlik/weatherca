import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Radio, Sparkles, MapPin, Globe, Award, Database, Layers, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About WeatherCA - Canada Premier Meteorological Network',
  description: 'Learn about WeatherCA mission, atmospheric data infrastructure, Environment Canada integration, and Canadian Doppler radar stations.',
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">About Us</span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/60 to-indigo-950/70 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-300">
          <span>🍁</span>
          <span>Canadian Meteorological Infrastructure</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-200">WeatherCA</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          Founded to deliver high-resolution, uncompromised, and ad-clutter-free weather intelligence for Canadians. From sub-arctic diamond mines in the Northwest Territories to downtown financial towers in Toronto and Vancouver harbour, WeatherCA powers daily decisions with scientific precision.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Radio className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">HRDPS 2.5km Modeling</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            We compute hyper-local atmospheric forecasts utilizing the High-Resolution Deterministic Prediction System (HRDPS) from Environment Canada, providing true 2.5 km grid spacing across complex Canadian geography.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Official ECCC Alerts</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct CAP (Common Alerting Protocol) telemetry with Environment and Climate Change Canada ensures immediate red-banner broadcasts for blizzards, freezing rain, tornadoes, and extreme cold statements.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">5,000+ Communities</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full coverage of all 10 provinces and 3 northern territories, indexed by forward sortation areas (FSA postal codes), municipal jurisdictions, and Indigenous northern settlements.
          </p>
        </div>
      </div>

      {/* Radar Network Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-400" />
          <span>Canadian Radar Modernization</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          WeatherCA ingests live dual-polarization imagery from all 31 modern S-Band radar towers across the national network (King City, Britt, Landrienne, McGill, Strathmore, Silver Star, Aldergrove, etc.). Dual-pol technology enables instant discrimination between wet snow, ice pellets, hail, and rain.
        </p>
      </div>
    </div>
  );
}
