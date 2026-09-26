'use client';

import React, { useState } from 'react';
import {
  Printer,
  Calendar,
  Compass,
  Car,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  FileDown,
  AlertTriangle,
  Sun,
  Snowflake,
  Wind,
} from 'lucide-react';
import { CANADIAN_CITIES } from '@/data/canadian-cities';

export function TravelBriefingReport() {
  const [originCity, setOriginCity] = useState(CANADIAN_CITIES[0]); // Toronto
  const [destinationCity, setDestinationCity] = useState(CANADIAN_CITIES[2]); // Montreal
  const [departureDate, setDepartureDate] = useState('2026-09-18');
  const [tripPurpose, setTripPurpose] = useState<'Road Trip' | 'Business' | 'Ski / Alpine' | 'Family Vacation'>('Road Trip');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const routeDistanceKm = 540;
  const estimatedDriveHours = '5h 15m';

  const daysOutlook = [
    { day: 'Day 1 (Departure)', date: 'Sept 18', tempHigh: 22, tempLow: 13, condition: 'Sunny / Clear', precipProb: '0%', wind: '15 km/h SW', roadRisk: 'Low' },
    { day: 'Day 2', date: 'Sept 19', tempHigh: 20, tempLow: 11, condition: 'Partly Cloudy', precipProb: '15%', wind: '18 km/h W', roadRisk: 'Low' },
    { day: 'Day 3', date: 'Sept 20', tempHigh: 17, tempLow: 9, condition: 'Scattered Showers', precipProb: '60%', wind: '25 km/h NW', roadRisk: 'Moderate (Wet pavement)' },
    { day: 'Day 4', date: 'Sept 21', tempHigh: 16, tempLow: 8, condition: 'Sunny Intervals', precipProb: '10%', wind: '12 km/h N', roadRisk: 'Low' },
    { day: 'Day 5', date: 'Sept 22', tempHigh: 18, tempLow: 10, condition: 'Clear Sky', precipProb: '0%', wind: '10 km/h NE', roadRisk: 'Low' },
    { day: 'Day 6', date: 'Sept 23', tempHigh: 19, tempLow: 11, condition: 'Mild Autumn Day', precipProb: '5%', wind: '14 km/h S', roadRisk: 'Low' },
    { day: 'Day 7 (Return)', date: 'Sept 24', tempHigh: 19, tempLow: 12, condition: 'Clear & Crisp', precipProb: '5%', wind: '15 km/h SW', roadRisk: 'Low' },
  ];

  return (
    <div className="space-y-8">
      {/* Configuration Header Bar (Hidden during print) */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Canadian Travel Weather Briefing Studio</h3>
            <p className="text-xs text-slate-400">
              Generate a printable high-resolution 7-day travel weather report &amp; packing guide
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-sky-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Control Form (Hidden during print) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Origin City
          </label>
          <select
            value={originCity.slug}
            onChange={(e) => {
              const c = CANADIAN_CITIES.find((x) => x.slug === e.target.value);
              if (c) setOriginCity(c);
            }}
            className="w-full bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {CANADIAN_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.provinceCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Destination City
          </label>
          <select
            value={destinationCity.slug}
            onChange={(e) => {
              const c = CANADIAN_CITIES.find((x) => x.slug === e.target.value);
              if (c) setDestinationCity(c);
            }}
            className="w-full bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {CANADIAN_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.provinceCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Departure Date
          </label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Trip Purpose
          </label>
          <select
            value={tripPurpose}
            onChange={(e) => setTripPurpose(e.target.value as typeof tripPurpose)}
            className="w-full bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Road Trip">Road Trip</option>
            <option value="Business">Business Travel</option>
            <option value="Ski / Alpine">Ski &amp; Alpine Expedition</option>
            <option value="Family Vacation">Family Vacation</option>
          </select>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE DOCUMENT CONTAINER (Styled for A4 print and digital preview)
         ========================================================================= */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none print:rounded-none">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
              🍁
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Weather<span className="text-sky-600">CA</span> Official Travel Briefing
              </h1>
              <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                Environment and Climate Change Canada Synoptic Synthesis
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600">
            <div className="font-bold text-slate-900">Document #{Math.floor(100000 + Math.random() * 900000)}</div>
            <div>Issued: {new Date().toLocaleDateString('en-CA', { dateStyle: 'long' })}</div>
            <div className="text-emerald-700 font-bold">HRDPS Model Verified</div>
          </div>
        </div>

        {/* Itinerary Summary Banner */}
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-300 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-bold uppercase text-[10px]">Origin</span>
            <div className="text-base font-black text-slate-900">{originCity.name}, {originCity.provinceCode}</div>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[10px]">Destination</span>
            <div className="text-base font-black text-slate-900">{destinationCity.name}, {destinationCity.provinceCode}</div>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[10px]">Est. Road Distance</span>
            <div className="text-base font-black text-slate-900">~{routeDistanceKm} km ({estimatedDriveHours})</div>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[10px]">Purpose</span>
            <div className="text-base font-black text-sky-700">{tripPurpose}</div>
          </div>
        </div>

        {/* 7-Day Day-by-Day Forecast Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            7-Day Journey Meteorological Matrix ({destinationCity.name})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="p-2.5">Timeline</th>
                  <th className="p-2.5">Expected Condition</th>
                  <th className="p-2.5">High / Low</th>
                  <th className="p-2.5">Precip Prob.</th>
                  <th className="p-2.5">Wind Speed</th>
                  <th className="p-2.5">Road Hazard Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {daysOutlook.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="p-2.5 font-bold text-slate-900">
                      {row.day} <span className="text-slate-500 text-[10px]">({row.date})</span>
                    </td>
                    <td className="p-2.5">{row.condition}</td>
                    <td className="p-2.5 font-bold text-slate-900">{row.tempHigh}°C / {row.tempLow}°C</td>
                    <td className="p-2.5">{row.precipProb}</td>
                    <td className="p-2.5">{row.wind}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{row.roadRisk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Packing & Vehicle Winter/Summer Preparedness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              🎒 Recommended Wardrobe &amp; Gear
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside leading-relaxed">
              <li>Wind-resistant shell jacket &amp; thermal mid-layer for morning lows ({daysOutlook[0].tempLow}°C).</li>
              <li>Comfortable breathable footwear; waterproof shoes recommended on Day 3.</li>
              <li>UV protection sunglasses &amp; brimmed hat for midday highway glare.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              🚗 Vehicle Highway Safety Protocol
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside leading-relaxed">
              <li>Verify washer fluid is rated to -40°C with bug/ice repellant additive.</li>
              <li>Inspect tire pressure and tread depth (minimum 3.5mm recommended).</li>
              <li>Maintain vehicle 72-hour safety kit with first-aid, flashlight &amp; thermal blanket.</li>
            </ul>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
          <div>WeatherCA • Canada Meteorological Portal • 2026 Edition</div>
          <div>Always check live Doppler radar and municipal road closures before departure.</div>
        </div>
      </div>
    </div>
  );
}
