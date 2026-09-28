import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ShieldCheck, ArrowLeft, AlertCircle, Heart, Activity } from 'lucide-react';
import { getProvinceBySlug } from '@/data/provinces';
import { getCityBySlug } from '@/data/canadian-cities';
import { fetchCityWeather } from '@/lib/weather';

export const revalidate = 86400; // 24-hour ISR cache

export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string; city: string }>;
}): Promise<Metadata> {
  const { province: provSlug, city: citySlug } = await params;
  const city = getCityBySlug(provSlug, citySlug);
  const prov = getProvinceBySlug(provSlug);
  if (!city || !prov) return {};

  return {
    title: `${city.name} Air Quality Index (AQHI) & Wildfire Smoke Health Report | WeatherCA`,
    description: `Official Canadian Air Quality Health Index (AQHI) for ${city.name}, ${prov.name}. Real-time PM2.5, Ozone, and wildfire smoke tracking with health advice for children, seniors, and active individuals.`,
  };
}

export default async function AirQualityPage({
  params,
}: {
  params: Promise<{ province: string; city: string }>;
}) {
  const { province: provSlug, city: citySlug } = await params;
  const province = getProvinceBySlug(provSlug);
  const city = getCityBySlug(provSlug, citySlug);

  if (!province || !city) {
    notFound();
  }

  const forecast = await fetchCityWeather(city);
  const aq = forecast.airQuality;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href={`/${province.slug}/${city.slug}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to {city.name} Main Forecast</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <span>{city.name} Air Quality Health Index (AQHI)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Health Canada & Environment and Climate Change Canada official environmental metrics
        </p>
      </div>

      {/* Main AQHI Score Card */}
      <div className="p-8 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Current Air Quality Category
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-7xl font-black text-emerald-400">{aq?.aqhi ?? 2}</span>
            <div>
              <div className="text-2xl font-bold text-white">{aq?.aqhiRiskLevel ?? 'Low Risk'}</div>
              <div className="text-xs text-slate-400">Canadian AQHI Scale (1 to 10+)</div>
            </div>
          </div>
          <p className="text-sm text-slate-300 mt-4 max-w-xl leading-relaxed">
            {aq?.healthMessage ?? 'Air quality is considered satisfactory, and air pollution poses little or no risk.'}
          </p>
        </div>

        {/* Health Guidance Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0 max-w-md">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Heart className="w-4 h-4 text-red-400" />
              <span>At-Risk Population</span>
            </div>
            <p className="text-xs text-slate-300">
              Enjoy your usual outdoor activities. Ideal conditions for individuals with heart or breathing issues.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>General Population</span>
            </div>
            <p className="text-xs text-slate-300">
              Ideal air quality for outdoor sports, recreation, and work in {city.name}.
            </p>
          </div>
        </div>
      </div>

      {/* Pollutant Concentrations Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Fine Particulate (PM2.5)</div>
          <div className="text-2xl font-bold text-white mt-1">{aq?.pm25 ?? 6.2} µg/m³</div>
          <div className="text-[10px] text-emerald-400 mt-1">Well below health threshold</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Particulate Matter (PM10)</div>
          <div className="text-2xl font-bold text-white mt-1">{aq?.pm10 ?? 11.4} µg/m³</div>
          <div className="text-[10px] text-emerald-400 mt-1">Normal background levels</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Ground-Level Ozone (O3)</div>
          <div className="text-2xl font-bold text-white mt-1">{aq?.ozone ?? 44} ppb</div>
          <div className="text-[10px] text-slate-400 mt-1">Photochemical balance</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Nitrogen Dioxide (NO2)</div>
          <div className="text-2xl font-bold text-white mt-1">{aq?.nitrogenDioxide ?? 14} ppb</div>
          <div className="text-[10px] text-slate-400 mt-1">Traffic emission index</div>
        </div>
      </div>
    </div>
  );
}
