'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Search,
} from 'lucide-react';

export interface ManagedPage {
  slug: string;
  name: string;
  url: string;
  category: 'Corporate' | 'Scientific Tools' | 'Specialized Hubs' | 'Custom';
  seoTitle: string;
  status: 'Published' | 'Draft';
  lastUpdated: string;
}

const INITIAL_PAGES: ManagedPage[] = [
  { slug: 'about', name: 'About WeatherCA', url: '/about', category: 'Corporate', seoTitle: 'About WeatherCA - Canada Premier Meteorological Network', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'contact', name: 'Contact & Inquiries', url: '/contact', category: 'Corporate', seoTitle: 'Contact WeatherCA - Atmospheric Specialists & Offices', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'methodology', name: 'Atmospheric Formulas & Methodology', url: '/methodology', category: 'Corporate', seoTitle: 'Meteorological Methodology & Scientific Formulas | WeatherCA', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'faq', name: 'Frequently Asked Questions', url: '/faq', category: 'Corporate', seoTitle: 'Frequently Asked Questions | WeatherCA', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'ski', name: 'Canada Ski Resorts & Snow Reports Hub', url: '/ski', category: 'Specialized Hubs', seoTitle: 'Canada Ski Resorts & Snow Reports - Live Mountain Conditions', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'calculator', name: 'Canadian Wind Chill & Humidex Calculator', url: '/tools/calculator', category: 'Scientific Tools', seoTitle: 'Canadian Wind Chill & Humidex Calculator | WeatherCA', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'compare', name: 'Compare Canadian Cities Weather', url: '/tools/compare', category: 'Scientific Tools', seoTitle: 'Compare Canadian Cities Weather | WeatherCA', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'radar', name: 'Canada Live Doppler Radar Network', url: '/radar', category: 'Specialized Hubs', seoTitle: 'Canada Live Weather Radar - Doppler Precipitation & Storm Tracking', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'alerts', name: 'Emergency Weather Dispatch Center', url: '/alerts', category: 'Specialized Hubs', seoTitle: 'Canada Emergency Weather Alerts & Meteorological Warnings', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'widget', name: 'Weather Widget Studio', url: '/tools/widget', category: 'Scientific Tools', seoTitle: 'Free Canadian Weather Widgets & Website Embed Generator', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'almanac', name: 'Canadian Climate Almanac & Extremes', url: '/almanac', category: 'Specialized Hubs', seoTitle: 'Canadian Climate Normals & Historical Weather Almanac', status: 'Published', lastUpdated: '2026-09-15' },
  { slug: 'highways', name: 'Highway & Mountain Pass Conditions', url: '/highways', category: 'Specialized Hubs', seoTitle: 'Canadian Highway & Mountain Pass Winter Weather Conditions', status: 'Published', lastUpdated: '2026-09-15' },
];

export default function AdminPagesManager() {
  const [pages, setPages] = useState<ManagedPage[]>(INITIAL_PAGES);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ManagedPage | null>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('weatherca_cms_pages');
      if (saved) setPages(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Form State
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState<ManagedPage['category']>('Custom');
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Published');

  const saveToStorage = (updated: ManagedPage[]) => {
    setPages(updated);
    localStorage.setItem('weatherca_cms_pages', JSON.stringify(updated));
  };

  const handleOpenAdd = () => {
    setEditingPage(null);
    setFormName('');
    setFormUrl('/custom-page');
    setFormCategory('Custom');
    setFormSeoTitle('');
    setFormStatus('Published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: ManagedPage) => {
    setEditingPage(page);
    setFormName(page.name);
    setFormUrl(page.url);
    setFormCategory(page.category);
    setFormSeoTitle(page.seoTitle);
    setFormStatus(page.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    if (editingPage) {
      // Update
      const updated = pages.map((p) =>
        p.slug === editingPage.slug
          ? {
              ...p,
              name: formName,
              url: formUrl,
              category: formCategory,
              seoTitle: formSeoTitle,
              status: formStatus,
              lastUpdated: today,
            }
          : p
      );
      saveToStorage(updated);
    } else {
      // Add
      const slug = formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const newPage: ManagedPage = {
        slug,
        name: formName,
        url: formUrl,
        category: formCategory,
        seoTitle: formSeoTitle || `${formName} | WeatherCA`,
        status: formStatus,
        lastUpdated: today,
      };
      saveToStorage([newPage, ...pages]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to remove this managed page?')) {
      const updated = pages.filter((p) => p.slug !== slug);
      saveToStorage(updated);
    }
  };

  const filtered = pages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.url.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" />
            <span>CMS Pages & Canonical Route Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, or decommission specialized pages, corporate landing routes, and SEO meta anchors.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search managed pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Total Canonical Routes: <strong className="text-white">{pages.length}</strong>
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4">Page Title & Meta</th>
                <th className="p-4">Route URL</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Verified</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((page) => (
                <tr key={page.slug} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 max-w-xs">
                    <div className="font-bold text-white text-sm">{page.name}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{page.seoTitle}</div>
                  </td>
                  <td className="p-4 font-mono text-sky-400 font-semibold">{page.url}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-purple-300">
                      {page.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        page.status === 'Published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {page.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{page.lastUpdated}</td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={page.url}
                      className="inline-block p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Preview Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(page)}
                      className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors"
                      title="Edit Page Properties"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.slug)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingPage ? 'Edit Managed Page' : 'Create New Custom Page'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Page Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Route Path (URL)</label>
                <input
                  type="text"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Category Classification</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ManagedPage['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Scientific Tools">Scientific Tools</option>
                    <option value="Specialized Hubs">Specialized Hubs</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Publication Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">SEO Meta Title Override</label>
                <input
                  type="text"
                  value={formSeoTitle}
                  onChange={(e) => setFormSeoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {editingPage ? 'Save Updates' : 'Publish Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
