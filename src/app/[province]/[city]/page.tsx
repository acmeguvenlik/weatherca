import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  HelpCircle,
  MapPin,
  ChevronRight,
  Sparkles,
  Radio,
  Clock,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import { getProvinceBySlug, PROVINCE_LIST } from '@/data/provinces';
import { CANADIAN_CITIES, getCityBySlug, getCitiesByProvince } from '@/data/canadian-cities';
import { fetchCityWeather, getWeatherConditionInfo } from '@/lib/weather';
import { generateCityMetadata, generateWeatherSchema } from '@/lib/seo';
import { HeroWeatherCard } from '@/components/HeroWeatherCard';
import { BentoGrid } from '@/components/BentoGrid';
import { WeatherRadar } from '@/components/WeatherRadar';

export const revalidate = 86400; // 24-hour ISR cache

export async function generateStaticParams() {
  // Prerender top featured cities for instantaneous loading
  return CANADIAN_CITIES.filter((c) => c.featured)
    .slice(0, 12)
    .map((city) => {
      const prov = PROVINCE_LIST.find((p) => p.code === city.provinceCode);
      return {
        province: prov ? prov.slug : city.provinceCode.toLowerCase(),
        city: city.slug,
      };
    });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string; city: string }>;
}): Promise<Metadata> {
  const { province: provSlug, city: citySlug } = await params;
  const city = getCityBySlug(provSlug, citySlug);
  if (!city) return {};

  try {
    const forecast = await fetchCityWeather(city);
    return generateCityMetadata(forecast);
  } catch {
    return {
      title: `${city.name} Weather Forecast | WeatherCA`,
    };
  }
}

export default async function CityForecastPage({
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
  const schemaJson = generateWeatherSchema(forecast);
  const cond = getWeatherConditionInfo(forecast.current.weatherCode, forecast.current.isDay);

  // Other cities in the same province for contextual SEO linking
  const nearbyCities = getCitiesByProvince(province.code)
    .filter((c) => c.slug !== city.slug)
    .slice(0, 8);

  return (
    <>
      {/* Schema.org JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
          <Link href="/" className="hover:underline">
            Canada
          </Link>
          <span>/</span>
          <Link href={`/${province.slug}`} className="hover:underline">
            {province.name}
          </Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">{city.name}</span>
        </div>

        {/* Hero Weather Card */}
        <HeroWeatherCard forecast={forecast} />

        {/* Comprehensive 2026 Bento Grid */}
        <BentoGrid forecast={forecast} />

        {/* Interactive Radar Section */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span>{city.name} Live Precipitation Radar</span>
            </h2>
            <Link
              href={`/${province.slug}/${city.slug}/radar`}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <span>Full Screen View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <WeatherRadar
            lat={city.lat}
            lon={city.lon}
            cityName={city.name}
            provinceCode={province.code}
          />
        </section>

        {/* Climate History & AQHI Deep Dive Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/${province.slug}/${city.slug}/history`}
            className="p-5 rounded-3xl bg-indigo-50/90 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-500/40 backdrop-blur-xl transition-all group flex flex-col justify-between shadow-sm dark:shadow-none"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 font-semibold mb-2">
                <span>Climate Normals</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-200 transition-colors">
                {city.name} 30-Year Weather History & Monthly Averages
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Explore month-by-month temperatures, annual snowfall in cm, rainy days, and historical record highs and lows.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
              <span>View Jan - Dec Climate Table</span>
              <span>→</span>
            </div>
          </Link>

          <Link
            href={`/${province.slug}/${city.slug}/air-quality`}
            className="p-5 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 backdrop-blur-xl transition-all group flex flex-col justify-between shadow-sm dark:shadow-none"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-semibold mb-2">
                <span>Health & Environment</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-200 transition-colors">
                {city.name} Air Quality & Wildfire Smoke Report
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Detailed Canadian AQHI breakdown, fine particulate matter (PM2.5), ground-level ozone, and health guidance.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span>View AQHI Health Index</span>
              <span>→</span>
            </div>
          </Link>
        </section>

        {/* SEO Frequently Asked Questions Section (FAQPage Rich Results) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl space-y-6">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions About Weather in {city.name}, {province.code}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                What is the current temperature and conditions in {city.name}?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                As of today, the temperature in {city.name} is {forecast.current.temperature}°C with{' '}
                {cond.condition.toLowerCase()}. The apparent temperature (feels like) is{' '}
                {forecast.current.apparentTemperature}°C with relative humidity at{' '}
                {forecast.current.relativeHumidity}%.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                How does Wind Chill and Humidex affect {city.name}?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {forecast.current.temperature <= 0
                  ? `With winter temperatures active, the Canadian Wind Chill factor is currently ${forecast.current.windChill ?? forecast.current.temperature}°C. The frostbite risk level is rated as ${forecast.current.frostbiteRiskLevel}.`
                  : `During warmer conditions, the Canadian Humidex indicates comfort levels. The current Humidex is ${forecast.current.humidex ?? forecast.current.temperature} (${forecast.current.humidexCategory}).`}
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                What is the Air Quality Health Index (AQHI) for {city.name}?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                The current AQHI for {city.name} is {forecast.airQuality?.aqhi ?? 2} (
                {forecast.airQuality?.aqhiRiskLevel ?? 'Low Risk'}). It is calculated based on ground-level
                ozone, fine particulate matter (PM2.5), and nitrogen dioxide levels according to Health Canada
                standards.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Where does the meteorological data for {city.name} come from?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Forecasts are generated using high-resolution Canadian Deterministic Prediction System (HRDPS
                2.5km) and Global Environmental Multiscale (GEM) models alongside official Environment and
                Climate Change Canada Doppler radar feeds.
              </p>
            </div>
          </div>
        </section>

        {/* Nearby Cities in the Same Province (Internal Linking Powerhouse) */}
        {nearbyCities.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Other Forecasts in {province.name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {nearbyCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${province.slug}/${c.slug}`}
                  className="p-3.5 rounded-xl bg-white/85 hover:bg-white dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200/80 hover:border-sky-300 dark:border-white/5 dark:hover:border-sky-500/30 text-xs transition-all flex items-center justify-between group shadow-sm hover:shadow-md dark:shadow-none"
                >
                  <span className="font-medium text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300">{c.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
