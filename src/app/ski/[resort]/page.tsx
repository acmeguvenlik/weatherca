import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  Snowflake,
  Mountain,
  Wind,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  Compass,
  Layers,
  Thermometer,
  Eye,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { getSkiResortBySlug, CANADIAN_SKI_RESORTS } from '@/data/canadian-ski-resorts';

export const revalidate = 86400; // 24-hour ISR cache

export async function generateStaticParams() {
  return CANADIAN_SKI_RESORTS.map((resort) => ({
    resort: resort.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resort: string }>;
}): Promise<Metadata> {
  const { resort: slug } = await params;
  const resort = getSkiResortBySlug(slug);
  if (!resort) return {};

  return {
    title: `${resort.name} Snow Report & Mountain Weather - Live Conditions | WeatherCA`,
    description: `Official live snow report for ${resort.name}, ${resort.province}. 24-hour snowfall (${resort.snow.last24HoursCm} cm), base depth (${resort.snow.baseDepthCm} cm), summit wind chill, open runs, and Avalanche Canada ratings.`,
    openGraph: {
      title: `${resort.name} Snow Report | WeatherCA`,
      description: `Current snow depth: ${resort.snow.baseDepthCm} cm. 24h fresh powder: ${resort.snow.last24HoursCm} cm. Summit temperature: ${resort.weather.summitTempC}°C.`,
    },
  };
}

export default async function SkiResortDetailPage({
  params,
}: {
  params: Promise<{ resort: string }>;
}) {
  const { resort: slug } = await params;
  const resort = getSkiResortBySlug(slug);

  if (!resort) {
    notFound();
  }

  // JSON-LD Structured Data
  const skiJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SkiResort',
    name: resort.name,
    description: resort.highlights.join('. '),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: resort.lat,
      longitude: resort.lon,
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: resort.provinceCode,
      addressCountry: 'CA',
    },
    url: resort.websiteUrl,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skiJsonLd) }}
      />

      {/* Back & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/ski"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Ski Resorts
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-xs text-slate-400">{resort.province}</span>
        <span className="text-slate-600">/</span>
        <span className="text-xs font-semibold text-white">{resort.name}</span>
      </div>

      {/* Resort Header Hero Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/60 to-indigo-950/70 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
              <Mountain className="w-3.5 h-3.5" />
              {resort.mountainRange}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {resort.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              {resort.highlights.join(' • ')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <a
              href={resort.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all group"
            >
              <span>Official Mountain Webcams & Passes</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <div className="text-[11px] text-slate-400">
              Co-ordinates: {resort.lat.toFixed(2)}°N, {Math.abs(resort.lon).toFixed(2)}°W
            </div>
          </div>
        </div>
      </div>

      {/* Live Snow & Depth Metrics Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/20 backdrop-blur-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Snowflake className="w-4 h-4" />
            <span>24h Fresh Snow</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">+{resort.snow.last24HoursCm} cm</div>
          <div className="text-[11px] text-slate-400">48h: +{resort.snow.last48HoursCm} cm • 7d: +{resort.snow.last7DaysCm} cm</div>
        </div>

        <div className="p-6 rounded-3xl bg-sky-950/20 border border-sky-500/20 backdrop-blur-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <Layers className="w-4 h-4" />
            <span>Base Depth</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">{resort.snow.baseDepthCm} cm</div>
          <div className="text-[11px] text-slate-400">Summit Depth: {resort.snow.summitDepthCm} cm</div>
        </div>

        <div className="p-6 rounded-3xl bg-teal-950/20 border border-teal-500/20 backdrop-blur-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Runs & Trails Open</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">
            {resort.runs.open} <span className="text-lg font-semibold text-slate-400">/ {resort.runs.total}</span>
          </div>
          <div className="text-[11px] text-slate-400">{resort.lifts.open} of {resort.lifts.total} Lifts Spinning</div>
        </div>

        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/20 backdrop-blur-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Snowflake className="w-4 h-4" />
            <span>Condition</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white truncate">{resort.snow.condition}</div>
          <div className="text-[11px] text-slate-400">Season Total: {resort.snow.seasonTotalSnowfallCm} cm</div>
        </div>
      </div>

      {/* Elevation Gradient Weather Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summit vs Base Weather */}
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mountain className="w-5 h-5 text-sky-400" />
            <span>Mountain Elevation Weather Gradient</span>
          </h2>

          <div className="space-y-4">
            {/* Summit Station */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-cyan-300">Summit Station ({resort.summitElevationM}m)</div>
                <div className="text-sm font-medium text-slate-300 mt-0.5">{resort.weather.currentCondition}</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  <span>{resort.weather.summitWindKmH} km/h {resort.weather.windDirection}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">{resort.weather.summitTempC}°C</div>
                <div className="text-xs font-semibold text-sky-400">
                  Feels like {resort.weather.summitWindChillC}°C
                </div>
              </div>
            </div>

            {/* Base Station */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-300">Base Village ({resort.baseElevationM}m)</div>
                <div className="text-sm font-medium text-slate-300 mt-0.5">Freezing Level: {resort.weather.freezingLevelM}m</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-teal-400" />
                  <span>Visibility: {resort.weather.visibility}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">{resort.weather.baseTempC}°C</div>
                <div className="text-xs text-slate-400">Vertical Drop: {resort.verticalDropM}m</div>
              </div>
            </div>
          </div>

          {/* 3-Day Snow Forecast */}
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-sky-400" />
              <div>
                <div className="text-xs font-bold text-white">Next 72-Hour Snow Accumulation</div>
                <div className="text-xs text-slate-300">Canadian HRDPS High-Res Alpine Forecast</div>
              </div>
            </div>
            <div className="text-xl font-extrabold text-cyan-300">
              +{resort.snow.forecastNext3DaysCm} cm
            </div>
          </div>
        </div>

        {/* Avalanche Canada Bulletin & Safety */}
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Avalanche Canada Danger Rating</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                Official Bulletin
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 my-5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Alpine</div>
                <div className="text-sm font-bold text-amber-300 mt-1">{resort.avalancheDanger.alpine}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Treeline</div>
                <div className="text-sm font-bold text-slate-200 mt-1">{resort.avalancheDanger.treeline}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Below Treeline</div>
                <div className="text-sm font-bold text-emerald-300 mt-1">{resort.avalancheDanger.belowTreeline}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Hazard Summary: </strong>
                {resort.avalancheDanger.bulletinSummary}
              </div>
            </div>
          </div>

          {/* Terrain Breakdown Bar */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span className="text-emerald-400">● Beginner ({resort.runs.beginnerPercent}%)</span>
              <span className="text-sky-400">■ Intermediate ({resort.runs.intermediatePercent}%)</span>
              <span className="text-rose-400">◆ Advanced/Expert ({resort.runs.advancedPercent}%)</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex bg-white/10">
              <div style={{ width: `${resort.runs.beginnerPercent}%` }} className="bg-emerald-500" />
              <div style={{ width: `${resort.runs.intermediatePercent}%` }} className="bg-sky-500" />
              <div style={{ width: `${resort.runs.advancedPercent}%` }} className="bg-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
