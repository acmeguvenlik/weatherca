'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Share2,
  CheckCircle2,
  FileCode,
  Sparkles,
  Tag,
  Save,
  Eye,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function AdminSeoPage() {
  const { seoSettings, updateSeoSettings } = useSettings();

  const [titleTemplate, setTitleTemplate] = useState(seoSettings.metaTitleTemplate);
  const [description, setDescription] = useState(seoSettings.defaultMetaDescription);
  const [keywords, setKeywords] = useState(seoSettings.keywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [robotsTxt, setRobotsTxt] = useState(seoSettings.robotsTxt);
  const [twitterHandle, setTwitterHandle] = useState(seoSettings.twitterHandle);
  const [schemaEnabled, setSchemaEnabled] = useState(seoSettings.schemaJsonLdEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeoSettings({
      metaTitleTemplate: titleTemplate,
      defaultMetaDescription: description,
      keywords,
      robotsTxt,
      twitterHandle,
      schemaJsonLdEnabled: schemaEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-purple-400" />
            <span>SEO & Search Engine Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune title architectures, social card meta tags, Google rich results schemas, and robots crawling directives.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>SEO and Robots configuration persisted and updated globally across Edge routes!</span>
        </div>
      )}

      {/* Meta Titles & Descriptions */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Global Title & Snippet Directives</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Meta Title Template (%s = Page Title)</label>
            <input
              type="text"
              value={titleTemplate}
              onChange={(e) => setTitleTemplate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-purple-400"
            />
            <p className="text-[11px] text-slate-500">
              Preview: <span className="text-sky-300">Toronto, ON | WeatherCA - Canadian Live Weather Network</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Default SERP Meta Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Keywords Tag Manager */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-sky-400" />
          <span>Target Canadian Weather Keywords</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(kw)}
                className="text-slate-500 hover:text-rose-400 font-bold"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddKeyword} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Add keyword (e.g. Banff snowfall, Montreal radar)..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 w-72"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            Add Tag
          </button>
        </form>
      </div>

      {/* OpenGraph Card Live Inspector */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <span>Social Sharing OpenGraph Preview (1200x630 HD)</span>
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-400">
            @vercel/og Active
          </span>
        </div>

        {/* Live Card Preview */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 max-w-xl space-y-3">
          <div className="aspect-[1.91/1] w-full rounded-xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 border border-white/10 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-white flex items-center gap-1.5">
                🍁 Weather<span className="text-sky-400">CA</span>
              </span>
              <span className="text-xs font-mono text-cyan-300">LIVE SATELLITE RADAR</span>
            </div>
            <div>
              <div className="text-2xl font-black text-white">Toronto, ON: -2°C Kar Yağışlı</div>
              <div className="text-xs text-slate-300 mt-1">Wind Chill: -9°C • Rüzgar: 28 km/h KB • AQHI: 2 Düşük</div>
            </div>
          </div>
          <div className="px-2 space-y-0.5">
            <div className="text-[11px] font-mono uppercase text-slate-500">WEATHERCA.NET</div>
            <div className="text-sm font-bold text-white">Canada Live Weather Forecasts & Doppler Radar</div>
            <div className="text-xs text-slate-400 line-clamp-1">{description}</div>
          </div>
        </div>
      </div>

      {/* Robots.txt Directives */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <span>Live robots.txt Crawling Directives</span>
          </h2>
          <Link
            href="/robots.txt"
            target="_blank"
            className="text-xs text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Live /robots.txt</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <textarea
          rows={6}
          value={robotsTxt}
          onChange={(e) => setRobotsTxt(e.target.value)}
          className="w-full p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-emerald-300 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
