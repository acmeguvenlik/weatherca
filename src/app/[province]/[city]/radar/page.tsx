import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, Radio, Layers, Info } from 'lucide-react';
import { getProvinceBySlug } from '@/data/provinces';
import { getCityBySlug } from '@/data/canadian-cities';
import { WeatherRadar } from '@/components/WeatherRadar';

export const revalidate = 604800; // 7-day ISR cache

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
    title: `${city.name} Live Weather Radar - Doppler Precipitation & Snow Tracking | WeatherCA`,
    description: `Real-time interactive weather radar for ${city.name}, ${prov.name}. Track rain, snowstorms, freezing rain, and thunderstorms moving across the region with high-precision Canadian radar.`,
  };
}

export default async function RadarPage({
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        href={`/${province.slug}/${city.slug}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to {city.name} Main Forecast</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Radio className="w-7 h-7 text-sky-400 animate-pulse" />
          <span>{city.name} Live Doppler Weather Radar</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          High-definition precipitation scanner and storm tracker for {city.name} and surrounding region of{' '}
          {province.name}
        </p>
      </div>

      <WeatherRadar
        lat={city.lat}
        lon={city.lon}
        cityName={city.name}
        provinceCode={province.code}
      />

      {/* Radar Information and Guide */}
      <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl space-y-3 text-xs text-slate-300">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400" />
          <span>Understanding Canadian Doppler Radar</span>
        </h3>
        <p className="leading-relaxed">
          The Canadian radar network operates S-band and C-band dual-polarization Doppler radar stations across
          the country. Dual-polarization technology allows meteorologists and algorithms to distinguish between
          rain, wet snow, dry snow, hail, ice pellets, and freezing rain with extreme precision.
        </p>
      </div>
    </div>
  );
}
