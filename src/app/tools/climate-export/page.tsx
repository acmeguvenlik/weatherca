import { Metadata } from 'next';
import Link from 'next/link';
import { Database, ArrowLeft, Download, FileSpreadsheet } from 'lucide-react';
import { ClimateDataExporter } from '@/components/tools/ClimateDataExporter';

export const metadata: Metadata = {
  title: 'Canada Historical Climate Data CSV & JSON Exporter | WeatherCA',
  description:
    'Export verified historical temperature, precipitation, snowfall, and peak wind observations for over 20,000 Canadian settlements and meteorological stations in standard CSV or JSON formats.',
  keywords: [
    'Canada weather data export CSV',
    'historical climate dataset Canada',
    'Environment Canada weather download',
    'Toronto climate history CSV',
    'Vancouver rainfall statistics JSON',
  ],
};

export default function ClimateExportPage() {
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
          <Link href="/almanac" className="hover:text-emerald-400 transition-colors">
            Almanac &amp; Data
          </Link>
          <span>/</span>
          <span className="text-emerald-400">Climate Data CSV/JSON Export</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-3">
              <Database className="w-3.5 h-3.5" />
              Open Data &amp; Research Access
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Historical <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Climate Data Export</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-medium">
              Download clean time-series datasets of Canadian meteorological observations.
              Calibrated for academic research, HVAC engineering calculations, civil construction planning, and environmental impact modeling.
            </p>
          </div>
        </div>

        {/* Exporter Console */}
        <ClimateDataExporter />
      </div>
    </div>
  );
}
