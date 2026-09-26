'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Sliders,
  Radio,
  Globe,
  Database,
  AlertOctagon,
} from 'lucide-react';
import { useSettings, SiteSettings } from '@/context/SettingsContext';

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings } = useSettings();

  const [form, setForm] = useState<SiteSettings>(siteSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-400" />
            <span>Global Site & Operational Parameters</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Control brand identity, meteorological polling intervals, maintenance barriers, and telemetry caching.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Parameters</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>System parameters successfully updated and committed to active runtime memory!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Identity Section */}
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Platform Branding & Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Brand Identity Name</label>
              <input
                type="text"
                required
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Official Tagline</label>
              <input
                type="text"
                required
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Localization & Default Units */}
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Default Locale & Temperature Standards</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Default Measurement Unit</label>
              <select
                value={form.defaultUnit}
                onChange={(e) => setForm({ ...form, defaultUnit: e.target.value as 'C' | 'F' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold focus:outline-none focus:border-purple-400"
              >
                <option value="C">Celsius (°C) — Canadian Standard</option>
                <option value="F">Fahrenheit (°F) — US Standard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Default Primary Language</label>
              <select
                value={form.defaultLanguage}
                onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value as 'EN' | 'FR' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold focus:outline-none focus:border-purple-400"
              >
                <option value="EN">English (en-CA)</option>
                <option value="FR">Français (fr-CA - Météo Canada)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Telemetry & Cache Intervals */}
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Atmospheric Telemetry Polling Intervals</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Environment Canada API Polling Frequency</label>
              <select
                value={form.apiPollingMinutes}
                onChange={(e) => setForm({ ...form, apiPollingMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-400 font-mono"
              >
                <option value={1}>1 Minute (Real-time severe storm surge mode)</option>
                <option value={3}>3 Minutes (Default operational mode)</option>
                <option value={5}>5 Minutes (Balanced mode)</option>
                <option value={10}>10 Minutes (Low quota conservation)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Edge ISR Cache TTL (Seconds)</label>
              <input
                type="number"
                value={form.cacheTtlSeconds}
                onChange={(e) => setForm({ ...form, cacheTtlSeconds: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Third-Party Integrations */}
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Search Engine & Analytics Telemetry</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                value={form.googleAnalyticsId}
                onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Google Search Console HTML Verification Token</label>
              <input
                type="text"
                value={form.gscVerificationToken}
                onChange={(e) => setForm({ ...form, gscVerificationToken: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode Emergency Barrier */}
        <div className="rounded-3xl bg-amber-950/20 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>Platform Maintenance Override</span>
            </div>
            <p className="text-xs text-slate-400">
              When active, public visitors are shown a Canadian meteorological maintenance splash screen while HQ operators retain full access.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
            <span className="text-xs font-bold text-white uppercase">
              {form.maintenanceMode ? 'ACTIVE' : 'OFF'}
            </span>
          </label>
        </div>
      </form>
    </div>
  );
}
