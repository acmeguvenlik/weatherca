import React from 'react';
import Link from 'next/link';
import { PROVINCE_LIST } from '@/data/provinces';
import { ShieldCheck, Radio, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-24 border-t border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-slate-950/80 backdrop-blur-2xl text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        {/* Top: Brand & Mission */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-slate-200 dark:border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-red-600/30">
                🍁
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Weather<span className="text-sky-600 dark:text-sky-400">CA</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold">
                Canada 2026 Pro
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Canada&apos;s state-of-the-art meteorological network delivering high-precision weather forecasts,
              live Doppler precipitation radar, and official Environment Canada alerts for all 10 provinces
              and 3 northern territories.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xs text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Environment Canada Verified</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xs text-slate-800 dark:text-slate-200">
              <Radio className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>HRDPS 2.5km Resolution</span>
            </div>
          </div>
        </div>

        {/* Middle 1: Fast Tools & Specialized Centers */}
        <div className="py-8 border-b border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-xs">
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <span>⛷️ Ski & Winter Sports</span>
            </h5>
            <ul className="space-y-2">
              <li>
                <Link href="/ski" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Canada Ski Resorts & Snow Reports
                </Link>
              </li>
              <li>
                <Link href="/ski/whistler-blackcomb" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Whistler Blackcomb Snowpack
                </Link>
              </li>
              <li>
                <Link href="/ski/banff-sunshine" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Banff Sunshine Village
                </Link>
              </li>
              <li>
                <Link href="/ski/mont-tremblant" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Mont-Tremblant Resort (QC)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <span>🧮 Climate &amp; Outdoor Tools</span>
            </h5>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/wildfire-smoke" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  🔥 Wildfire &amp; Smoke Tracker
                </Link>
              </li>
              <li>
                <Link href="/tools/solunar" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  🎣 Solunar &amp; Fishing Forecast
                </Link>
              </li>
              <li>
                <Link href="/tools/aviation" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  ✈️ Aviation METAR / TAF
                </Link>
              </li>
              <li>
                <Link href="/tools/agriculture" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  🌾 Agriculture &amp; GDD Index
                </Link>
              </li>
              <li>
                <Link href="/tools/travel-briefing" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                  🖨️ Travel Weather Briefing PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/marine-tides" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  🌊 Marine &amp; Coastal Tides
                </Link>
              </li>
              <li>
                <Link href="/tools/route-planner" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                  🚗 Route Weather Planner
                </Link>
              </li>
              <li>
                <Link href="/tools/weather-lab" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  ⚡ Atmospheric Simulator Lab
                </Link>
              </li>
              <li>
                <Link href="/tools/offline-hub" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  🌲 National Parks Offline Hub
                </Link>
              </li>
              <li>
                <Link href="/tools/calculator" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Wind Chill &amp; Humidex Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/compare" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Compare Canadian Cities
                </Link>
              </li>
              <li>
                <Link href="/tools/aurora" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Aurora Borealis Tracker
                </Link>
              </li>
              <li>
                <Link href="/tools/widget" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Weather Widget Studio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <span>📡 Radar & Safety</span>
            </h5>
            <ul className="space-y-2">
              <li>
                <Link href="/radar" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  National Doppler Radar
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Severe Weather Warnings
                </Link>
              </li>
              <li>
                <Link href="/highways" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Mountain Pass & Highway Weather
                </Link>
              </li>
              <li>
                <Link href="/provinces" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  All 13 Provinces & Territories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <span>🍁 Météo Canada (FR)</span>
            </h5>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/quebec/montreal" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Météo Montréal (QC)
                </Link>
              </li>
              <li>
                <Link href="/quebec/quebec-city" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Météo Ville de Québec
                </Link>
              </li>
              <li>
                <Link href="/ski/le-massif" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                  Le Massif de Charlevoix
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle 2: Provinces and Territories Directory (SEO Dominance) */}
        <div className="py-10 border-b border-slate-200 dark:border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Canadian Provinces & Territories Forecast Directory</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-4 text-xs">
            {PROVINCE_LIST.map((prov) => (
              <Link
                key={prov.code}
                href={`/${prov.slug}`}
                className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors flex items-center gap-1.5"
              >
                <span className="font-semibold text-slate-800 dark:text-white/90">{prov.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">({prov.code})</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom: Legal & Data Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} WeatherCA.net. All rights reserved. Data sourced from Environment and
            Climate Change Canada (ECCC) & MSC GeoMet.
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-5 text-xs">
            <Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              About WeatherCA
            </Link>
            <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Contact & Inquiries
            </Link>
            <Link href="/methodology" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Scientific Methodology
            </Link>
            <Link href="/faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Help & FAQ
            </Link>
            <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Weather Stories
            </Link>
            <Link href="/feed.xml" className="hover:text-amber-500 font-mono transition-colors">
              RSS Feed
            </Link>
            <Link href="/tools/climate-export" className="hover:text-emerald-500 transition-colors">
              Climate Data Export
            </Link>
            <Link href="/alerts" className="hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors">
              Severe Alerts
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              XML Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
