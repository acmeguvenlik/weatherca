import { Metadata } from 'next';
import Link from 'next/link';
import { Sprout, ArrowLeft, Sun, Compass, Droplets } from 'lucide-react';
import { AgricultureDashboard } from '@/components/tools/AgricultureDashboard';

export const metadata: Metadata = {
  title: 'Canada Agricultural Weather | Growing Degree Days (GDD), Frost Threat & Soil Temp',
  description:
    'Comprehensive Canadian agricultural weather portal featuring Growing Degree Days (GDD Base 5°C and 10°C), overnight frost risk warning indices, root zone soil temperature at 10cm depth, and crop phenology staging.',
  keywords: [
    'Canada agricultural weather',
    'Growing Degree Days Canada GDD',
    'Prairie frost risk forecast',
    'soil temperature Canada 10cm',
    'Niagara grape weather forecast',
    'Saskatchewan canola harvest weather',
  ],
};

export default function AgriculturePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <Link href="/almanac" className="hover:text-amber-400 transition-colors">
            Almanac &amp; Tools
          </Link>
          <span>/</span>
          <span className="text-amber-400">Agricultural &amp; Growing Degree Index</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
              <Sprout className="w-3.5 h-3.5" />
              Agri-Food &amp; Crop Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Canadian <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">Agricultural Weather</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-medium">
              Real-time agro-meteorological analytics for Canada's key agricultural corridors.
              Track cumulative Growing Degree Days (GDD), critical overnight radiation frost hazards, root-zone soil temperatures, and soil moisture balances.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/almanac"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Climate Almanac</span>
            </Link>
          </div>
        </div>

        {/* Agriculture Interactive Dashboard */}
        <AgricultureDashboard />

        {/* Agricultural Science Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              🌱
            </div>
            <h3 className="text-base font-bold text-white">Growing Degree Days (GDD)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculated as [(Tmax + Tmin)/2] - Tbase. Base 5°C is calibrated for cool-season cereals, canola, and forages; Base 10°C models warm-season corn and soybeans.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg">
              ❄️
            </div>
            <h3 className="text-base font-bold text-white">Radiation Frost Dynamics</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Occurs during clear, calm nocturnal conditions when ground-level heat radiates into space, cooling surface vegetation below 0°C even when screen-height air temps read +2°C to +3°C.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              💧
            </div>
            <h3 className="text-base font-bold text-white">10cm Soil Thermal Profiles</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Root-zone temperature governs biological enzyme activation, seed imbibition, nutrient uptake, and emergence velocity in spring seeding across the Prairie wheat belt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
