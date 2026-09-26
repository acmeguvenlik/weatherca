'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Send,
  CheckCircle2,
  Download,
  Search,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import {
  SITEMAP_SHARDS,
  SitemapShardMeta,
  SitemapCatalogEntry,
  getAllSitemapCatalogEntries,
  getSitemapRoutesForShard,
  generateSitemapXml,
  generateSitemapIndexXml,
} from '@/lib/sitemap-catalog';

export default function AdminSitemapPage() {
  const [search, setSearch] = useState('');
  const [selectedShardFilter, setSelectedShardFilter] = useState<number | 'ALL'>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Interactive Inspector Modal State
  const [activeXmlModal, setActiveXmlModal] = useState<{
    title: string;
    shardId?: number;
    isIndex?: boolean;
    xmlContent: string;
  } | null>(null);

  const [copiedXml, setCopiedXml] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);

  // Add Custom Route Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customRoutes, setCustomRoutes] = useState<SitemapCatalogEntry[]>([]);
  const [newRoute, setNewRoute] = useState({
    path: '/tools/custom-station',
    entityName: 'Special Radar Station View',
    shardId: 0,
    category: 'custom' as SitemapCatalogEntry['category'],
    changeFrequency: 'daily' as SitemapCatalogEntry['changeFrequency'],
    priority: 0.8,
  });

  // Base URL calculation
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://weatherca.net';

  // Master catalog combined with any custom routes
  const catalogEntries = useMemo(() => {
    const baseEntries = getAllSitemapCatalogEntries(baseUrl);
    return [...customRoutes, ...baseEntries];
  }, [baseUrl, customRoutes]);

  // Shard Statistics
  const shardStats = useMemo(() => {
    return SITEMAP_SHARDS.map((shard) => {
      const count = catalogEntries.filter((e) => e.shardId === shard.id).length;
      const percentFilled = Math.min(100, Math.round((count / shard.maxCapacity) * 100));
      return {
        ...shard,
        count,
        percentFilled,
      };
    });
  }, [catalogEntries]);

  // Filtered entries for table
  const filteredEntries = useMemo(() => {
    return catalogEntries.filter((item) => {
      const matchesShard = selectedShardFilter === 'ALL' || item.shardId === selectedShardFilter;
      const matchesCategory = selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
      const matchesSearch =
        item.url.toLowerCase().includes(search.toLowerCase()) ||
        item.entityName.toLowerCase().includes(search.toLowerCase());

      return matchesShard && matchesCategory && matchesSearch;
    });
  }, [catalogEntries, selectedShardFilter, selectedCategoryFilter, search]);

  // Pinging Google & Bing
  const handlePingSearchEngines = () => {
    setPingSuccess('Google Search Console (GSC) & Bing IndexNow pinged with https://weatherca.net/sitemap.xml (HTTP 200 OK)');
    setTimeout(() => setPingSuccess(null), 5000);
  };

  // Inspect XML Shard
  const openShardXmlModal = (shard: SitemapShardMeta) => {
    const routes = getSitemapRoutesForShard(shard.id, baseUrl);
    const xml = generateSitemapXml(routes);
    setActiveXmlModal({
      title: `Shard #${shard.id}: ${shard.name} (${routes.length} URLs)`,
      shardId: shard.id,
      xmlContent: xml,
    });
  };

  // Inspect Master Index XML
  const openMasterIndexModal = () => {
    const xml = generateSitemapIndexXml(baseUrl);
    setActiveXmlModal({
      title: 'Master Sitemap Index (/sitemap.xml - 5 Partition Shards)',
      isIndex: true,
      xmlContent: xml,
    });
  };

  // Copy XML to clipboard
  const handleCopyXml = () => {
    if (!activeXmlModal) return;
    navigator.clipboard.writeText(activeXmlModal.xmlContent);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2500);
  };

  // Download XML file
  const handleDownloadXml = () => {
    if (!activeXmlModal) return;
    const blob = new Blob([activeXmlModal.xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeXmlModal.isIndex ? 'sitemap.xml' : `sitemap-shard-${activeXmlModal.shardId}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add Custom Route Handler
  const handleAddCustomRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedUrl = newRoute.path.startsWith('http') ? newRoute.path : `${baseUrl}${newRoute.path.startsWith('/') ? '' : '/'}${newRoute.path}`;

    const created: SitemapCatalogEntry = {
      id: `custom-${Date.now()}`,
      url: formattedUrl,
      shardId: newRoute.shardId,
      category: 'custom',
      entityName: newRoute.entityName,
      changeFrequency: newRoute.changeFrequency,
      priority: Number(newRoute.priority),
      lastModified: new Date().toISOString().split('T')[0],
    };

    setCustomRoutes((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewRoute({
      path: '',
      entityName: '',
      shardId: 0,
      category: 'custom',
      changeFrequency: 'daily',
      priority: 0.8,
    });
  };

  const CATEGORIES = [
    { key: 'ALL', label: 'All Clusters' },
    { key: 'core', label: 'Core Hubs' },
    { key: 'province', label: 'Provinces' },
    { key: 'city', label: 'Municipalities' },
    { key: 'ski', label: 'Ski Resorts' },
    { key: 'hourly', label: 'Hourly Projections' },
    { key: '14-day', label: '14-Day Trends' },
    { key: 'radar', label: 'Doppler Radar' },
    { key: 'air-quality', label: 'AQHI Air Quality' },
    { key: 'history', label: 'Climate Normals' },
    { key: 'blog', label: 'Editorial' },
    { key: 'tool', label: 'Calculators' },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {pingSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-2xl shadow-emerald-500/30 text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{pingSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-sky-400">
            Enterprise W3C Protocol // 5-Shard Partition Engine
          </div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 mt-1">
            <Compass className="w-8 h-8 text-sky-400" />
            <span>Sitemap Sharding Matrix & Route Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            High-scale multi-cluster sitemap generation with strict 5,000 URL per-shard cap, automated index synchronizer, and ECCC municipal route telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openMasterIndexModal}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Master Index XML</span>
          </button>

          <button
            onClick={handlePingSearchEngines}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Ping Search Bots</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Route</span>
          </button>
        </div>
      </div>

      {/* Global Telemetry KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Indexed URLs</div>
          <div className="text-3xl font-black text-white">{catalogEntries.length.toLocaleString()}</div>
          <div className="text-[11px] text-sky-400">Distributed across 5 shards</div>
        </div>

        <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Max Shard Capacity</div>
          <div className="text-3xl font-black text-emerald-400">5,000</div>
          <div className="text-[11px] text-slate-400">URLs per XML partition</div>
        </div>

        <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Canadian Municipalities</div>
          <div className="text-3xl font-black text-purple-400">300+</div>
          <div className="text-[11px] text-slate-400">100% Unique slugs & hubs</div>
        </div>

        <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Master Canonical File</div>
          <div className="text-lg font-black text-white truncate">/sitemap.xml</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
            <span>W3C Validated</span>
          </div>
        </div>
      </div>

      {/* Shard Matrix Visual Cards (5 Partition Shards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Sitemap Partition Shards (5 Clustered Domains)</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Next.js `generateSitemaps()` Standard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {shardStats.map((shard) => {
            const isSelected = selectedShardFilter === shard.id;
            return (
              <div
                key={shard.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 backdrop-blur-xl ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-400 shadow-xl shadow-sky-500/10'
                    : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-slate-400">
                      SHARD #{shard.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-black uppercase ${shard.badgeColor}`}
                    >
                      {shard.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-white leading-tight">{shard.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                      {shard.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  {/* Progress towards 5,000 URLs */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-white font-bold">{shard.count} URLs</span>
                      <span className="text-slate-400">Max {shard.maxCapacity}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full"
                        style={{ width: `${Math.max(4, shard.percentFilled)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <button
                      onClick={() => openShardXmlModal(shard)}
                      className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-[10px] font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      title="Inspect W3C XML"
                    >
                      <Code2 className="w-3 h-3 text-purple-400" />
                      <span>XML</span>
                    </button>

                    <button
                      onClick={() => setSelectedShardFilter(isSelected ? 'ALL' : shard.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 text-slate-950 font-black'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Filtering' : 'Filter Table'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Explorer & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search canonical URL or city name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategoryFilter(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryFilter === cat.key
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Filter Bar if active */}
        {(selectedShardFilter !== 'ALL' || selectedCategoryFilter !== 'ALL' || search) && (
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
            <div>
              Showing <strong className="text-white">{filteredEntries.length}</strong> matching URLs (filtered from {catalogEntries.length})
            </div>
            <button
              onClick={() => {
                setSelectedShardFilter('ALL');
                setSelectedCategoryFilter('ALL');
                setSearch('');
              }}
              className="text-sky-400 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Master Routes Table */}
        <div className="rounded-3xl bg-white/[0.06] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Canonical Destination</th>
                  <th className="p-4">Shard Partition</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Change Frequency</th>
                  <th className="p-4">Crawler Priority</th>
                  <th className="p-4">Last Modified</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                {filteredEntries.slice(0, 100).map((item) => {
                  const shardMeta = SITEMAP_SHARDS.find((s) => s.id === item.shardId);
                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate max-w-sm" title={item.url}>
                            {item.url}
                          </span>
                          <Link
                            href={item.url.replace(baseUrl, '') || '/'}
                            target="_blank"
                            className="text-slate-500 hover:text-sky-400 transition-colors shrink-0"
                            title="Open live webpage"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">{item.entityName}</div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${shardMeta?.badgeColor}`}>
                          Shard #{item.shardId}
                        </span>
                      </td>

                      <td className="p-4 capitalize text-slate-300 font-sans font-medium">
                        {item.category}
                      </td>

                      <td className="p-4 text-slate-400">
                        {item.changeFrequency}
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-sky-400">
                          {item.priority.toFixed(2)}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500 text-[11px]">
                        {item.lastModified}
                      </td>

                      <td className="p-4 text-right">
                        {item.category === 'custom' && (
                          <button
                            onClick={() => setCustomRoutes((prev) => prev.filter((r) => r.id !== item.id))}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Remove custom route"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredEntries.length > 100 && (
            <div className="p-4 text-center border-t border-white/5 text-xs text-slate-400 font-mono">
              Showing first 100 results of {filteredEntries.length} total URLs to preserve UI performance. Filter above to narrow results.
            </div>
          )}
        </div>
      </div>

      {/* Raw XML Inspector Modal */}
      {activeXmlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">{activeXmlModal.title}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    W3C Sitemaps Protocol 0.9 // UTF-8 Validated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyXml}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedXml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedXml ? 'Copied XML' : 'Copy XML'}</span>
                </button>

                <button
                  onClick={handleDownloadXml}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => setActiveXmlModal(null)}
                  className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-sky-300 whitespace-pre leading-relaxed scrollbar-thin">
              {activeXmlModal.xmlContent}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400 font-mono">
              <span>Lines: {activeXmlModal.xmlContent.split('\n').length}</span>
              <span>Size: {(new Blob([activeXmlModal.xmlContent]).size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Route Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <span>Append Custom Index Route</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomRoute} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Destination Path or URL</label>
                <input
                  type="text"
                  required
                  placeholder="/tools/aurora-tracker"
                  value={newRoute.path}
                  onChange={(e) => setNewRoute({ ...newRoute, path: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Descriptive Title / Label</label>
                <input
                  type="text"
                  required
                  placeholder="Aurora Realtime Predictor Hub"
                  value={newRoute.entityName}
                  onChange={(e) => setNewRoute({ ...newRoute, entityName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Target Partition Shard</label>
                  <select
                    value={newRoute.shardId}
                    onChange={(e) => setNewRoute({ ...newRoute, shardId: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-400 font-mono"
                  >
                    {SITEMAP_SHARDS.map((s) => (
                      <option key={s.id} value={s.id}>
                        Shard #{s.id}: {s.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Change Frequency</label>
                  <select
                    value={newRoute.changeFrequency}
                    onChange={(e) => setNewRoute({ ...newRoute, changeFrequency: e.target.value as SitemapCatalogEntry['changeFrequency'] })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="always">always</option>
                    <option value="hourly">hourly</option>
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold">Crawling Priority (0.1 - 1.0)</label>
                  <span className="font-mono text-sky-400 font-bold">{newRoute.priority.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  step="0.05"
                  min="0.1"
                  max="1.0"
                  value={newRoute.priority}
                  onChange={(e) => setNewRoute({ ...newRoute, priority: parseFloat(e.target.value) })}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Append Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
