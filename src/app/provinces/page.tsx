import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Globe, MapPin, ChevronRight, Building, Users, Sparkles } from 'lucide-react';
import { PROVINCE_LIST } from '@/data/provinces';
import { CANADIAN_CITIES, getCitiesByProvince } from '@/data/canadian-cities';

export const metadata: Metadata = {
  title: 'Canadian Provinces & Territories Weather Forecast Directory | WeatherCA',
  description:
    'Comprehensive weather directory covering all 10 Canadian provinces and 3 territories. Explore regional forecasts, Doppler radar stations, and climate summaries.',
};

export default function ProvincesIndexPage() {
  const regions = [
    'Western Canada',
    'Central Canada',
    'Atlantic Canada',
    'Northern Canada',
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">All Provinces & Territories</span>
      </div>

      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Canadian Provinces & Territories Directory
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Browse weather forecasts, live radar streams, and severe weather warnings across all 13 Canadian
          jurisdictions. Select any province to view its regional climate overview and localized municipal
          forecasts.
        </p>
      </div>

      {/* Regional Grouping */}
      <div className="space-y-12">
        {regions.map((region) => {
          const provsInRegion = PROVINCE_LIST.filter((p) => p.region === region);
          if (provsInRegion.length === 0) return null;

          return (
            <section key={region} className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <Globe className="w-5 h-5 text-sky-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">{region}</h2>
                <span className="text-xs text-slate-400 font-mono">
                  ({provsInRegion.length} {provsInRegion.length === 1 ? 'Jurisdiction' : 'Jurisdictions'})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {provsInRegion.map((prov) => {
                  const cityCount = getCitiesByProvince(prov.code).length;

                  return (
                    <Link
                      key={prov.code}
                      href={`/${prov.slug}`}
                      className="p-6 rounded-3xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-sky-500/40 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {prov.code}
                          </span>
                          <span className="text-xs text-slate-400">
                            {cityCount} Local {cityCount === 1 ? 'Station' : 'Stations'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                            {prov.name}
                          </h3>
                          {prov.nameFr && prov.nameFr !== prov.name && (
                            <div className="text-xs text-slate-400">Français: {prov.nameFr}</div>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {prov.climateSummary}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          Cap: <strong className="text-white">{prov.capital}</strong>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
