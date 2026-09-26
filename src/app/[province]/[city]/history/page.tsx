import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { History, ArrowLeft, Snowflake, Sun, CloudRain, Calendar, Award } from 'lucide-react';
import { getProvinceBySlug } from '@/data/provinces';
import { getCityBySlug } from '@/data/canadian-cities';
import { getCityClimateHistory } from '@/data/canadian-climate-history';

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
    title: `${city.name} Climate History & Monthly Averages - Weather by Month | WeatherCA`,
    description: `Detailed historical climate data for ${city.name}, ${prov.name}. Month-by-month temperature averages, annual snowfall (cm), rainfall, record high/low temperatures, and frost dates.`,
  };
}

export default async function HistoryPage({
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

  const climate = getCityClimateHistory(city.provinceCode, city.lat, 10);

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-3">
          <History className="w-3.5 h-3.5" />
          Canadian 30-Year Climate Normals (ECCC)
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {city.name} Climate History & Monthly Weather Averages
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Historical meteorological averages, seasonal temperature records, and precipitation patterns for{' '}
          {city.name}, {province.name}
        </p>
      </div>

      {/* Climate Records Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <Award className="w-4 h-4" />
            <span>All-Time High</span>
          </div>
          <div className="text-3xl font-black text-white mt-1">{climate.recordHigh.temp}°C</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Recorded in {climate.recordHigh.year}</div>
        </div>

        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <Snowflake className="w-4 h-4" />
            <span>All-Time Low</span>
          </div>
          <div className="text-3xl font-black text-white mt-1">{climate.recordLow.temp}°C</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Recorded in {climate.recordLow.year}</div>
        </div>

        <div className="p-5 rounded-2xl bg-sky-950/20 border border-sky-500/20 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-sky-400">
            <CloudRain className="w-4 h-4" />
            <span>Annual Snowfall</span>
          </div>
          <div className="text-3xl font-black text-white mt-1">{climate.annualSnowfallCm} cm</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Average yearly accumulation</div>
        </div>

        <div className="p-5 rounded-2xl bg-teal-950/20 border border-teal-500/20 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-teal-400">
            <Sun className="w-4 h-4" />
            <span>Sunshine Hours</span>
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {climate.sunshineHoursYear.toLocaleString()} hrs
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Annual total daylight</div>
        </div>
      </div>

      {/* Month-by-Month Climate Table */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            <span>Month-by-Month Weather Normals (Jan – Dec)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">30-Year Baseline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Month</th>
                <th className="p-4">Avg High (°C)</th>
                <th className="p-4">Avg Low (°C)</th>
                <th className="p-4">Rainfall (mm)</th>
                <th className="p-4">Snowfall (cm)</th>
                <th className="p-4">Precip Days</th>
                <th className="p-4">Sunshine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {climate.monthly.map((m) => (
                <tr key={m.month} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">{m.month}</td>
                  <td className="p-4 font-semibold text-amber-300">{m.avgHigh}°C</td>
                  <td className="p-4 font-semibold text-sky-400">{m.avgLow}°C</td>
                  <td className="p-4 text-slate-300">{m.rainfallMm} mm</td>
                  <td className="p-4 text-slate-300">
                    {m.snowfallCm > 0 ? (
                      <span className="font-semibold text-cyan-200">{m.snowfallCm} cm ❄️</span>
                    ) : (
                      '0 cm'
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{m.rainyDays + m.snowDays} days</td>
                  <td className="p-4 text-slate-300">{m.sunshineHours} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Canadian Winter Milestones */}
      <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Snowflake className="w-4 h-4 text-cyan-300" />
          <span>Snow Season Milestones for {city.name}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="font-bold text-white text-sm">Average First Snowfall:</div>
            <p>{climate.firstSnowAverage}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="font-bold text-white text-sm">Average Last Snowfall:</div>
            <p>{climate.lastSnowAverage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
