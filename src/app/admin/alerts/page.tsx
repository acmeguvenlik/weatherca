'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminAlertsPage() {
  const { broadcastAlert, setBroadcastAlert } = useAuth();

  const [message, setMessage] = useState(
    broadcastAlert?.message ||
      'ENVIRONMENT CANADA BULLETIN: Severe Winter Storm & Flash Freeze Warning across Southern Ontario and Quebec corridors.'
  );
  const [severity, setSeverity] = useState<'warning' | 'watch' | 'advisory'>(
    broadcastAlert?.severity || 'warning'
  );
  const [active, setActive] = useState(broadcastAlert ? broadcastAlert.active : true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastAlert({
      message,
      severity,
      active,
      issuedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDisable = () => {
    setActive(false);
    setBroadcastAlert(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <span>National Emergency Alert Broadcaster</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Broadcast instant red-banner severe weather statements and blizzard alerts across all public pages in Canada.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Emergency alert configuration updated and broadcasted nationwide!</span>
        </div>
      )}

      {/* Broadcast Form */}
      <form onSubmit={handleSave} className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider">
            Broadcast Ticker Message
          </label>
          <textarea
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 resize-none font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Severity Classification</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as 'warning' | 'watch' | 'advisory')}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="warning" className="bg-slate-900 text-red-400 font-bold">
                ⚠️ Severe Warning (Red Banner)
              </option>
              <option value="watch" className="bg-slate-900 text-amber-400 font-bold">
                👁️ Weather Watch (Amber Banner)
              </option>
              <option value="advisory" className="bg-slate-900 text-sky-400 font-bold">
                ℹ️ Special Advisory (Sky Blue)
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Broadcast Status</label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
                <span>Enable Nationwide Broadcast</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Preview of the Banner */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Public User Banner Preview</span>
          </div>

          {active ? (
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all ${
                severity === 'warning'
                  ? 'bg-red-600/90 text-white shadow-lg shadow-red-600/20'
                  : severity === 'watch'
                  ? 'bg-amber-600/90 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-sky-600/90 text-white shadow-lg shadow-sky-600/20'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse" />
              <div className="flex-1 truncate">{message}</div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/20 text-white">
                LIVE
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-500 text-center font-mono">
              [Broadcast Banner is currently disabled / standby]
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleDisable}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
          >
            Clear & Disable
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            Update Live Broadcast
          </button>
        </div>
      </form>
    </div>
  );
}
