'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ShieldAlert,
  Bell,
  Snowflake,
  Flame,
  Wind,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Info,
  Radio,
  Share2,
  X,
} from 'lucide-react';
import { PROVINCE_LIST } from '@/data/provinces';
import { useAuth } from '@/context/AuthContext';

interface SevereAlertItem {
  id: string;
  headline: string;
  severity: 'Warning' | 'Watch' | 'Advisory';
  provinceCode: string;
  provinceName: string;
  affectedRegions: string[];
  issuedAt: string;
  expiresAt: string;
  summary: string;
  hazardDetails: string[];
  safetyInstructions: string[];
}

const LIVE_CANADIAN_ALERTS: SevereAlertItem[] = [
  {
    id: 'alt-on-1',
    headline: 'BLIZZARD & FLASH FREEZE WARNING',
    severity: 'Warning',
    provinceCode: 'ON',
    provinceName: 'Ontario',
    affectedRegions: ['Greater Toronto Area', 'Hamilton', 'Niagara Corridor', 'Highway 401 London to Kingston'],
    issuedAt: '2026-09-15 07:30 EST',
    expiresAt: '2026-09-15 22:00 EST',
    summary: 'A fast-moving Arctic cold front colliding with moist Great Lakes air is generating rapid snow squalls, zero visibility, and immediate flash freeze conditions on roadways.',
    hazardDetails: [
      'Near-zero visibility in heavy blowing snow squalls',
      'Sudden temperature drop from +2°C to -12°C in under 90 minutes',
      'Wind gusts up to 85 km/h causing widespread power line strain',
    ],
    safetyInstructions: [
      'Avoid non-essential travel along Highway 401, QEW, and Highway 400 corridors.',
      'Ensure vehicles carry winter emergency kits (booster cables, wool blanket, sand/salt).',
      'Treat all wet roadway surfaces as invisible black ice.',
    ],
  },
  {
    id: 'alt-ab-sk-2',
    headline: 'EXTREME ARCTIC WIND CHILL WARNING (-42°C to -48°C)',
    severity: 'Warning',
    provinceCode: 'AB',
    provinceName: 'Alberta',
    affectedRegions: ['Calgary Metropolitan', 'Edmonton', 'Red Deer', 'Medicine Hat', 'Lloydminster'],
    issuedAt: '2026-09-15 05:45 MST',
    expiresAt: '2026-09-16 12:00 MST',
    summary: 'Siberian polar vortex core has displaced south across the Prairies. Extreme wind chills between -40°C and -48°C create dangerous frostbite conditions in minutes.',
    hazardDetails: [
      'Exposed skin freezes within 3 to 5 minutes',
      'Risk of hypothermia for stranded motorists and outdoor workers',
      'Potential water pipe freezing in uninsulated residential lines',
    ],
    safetyInstructions: [
      'Dress in synthetic thermal base layers, fleece mid-layers, and heavy down outer parkas.',
      'Cover all exposed facial skin with balaclavas and insulated mittens.',
      'Keep pets indoors and check on elderly or vulnerable neighbors.',
    ],
  },
  {
    id: 'alt-bc-3',
    headline: 'ATMOSPHERIC RIVER & HEAVY RAINFALL WATCH',
    severity: 'Watch',
    provinceCode: 'BC',
    provinceName: 'British Columbia',
    affectedRegions: ['Metro Vancouver', 'Howe Sound', 'Sea-to-Sky Whistler Corridor', 'Fraser Valley'],
    issuedAt: '2026-09-15 06:15 PST',
    expiresAt: '2026-09-16 18:00 PST',
    summary: 'A subtropical moisture plume is forecast to deliver 80 to 120 mm of rain to Coastal British Columbia with elevated freezing levels causing rapid snowpack melting in lower mountain basins.',
    hazardDetails: [
      'Localized flash flooding in urban low-lying culverts and stream basins',
      'Considerable avalanche hazard rating across Sea-to-Sky alpine bowls',
      'Debris flow and rockfall risks along Highway 99',
    ],
    safetyInstructions: [
      'Clear storm drains and gutters of organic debris and leaves.',
      'Avoid camping or parking vehicles near fast-rising creeks and riverbanks.',
      'Check DriveBC road condition advisories before traveling mountain passes.',
    ],
  },
  {
    id: 'alt-qc-4',
    headline: 'FREEZING RAIN & ICE PELLET ADVISORY',
    severity: 'Advisory',
    provinceCode: 'QC',
    provinceName: 'Quebec',
    affectedRegions: ['Montréal Metropolitan', 'Laval', 'Montérégie', 'Estrie', 'Autoroute 20 Corridor'],
    issuedAt: '2026-09-15 08:00 EST',
    expiresAt: '2026-09-15 16:00 EST',
    summary: 'A warm layer aloft is producing a 4 to 6-hour period of freezing rain with ice accumulation of 2 to 5 mm before changing over to light snow.',
    hazardDetails: [
      'Ice accretion on tree branches, overhead utility cables, and walkways',
      'Hazardous walking conditions; increased slip and fall injuries',
      'Flight delays and de-icing backlogs at Montréal-Trudeau (YUL)',
    ],
    safetyInstructions: [
      'Apply ice melt, sand, or salt to outdoor stairs and driveways immediately.',
      'Exercise extreme caution when walking on stairs or unsalted sidewalks.',
      'Allow extra braking distance when driving.',
    ],
  },
  {
    id: 'alt-ns-nl-5',
    headline: 'OFFSHORE NOR’EASTER GALE & SURGE WATCH',
    severity: 'Watch',
    provinceCode: 'NS',
    provinceName: 'Nova Scotia',
    affectedRegions: ['Cape Breton Island', 'Eastern Shore', 'Halifax Coastal', 'South Coast Newfoundland'],
    issuedAt: '2026-09-15 04:30 AST',
    expiresAt: '2026-09-16 08:00 AST',
    summary: 'Intense maritime low tracking south of Sable Island will generate northeast storm-force winds up to 90 km/h with pounding surf and minor coastal flooding along south-facing coastlines.',
    hazardDetails: [
      'Waves of 5 to 7 meters pounding exposed Atlantic headlands',
      'High tide storm surge overtopping low coastal roads',
      'Ferry service suspensions across Cabot Strait',
    ],
    safetyInstructions: [
      'Stay away from breakwaters and rocky coastlines during high tide cycles.',
      'Secure loose outdoor furniture, marine equipment, and construction materials.',
      'Check Marine Atlantic schedules for crossing updates.',
    ],
  },
];

export default function SevereWeatherAlertsPage() {
  const { broadcastAlert } = useAuth();
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | 'Warning' | 'Watch' | 'Advisory'>('ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [activeModalAlert, setActiveModalAlert] = useState<SevereAlertItem | null>(null);
  const [smsSubscribed, setSmsSubscribed] = useState(false);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return LIVE_CANADIAN_ALERTS.filter((alt) => {
      const matchesSev = selectedSeverity === 'ALL' || alt.severity === selectedSeverity;
      const matchesProv = selectedProvince === 'ALL' || alt.provinceCode === selectedProvince;
      return matchesSev && matchesProv;
    });
  }, [selectedSeverity, selectedProvince]);

  const stats = useMemo(() => {
    return {
      warnings: LIVE_CANADIAN_ALERTS.filter((a) => a.severity === 'Warning').length,
      watches: LIVE_CANADIAN_ALERTS.filter((a) => a.severity === 'Watch').length,
      advisories: LIVE_CANADIAN_ALERTS.filter((a) => a.severity === 'Advisory').length,
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">National Emergency Weather Dispatch</span>
      </div>

      {/* Broadcast Alert if set by HQ */}
      {broadcastAlert && broadcastAlert.active && (
        <div className="p-5 rounded-3xl bg-red-600/25 border border-red-500/50 backdrop-blur-2xl shadow-2xl flex items-start justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-300">
                OFFICIAL NATIONAL PUBLIC SAFETY BROADCAST // ECCC DISPATCH
              </div>
              <p className="text-sm sm:text-base font-bold text-white mt-1">
                {broadcastAlert.message}
              </p>
              <div className="text-xs text-red-300 font-mono mt-1">
                Issued: {broadcastAlert.issuedAt} • Federal Meteorological Protocol
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Meteorological Service of Canada (MSC DataMart) Feed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Canada Severe Weather <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-sky-300">Alert Operations</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time atmospheric hazards, winter storm warnings, flash freeze criteria, and emergency preparedness advisories for all 10 provinces & 3 territories.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 shrink-0 font-mono">
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-center min-w-[90px]">
            <div className="text-2xl font-black text-red-400">{stats.warnings}</div>
            <div className="text-[10px] uppercase font-bold text-red-300">Warnings</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center min-w-[90px]">
            <div className="text-2xl font-black text-amber-400">{stats.watches}</div>
            <div className="text-[10px] uppercase font-bold text-amber-300">Watches</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-center min-w-[90px]">
            <div className="text-2xl font-black text-sky-400">{stats.advisories}</div>
            <div className="text-[10px] uppercase font-bold text-sky-300">Advisories</div>
          </div>
        </div>
      </div>

      {/* Filter Matrix Bar */}
      <div className="p-4 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Severity Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Severity:</span>
            {(['ALL', 'Warning', 'Watch', 'Advisory'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedSeverity === sev
                    ? sev === 'Warning'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : sev === 'Watch'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : sev === 'Advisory'
                      ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20'
                      : 'bg-white text-slate-950'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {sev === 'ALL' ? 'All Severities' : `${sev}s`}
              </button>
            ))}
          </div>

          {/* SMS / Web Push Alert Subscription Channel */}
          <button
            onClick={() => setSmsSubscribed(!smsSubscribed)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              smsSubscribed
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{smsSubscribed ? 'Alerts Subscribed (SMS / Push)' : 'Get Push Alerts'}</span>
          </button>
        </div>

        {/* Province Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setSelectedProvince('ALL')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedProvince === 'ALL'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All Regions
          </button>
          {PROVINCE_LIST.map((p) => {
            const hasAlert = LIVE_CANADIAN_ALERTS.some((a) => a.provinceCode === p.code);
            return (
              <button
                key={p.code}
                onClick={() => setSelectedProvince(p.code)}
                className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedProvince === p.code
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span>{p.code}</span>
                {hasAlert && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping inline-block" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Active Weather Advisories & Statements ({filteredAlerts.length})</span>
          <span className="font-mono">Next radar sweep: in 3 mins</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map((alt) => {
            const isWarning = alt.severity === 'Warning';
            const isWatch = alt.severity === 'Watch';

            const borderClass = isWarning
              ? 'border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900/60 to-slate-900/80 hover:border-red-500/60'
              : isWatch
              ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-900/80 hover:border-amber-500/60'
              : 'border-sky-500/40 bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-slate-900/80 hover:border-sky-500/60';

            const badgeClass = isWarning
              ? 'bg-red-500/25 text-red-200 border-red-500/50'
              : isWatch
              ? 'bg-amber-500/25 text-amber-200 border-amber-500/50'
              : 'bg-sky-500/25 text-sky-200 border-sky-500/50';

            return (
              <div
                key={alt.id}
                className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-xl space-y-4 shadow-xl ${borderClass}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${badgeClass}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${badgeClass}`}>
                          {alt.severity}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                          {alt.provinceName} ({alt.provinceCode})
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                        {alt.headline}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                    <div>Issued: {alt.issuedAt}</div>
                    <div className="text-amber-300">Until: {alt.expiresAt}</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {alt.summary}
                </p>

                {/* Affected Regions Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>Areas:</span>
                  </span>
                  {alt.affectedRegions.map((reg) => (
                    <span
                      key={reg}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                    >
                      {reg}
                    </span>
                  ))}
                </div>

                {/* Card Action Row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Official ECCC Bulletin #{alt.id}
                  </span>

                  <button
                    onClick={() => setActiveModalAlert(alt)}
                    className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Safety Directives</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Directive Modal */}
      {activeModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-300">
                    {activeModalAlert.severity} • {activeModalAlert.provinceName}
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    {activeModalAlert.headline}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModalAlert(null)}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-300">
                  Detailed Hazard Manifest
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  {activeModalAlert.hazardDetails.map((haz, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{haz}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">
                  Public Safety Actions & Directives
                </h4>
                <ul className="space-y-2 text-slate-200">
                  {activeModalAlert.safetyInstructions.map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                <span>Valid: {activeModalAlert.issuedAt} to {activeModalAlert.expiresAt}</span>
                <Link
                  href={`/${activeModalAlert.provinceCode.toLowerCase()}`}
                  className="text-sky-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Regional Radar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canadian 72-Hour Winter Emergency Kit Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Government of Canada 72-Hour Emergency Preparedness Guide</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          During severe blizzards and ice storms across Canada, utility power and highway access may be interrupted for up to 72 hours. Public Safety Canada recommends every household maintain an accessible emergency survival kit.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <strong className="text-white">Water & Non-Perishable Food:</strong>
            <p className="text-slate-400">Four litres of water per person per day, plus canned food and energy bars.</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <strong className="text-white">Light & Power:</strong>
            <p className="text-slate-400">Crank or battery-powered flashlight, spare batteries, and portable phone power bank.</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <strong className="text-white">First Aid & Warmth:</strong>
            <p className="text-slate-400">Emergency thermal blankets, prescription medications, whistle, and dry wool socks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
