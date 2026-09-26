import { Metadata } from 'next';
import Link from 'next/link';
import { Car, ArrowLeft, Navigation, Camera } from 'lucide-react';
import { RouteWeatherPlanner } from '@/components/tools/RouteWeatherPlanner';

export const metadata: Metadata = {
  title: 'Canada Highway Route Weather Planner | Segment Elevation & Mountain Pass Cams',
  description:
    'Plan road trips across Canada with mile-by-mile highway weather forecasting, mountain pass camera feeds, black ice hazard detection, and elevation profiles for Coquihalla Hwy 5, Trans-Canada Hwy 1, and Hwy 401.',
  keywords: [
    'Canada highway weather planner',
    'Coquihalla route weather forecast',
    'Trans-Canada highway cameras weather',
    'Hwy 401 road conditions Toronto to Montreal',
    'mountain pass road weather Canada',
  ],
};

export default function RoutePlannerPage() {
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
          <Link href="/highways" className="hover:text-sky-400 transition-colors">
            Highways &amp; Passes
          </Link>
          <span>/</span>
          <span className="text-sky-400">Multi-Stop Route Weather Planner</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-black uppercase tracking-wider mb-3">
              <Car className="w-3.5 h-3.5" />
              Highway Meteorology &amp; Road Safety
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Highway <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-cyan-400">Route Weather Planner</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-medium">
              Analyze live weather across every leg of major Canadian highway corridors.
              Inspect elevation curves, sub-zero black ice warnings on mountain passes, and real-time highway cameras before you drive.
            </p>
          </div>
        </div>

        {/* Route Planner Interactive Component */}
        <RouteWeatherPlanner />
      </div>
    </div>
  );
}
