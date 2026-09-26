import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Clock, ArrowLeft, Droplets, Wind, Gauge, Sun } from 'lucide-react';
import { getProvinceBySlug } from '@/data/provinces';
import { getCityBySlug } from '@/data/canadian-cities';
import { fetchCityWeather, getWeatherConditionInfo } from '@/lib/weather';
import { WeatherIcon } from '@/components/WeatherIcons';

export const revalidate = 21600; // 6-hour ISR cache

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
    title: `${city.name} Hourly Weather Forecast - 48-Hour Detailed Outlook | WeatherCA`,
    description: `Hour-by-hour weather forecast for ${city.name}, ${prov.name}. Check temperatures, precipitation probability, wind speed, and humidity for the next 48 hours.`,
  };
}

export default async function HourlyPage({
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {city.name} Hourly Weather Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detailed 24 to 48-hour timeline generated with Canadian HRDPS high-resolution data
          </p>
        </div>
      </div>

      {/* Hourly Breakdown Table */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Time</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Temp (°C)</th>
                <th className="p-4">Feels Like</th>
                <th className="p-4">Precipitation</th>
                <th className="p-4">Wind (km/h)</th>
                <th className="p-4">Humidity</th>
                <th className="p-4">Pressure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {forecast.hourly.map((h, i) => {
                const cond = getWeatherConditionInfo(h.weatherCode, h.isDay);
                return (
                  <tr key={h.time} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white whitespace-nowrap">
                      {i === 0 ? 'Now' : h.formattedHour}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <WeatherIcon code={h.weatherCode} isDay={h.isDay} size={20} />
                        <span className="text-xs text-slate-300">{cond.condition}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white text-base">{h.temperature}°</td>
                    <td className="p-4 text-xs text-slate-300">{h.apparentTemperature}°</td>
                    <td className="p-4">
                      {h.precipitationProbability > 0 ? (
                        <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" />
                          {h.precipitationProbability}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">0%</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      {h.windSpeed} km/h
                    </td>
                    <td className="p-4 text-xs text-slate-300">{h.relativeHumidity}%</td>
                    <td className="p-4 text-xs font-mono text-slate-400">{h.pressure} hPa</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
