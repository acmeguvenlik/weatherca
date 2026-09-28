import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  MapPin,
  Building,
  Users,
  Compass,
  ArrowRight,
  ChevronRight,
  Radio,
  CloudSun,
  Thermometer,
  Snowflake,
  Sun,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';
import { getProvinceBySlug, PROVINCE_LIST } from '@/data/provinces';
import {
  getCitiesByProvince,
  getAllSettlementsByProvince,
  CANADIAN_CITIES,
} from '@/data/canadian-cities';
import { fetchCityWeather, getWeatherConditionInfo } from '@/lib/weather';
import { generateProvinceMetadata } from '@/lib/seo';
import { WeatherIcon } from '@/components/WeatherIcons';
import { WeatherRadar } from '@/components/WeatherRadar';
import { ProvinceSettlementsDirectory } from '@/components/ProvinceSettlementsDirectory';

export const revalidate = 86400; // 24-hour ISR cache

export async function generateStaticParams() {
  return PROVINCE_LIST.map((prov) => ({
    province: prov.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string }>;
}): Promise<Metadata> {
  const { province: slug } = await params;
  const province = getProvinceBySlug(slug);
  if (!province) return {};
  return generateProvinceMetadata(province);
}

export default async function ProvincePage({
  params,
}: {
  params: Promise<{ province: string }>;
}) {
  const { province: slug } = await params;
  const province = getProvinceBySlug(slug);

  if (!province) {
    notFound();
  }

  const primaryCities = getCitiesByProvince(province.code);
  const allSettlements = getAllSettlementsByProvince(province.code);

  const capitalCity =
    primaryCities.find((c) => c.isCapital || c.name.toLowerCase() === province.capital.toLowerCase()) ||
    primaryCities[0] ||
    allSettlements[0];

  let capitalForecast = null;
  if (capitalCity) {
    try {
      capitalForecast = await fetchCityWeather(capitalCity);
    } catch {
      capitalForecast = null;
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300">{province.name}</span>
      </div>

      {/* Provincial Hero Spotlight */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-indigo-950/60 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold font-mono text-sky-700 dark:text-sky-300">
              <span>{province.code}</span>
              <span>•</span>
              <span>{province.region}</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-300">{allSettlements.length.toLocaleString()} Tracked Locations</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {province.name}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-300">
                Weather &amp; Radar Center
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {province.climateSummary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Capital: <strong className="text-slate-900 dark:text-white">{province.capital}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Population: <strong className="text-slate-900 dark:text-white">{province.population.toLocaleString()}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Timezone: <strong className="text-slate-900 dark:text-white">{province.timezone}</strong>
              </span>
            </div>
          </div>

          {/* Capital City Live Card */}
          {capitalForecast && capitalCity && (
            <Link
              href={`/${province.slug}/${capitalCity.slug}`}
              className="p-6 rounded-3xl bg-white/90 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 border border-sky-300 dark:border-sky-500/40 shadow-xl shadow-sky-500/10 dark:shadow-2xl backdrop-blur-2xl transition-all group shrink-0 min-w-[300px] transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-xs text-sky-700 dark:text-sky-300 font-bold mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Capital Live Weather
                </span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{capitalCity.name}</div>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-5xl font-black text-slate-900 dark:text-white">
                  {Math.round(capitalForecast.current.temperature)}°C
                </span>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-300 block">
                    {getWeatherConditionInfo(capitalForecast.current.weatherCode, capitalForecast.current.isDay).condition}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Feels like {Math.round(capitalForecast.current.apparentTemperature)}°C
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <span>Wind: {capitalForecast.current.windSpeed} km/h</span>
                <span>Humidity: {capitalForecast.current.relativeHumidity}%</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Provincial Climate Normals & Fast Facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/85 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Thermometer className="w-4 h-4 text-rose-500" />
            <span>Region</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{province.region}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Canadian geographic zone</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/85 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Annual Sunshine</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">~2,150 Hours</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Solar radiation index</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/85 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Snowflake className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Winter Season</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Nov – April</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Sub-zero freeze cycle</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/85 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Radio className="w-4 h-4 text-emerald-500" />
            <span>ECCC Radar</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Dual-Pol S-Band</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">100% Operational</div>
        </div>
      </div>

      {/* Provincial Live Radar Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span>{province.name} Regional Precipitation Radar</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Live composite Doppler radar and precipitation movement across {province.name}
            </p>
          </div>
          <Link
            href="/radar"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1"
          >
            <span>National Mosaic</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <WeatherRadar
          lat={capitalCity ? capitalCity.lat : province.lat}
          lon={capitalCity ? capitalCity.lon : province.lon}
          cityName={capitalCity ? capitalCity.name : province.capital}
          provinceCode={province.code}
        />
      </section>

      {/* Primary Featured Metros in this Province */}
      {primaryCities.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Major Urban Centers &amp; Hubs in {province.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              High-density metropolitan forecast centers with live wind chill and hourly forecasts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {primaryCities.slice(0, 12).map((city) => (
              <Link
                key={city.slug}
                href={`/${province.slug}/${city.slug}`}
                className="p-4 rounded-2xl bg-white/85 hover:bg-white dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200/80 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-500/40 backdrop-blur-md transition-all group flex items-center justify-between shadow-sm hover:shadow-md dark:shadow-lg"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                    <span>{city.name}</span>
                    {city.isCapital && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        Cap
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Population: {city.population.toLocaleString()}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Settlement Directory (Curated prominent locations + total count) */}
      <section>
        <ProvinceSettlementsDirectory
          provinceName={province.name}
          provinceSlug={province.slug}
          provinceCode={province.code}
          totalCount={allSettlements.length}
          settlements={allSettlements.slice(0, 384).map((s) => ({
            slug: s.slug,
            name: s.name,
            provinceCode: s.provinceCode,
            isCapital: s.isCapital,
            featured: s.featured,
            population: s.population,
            postalCodePrefix: s.postalCodePrefix,
          }))}
        />
      </section>
    </div>
  );
}

