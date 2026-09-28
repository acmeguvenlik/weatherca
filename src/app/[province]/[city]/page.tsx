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
import { generateCityFaqs, generateCityFaqSchema } from '@/lib/city-faq';
import { HeroWeatherCard } from '@/components/HeroWeatherCard';
import { BentoGrid } from '@/components/BentoGrid';
import { WeatherRadar } from '@/components/WeatherRadar';
import { CanadaLiveExtremes } from '@/components/CanadaLiveExtremes';
import { CityFaqSection } from '@/components/CityFaqSection';
import { NearbyCitiesSection } from '@/components/NearbyCitiesSection';
import { CommunityWeatherPulse } from '@/components/CommunityWeatherPulse';

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
  const weatherSchema = generateWeatherSchema(forecast);
  const faqs = generateCityFaqs(forecast);
  const faqSchema = generateCityFaqSchema(faqs);
  const cond = getWeatherConditionInfo(forecast.current.weatherCode, forecast.current.isDay);

  // Other cities in the same province for contextual SEO linking
  const nearbyCities = getCitiesByProvince(province.code)
    .filter((c) => c.slug !== city.slug)
    .slice(0, 8);

  const isMinorSettlement = !city.featured && (city.population || 0) < 5000;

  return (
    <>
      {/* 1. Schema.org JSON-LD: WeatherForecast */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(weatherSchema) }}
      />
      {/* 2. Schema.org JSON-LD: FAQPage for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* National Live Extremes Pulse Header */}
        <CanadaLiveExtremes />

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

        {/* Real-Time Citizen Observer Verification Pulse */}
        <CommunityWeatherPulse cityName={city.name} />

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
              rel={isMinorSettlement ? 'nofollow' : undefined}
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
            rel={isMinorSettlement ? 'nofollow' : undefined}
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
            rel={isMinorSettlement ? 'nofollow' : undefined}
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

        {/* SEO Interactive FAQ Section with Schema */}
        <CityFaqSection
          cityName={city.name}
          provinceName={province.name}
          faqs={faqs}
        />

        {/* Regional Internal Linking Hub (Nearby Stations & Municipalities) */}
        <NearbyCitiesSection
          currentCityName={city.name}
          provinceSlug={province.slug}
          provinceName={province.name}
          nearbyCities={nearbyCities}
        />
      </div>
    </>
  );
}
