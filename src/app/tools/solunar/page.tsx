import { Metadata } from 'next';
import Link from 'next/link';
import { Fish, ArrowLeft, Moon, Compass, Sparkles } from 'lucide-react';
import { SolunarCalendar } from '@/components/tools/SolunarCalendar';

export const metadata: Metadata = {
  title: 'Canada Solunar & Fishing Forecaster | Best Bite Times & Moon Phases',
  description:
    'Calculate major and minor wildlife feeding times, lunar transit phases, and fish activity ratings for Canadian lakes, rivers, and coastal waterways.',
  keywords: [
    'Canada solunar calendar',
    'best fishing times Canada',
    'Ontario solunar forecast',
    'BC salmon fishing times',
    'lake simcoe fishing forecast',
    'major minor feeding windows moon',
  ],
};

export default function SolunarPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <Link href="/tools/calculator" className="hover:text-emerald-400 transition-colors">
            Tools &amp; Calculators
          </Link>
          <span>/</span>
          <span className="text-emerald-400">Solunar &amp; Fishing Forecast</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-3">
              <Fish className="w-3.5 h-3.5" />
              Outdoor &amp; Marine Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Canadian <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Solunar Forecaster</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-medium">
              John Alden Knight's Solunar Theory tailored to Canadian geography.
              Predict the precise 2-hour major and 1-hour minor wildlife feeding periods across Great Lakes, Canadian Shield waters, and Pacific estuaries.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/almanac"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Climate Almanac</span>
            </Link>
          </div>
        </div>

        {/* Solunar Interactive Component */}
        <SolunarCalendar />

        {/* Scientific Guide / Solunar Mechanics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              🌊
            </div>
            <h3 className="text-base font-bold text-white">The Gravitational Trigger</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When the moon is directly overhead (lunar transit) or underfoot (opposite meridian), gravitational pull reaches its apex, triggering heightened metabolic activity and predatory instincts in fish and game.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
              ⏱️
            </div>
            <h3 className="text-base font-bold text-white">Major vs. Minor Periods</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Major periods</strong> span approximately 2 hours surrounding lunar zenith and nadir. <strong>Minor periods</strong> last 45–60 minutes coinciding with moonrise and moonset. Bites peak if these align with sunrise or sunset.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              🌡️
            </div>
            <h3 className="text-base font-bold text-white">Barometric Synergy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Solunar feeding windows produce the strongest results when paired with a falling barometer 2–4 hours ahead of a passing low-pressure frontal boundary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
