import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, ArrowLeft, Droplets, Sunrise, Sunset, Wind } from 'lucide-react';
import { getProvinceBySlug } from '@/data/provinces';
import { getCityBySlug } from '@/data/canadian-cities';
import { fetchCityWeather, getWeatherConditionInfo } from '@/lib/weather';
import { WeatherIcon } from '@/components/WeatherIcons';

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
    title: `${city.name} 14-Day Weather Forecast - Extended Trend & Outlook | WeatherCA`,
    description: `14-day weather forecast for ${city.name}, ${prov.name}. Extended long-range outlook, daily high/low temperatures, precipitation chances, and snowfall estimates.`,
  };
}

export default async function FourteenDayPage({
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
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {city.name} 14-Day Extended Forecast
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Two-week long-range trend forecast based on Canadian GEM ensemble model
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forecast.daily.map((day, idx) => {
          const cond = getWeatherConditionInfo(day.weatherCode, 1);
          const isToday = idx === 0;

          return (
            <div
              key={day.date}
              className={`p-5 rounded-3xl border transition-all ${
                isToday
                  ? 'bg-sky-500/15 border-sky-500/40 shadow-xl'
                  : 'bg-white/[0.05] border-white/10 hover:bg-white/[0.08]'
              } backdrop-blur-xl flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-white text-lg flex items-center gap-2">
                    <span>{isToday ? 'Today' : day.dayName}</span>
                    <span className="text-xs text-slate-400 font-normal">({day.date})</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">{cond.condition}</div>
                </div>

                <WeatherIcon code={day.weatherCode} size={32} />
              </div>

              <div className="flex items-baseline justify-between mt-6 pt-4 border-t border-white/10">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white">{day.temperatureMax}°</span>
                  <span className="text-lg font-medium text-sky-400">{day.temperatureMin}°</span>
                </div>

                <div className="text-xs text-right space-y-0.5">
                  <div className="text-sky-300 font-semibold flex items-center justify-end gap-1">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{day.precipitationProbabilityMax}% precip</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Max Wind: {day.windSpeedMax} km/h (Gusts: {day.windGustsMax} km/h)
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
