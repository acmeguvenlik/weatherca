'use client';

import React, { useState } from 'react';
import {
  Plane,
  Wind,
  Compass,
  Eye,
  Thermometer,
  CloudRain,
  ShieldAlert,
  Layers,
  FileText,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { CANADIAN_AIRPORTS, CanadianAirport } from '@/data/canadian-airports';

export function AviationMetarDisplay() {
  const [selectedAirport, setSelectedAirport] = useState<CanadianAirport>(CANADIAN_AIRPORTS[0]);
  const [selectedRunway, setSelectedRunway] = useState<string>(CANADIAN_AIRPORTS[0].runways[0]);
  const [activeTab, setActiveTab] = useState<'decoded' | 'raw' | 'crosswind'>('decoded');

  // Compute Crosswind & Headwind components
  // Runway string like "06L/24R" -> parse selected end
  const runwayHeadingDeg = parseInt(selectedRunway.split('/')[0].replace(/\D/g, ''), 10) * 10 || 50;
  const windAngleDiffRad = ((selectedAirport.windDirectionDeg - runwayHeadingDeg) * Math.PI) / 180;
  const headwindKt = Math.round(selectedAirport.windSpeedKt * Math.cos(windAngleDiffRad));
  const crosswindKt = Math.abs(Math.round(selectedAirport.windSpeedKt * Math.sin(windAngleDiffRad)));

  // Calculate Density Altitude approx
  // DA = Pressure Alt + (120 * (OAT - ISA Temp))
  const isaTemp = 15 - (2 * selectedAirport.elevationFt) / 1000;
  const pressureAlt = selectedAirport.elevationFt + (29.92 - selectedAirport.altimeterInHg) * 1000;
  const densityAltitudeFt = Math.round(pressureAlt + 120 * (selectedAirport.tempC - isaTemp));

  const getFlightCategoryColor = (cat: CanadianAirport['flightCategory']) => {
    switch (cat) {
      case 'VFR':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'MVFR':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'IFR':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'LIFR':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="space-y-8">
      {/* Airport Selector Bar */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
              Selected Nav Canada Station
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{selectedAirport.name}</span>
              <span className="px-2 py-0.5 rounded-lg bg-white/10 text-xs font-mono text-slate-300">
                {selectedAirport.icao} / {selectedAirport.iata}
              </span>
            </h3>
            <span className="text-xs text-slate-400">
              {selectedAirport.city}, {selectedAirport.province} • Field Elevation: {selectedAirport.elevationFt} ft MSL
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <select
            value={selectedAirport.icao}
            onChange={(e) => {
              const airport = CANADIAN_AIRPORTS.find((a) => a.icao === e.target.value);
              if (airport) {
                setSelectedAirport(airport);
                setSelectedRunway(airport.runways[0]);
              }
            }}
            className="w-full md:w-64 bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner"
          >
            {CANADIAN_AIRPORTS.map((a) => (
              <option key={a.icao} value={a.icao}>
                {a.icao} - {a.city} ({a.iata})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Flight Category Banner & Vital Avionics Ribbons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Category */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Flight Rules</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getFlightCategoryColor(
                selectedAirport.flightCategory
              )}`}
            >
              {selectedAirport.flightCategory}
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {selectedAirport.flightCategory === 'VFR'
              ? 'Visual Flight Rules'
              : selectedAirport.flightCategory === 'MVFR'
              ? 'Marginal VFR'
              : selectedAirport.flightCategory === 'IFR'
              ? 'Instrument Rules'
              : 'Low Instrument (LIFR)'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {selectedAirport.visibilitySm >= 5 ? 'Good Surface Visibility' : 'Low Visibility Ops'}
          </div>
        </div>

        {/* Winds */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-sky-400" /> Surface Wind
          </span>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {selectedAirport.windDirectionDeg.toString().padStart(3, '0')}° @ {selectedAirport.windSpeedKt} kt
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {selectedAirport.windGustKt ? `Gusting to ${selectedAirport.windGustKt} kt` : 'Steady Gradient'}
          </div>
        </div>

        {/* Visibility & Ceiling */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-emerald-400" /> Visibility &amp; Altimeter
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {selectedAirport.visibilitySm} <span className="text-xs text-slate-400 font-normal">SM</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">QNH: {selectedAirport.altimeterInHg.toFixed(2)} inHg</div>
        </div>

        {/* Density Alt */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Density Altitude
          </span>
          <div className="text-2xl font-black text-amber-300 mt-1">
            {densityAltitudeFt.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ft</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Temp: {selectedAirport.tempC}°C • Dewpoint: {selectedAirport.dewpointC}°C
          </div>
        </div>
      </div>

      {/* Main Console: Decoded Breakdown & Crosswind Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Decoded / Raw METAR & TAF */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5">
            {/* Nav Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('decoded')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'decoded'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Decoded Telemetry
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'raw'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Raw METAR / TAF
                </button>
              </div>

              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Nav Canada MSC Feed
              </span>
            </div>

            {activeTab === 'decoded' ? (
              <div className="space-y-4">
                {/* Cloud Layers Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    Observed Cloud Layers &amp; Ceiling
                  </h4>
                  {selectedAirport.cloudLayers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedAirport.cloudLayers.map((layer, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-sky-300 uppercase">
                              {layer.coverage} @ {layer.altitudeFt.toLocaleString()} ft AGL
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5">{layer.type || 'Cloud Layer'}</div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {Math.round(layer.altitudeFt * 0.3048)} m
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-xs text-slate-400">
                      SKC / CLR (Sky Clear - No clouds detected below 12,000 ft)
                    </div>
                  )}
                </div>

                {/* TAF Forecast Section */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Terminal Aerodrome Forecast (TAF) Synopsis
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {selectedAirport.rawTaf}
                  </div>
                </div>

                {/* Remarks */}
                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 text-xs text-slate-400 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Station Remarks:</span>
                  <span>{selectedAirport.remarks}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-400 uppercase">Raw METAR Telegram</div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-sky-300 leading-relaxed select-all">
                    {selectedAirport.rawMetar}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-400 uppercase">Raw TAF Telegram</div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-emerald-300 leading-relaxed select-all">
                    {selectedAirport.rawTaf}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Runway Crosswind Component Tool */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-5">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3">
              <Compass className="w-4 h-4 text-sky-400" />
              Runway Crosswind Resolver
            </h4>

            {/* Runway Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Select Active Runway:</label>
              <select
                value={selectedRunway}
                onChange={(e) => setSelectedRunway(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 text-white rounded-2xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {selectedAirport.runways.map((rw) => (
                  <option key={rw} value={rw}>
                    Runway {rw} (Heading ~{parseInt(rw.split('/')[0].replace(/\D/g, ''), 10) * 10}°)
                  </option>
                ))}
              </select>
            </div>

            {/* Resolved Wind Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Crosswind Component</span>
                <div
                  className={`text-2xl font-black ${
                    crosswindKt > 20 ? 'text-red-400' : crosswindKt > 12 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {crosswindKt} <span className="text-xs text-slate-400 font-normal">kt</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {crosswindKt > 20 ? 'Severe Crosswind Alert' : 'Within Normal Limits'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  {headwindKt >= 0 ? 'Headwind' : 'Tailwind'} Component
                </span>
                <div className="text-2xl font-black text-white">
                  {Math.abs(headwindKt)} <span className="text-xs text-slate-400 font-normal">kt</span>
                </div>
                <div className="text-[10px] text-slate-400">{headwindKt >= 0 ? 'Favorable headwind' : 'Caution: Tailwind'}</div>
              </div>
            </div>

            {/* Visual Compass Orientation */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Wind Bearing: <strong className="text-white">{selectedAirport.windDirectionDeg}°</strong>
              </div>
              <div className="text-slate-400">
                RW Heading: <strong className="text-white">{runwayHeadingDeg}°</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
