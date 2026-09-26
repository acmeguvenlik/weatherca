import { Metadata } from 'next';
import Link from 'next/link';
import { Trees, ArrowLeft, Download, WifiOff } from 'lucide-react';
import { OfflineParksHub } from '@/components/tools/OfflineParksHub';

export const metadata: Metadata = {
  title: 'Canadian National Parks Offline Weather Hub | Trail Safety & PWA Cache',
  description:
    'Save and cache mountain weather forecasts, emergency satellite frequencies, and trail safety advisories for Banff, Jasper, Algonquin, and Gros Morne for offline wilderness expeditions with zero cellular connection.',
  keywords: [
    'Banff offline weather forecast',
    'Jasper trail weather offline',
    'Algonquin park canoe weather',
    'Canada national park weather PWA',
    'wilderness emergency frequencies Canada',
  ],
};

export default function OfflineHubPage() {
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
          <Link href="/ski" className="hover:text-emerald-400 transition-colors">
            Parks &amp; Outdoors
          </Link>
          <span>/</span>
          <span className="text-emerald-400">Offline National Parks Hub</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-3">
              <Trees className="w-3.5 h-3.5" />
              Wilderness Expedition Readiness
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              National Parks <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Offline Weather Hub</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-medium">
              Pre-load high-altitude park forecasts, emergency warden VHF frequencies, and trail conditions into your device cache before heading into backcountry off-grid wilderness zones.
            </p>
          </div>
        </div>

        {/* Offline Parks Interactive Component */}
        <OfflineParksHub />
      </div>
    </div>
  );
}
