import { Metadata } from 'next';
import Link from 'next/link';
import { Plane, ArrowLeft, Wind, Compass, Layers } from 'lucide-react';
import { AviationMetarDisplay } from '@/components/tools/AviationMetarDisplay';

export const metadata: Metadata = {
  title: 'Canada Aviation Weather | Live METAR, TAF Decoder & Runway Crosswind',
  description:
    'Real-time Nav Canada METAR and TAF decoder for major Canadian airports including CYYZ Toronto Pearson, CYVR Vancouver, CYUL Montreal, and CYYC Calgary with flight rules (VFR/IFR) and crosswind calculator.',
  keywords: [
    'Canada aviation weather',
    'Nav Canada METAR TAF decoder',
    'CYYZ live METAR',
    'CYVR Vancouver airport weather',
    'runway crosswind calculator',
    'VFR IFR flight rules Canada',
  ],
};

export default function AviationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <Link href="/radar" className="hover:text-sky-400 transition-colors">
            Radar &amp; Tools
          </Link>
          <span>/</span>
          <span className="text-sky-400">Aviation Weather &amp; METAR/TAF</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-black uppercase tracking-wider mb-3">
              <Plane className="w-3.5 h-3.5" />
              Nav Canada Aviation Meteorolgy
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Canadian <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-cyan-400">Aviation Weather</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-medium">
              Live METAR (Meteorological Aerodrome Report) &amp; TAF decoder with flight rule classification (VFR, MVFR, IFR, LIFR), cloud ceiling bases, density altitude, and active runway crosswind resolvers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/radar"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Live Radar Loop</span>
            </Link>
          </div>
        </div>

        {/* Aviation Interactive Component */}
        <AviationMetarDisplay />

        {/* Flight Categories Knowledge Guide */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="font-extrabold text-emerald-400 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> VFR (Visual)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Ceiling greater than 3,000 ft AGL and visibility greater than 5 Statute Miles. Visual navigation permissible.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 space-y-2">
            <div className="font-extrabold text-blue-400 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> MVFR (Marginal)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Ceiling 1,000 to 3,000 ft AGL and/or visibility 3 to 5 Statute Miles. Increased pilot vigilance required.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 space-y-2">
            <div className="font-extrabold text-red-400 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> IFR (Instrument)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Ceiling 500 to 1,000 ft AGL and/or visibility 1 to 3 Statute Miles. Instrument flight plan mandatory.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <div className="font-extrabold text-purple-400 uppercase tracking-wider text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> LIFR (Low IFR)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Ceiling below 500 ft AGL and/or visibility below 1 Statute Mile. Low-approach ILS Cat II/III required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
