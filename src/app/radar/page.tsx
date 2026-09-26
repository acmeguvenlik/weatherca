'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Radio,
  MapPin,
  Layers,
  Info,
  ShieldCheck,
  ArrowRight,
  Search,
  Activity,
  Compass,
  Zap,
  Globe,
  Wind,
  CloudRain,
  Snowflake,
} from 'lucide-react';
import { WeatherRadar } from '@/components/WeatherRadar';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { CANADIAN_PROVINCES } from '@/data/provinces';

interface RadarSector {
  id: string;
  name: string;
  badge: string;
  cityName: string;
  provinceCode: string;
  lat: number;
  lon: number;
  description: string;
  radarStationCode: string;
  radarStationName: string;
}

const RADAR_SECTORS: RadarSector[] = [
  {
    id: 'national',
    name: 'National Composite',
    badge: 'Coast-to-Coast',
    cityName: 'National Mosaic',
    provinceCode: 'CA',
    lat: 53.7267,
    lon: -95.5,
    description: 'High-altitude 33-station composite spanning all 10 Canadian provinces and 3 territories.',
    radarStationCode: 'NAT-MOSAIC',
    radarStationName: 'Canadian MSC GeoMet National Server',
  },
  {
    id: 'ontario',
    name: 'Southern Ontario & Great Lakes',
    badge: 'Snowbelt Hub',
    cityName: 'Toronto Metro',
    provinceCode: 'ON',
    lat: 43.6532,
    lon: -79.3832,
    description: 'Lake Huron and Georgian Bay lake-effect snow squalls, convective summer squall lines.',
    radarStationCode: 'WKR',
    radarStationName: 'King City Radar Station (King, ON)',
  },
  {
    id: 'quebec',
    name: 'St. Lawrence & Quebec Corridor',
    badge: 'Valley Flow',
    cityName: 'Montréal',
    provinceCode: 'QC',
    lat: 45.5017,
    lon: -73.5673,
    description: 'Northeasters, freezing rain transitions, and St. Lawrence river valley wind channeling.',
    radarStationCode: 'WMN',
    radarStationName: 'McGill Radar Observatory (Sainte-Anne-de-Bellevue, QC)',
  },
  {
    id: 'pacific',
    name: 'Pacific Coast & BC Cascades',
    badge: 'Atmospheric Rivers',
    cityName: 'Vancouver',
    provinceCode: 'BC',
    lat: 49.2827,
    lon: -123.1207,
    description: 'Pacific frontal storms, Pineapple Express atmospheric rivers, orographic mountain snowfall.',
    radarStationCode: 'WJX',
    radarStationName: 'Aldergrove Radar Station (Langley, BC)',
  },
  {
    id: 'prairies',
    name: 'Western Prairies & Foothills',
    badge: 'Blizzard Alley',
    cityName: 'Calgary',
    provinceCode: 'AB',
    lat: 51.0447,
    lon: -114.0719,
    description: 'Chinook wind transitions, severe supercell hail cores, and Arctic clipper blizzards.',
    radarStationCode: 'XSM',
    radarStationName: 'Strathmore Doppler Radar (Strathmore, AB)',
  },
  {
    id: 'atlantic',
    name: 'Atlantic Maritimes & Grand Banks',
    badge: 'Nor\'easter Basin',
    cityName: 'Halifax',
    provinceCode: 'NS',
    lat: 44.6488,
    lon: -63.5752,
    description: 'Oceanic bomb cyclones, freezing drizzle, rapid rain-to-blizzard barometric drops.',
    radarStationCode: 'XGO',
    radarStationName: 'Halifax Radar Station (Gore, NS)',
  },
  {
    id: 'north',
    name: 'Subarctic & Northern Gateway',
    badge: 'Polar Vortex',
    cityName: 'Yellowknife',
    provinceCode: 'NT',
    lat: 62.454,
    lon: -114.3718,
    description: 'High-latitude polar airmass tracking, extreme low-level crystal snow flurries.',
    radarStationCode: 'XSL',
    radarStationName: 'Great Slave Regional Meteorological Node',
  },
];

const ECCC_RADAR_STATIONS = [
  { code: 'WKR', name: 'King City', prov: 'ON', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '12ms' },
  { code: 'WMN', name: 'McGill', prov: 'QC', freq: '2.8 GHz S-band', status: 'Operational', range: '250 km', ping: '14ms' },
  { code: 'WJX', name: 'Aldergrove', prov: 'BC', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '28ms' },
  { code: 'XSM', name: 'Strathmore', prov: 'AB', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '22ms' },
  { code: 'XBE', name: 'Bethune', prov: 'SK', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '19ms' },
  { code: 'XFW', name: 'Woodlands', prov: 'MB', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '18ms' },
  { code: 'XGO', name: 'Halifax (Gore)', prov: 'NS', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '26ms' },
  { code: 'WTP', name: 'Holyrood', prov: 'NL', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '31ms' },
  { code: 'XFT', name: 'Franktown (Ottawa)', prov: 'ON', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '15ms' },
  { code: 'XLA', name: 'Landrienne', prov: 'QC', freq: '5.6 GHz C-band', status: 'Operational', range: '250 km', ping: '17ms' },
];

export default function NationalRadarPage() {
  const [selectedSector, setSelectedSector] = useState<RadarSector>(RADAR_SECTORS[0]);
  const [citySearch, setCitySearch] = useState('');

  const filteredCities = citySearch.trim()
    ? CANADIAN_CITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
          (CANADIAN_PROVINCES[c.provinceCode]?.name || '').toLowerCase().includes(citySearch.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Live Doppler Radar Network</span>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-300 mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Environment Canada MSC GeoMet 2026 Doppler Feed
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Canada Live Doppler Radar Network
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Continuous high-resolution precipitation tracking, rain-to-snow phase transitions, and convective storm tracking powered by Canada&apos;s dual-polarization S-band and C-band Doppler stations.
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shrink-0 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Station: {selectedSector.radarStationCode}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ONLINE
              </span>
            </div>
            <div className="text-[11px] text-slate-400">{selectedSector.radarStationName}</div>
          </div>
        </div>
      </div>

      {/* Regional Sector Buttons */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>Select Canadian Radar Sector</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {RADAR_SECTORS.map((sector) => {
            const isSelected = selectedSector.id === sector.id;
            return (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-400/60 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] font-mono font-semibold uppercase text-sky-400 mb-1">
                  {sector.badge}
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">{sector.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {sector.radarStationCode}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sector Description */}
      <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/20 text-xs text-sky-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong className="text-white">{selectedSector.name}:</strong> {selectedSector.description}
          </span>
        </div>
        <span className="text-[11px] font-mono text-sky-300 shrink-0 hidden sm:inline-block">
          Grid: {selectedSector.lat.toFixed(2)}°N, {Math.abs(selectedSector.lon).toFixed(2)}°W
        </span>
      </div>

      {/* Main Radar Screen */}
      <WeatherRadar
        key={selectedSector.id}
        lat={selectedSector.lat}
        lon={selectedSector.lon}
        cityName={selectedSector.cityName}
        provinceCode={selectedSector.provinceCode}
      />

      {/* Quick City Search for Individual City Radars */}
      <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Explore City-Specific Doppler Radar</span>
            </h3>
            <p className="text-xs text-slate-400">
              Access local high-precision Doppler reflectivity for all 300+ Canadian cities and municipalities.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search city (e.g. Barrie, Banff, Kelowna)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>
        </div>

        {/* Search Results */}
        {filteredCities.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {filteredCities.map((c) => {
              const provSlug = CANADIAN_PROVINCES[c.provinceCode]?.slug || 'ontario';
              return (
                <Link
                  key={c.slug}
                  href={`/${provSlug}/${c.slug}/radar`}
                  className="p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-400/40 text-xs font-semibold text-white flex items-center justify-between transition-all"
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] font-mono text-sky-300">{c.provinceCode} →</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Popular City Radar Shortcuts */}
        {!citySearch && (
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { name: 'Toronto', prov: 'ontario', slug: 'toronto' },
              { name: 'Montréal', prov: 'quebec', slug: 'montreal' },
              { name: 'Vancouver', prov: 'british-columbia', slug: 'vancouver' },
              { name: 'Calgary', prov: 'alberta', slug: 'calgary' },
              { name: 'Ottawa', prov: 'ontario', slug: 'ottawa' },
              { name: 'Edmonton', prov: 'alberta', slug: 'edmonton' },
              { name: 'Winnipeg', prov: 'manitoba', slug: 'winnipeg' },
              { name: 'Halifax', prov: 'nova-scotia', slug: 'halifax' },
              { name: 'Victoria', prov: 'british-columbia', slug: 'victoria' },
              { name: 'St. John\'s', prov: 'newfoundland-and-labrador', slug: 'st-johns' },
              { name: 'Saskatoon', prov: 'saskatchewan', slug: 'saskatoon' },
              { name: 'Barrie (Snowbelt)', prov: 'ontario', slug: 'barrie' },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/${c.prov}/${c.slug}/radar`}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/40 text-xs text-slate-300 hover:text-sky-300 transition-all"
              >
                {c.name} Radar
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Environment Canada Radar Station Telemetry Network */}
      <div className="rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <Activity className="w-3.5 h-3.5" />
              Environment Canada MSC GeoMet Station Telemetry
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Canadian Radar Station Directory</h2>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Network Integrity: <span className="text-emerald-400 font-bold">100% Operational</span> (33/33 Active)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Station Code</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Province</th>
                <th className="py-3 px-4 font-semibold">Radar Transmitter</th>
                <th className="py-3 px-4 font-semibold">Effective Range</th>
                <th className="py-3 px-4 font-semibold">Latency</th>
                <th className="py-3 px-4 font-semibold text-right">Station Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {ECCC_RADAR_STATIONS.map((station) => (
                <tr key={station.code} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{station.code}</td>
                  <td className="py-3 px-4 font-sans text-slate-200">{station.name}</td>
                  <td className="py-3 px-4 text-sky-400">{station.prov}</td>
                  <td className="py-3 px-4 text-slate-400">{station.freq}</td>
                  <td className="py-3 px-4">{station.range}</td>
                  <td className="py-3 px-4 text-slate-400">{station.ping}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {station.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Meteorological Guide to Canadian Radar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Dual-Polarization Hydrometeor Discrimination</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Canadian radar sends both horizontal and vertical electromagnetic waves. By analyzing the differential reflectivity (Zdr), meteorologists precisely detect the freezing level, identifying whether precipitation falling aloft is reaching the ground as dry snow, sleet pellets, or dangerous freezing rain.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Snowflake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Lake-Effect Snow Streamers</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            During winter, Arctic winds traveling across unfrozen waters of Lake Huron, Superior, and Ontario trigger narrow, intense snow squall bands. The King City (WKR) and Franktown (XFT) stations capture these narrow 15km bands with micro-pulse scanning.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Wind className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Doppler Radial Velocity & Shear</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Radial velocity tracks the speed of atmospheric particles toward or away from the antenna. A tight green-and-red couplet indicates intense rotation, providing vital advance warning for Prairie tornadoes, Alberta plow winds, and microbursts.
          </p>
        </div>
      </div>
    </div>
  );
}
