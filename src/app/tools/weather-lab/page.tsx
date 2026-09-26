import { Metadata } from 'next';
import Link from 'next/link';
import { Zap, ArrowLeft, Sliders, Activity } from 'lucide-react';
import { WeatherSimulatorLab } from '@/components/tools/WeatherSimulatorLab';

export const metadata: Metadata = {
  title: 'Atmospheric Weather Simulator Lab | CAPE, Wind Shear & Disaster Replay',
  description:
    'Interactive Canadian meteorological simulation sandbox. Test thermodynamic stability, calculate CAPE and Lifted Index, and replay historic disasters like the 1998 Ice Storm, 2021 Heat Dome, and Edmonton F4 Tornado.',
  keywords: [
    'meteorological simulator',
    'CAPE calculator weather',
    'severe thunderstorm simulator',
    '1998 ice storm replay',
    'atmospheric stability lab',
  ],
};

export default function WeatherLabPage() {
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
          <Link href="/tools/calculator" className="hover:text-amber-400 transition-colors">
            Tools &amp; Studios
          </Link>
          <span>/</span>
          <span className="text-amber-400">Atmospheric Weather Simulator Lab</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              Thermodynamic Sandbox &amp; Simulation
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Atmospheric <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400">Weather Lab</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-medium">
              Simulate atmospheric instability, Convective Available Potential Energy (CAPE), and vertical wind shear across Canadian weather scenarios.
            </p>
          </div>
        </div>

        {/* Simulator Interactive Component */}
        <WeatherSimulatorLab />
      </div>
    </div>
  );
}
