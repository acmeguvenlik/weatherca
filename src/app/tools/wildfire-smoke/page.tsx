import { Metadata } from 'next';
import Link from 'next/link';
import { Flame, ShieldAlert, ArrowLeft, Wind, Sparkles } from 'lucide-react';
import { WildfireSmokeMap } from '@/components/tools/WildfireSmokeMap';

export const metadata: Metadata = {
  title: 'Canada Wildfire & Smoke Dispersion Tracker | Live PM2.5 & Plume Forecast',
  description:
    'Track active Canadian wildfires across British Columbia, Alberta, NWT, Ontario, and Quebec with live satellite smoke plume modeling, surface PM2.5 particulate levels, and Fire Danger Ratings.',
  keywords: [
    'Canada wildfire tracker',
    'BC smoke forecast',
    'Alberta wildfire map',
    'FireSmoke Canada live model',
    'Canada PM2.5 air quality smoke',
    'Environment Canada special air quality statement',
  ],
};

export default function WildfireSmokePage() {
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
            Radar &amp; Maps
          </Link>
          <span>/</span>
          <span className="text-red-400">Wildfire &amp; Smoke Tracker</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5" />
              National Wildfire &amp; Dispersion Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Canada Wildfire &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-yellow-400">Smoke Tracker</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-medium">
              Real-time Canadian Wildland Fire Information System (CWFIS) &amp; FireSmoke CA modeling.
              Monitor active perimeter complexes, PM2.5 ground-level concentration, and 48-hour atmospheric smoke dispersion across Canada.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/tools/air-quality"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <Wind className="w-4 h-4 text-sky-400" />
              <span>Full AQHI Air Index</span>
            </Link>
            <Link
              href="/alerts"
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Severe Alerts</span>
            </Link>
          </div>
        </div>

        {/* Interactive Map & Telemetry Dashboard */}
        <WildfireSmokeMap />

        {/* Safety & Preparedness Knowledge Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg">
              😷
            </div>
            <h3 className="text-base font-bold text-white">Wildfire Smoke Health Advice</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Wildfire smoke contains fine particulate matter (PM2.5) that penetrates deep into lungs and bloodstream.
              During High or Very High AQHI events, avoid strenuous outdoor physical activities, run HEPA indoor air purifiers, and wear well-fitted N95 masks when outdoors.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              🚨
            </div>
            <h3 className="text-base font-bold text-white">Evacuation Alert vs. Order</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              An <strong>Evacuation Alert</strong> informs residents to prepare an emergency "grab-and-go" kit, pack vital documents and medications, and fuel vehicles.
              An <strong>Evacuation Order</strong> mandates immediate departure along designated emergency egress corridors due to imminent life safety peril.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg">
              🛰️
            </div>
            <h3 className="text-base font-bold text-white">Dispersion Forecasting Science</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Smoke plume movement is dictated by high-altitude jetstream dynamics, atmospheric inversion caps, and local valley thermal winds.
              Our predictive timeline tracks multi-tier vertical dispersion models updated twice daily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
