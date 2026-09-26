'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Radio,
  AlertTriangle,
  Users,
  FileText,
  Activity,
  ShieldCheck,
  Radar,
  ArrowRight,
  TrendingUp,
  MapPin,
  Flame,
  Snowflake,
  Wind,
  Terminal,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Globe,
  Database,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BLOG_POSTS } from '@/data/blog-posts';

interface RegionalThreat {
  region: string;
  provinces: string;
  threatLevel: 'Critical' | 'Warning' | 'Watch' | 'Nominal';
  icon: string;
  condition: string;
  summary: string;
  tempRange: string;
  windGusts: string;
}

const REGIONAL_THREATS: RegionalThreat[] = [
  {
    region: 'Central Corridor',
    provinces: 'Ontario (ON) & Quebec (QC)',
    threatLevel: 'Critical',
    icon: '⚡',
    condition: 'Freezing Rain & Flash Freeze',
    summary: 'Active winter transition zone. Hazardous icing along Highway 401 & Autoroute 20 with rapid temperature plunge.',
    tempRange: '-4°C to +1°C',
    windGusts: '55 km/h NE',
  },
  {
    region: 'Western Prairies',
    provinces: 'Alberta (AB), Saskatchewan (SK), Manitoba (MB)',
    threatLevel: 'Warning',
    icon: '❄️',
    condition: 'Extreme Arctic Wind Chill Outbreak',
    summary: 'Siberian polar jet buckle. Wind chills ranging from -35°C to -44°C across Regina, Saskatoon & Winnipeg.',
    tempRange: '-28°C to -19°C',
    windGusts: '45 km/h NW',
  },
  {
    region: 'Pacific Coast & Rockies',
    provinces: 'British Columbia (BC)',
    threatLevel: 'Watch',
    icon: '🌧️',
    condition: 'Atmospheric River & Alpine Snow',
    summary: 'Heavy precipitation in Coast Range. Avalanche danger considerable in Whistler alpine bowls & Coquihalla Pass.',
    tempRange: '+2°C to +7°C',
    windGusts: '40 km/h SW',
  },
  {
    region: 'Atlantic Maritime',
    provinces: 'Nova Scotia, New Brunswick, PEI, Newfoundland',
    threatLevel: 'Watch',
    icon: '🌊',
    condition: 'Nor’easter Offshore Gale',
    summary: '90 km/h gusts recorded off Cape Breton. Storm surge advisories on south-facing Atlantic shorelines.',
    tempRange: '+3°C to +6°C',
    windGusts: '75 km/h ESE',
  },
  {
    region: 'Northern & Arctic',
    provinces: 'Yukon (YT), NWT (NT), Nunavut (NU)',
    threatLevel: 'Nominal',
    icon: '🌌',
    condition: 'Sub-Zero Clear & High Aurora Activity',
    summary: 'Stable continental Arctic high. Kp 4.8 geomagnetic field with optimal aurora borealis viewing across Yellowknife.',
    tempRange: '-32°C to -22°C',
    windGusts: '15 km/h N',
  },
];

interface LogEntry {
  id: string;
  time: string;
  type: 'INFO' | 'AUTH' | 'MODEL' | 'ALERT' | 'CACHE';
  msg: string;
}

const INITIAL_STREAM_LOGS: LogEntry[] = [
  { id: '1', time: '10:14:02Z', type: 'INFO', msg: 'ECCC GeoMet WMS layer ingestion validated across 31 radar sites (22ms)' },
  { id: '2', time: '10:13:45Z', type: 'AUTH', msg: 'Operator session verified (Duty Commander // Level-Alpha)' },
  { id: '3', time: '10:12:30Z', type: 'MODEL', msg: 'HRDPS 2.5km High-Res run cycle [12Z] deterministic compilation complete' },
  { id: '4', time: '10:11:15Z', type: 'ALERT', msg: 'Blizzard & Flash Freeze warning broadcast dispatched to Central Ontario corridor' },
  { id: '5', time: '10:10:00Z', type: 'CACHE', msg: 'Edge ISR CDN 220 routes synchronized globally across Montreal & Toronto nodes' },
];

export default function AdminTacticalDashboard() {
  const { allUsers, broadcastAlert } = useAuth();
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<'ALL' | RegionalThreat['threatLevel']>('ALL');
  const [streamLogs, setStreamLogs] = useState<LogEntry[]>(INITIAL_STREAM_LOGS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const handleManualSweep = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' EST');
      const newLog: LogEntry = {
        id: String(Date.now()),
        time: new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false }) + 'Z',
        type: 'INFO',
        msg: 'Manual telemetry sweep completed: All S-Band radar nodes & model endpoints responsive',
      };
      setStreamLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 800);
  };

  const filteredThreats = REGIONAL_THREATS.filter((t) => {
    if (selectedThreatFilter === 'ALL') return true;
    return t.threatLevel === selectedThreatFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner if Active Alert */}
      {broadcastAlert && broadcastAlert.active && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-rose-900/60 to-red-950/80 border border-red-500/50 text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-2xl shadow-xl shadow-red-950/40">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-300">
                  ACTIVE NATIONWIDE EMERGENCY BROADCAST ({broadcastAlert.severity.toUpperCase()})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-mono text-[9px] font-black uppercase animate-ping">
                  LIVE
                </span>
              </div>
              <div className="text-sm font-bold text-white mt-0.5 leading-snug">{broadcastAlert.message}</div>
            </div>
          </div>
          <Link
            href="/admin/alerts"
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-black text-xs shrink-0 transition-colors shadow-lg shadow-red-500/30 text-center"
          >
            Manage Dispatch
          </Link>
        </div>
      )}

      {/* Hero Tactical Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-purple-950/30 to-slate-900/90 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
              Operations Center Console
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Updated: {lastRefreshed}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            National Meteorological Tactical Matrix
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real-time multi-band radar ingestion, HRDPS deterministic model synchronization, emergency alert broadcast management, and federal weather safety protocols.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={handleManualSweep}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Sweeping Feed...' : 'Sync Telemetry'}</span>
          </button>

          <Link
            href="/admin/alerts"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency Broadcast</span>
          </Link>

          <Link
            href="/admin/stations"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Radar className="w-3.5 h-3.5" />
            <span>31 Radar Towers</span>
          </Link>
        </div>
      </div>

      {/* KPI High-Level Telemetry Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Personnel Registry */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-purple-500/40 transition-all backdrop-blur-xl space-y-3 group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-400 uppercase font-black tracking-wider">
              Personnel Registry
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{allUsers.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active verified officers & editors</div>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Security: Level Alpha</span>
            <span className="text-emerald-400 font-bold">100% SECURE</span>
          </div>
        </div>

        {/* Doppler Radar Towers */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-sky-500/40 transition-all backdrop-blur-xl space-y-3 group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-sky-400 uppercase font-black tracking-wider">
              Doppler Radar Grid
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
              <Radar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">31 / 31</div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">100% S-Band Operational</div>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Band: Dual-Pol (10cm)</span>
            <span className="text-sky-300 font-bold">300 km RANGE</span>
          </div>
        </div>

        {/* Press & Meteorological Stories */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 transition-all backdrop-blur-xl space-y-3 group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-black tracking-wider">
              Editorial Bulletins
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{BLOG_POSTS.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Published scientific investigations</div>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Authors: Staff Meteorologists</span>
            <span className="text-cyan-300 font-bold">INDEXED</span>
          </div>
        </div>

        {/* HRDPS Model Grid */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 transition-all backdrop-blur-xl space-y-3 group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-black tracking-wider">
              HRDPS Model Grid
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">2.5 km</div>
            <div className="text-[11px] text-slate-400 mt-0.5">High-Resolution deterministic grid</div>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Cycle: 12Z Synced</span>
            <span className="text-emerald-400 font-bold">LIVE</span>
          </div>
        </div>
      </div>

      {/* Canadian Regional Threat Matrix (5 Sectors) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Canadian Regional Threat Matrix (5 Sectors)</h2>
              <p className="text-xs text-slate-400">Continuous meteorological risk evaluation across all provinces</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['ALL', 'Critical', 'Warning', 'Watch', 'Nominal'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedThreatFilter(filter)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedThreatFilter === filter
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {filter === 'ALL' ? 'All Sectors' : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredThreats.map((sect) => {
            const isCritical = sect.threatLevel === 'Critical';
            const isWarning = sect.threatLevel === 'Warning';
            const isWatch = sect.threatLevel === 'Watch';

            return (
              <div
                key={sect.region}
                className={`p-5 rounded-3xl border transition-all backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl ${
                  isCritical
                    ? 'bg-gradient-to-br from-red-950/40 via-slate-900/80 to-slate-900/80 border-red-500/40 hover:border-red-400'
                    : isWarning
                    ? 'bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-900/80 border-amber-500/30 hover:border-amber-400'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider">
                      {sect.provinces}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border uppercase ${
                        isCritical
                          ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : isWatch
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {sect.threatLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                      {sect.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-white">{sect.region}</h3>
                      <div className="text-xs font-bold text-purple-300">{sect.condition}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{sect.summary}</p>
                </div>

                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Temp Band</div>
                    <div className="font-black text-white mt-0.5">{sect.tempRange}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Peak Wind</div>
                    <div className="font-black text-sky-300 mt-0.5">{sect.windGusts}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launch & Diagnostic Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rapid Actions */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 space-y-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-400" />
              <span>Operations Dispatch Shortcuts</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">DIRECT ROUTE MATRIX</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              href="/admin/alerts"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 transition-all space-y-1 group"
            >
              <div className="font-black text-white group-hover:text-amber-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Emergency Dispatch</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-400 text-[11px]">Issue red ticker warnings across Canada</p>
            </Link>

            <Link
              href="/admin/stations"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky-500/30 transition-all space-y-1 group"
            >
              <div className="font-black text-white group-hover:text-sky-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Radar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Radar Towers (31)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-400 text-[11px]">Inspect S-Band health & ping sweeps</p>
            </Link>

            <Link
              href="/admin/users"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all space-y-1 group"
            >
              <div className="font-black text-white group-hover:text-purple-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Personnel Clearance</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-400 text-[11px]">Manage roles & active sessions</p>
            </Link>

            <Link
              href="/admin/blog"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all space-y-1 group"
            >
              <div className="font-black text-white group-hover:text-cyan-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Editorial Studio</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-400 text-[11px]">Publish severe weather investigations</p>
            </Link>

            <Link
              href="/admin/sitemap"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all space-y-1 group"
            >
              <div className="font-black text-white group-hover:text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5-Shard Sitemap XML</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-400 text-[11px]">Audit partitioned W3C route index</p>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all space-y-1 group"
            >
              <div className="font-black text-white group-hover:text-purple-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>Site Parameters</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-400 text-[11px]">API polling interval, cache & units</p>
            </Link>
          </div>
        </div>

        {/* Live Operational Console Stream */}
        <div className="rounded-3xl bg-black/70 border border-white/10 p-6 font-mono text-xs space-y-3 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-slate-400">
              <span className="flex items-center gap-2 font-bold text-white">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live Operational Console Stream</span>
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                AUTOPREDICT // ONLINE
              </span>
            </div>

            <div className="space-y-2 text-slate-300 text-[11px] pt-3 overflow-y-auto max-h-56 scrollbar-thin">
              {streamLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span
                    className={`font-black uppercase text-[10px] px-1.5 py-0.2 rounded border shrink-0 ${
                      log.type === 'ALERT'
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : log.type === 'AUTH'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : log.type === 'MODEL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : log.type === 'CACHE'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        : 'bg-white/10 text-slate-300 border-white/15'
                    }`}
                  >
                    {log.type}
                  </span>
                  <span className="text-slate-200">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500">
            <span>Buffer: 256KB Circular FIFO</span>
            <span className="text-slate-400">ECCC MSC // AES-GCM-256</span>
          </div>
        </div>
      </div>
    </div>
  );
}

