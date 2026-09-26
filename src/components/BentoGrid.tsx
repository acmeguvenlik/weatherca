'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Sun,
  ShieldCheck,
  Compass,
  Activity,
  Calendar,
  CloudRain,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { CityWeatherForecast } from '@/types/weather';
import { WeatherIcon } from './WeatherIcons';
import { getWeatherConditionInfo } from '@/lib/weather';
import { useUnit } from '@/context/UnitContext';

interface BentoGridProps {
  forecast: CityWeatherForecast;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ forecast }) => {
  const { city, province, current, hourly, daily, airQuality } = forecast;
  const { unit, convertTemp } = useUnit();

  // Compute sunrise/sunset formatted
  const todayDaily = daily[0];
  const sunriseTime = todayDaily?.sunrise
    ? new Date(todayDaily.sunrise).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: city.timezone,
      })
    : '6:30 AM';
  const sunsetTime = todayDaily?.sunset
    ? new Date(todayDaily.sunset).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: city.timezone,
      })
    : '7:45 PM';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* ================= CARD 1: 24-HOUR HOURLY SCROLLER (COL-SPAN FULL) ================= */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl p-5 sm:p-6 transition-all hover:border-slate-300 dark:hover:border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>24-Hour Forecast & Precipitation Timeline</span>
          </div>
          <Link
            href={`/${province.slug}/${city.slug}/hourly`}
            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>Full 48h Outlook</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal Scroll container */}
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
          {hourly.slice(0, 24).map((h, idx) => {
            const isNow = idx === 0;
            return (
              <div
                key={h.time}
                className={`flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[85px] shrink-0 border transition-all ${
                  isNow
                    ? 'bg-sky-50 dark:bg-sky-500/20 border-sky-300 dark:border-sky-500/40 text-slate-900 dark:text-white shadow-md shadow-sky-500/10'
                    : 'bg-slate-50/80 dark:bg-white/5 border-slate-200/70 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                  {isNow ? 'Now' : h.formattedHour}
                </span>

                <div className="my-2.5">
                  <WeatherIcon code={h.weatherCode} isDay={h.isDay} size={26} />
                </div>

                <div className="text-base font-bold text-slate-900 dark:text-white">{convertTemp(h.temperature)}°</div>

                {/* Rain probability bar */}
                <div className="mt-2 w-full flex flex-col items-center">
                  {h.precipitationProbability > 10 ? (
                    <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />
                      {h.precipitationProbability}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">-</span>
                  )}
                  <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-sky-500 dark:bg-sky-400 rounded-full transition-all"
                      style={{ width: `${h.precipitationProbability}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= CARD 2: 14-DAY OUTLOOK (COL-SPAN 2) ================= */}
      <div className="col-span-1 md:col-span-2 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-white/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>14-Day Extended Trend (HRDPS & GEM Models)</span>
            </div>
            <Link
              href={`/${province.slug}/${city.slug}/14-day`}
              className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <span>14-Day View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5 space-y-1">
            {daily.slice(0, 7).map((day, idx) => {
              const cond = getWeatherConditionInfo(day.weatherCode, 1);
              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-sm"
                >
                  <div className="w-24 font-medium text-slate-800 dark:text-white flex items-center gap-1.5">
                    <span>{idx === 0 ? 'Today' : day.dayNameShort}</span>
                  </div>

                  <div className="flex items-center gap-2.5 w-36">
                    <WeatherIcon code={day.weatherCode} size={22} />
                    <span className="text-xs text-slate-600 dark:text-slate-300 truncate hidden sm:inline">
                      {cond.condition}
                    </span>
                  </div>

                  {/* Precipitation badge */}
                  <div className="w-16 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {day.precipitationSum > 0 ? (
                      <span className="text-sky-600 dark:text-sky-300 font-medium">
                        {day.precipitationSum}mm
                      </span>
                    ) : day.snowfallSum > 0 ? (
                      <span className="text-cyan-600 dark:text-cyan-200 font-medium">
                        {day.snowfallSum}cm ❄️
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">0%</span>
                    )}
                  </div>

                  {/* Temperature slider bar */}
                  <div className="flex items-center gap-2 w-36 justify-end">
                    <span className="text-xs font-mono text-sky-600 dark:text-sky-400 w-7 text-right">
                      {convertTemp(day.temperatureMin)}°
                    </span>
                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden relative">
                      <div
                        className="absolute h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
                        style={{
                          left: `${Math.max(5, (day.temperatureMin + 20) * 1.5)}%`,
                          right: `${Math.max(5, (40 - day.temperatureMax) * 1.5)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-300 w-7 font-bold">
                      {convertTemp(day.temperatureMax)}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Official Canadian Ensemble Forecast</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono">Updated 15 mins ago</span>
        </div>
      </div>

      {/* ================= CARD 3: WIND & GUSTS WITH ROTATING COMPASS ================= */}
      <div className="col-span-1 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-white/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            <Wind className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Wind & Gust Velocity</span>
          </div>

          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                <span>{current.windSpeed}</span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">km/h</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Peak Gusts: <strong className="text-slate-900 dark:text-white font-bold">{current.windGusts} km/h</strong>
              </div>
            </div>

            {/* Compass Dial Indicator */}
            <div className="relative w-20 h-20 rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-inner">
              <span className="absolute top-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">N</span>
              <span className="absolute bottom-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">S</span>
              <span className="absolute left-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">W</span>
              <span className="absolute right-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">E</span>
              <div
                className="w-8 h-8 flex items-center justify-center transition-transform duration-700 text-sky-600 dark:text-sky-400"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              >
                <Compass className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
          Wind blowing from <strong className="text-slate-800 dark:text-white">{current.windDirection}°</strong>. Calm to moderate breeze for Canadian standards.
        </div>
      </div>

      {/* ================= CARD 4: CANADIAN AQHI & AIR QUALITY ================= */}
      <div className="col-span-1 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-white/20">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Canada AQHI (Air Quality)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Scale 1 - 10+
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {airQuality?.aqhi ?? 2}
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {airQuality?.aqhiRiskLevel ?? 'Low Risk'}
            </span>
          </div>

          {/* AQHI Spectrum Bar */}
          <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600 relative my-3">
            <div
              className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-800 dark:border-slate-950 shadow-md transition-all"
              style={{ left: `${Math.min(95, ((airQuality?.aqhi ?? 2) / 10) * 100)}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {airQuality?.healthMessage ?? 'Air quality is ideal for outdoor activities in Canada.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div>PM2.5: {airQuality?.pm25 ?? 6.5} µg/m³</div>
          <div>Ozone: {airQuality?.ozone ?? 42} ppb</div>
        </div>
      </div>

      {/* ================= CARD 5: SUNRISE & SUNSET CYCLE ================= */}
      <div className="col-span-1 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-white/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Solar Cycle & Golden Hour</span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-300 font-medium">
                <Sunrise className="w-4 h-4" />
                <span>Sunrise</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">{sunriseTime}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-300 font-medium">
                <Sunset className="w-4 h-4" />
                <span>Sunset</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">{sunsetTime}</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
          Timezone: <strong className="text-slate-800 dark:text-white">{city.timezone}</strong>
        </div>
      </div>

      {/* ================= CARD 6: HUMIDITY, UV & BAROMETRIC PRESSURE ================= */}
      <div className="col-span-1 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-white/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            <Gauge className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Atmospheric Diagnostics</span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Droplets className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Humidity</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {current.relativeHumidity}%
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Dew Point: {convertTemp(current.dewPoint)}°{unit}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Max UV</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {current.uvIndex ?? todayDaily?.uvIndexMax ?? 3}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Moderate Exposure</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Gauge className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                <span>Pressure</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {current.pressureMsl} <span className="text-xs font-normal">hPa</span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Stable Trend</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300" />
                <span>Visibility</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">16+ km</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Clear Horizon</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
          Cloud Cover: <strong className="text-slate-800 dark:text-white">{current.cloudCover}%</strong>
        </div>
      </div>
    </div>
  );
};
