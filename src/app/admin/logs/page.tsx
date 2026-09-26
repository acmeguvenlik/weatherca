'use client';

import React, { useState } from 'react';
import { Terminal, ShieldCheck, Download, RefreshCw, Filter, Clock } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'AUTH' | 'ALERT' | 'WARN';
  operator: string;
  action: string;
  sourceIp: string;
}

const INITIAL_LOGS: AuditLog[] = [
  { id: 'LOG-9821', timestamp: '2026-09-15 10:10:44Z', level: 'AUTH', operator: 'Alex Tremblay (Admin)', action: 'Operator session authenticated into Operations HQ Console', sourceIp: '142.250.80.45 (Ottawa, ON)' },
  { id: 'LOG-9820', timestamp: '2026-09-15 10:08:12Z', level: 'INFO', operator: 'System Daemon', action: 'HRDPS 2.5km deterministic prediction model cycle [12Z] compiled', sourceIp: 'internal.eccc.cloud' },
  { id: 'LOG-9819', timestamp: '2026-09-15 10:05:30Z', level: 'ALERT', operator: 'Alex Tremblay (Admin)', action: 'Emergency Broadcast Statement dispatched nationwide (Freezing Rain Warning)', sourceIp: '142.250.80.45 (Ottawa, ON)' },
  { id: 'LOG-9818', timestamp: '2026-09-15 10:00:15Z', level: 'INFO', operator: 'System Daemon', action: 'Turbopack Edge build successfully distributed 86 static & dynamic routes', sourceIp: 'vercel.edge.cluster' },
  { id: 'LOG-9817', timestamp: '2026-09-15 09:55:20Z', level: 'WARN', operator: 'Telemetry Worker', action: 'Thunder Bay station (CWKR) HTTP 429 rate limit handled with fallback snapshot', sourceIp: 'open-meteo.upstream' },
  { id: 'LOG-9816', timestamp: '2026-09-15 09:40:02Z', level: 'INFO', operator: 'Sarah Chen (Editor)', action: 'Published blog article: "Chasing the Aurora Borealis in Yellowknife"', sourceIp: '198.51.100.22 (Calgary, AB)' },
  { id: 'LOG-9815', timestamp: '2026-09-15 09:15:40Z', level: 'AUTH', operator: 'Sarah Chen (Editor)', action: 'Session token issued with editorial role privileges', sourceIp: '198.51.100.22 (Calgary, AB)' },
  { id: 'LOG-9814', timestamp: '2026-09-15 08:30:10Z', level: 'INFO', operator: 'MSC GeoMet Poller', action: 'All 31 Canadian Doppler S-Band radar towers swept and validated (24ms mean)', sourceIp: 'msc.geomet.eccc.gc.ca' },
];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const filtered = logs.filter((l) => levelFilter === 'ALL' || l.level === levelFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            <span>Security & Operational Audit Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident record of all administrative commands, emergency alerts, and telemetry ingestions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Audit logs exported to CSV format.')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-2">
        {['ALL', 'INFO', 'AUTH', 'ALERT', 'WARN'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevelFilter(lvl)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              levelFilter === lvl
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Log Console Table */}
      <div className="rounded-3xl bg-black/60 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Level</th>
                <th className="p-4">Operator</th>
                <th className="p-4">Action Summary</th>
                <th className="p-4 text-right">Source IP / Host</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 text-[11px]">
              {filtered.map((log) => {
                const isAlert = log.level === 'ALERT';
                const isWarn = log.level === 'WARN';
                const isAuth = log.level === 'AUTH';
                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isAlert
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isWarn
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : isAuth
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="p-4 text-white font-semibold">{log.operator}</td>
                    <td className="p-4 text-slate-200">{log.action}</td>
                    <td className="p-4 text-right text-slate-400 whitespace-nowrap">{log.sourceIp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
