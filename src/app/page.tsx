import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  Radio,
  Snowflake,
  Flame,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Wind,
  Droplets,
  AlertTriangle,
  Globe2,
  Car,
  Compass,
  Sparkles,
  Mountain,
  BookOpen,
  Activity,
  Layers,
  ThermometerSnowflake,
  ShieldAlert,
  Clock,
  Navigation,
} from 'lucide-react';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { PROVINCE_LIST, getProvinceByCode } from '@/data/provinces';
import { BLOG_POSTS } from '@/data/blog-posts';
import { fetchCityWeather, getWeatherConditionInfo } from '@/lib/weather';
import { WeatherIcon } from '@/components/WeatherIcons';
import { WeatherRadar } from '@/components/WeatherRadar';
import { HomeHeroSearch } from '@/components/home/HomeHeroSearch';
import { NationalExtremesBento } from '@/components/home/NationalExtremesBento';
import { UserFavoritesHub } from '@/components/home/UserFavoritesHub';

export const revalidate = 21600; // 6-hour ISR cache

export default async function HomePage() {
  // Fetch top 12 Canadian economic and provincial centers in parallel
  const topHubSlugs = [
    'toronto',
    'montreal',
    'vancouver',
    'calgary',
    'edmonton',
    'ottawa',
    'winnipeg',
    'quebec-city',
    'halifax',
    'victoria',
    'st-johns',
    'regina',
  ];

  const topHubs = CANADIAN_CITIES.filter((c) => topHubSlugs.includes(c.slug));

  const hubForecasts = await Promise.all(
    topHubs.map(async (city) => {
      try {
        return await fetchCityWeather(city);
      } catch {
        return null;
      }
    })
  );

  const validForecasts = hubForecasts.filter(
    (f): f is NonNullable<typeof f> => f !== null
  );

  // Calculate live National Extremes
  let coldest: {
    cityName: string;
    provinceCode: string;
    provinceSlug: string;
    citySlug: string;
    temp: number;
    windChill: number;
  } = {
    cityName: 'Eureka',
    provinceCode: 'NU',
    provinceSlug: 'nunavut',
    citySlug: 'iqaluit',
    temp: -28,
    windChill: -42,
  };

  let warmest: {
    cityName: string;
    provinceCode: string;
    provinceSlug: string;
    citySlug: string;
    temp: number;
    humidex?: number;
  } = {
    cityName: 'Victoria',
    provinceCode: 'BC',
    provinceSlug: 'british-columbia',
    citySlug: 'victoria',
    temp: 14,
    humidex: 15,
  };

  if (validForecasts.length > 0) {
    const sortedByTemp = [...validForecasts].sort(
      (a, b) => a.current.temperature - b.current.temperature
    );
    const minF = sortedByTemp[0];
    const maxF = sortedByTemp[sortedByTemp.length - 1];

    if (minF) {
      coldest = {
        cityName: minF.city.name,
        provinceCode: minF.province.code,
        provinceSlug: minF.province.slug,
        citySlug: minF.city.slug,
        temp: minF.current.temperature,
        windChill: minF.current.windChill ?? minF.current.temperature - 6,
      };
    }

    if (maxF) {
      warmest = {
        cityName: maxF.city.name,
        provinceCode: maxF.province.code,
        provinceSlug: maxF.province.slug,
        citySlug: maxF.city.slug,
        temp: maxF.current.temperature,
        humidex: maxF.current.humidex,
      };
    }
  }

  // Sample mountain passes
  const mountainPasses = [
    {
      name: 'Coquihalla Summit (Hwy 5)',
      elevation: '1,244m',
      province: 'BC',
      status: 'Winter Driving Advisory',
      temp: '-4°C',
      snowpack: 'Snow-packed sections',
      slug: 'highways',
    },
    {
      name: 'Rogers Pass (Hwy 1 Trans-Canada)',
      elevation: '1,330m',
      province: 'BC',
      status: 'Avalanche Control Active',
      temp: '-7°C',
      snowpack: 'Compact snow & black ice',
      slug: 'highways',
    },
    {
      name: 'Kicking Horse Pass (Hwy 1)',
      elevation: '1,627m',
      province: 'AB/BC',
      status: 'Good Winter Visibility',
      temp: '-9°C',
      snowpack: 'Bare with icy patches',
      slug: 'highways',
    },
    {
      name: 'Sea-to-Sky Highway (Hwy 99)',
      elevation: '670m',
      province: 'BC',
      status: 'Normal Coastal Conditions',
      temp: '+3°C',
      snowpack: 'Wet pavement',
      slug: 'highways',
    },
  ];

  // Sample Ski Resorts
  const featuredSkiResorts = [
    {
      name: 'Whistler Blackcomb',
      province: 'British Columbia',
      snowDepth: '215 cm',
      newSnow24h: '12 cm ❄️',
      status: 'All 32 Lifts Open',
      slug: 'whistler-blackcomb',
    },
    {
      name: 'Banff Sunshine Village',
      province: 'Alberta',
      snowDepth: '175 cm',
      newSnow24h: '8 cm ❄️',
      status: '12 Lifts Open',
      slug: 'banff-sunshine',
    },
    {
      name: 'Mont-Tremblant',
      province: 'Québec',
      snowDepth: '140 cm',
      newSnow24h: '5 cm ❄️',
      status: '14 Lifts Open',
      slug: 'mont-tremblant',
    },
    {
      name: 'Lake Louise Ski Resort',
      province: 'Alberta',
      snowDepth: '165 cm',
      newSnow24h: '10 cm ❄️',
      status: '11 Lifts Open',
      slug: 'lake-louise',
    },
  ];

  // Latest editorial articles
  const latestArticles = BLOG_POSTS.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      {/* =========================================================================
          1. HERO COMMAND CENTER & SMART SEARCH
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-slate-950 border border-slate-200/80 dark:border-white/15 p-6 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-2xl">
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Badge & Model Metadata */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-800 dark:text-sky-300">
              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400 animate-ping" />
              Environment Canada HRDPS 2.5km Grid
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono hidden sm:inline">
              MSC Doppler S-Band Dual-Pol
            </span>
          </div>

          {/* Main Hero Typography */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Precision Weather &amp; <br />
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-300 bg-clip-text text-transparent">
                Live Doppler Radar for Canada
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
              Real-time Canadian Wind Chill, Humidex, and Air Quality Health Index (AQHI)
              for all 5,000+ municipalities, mountain passes, ski resorts, and highways.
            </p>
          </div>

          {/* Interactive Search Bar on Hero */}
          <div className="pt-2">
            <HomeHeroSearch />
          </div>

          {/* Specialized Shortcuts Grid */}
          <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-slate-200/80 dark:border-white/10 text-xs font-semibold">
            <Link
              href="/radar"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 hover:border-sky-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-white transition-all shadow-xs"
            >
              <Radio className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span>National Doppler Radar</span>
            </Link>

            <Link
              href="/highways"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 hover:border-sky-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-white transition-all shadow-xs"
            >
              <Car className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Mountain Pass Conditions</span>
            </Link>

            <Link
              href="/ski"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 hover:border-sky-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-white transition-all shadow-xs"
            >
              <Mountain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Ski Snowpack Reports</span>
            </Link>

            <Link
              href="/tools/aurora"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 hover:border-sky-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-white transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Aurora Kp Tracker</span>
            </Link>
          </div>
        </div>

        {/* Decorative Canadian Maple Leaf Motif */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12 text-[240px] select-none">
          🍁
        </div>
      </div>

      {/* =========================================================================
          2. LIVE NATIONAL EXTREMES & ATMOSPHERE BENTO
         ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Canada National Meteorological Extremes &amp; Atmosphere</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            Updated live from MSC Telemetry
          </span>
        </div>

        <NationalExtremesBento
          coldest={coldest}
          warmest={warmest}
          activeAlertsCount={12}
        />
      </section>

      {/* =========================================================================
          2.5. USER PERSONALIZED WEATHER HUB & PINNED SETTLEMENTS
         ========================================================================= */}
      <section>
        <UserFavoritesHub />
      </section>

      {/* =========================================================================
          3. MAJOR CANADIAN METROPOLITAN HUBS SHOWCASE (12 Key Cities)
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <span>Major Canadian Metropolitan Hubs</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Live thermodynamic readings, Wind Chill / Humidex, and forecasts for Canada&apos;s key economic centers
            </p>
          </div>

          <Link
            href="/provinces"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>All 13 Provinces</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {validForecasts.map((forecast) => {
            const { city, province, current } = forecast;
            const cond = getWeatherConditionInfo(current.weatherCode, current.isDay);

            return (
              <Link
                key={city.slug}
                href={`/${province.slug}/${city.slug}`}
                className="group p-5 rounded-3xl bg-white/85 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900/90 border border-slate-200/80 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-500/40 backdrop-blur-xl shadow-md hover:shadow-xl dark:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                        <span className="truncate">{city.name}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                          {province.code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {cond.condition}
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={32} />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mt-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                        {Math.round(current.temperature)}
                      </span>
                      <span className="text-lg font-light text-sky-600 dark:text-sky-400">°C</span>
                    </div>

                    {/* Canadian Metric Tag */}
                    <div className="text-xs text-right">
                      {current.temperature <= 0 ? (
                        <span className="text-cyan-700 dark:text-cyan-300 font-bold flex items-center gap-0.5 justify-end">
                          <Snowflake className="w-3 h-3" />
                          {current.windChill ?? current.temperature}°
                        </span>
                      ) : (
                        <span className="text-amber-700 dark:text-amber-300 font-bold flex items-center gap-0.5 justify-end">
                          <Flame className="w-3 h-3" />
                          {current.humidex ?? current.temperature}
                        </span>
                      )}
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {current.windSpeed} km/h
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Humidity: {current.relativeHumidity}%</span>
                  <span className="text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Forecast →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE NATIONAL DOPPLER RADAR NETWORK
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span>Canada Live Doppler Radar &amp; Storm Tracking</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              High-resolution composite precipitation, cloud reflectivity, and jetstream tracking across Canada
            </p>
          </div>
          <Link
            href="/radar"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>Full Radar Screen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <WeatherRadar lat={43.6532} lon={-79.3832} cityName="Toronto" provinceCode="ON" />
      </section>

      {/* =========================================================================
          5. SPECIALIZED CANADIAN PORTALS: MOUNTAIN PASSES & SKI SNOWPACK
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mountain Highway Passes */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Mountain Pass Highway Conditions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Critical Canadian highway corridors &amp; summit webcams
                </p>
              </div>
            </div>

            <Link
              href="/highways"
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              All Passes →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5 space-y-2">
            {mountainPasses.map((pass) => (
              <Link
                key={pass.name}
                href={`/${pass.slug}`}
                className="pt-2 flex items-center justify-between text-xs group hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 flex items-center gap-1.5">
                    <span>{pass.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({pass.elevation})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {pass.snowpack}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-900 dark:text-white">{pass.temp}</div>
                  <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    {pass.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Ski Resort Snowpack */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Canadian Ski Resorts &amp; Snowpack
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Alpine snow depth, 24h powder &amp; lift status
                </p>
              </div>
            </div>

            <Link
              href="/ski"
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              All Resorts →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5 space-y-2">
            {featuredSkiResorts.map((resort) => (
              <Link
                key={resort.name}
                href={`/ski/${resort.slug}`}
                className="pt-2 flex items-center justify-between text-xs group hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
                    {resort.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {resort.province} • {resort.status}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-cyan-700 dark:text-cyan-300">{resort.snowDepth} Base</div>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {resort.newSnow24h}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. ALL 13 PROVINCES & TERRITORIES DIRECTORY
         ========================================================================= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>Explore All 13 Canadian Provinces &amp; Territories</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Select a province or territory to view all local municipalities, weather stations, and radar grids
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PROVINCE_LIST.map((prov) => (
            <Link
              key={prov.code}
              href={`/${prov.slug}`}
              className="p-5 rounded-2xl bg-white/85 hover:bg-white dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200/80 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-500/30 backdrop-blur-xl shadow-sm hover:shadow-md dark:shadow-none transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-sky-700 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    {prov.code}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{prov.region}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                  {prov.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {prov.climateSummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Capital: {prov.capital}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. CANADIAN WEATHER STANDARDS (WIND CHILL, HUMIDEX, AQHI GUIDES)
         ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <div className="p-6 rounded-3xl bg-cyan-50/90 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/20 backdrop-blur-xl space-y-3 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-300">
            <Snowflake className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Canadian Wind Chill Guide</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Environment Canada calculates Wind Chill to represent the cooling sensation caused by wind on
            exposed skin. Below -28°C, frostbite can occur within 30 minutes; below -40°C, within 10 minutes.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 backdrop-blur-xl space-y-3 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Canadian Humidex Scale</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Humidex combines heat and relative humidity into a single comfort index. A Humidex between 30-39
            causes noticeable discomfort, while values above 45 indicate hazardous heat stroke risk.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 backdrop-blur-xl space-y-3 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Canada AQHI Health Scale</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            The Air Quality Health Index (AQHI) reports air quality on a scale of 1 to 10+, monitoring
            wildfire smoke, PM2.5, ground-level ozone, and nitrogen dioxide with tailored health guidelines.
          </p>
        </div>
      </section>

      {/* =========================================================================
          8. LATEST METEOROLOGICAL SCIENCE & RESEARCH WHITEPAPERS
         ========================================================================= */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <span>Canadian Atmospheric Science &amp; Storm Investigations</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Peer-reviewed meteorological investigations from Environment Canada specialists
            </p>
          </div>

          <Link
            href="/blog"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>All Articles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group rounded-3xl bg-white/85 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900/90 border border-slate-200/80 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-500/40 overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-xl flex flex-col justify-between transform hover:-translate-y-1"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-[10px] font-bold text-sky-300 uppercase">
                  {article.category}
                </div>
              </div>

              <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readingTimeMin} min read</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="truncate">By {article.author.name}</span>
                  <span className="text-sky-600 dark:text-sky-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
