'use client';

import React, { useState, useEffect } from 'react';
import {
  AdSlotConfig,
  DirectCampaign,
  GlobalAdSettings,
  AdNetworkType,
  AdDeviceTarget,
  WeatherTriggerCondition,
} from '@/types/ads';
import {
  Megaphone,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  Code,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Copy,
  ExternalLink,
  ShieldCheck,
  Globe,
  Radio,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Monitor,
  Smartphone,
  Tablet,
  BarChart3,
  FileText,
  CloudSnow,
  CloudRain,
  Sun,
  Flame,
  Zap,
  Download,
  Upload,
  Search,
  Filter,
  Layers,
  X,
  Save,
} from 'lucide-react';

const PROVINCES = [
  { code: 'ALL', label: 'All Canada (National)' },
  { code: 'ON', label: 'Ontario' },
  { code: 'QC', label: 'Quebec' },
  { code: 'BC', label: 'British Columbia' },
  { code: 'AB', label: 'Alberta' },
  { code: 'MB', label: 'Manitoba' },
  { code: 'SK', label: 'Saskatchewan' },
  { code: 'NS', label: 'Nova Scotia' },
  { code: 'NB', label: 'New Brunswick' },
  { code: 'NL', label: 'Newfoundland & Labrador' },
  { code: 'PE', label: 'Prince Edward Island' },
  { code: 'YT', label: 'Yukon' },
  { code: 'NT', label: 'Northwest Territories' },
  { code: 'NU', label: 'Nunavut' },
];

const WEATHER_CONDITIONS: { value: WeatherTriggerCondition; label: string; icon: string }[] = [
  { value: 'any', label: 'Always Active (No Weather Constraint)', icon: '🌐' },
  { value: 'temp_below_zero', label: 'Freezing Weather (Temp < 0°C - Winter Tires/Gear)', icon: '❄️' },
  { value: 'temp_above_30', label: 'Extreme Heatwave (Temp > 30°C - Cooling/HVAC)', icon: '☀️' },
  { value: 'snow_falling', label: 'Active Snowfall (Ski Passes & Avalanche Safety)', icon: '⛷️' },
  { value: 'rain_storm', label: 'Heavy Rain / Atmospheric River (Flood & Wiper Gear)', icon: '🌧️' },
  { value: 'high_aqhi_smoke', label: 'Wildfire Smoke Hazard (AQHI > 5 - Air Purifiers/N95)', icon: '🔥' },
  { value: 'severe_weather_alert', label: 'Severe Storm Warning (Generators & Flashlights)', icon: '⚡' },
  { value: 'aurora_active', label: 'High Aurora Activity (Kp > 4 - Dark Sky Tours)', icon: '🌌' },
];

const DEFAULT_SLOTS: AdSlotConfig[] = [
  {
    id: 'slot-1',
    name: 'Header Top Leaderboard',
    slotKey: 'top-leaderboard',
    category: 'header',
    dimensions: '728x90 (Desktop) / 320x50 (Mobile)',
    placement: 'Global Top Header (Below Navigation)',
    type: 'google_adsense',
    enabled: true,
    cpm: 4.2,
    monthlyImpressions: 1450000,
    revenueEst: 6090,
    customCode: `<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-981273918237192" data-ad-slot="891230192"></ins>`,
    targetDevice: 'all',
    geoTargetProvinces: ['ALL'],
    weatherTrigger: { enabled: false, condition: 'any', description: 'Run unconditionally' },
    refreshIntervalSec: 60,
    lazyLoad: true,
    priorityWeight: 10,
    createdAt: '2026-09-01',
    updatedAt: '2026-09-16',
  },
  {
    id: 'slot-2',
    name: 'Interactive Doppler Radar Sponsor Bar',
    slotKey: 'radar-sponsor',
    category: 'radar',
    dimensions: 'Fluid Banner (100% x 60px)',
    placement: 'Directly below Live Doppler Canvas (/radar)',
    type: 'direct_sponsor',
    enabled: true,
    cpm: 6.5,
    monthlyImpressions: 890000,
    revenueEst: 5785,
    customCode: `<div class="weatherca-sponsor-badge bg-slate-900 border border-sky-500/30 p-3 text-center text-xs text-sky-300 font-bold">Official Radar Sponsor: Canadian Tire Auto Winter Defense</div>`,
    targetDevice: 'all',
    geoTargetProvinces: ['ALL'],
    weatherTrigger: { enabled: true, condition: 'temp_below_zero', description: 'Triggered when regional temperature is below 0°C' },
    refreshIntervalSec: 0,
    lazyLoad: false,
    priorityWeight: 9,
    createdAt: '2026-09-02',
    updatedAt: '2026-09-16',
  },
  {
    id: 'slot-3',
    name: 'Blog In-Article Mid-Roll Banner',
    slotKey: 'blog-midroll',
    category: 'in_article',
    dimensions: '336x280 Large Rectangle',
    placement: 'Section 2-3 Divider in 5,008 Scientific Treatises',
    type: 'google_adsense',
    enabled: true,
    cpm: 3.8,
    monthlyImpressions: 1120000,
    revenueEst: 4256,
    customCode: `<ins class="adsbygoogle" style="display:inline-block;width:336px;height:280px" data-ad-client="ca-pub-981273918237192" data-ad-slot="481920311"></ins>`,
    targetDevice: 'all',
    geoTargetProvinces: ['ALL'],
    weatherTrigger: { enabled: false, condition: 'any', description: 'Run unconditionally' },
    refreshIntervalSec: 45,
    lazyLoad: true,
    priorityWeight: 8,
    createdAt: '2026-09-05',
    updatedAt: '2026-09-16',
  },
  {
    id: 'slot-4',
    name: 'Sticky Sidebar Half-Page Tower',
    slotKey: 'sidebar-tower',
    category: 'sidebar',
    dimensions: '300x600 Half-Page',
    placement: 'Blog Articles & City 14-Day Forecast Sidebars',
    type: 'affiliate_partner',
    enabled: true,
    cpm: 5.1,
    monthlyImpressions: 650000,
    revenueEst: 3315,
    customCode: `<div class="affiliate-box bg-slate-950 border border-white/10 p-4 text-center rounded-2xl"><p class="text-xs text-amber-300 font-bold">Whistler Ski Season Passes - Save 25% with WeatherCA VIP</p></div>`,
    targetDevice: 'desktop',
    geoTargetProvinces: ['BC', 'AB', 'ON'],
    weatherTrigger: { enabled: true, condition: 'snow_falling', description: 'Triggered during alpine snowfall events' },
    refreshIntervalSec: 90,
    lazyLoad: true,
    priorityWeight: 7,
    createdAt: '2026-09-08',
    updatedAt: '2026-09-16',
  },
  {
    id: 'slot-5',
    name: 'Highway Passes & Mountain Telemetry Sponsor',
    slotKey: 'highways-sponsor',
    category: 'highways',
    dimensions: '728x90 Leaderboard',
    placement: 'Highway & Mountain Pass Webcams (/highways)',
    type: 'direct_sponsor',
    enabled: true,
    cpm: 4.8,
    monthlyImpressions: 420000,
    revenueEst: 2016,
    customCode: `<div class="p-3 bg-gradient-to-r from-slate-900 to-sky-950 border border-white/10 text-xs text-white">Kal Tire Winter 3PMSF Certified Traction Sponsor</div>`,
    targetDevice: 'all',
    geoTargetProvinces: ['BC', 'AB'],
    weatherTrigger: { enabled: true, condition: 'temp_below_zero', description: 'Sub-zero mountain pass triggers' },
    refreshIntervalSec: 0,
    lazyLoad: false,
    priorityWeight: 8,
    createdAt: '2026-09-10',
    updatedAt: '2026-09-16',
  },
  {
    id: 'slot-6',
    name: 'AdBlock Fallback Community Shield',
    slotKey: 'adblock-fallback',
    category: 'in_article',
    dimensions: 'Adaptive Responsive',
    placement: 'Shown when client browser triggers uBlock / AdBlock',
    type: 'custom_html',
    enabled: true,
    cpm: 0,
    monthlyImpressions: 210000,
    revenueEst: 0,
    customCode: `<div class="adblock-banner p-4 bg-sky-950/60 border border-sky-500/30 rounded-2xl text-center"><p class="text-xs font-bold text-sky-200">Support Free Public Canadian Weather Alerts & Doppler Radar</p></div>`,
    targetDevice: 'all',
    geoTargetProvinces: ['ALL'],
    weatherTrigger: { enabled: false, condition: 'any', description: 'Fallback on blocked ad requests' },
    refreshIntervalSec: 0,
    lazyLoad: false,
    priorityWeight: 1,
    createdAt: '2026-09-12',
    updatedAt: '2026-09-16',
  },
];

const DEFAULT_CAMPAIGNS: DirectCampaign[] = [
  {
    id: 'camp-1',
    advertiser: 'Canadian Tire Corp.',
    campaignName: 'Winter Readiness & Certified 3PMSF Tires',
    slotKey: 'radar-sponsor',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 'active',
    budgetCAD: 12000,
    cpm: 6.5,
    clicks: 4290,
    impressions: 480000,
    maxImpressions: 1000000,
    bannerImageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=728&q=80',
    clickUrl: 'https://canadiantire.ca',
    targetProvinces: ['ALL'],
    weatherTrigger: { enabled: true, condition: 'temp_below_zero', description: 'Triggered when temp is sub-zero' },
    createdAt: '2026-09-01',
  },
  {
    id: 'camp-2',
    advertiser: 'Vail Resorts / Whistler Blackcomb',
    campaignName: 'Early Bird Epic Ski Pass 2026/27',
    slotKey: 'sidebar-tower',
    startDate: '2026-08-15',
    endDate: '2026-11-30',
    status: 'active',
    budgetCAD: 8500,
    cpm: 5.1,
    clicks: 3120,
    impressions: 340000,
    maxImpressions: 800000,
    bannerImageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&q=80',
    clickUrl: 'https://whistlerblackcomb.com',
    targetProvinces: ['BC', 'AB', 'ON'],
    weatherTrigger: { enabled: true, condition: 'snow_falling', description: 'Triggered during alpine snowfall' },
    createdAt: '2026-08-15',
  },
  {
    id: 'camp-3',
    advertiser: 'Garmin Canada InReach',
    campaignName: 'Satellite SOS & Backcountry Safety Tech',
    slotKey: 'highways-sponsor',
    startDate: '2026-09-10',
    endDate: '2026-10-31',
    status: 'active',
    budgetCAD: 5000,
    cpm: 4.8,
    clicks: 1840,
    impressions: 210000,
    maxImpressions: 500000,
    bannerImageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=728&q=80',
    clickUrl: 'https://garmin.com',
    targetProvinces: ['BC', 'AB', 'YT', 'NT'],
    weatherTrigger: { enabled: true, condition: 'severe_weather_alert', description: 'Mountain pass severe alerts' },
    createdAt: '2026-09-10',
  },
];

export default function AdminAdsManagementPage() {
  const [activeTab, setActiveTab] = useState<
    'slots' | 'campaigns' | 'weather_triggers' | 'networks' | 'adstxt' | 'simulator'
  >('slots');
  const [masterAdsEnabled, setMasterAdsEnabled] = useState(true);
  const [publisherId, setPublisherId] = useState('ca-pub-981273918237192');
  const [headerBiddingEnabled, setHeaderBiddingEnabled] = useState(true);
  const [adblockFallbackEnabled, setAdblockFallbackEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Search & Filter State
  const [slotSearchQuery, setSlotSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Slots and Campaigns State
  const [slots, setSlots] = useState<AdSlotConfig[]>(DEFAULT_SLOTS);
  const [campaigns, setCampaigns] = useState<DirectCampaign[]>(DEFAULT_CAMPAIGNS);

  // Modal State for Slot CRUD
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AdSlotConfig | null>(null);

  // Modal State for Campaign CRUD
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<DirectCampaign | null>(null);

  // Simulator State
  const [selectedSlotForPreview, setSelectedSlotForPreview] = useState<string>('top-leaderboard');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // ads.txt state
  const [adsTxtContent, setAdsTxtContent] = useState(`google.com, pub-981273918237192, DIRECT, f08c47fec0942fa0
appnexus.com, 14291, RESELLER, bba84830856721b1
rubiconproject.com, 90812, RESELLER, 0bfd66d529a55803
openx.com, 537192841, RESELLER, 6a698e2ec38604c6
pubmatic.com, 159281, RESELLER, 5d62e6307edd348a
magnite.com, 29481, RESELLER, 1b48b7f8e87492c1`);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weatherca_ads_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.slots)) setSlots(parsed.slots);
        if (Array.isArray(parsed.campaigns)) setCampaigns(parsed.campaigns);
        if (typeof parsed.masterAdsEnabled === 'boolean')
          setMasterAdsEnabled(parsed.masterAdsEnabled);
        if (parsed.publisherId) setPublisherId(parsed.publisherId);
        if (parsed.adsTxtContent) setAdsTxtContent(parsed.adsTxtContent);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage
  const handleSaveConfig = () => {
    try {
      localStorage.setItem(
        'weatherca_ads_config',
        JSON.stringify({
          slots,
          campaigns,
          masterAdsEnabled,
          publisherId,
          headerBiddingEnabled,
          adblockFallbackEnabled,
          adsTxtContent,
        })
      );
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // SLOT CRUD OPERATIONS
  const handleOpenCreateSlot = () => {
    const newSlot: AdSlotConfig = {
      id: `slot-${Date.now()}`,
      name: '',
      slotKey: `ad-slot-${slots.length + 1}`,
      category: 'in_article',
      dimensions: '728x90 Leaderboard',
      placement: 'Custom Route Placement',
      type: 'google_adsense',
      enabled: true,
      cpm: 4.0,
      monthlyImpressions: 500000,
      revenueEst: 2000,
      customCode: `<ins class="adsbygoogle" style="display:block" data-ad-client="${publisherId}" data-ad-slot="123456789" data-ad-format="auto"></ins>`,
      targetDevice: 'all',
      geoTargetProvinces: ['ALL'],
      weatherTrigger: { enabled: false, condition: 'any', description: 'Run unconditionally' },
      refreshIntervalSec: 60,
      lazyLoad: true,
      priorityWeight: 5,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setEditingSlot(newSlot);
    setIsSlotModalOpen(true);
  };

  const handleOpenEditSlot = (slot: AdSlotConfig) => {
    setEditingSlot({ ...slot });
    setIsSlotModalOpen(true);
  };

  const handleSaveSlotModal = () => {
    if (!editingSlot || !editingSlot.name.trim() || !editingSlot.slotKey.trim()) {
      alert('Please provide a valid Slot Name and Unique Slot Key.');
      return;
    }

    const calculatedRevenue = Math.round(
      (editingSlot.monthlyImpressions / 1000) * editingSlot.cpm
    );
    const updatedSlot = {
      ...editingSlot,
      revenueEst: calculatedRevenue,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setSlots((prev) => {
      const exists = prev.some((s) => s.id === updatedSlot.id);
      if (exists) {
        return prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s));
      } else {
        return [updatedSlot, ...prev];
      }
    });

    setIsSlotModalOpen(false);
    setEditingSlot(null);
    handleSaveConfig();
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this ad slot?')) {
      setSlots((prev) => prev.filter((s) => s.id !== id));
      handleSaveConfig();
    }
  };

  const handleCloneSlot = (slot: AdSlotConfig) => {
    const cloned: AdSlotConfig = {
      ...slot,
      id: `slot-${Date.now()}`,
      name: `${slot.name} (Copy)`,
      slotKey: `${slot.slotKey}-copy`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setSlots((prev) => [cloned, ...prev]);
    handleSaveConfig();
  };

  const handleToggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // CAMPAIGN CRUD OPERATIONS
  const handleOpenCreateCampaign = () => {
    const newCamp: DirectCampaign = {
      id: `camp-${Date.now()}`,
      advertiser: '',
      campaignName: '',
      slotKey: slots[0]?.slotKey || 'top-leaderboard',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'active',
      budgetCAD: 5000,
      cpm: 5.0,
      clicks: 0,
      impressions: 0,
      maxImpressions: 500000,
      clickUrl: 'https://',
      targetProvinces: ['ALL'],
      weatherTrigger: { enabled: false, condition: 'any', description: 'Run unconditionally' },
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEditingCampaign(newCamp);
    setIsCampaignModalOpen(true);
  };

  const handleOpenEditCampaign = (camp: DirectCampaign) => {
    setEditingCampaign({ ...camp });
    setIsCampaignModalOpen(true);
  };

  const handleSaveCampaignModal = () => {
    if (!editingCampaign || !editingCampaign.advertiser.trim() || !editingCampaign.campaignName.trim()) {
      alert('Please fill in Advertiser Name and Campaign Title.');
      return;
    }

    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === editingCampaign.id);
      if (exists) {
        return prev.map((c) => (c.id === editingCampaign.id ? editingCampaign : c));
      } else {
        return [editingCampaign, ...prev];
      }
    });

    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
    handleSaveConfig();
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this sponsored direct campaign?')) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      handleSaveConfig();
    }
  };

  // EXPORT / IMPORT CONFIG
  const handleExportJson = () => {
    const data = {
      slots,
      campaigns,
      masterAdsEnabled,
      publisherId,
      headerBiddingEnabled,
      adblockFallbackEnabled,
      adsTxtContent,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weatherca-ads-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.slots)) setSlots(parsed.slots);
        if (Array.isArray(parsed.campaigns)) setCampaigns(parsed.campaigns);
        if (typeof parsed.masterAdsEnabled === 'boolean')
          setMasterAdsEnabled(parsed.masterAdsEnabled);
        if (parsed.publisherId) setPublisherId(parsed.publisherId);
        alert('Ads configuration imported successfully!');
      } catch {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all Ad Slots and Campaigns to WeatherCA Canadian High-Yield defaults?')) {
      setSlots(DEFAULT_SLOTS);
      setCampaigns(DEFAULT_CAMPAIGNS);
      setMasterAdsEnabled(true);
      handleSaveConfig();
    }
  };

  // Filtered Slots
  const filteredSlots = slots.filter((slot) => {
    const matchesCat = selectedCategoryFilter === 'ALL' || slot.category === selectedCategoryFilter;
    const query = slotSearchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      slot.name.toLowerCase().includes(query) ||
      slot.slotKey.toLowerCase().includes(query) ||
      slot.placement.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  // KPI Calculations
  const totalMonthlyImpressions = slots
    .filter((s) => s.enabled)
    .reduce((acc, s) => acc + s.monthlyImpressions, 0);

  const totalMonthlyRevenue = slots
    .filter((s) => s.enabled)
    .reduce((acc, s) => acc + s.revenueEst, 0);

  const averageCPM =
    totalMonthlyImpressions > 0
      ? ((totalMonthlyRevenue / totalMonthlyImpressions) * 1000).toFixed(2)
      : '0.00';

  const activeSlot = slots.find((s) => s.slotKey === selectedSlotForPreview) || slots[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Bar with Master Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/20">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>Ad Units &amp; Monetization Control</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  FULL CRUD PRO
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage Google AdSense, Prebid.js header bidding, weather-triggered sponsor campaigns,
                and programmatic slots across 5,008 articles &amp; 230 city routes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportJson}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Export full JSON config"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline">Export JSON</span>
          </button>

          <label className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={() => setMasterAdsEnabled(!masterAdsEnabled)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              masterAdsEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/15'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {masterAdsEnabled ? (
              <>
                <ToggleRight className="w-5 h-5 text-emerald-400" />
                <span>Monetization ACTIVE</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-rose-400" />
                <span>All Ads PAUSED</span>
              </>
            )}
          </button>

          <button
            onClick={handleSaveConfig}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>
            Ad inventory configurations, custom targeting, and weather triggers synchronized
            successfully with live edge servers.
          </span>
        </div>
      )}

      {/* 2. Real-Time Telemetry & Revenue KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Projected Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${totalMonthlyRevenue.toLocaleString()} <span className="text-xs text-slate-400">CAD</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+22.4% vs previous 30-day billing cycle</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Monthly Ad Impressions</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {(totalMonthlyImpressions / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-sky-400 flex items-center gap-1 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Across 5,008 articles, radar, and 230 city hubs</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Blended Network eCPM</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${averageCPM} <span className="text-xs text-slate-400">CAD</span>
          </div>
          <div className="text-[11px] text-purple-400 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tier 1 Canadian meteorological inventory</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Active Placements</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {slots.filter((s) => s.enabled).length} / {slots.length}
          </div>
          <div className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
            <Radio className="w-3.5 h-3.5" />
            <span>100% IAB Responsive Viewability</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'slots'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Ad Slots CRUD ({slots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'campaigns'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Direct Campaigns ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('weather_triggers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'weather_triggers'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CloudSnow className="w-4 h-4 text-cyan-400" />
          <span>Weather Triggers Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('networks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'networks'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Networks &amp; Scripts</span>
        </button>

        <button
          onClick={() => setActiveTab('adstxt')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'adstxt'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ads.txt Protocol</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Ad Simulator</span>
        </button>
      </div>

      {/* 4. Tab 1: Ad Slots Management Matrix (FULL CRUD) */}
      {activeTab === 'slots' && (
        <div className="space-y-4">
          {/* Controls: Search, Filter, Add Slot Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={slotSearchQuery}
                onChange={(e) => setSlotSearchQuery(e.target.value)}
                placeholder="Search ad slots by name, key, or page placement..."
                className="w-full bg-transparent text-white focus:outline-none placeholder:text-slate-500"
              />
              {slotSearchQuery && (
                <button onClick={() => setSlotSearchQuery('')} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="ALL">All Categories</option>
                <option value="header">Header</option>
                <option value="sidebar">Sidebar</option>
                <option value="in_article">In-Article</option>
                <option value="radar">Radar</option>
                <option value="highways">Highways</option>
                <option value="footer">Footer</option>
              </select>

              <button
                onClick={handleOpenCreateSlot}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Ad Slot</span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-white/5">
              {filteredSlots.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                  <p>No ad slots found matching your search filter.</p>
                  <button
                    onClick={handleResetDefaults}
                    className="text-sky-400 hover:underline font-bold"
                  >
                    Reset to Default Inventory
                  </button>
                </div>
              ) : (
                filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-white text-sm">{slot.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                          {slot.slotKey}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            slot.type === 'google_adsense'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : slot.type === 'direct_sponsor'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {slot.type.replace('_', ' ').toUpperCase()}
                        </span>

                        {slot.weatherTrigger?.enabled && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                            <CloudSnow className="w-3 h-3" />
                            <span>Weather Trigger</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                        <span>📐 {slot.dimensions}</span>
                        <span>•</span>
                        <span>📍 {slot.placement}</span>
                        <span>•</span>
                        <span>📱 {slot.targetDevice.toUpperCase()}</span>
                        <span>•</span>
                        <span>🇨🇦 {slot.geoTargetProvinces.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Est. CPM</div>
                        <div className="font-bold text-sky-400">${slot.cpm.toFixed(2)} CAD</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Monthly Impr.</div>
                        <div className="font-bold text-slate-200">
                          {(slot.monthlyImpressions / 1000).toLocaleString()}k
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Est. Revenue</div>
                        <div className="font-bold text-emerald-400">
                          ${slot.revenueEst.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                        <button
                          onClick={() => handleToggleSlot(slot.id)}
                          className={`p-1.5 rounded-xl border transition-colors ${
                            slot.enabled
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-white/5 text-slate-500 border-white/10'
                          }`}
                          title={slot.enabled ? 'Click to pause slot' : 'Click to enable slot'}
                        >
                          {slot.enabled ? (
                            <ToggleRight className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-500" />
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEditSlot(slot)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sky-300 transition-colors"
                          title="Edit slot configuration"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleCloneSlot(slot)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 transition-colors"
                          title="Duplicate / Clone slot"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedSlotForPreview(slot.slotKey);
                            setActiveTab('simulator');
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
                          title="Preview in simulator"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors"
                          title="Delete slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Direct Campaigns CRUD */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Direct Sponsored Campaigns &amp; Affiliates</h3>
                <p className="text-xs text-slate-400">
                  Manage fixed-rate direct advertising partnerships with Canadian automotive, ski, and outdoor brands.
                </p>
              </div>

              <button
                onClick={handleOpenCreateCampaign}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Direct Campaign</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400">{camp.advertiser}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      {camp.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{camp.campaignName}</h4>
                    <p className="text-[11px] text-slate-400">Target Slot: {camp.slotKey}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <div>
                      <div className="text-[10px] text-slate-500">Impressions</div>
                      <div className="font-bold text-white">
                        {camp.impressions.toLocaleString()} / {(camp.maxImpressions / 1000).toLocaleString()}k
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">CTR / Clicks</div>
                      <div className="font-bold text-emerald-400">
                        {camp.clicks.toLocaleString()} (
                        {camp.impressions > 0
                          ? ((camp.clicks / camp.impressions) * 100).toFixed(2)
                          : '0.00'}
                        %)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-[11px] text-slate-400">Budget: ${camp.budgetCAD} CAD</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCampaign(camp)}
                        className="text-sky-400 hover:text-sky-300 text-xs font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Weather Triggers Studio */}
      {activeTab === 'weather_triggers' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CloudSnow className="w-5 h-5 text-cyan-400" />
                <span>Weather-Triggered Contextual Ad Automation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Dynamically serve high-converting advertisements based on real-time Canadian weather telemetry
                (temperature, snowfall, air quality smoke index, and severe weather warnings).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WEATHER_CONDITIONS.map((cond) => (
                <div
                  key={cond.value}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{cond.icon}</span>
                      <div className="font-bold text-white text-sm">{cond.label}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automatically matches user location temperature and active ECCC alerts. When triggered,
                    slots assigned to this condition receive +300% priority weighting over general ads.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Networks & Scripts Config */}
      {activeTab === 'networks' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Programmatic Networks &amp; Header Bidding</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Google AdSense Publisher Client ID
                </label>
                <input
                  type="text"
                  value={publisherId}
                  onChange={(e) => setPublisherId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
                <p className="text-[11px] text-slate-400">
                  Automatically injected into document head on all public forecast and blog pages.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Consent Management Platform (CMP)
                </label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500">
                  <option>Google Funding Choices / TCF 2.2 (Certified)</option>
                  <option>Quantcast Choice CMP</option>
                  <option>Custom Canadian PIPEDA / Law 25 Notice</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  Compliant with Canadian PIPEDA, Quebec Law 25, and GDPR for international visitors.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Prebid.js Header Bidding Engine</div>
                  <div className="text-xs text-slate-400">
                    Runs client-side auctions across AppNexus, Magnite, OpenX, and PubMatic before Google Ad Manager waterfall.
                  </div>
                </div>
                <button
                  onClick={() => setHeaderBiddingEnabled(!headerBiddingEnabled)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                    headerBiddingEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {headerBiddingEnabled ? 'Prebid ENABLED' : 'Prebid DISABLED'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Tab 5: ads.txt Protocol Editor */}
      {activeTab === 'adstxt' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>IAB ads.txt Authorized Sellers Registry</span>
                  <a
                    href="/ads.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-400 font-normal hover:underline flex items-center gap-1"
                  >
                    <span>View Live /ads.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </h3>
                <p className="text-xs text-slate-400">
                  Direct seller and reseller authorization lines. Automatically parsed by DSPs and Google AdSense crawlers.
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(adsTxtContent);
                  alert('ads.txt copied to clipboard!');
                }}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Raw ads.txt</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={adsTxtContent}
              onChange={(e) => setAdsTxtContent(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      )}

      {/* 9. Tab 6: Live Ad Simulator Sandbox */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Live Ad Rendering Simulator Sandbox</h3>
                <p className="text-xs text-slate-400">
                  Preview how ad creatives, banners, and fallback blocks render on user viewports.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedSlotForPreview}
                  onChange={(e) => setSelectedSlotForPreview(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-sky-500"
                >
                  {slots.map((s) => (
                    <option key={s.slotKey} value={s.slotKey}>
                      {s.name} ({s.dimensions})
                    </option>
                  ))}
                </select>

                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-white/10">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      previewDevice === 'desktop' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      previewDevice === 'tablet' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      previewDevice === 'mobile' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sandbox Viewport */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-dashed border-white/20 flex flex-col items-center justify-center min-h-[260px] space-y-4">
              <div className="text-xs font-mono text-slate-500">
                [IAB Sandbox Container: {activeSlot.name} — {activeSlot.dimensions}]
              </div>

              <div
                className={`p-4 rounded-xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-slate-900/60 text-center shadow-xl ${
                  previewDevice === 'mobile'
                    ? 'max-w-xs'
                    : previewDevice === 'tablet'
                    ? 'max-w-md'
                    : 'w-full max-w-2xl'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">
                  Advertisement • WeatherCA Partner
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: activeSlot.customCode }}
                  className="overflow-hidden"
                />
              </div>

              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Responsive Viewport Verified (0 Layout Shift / CLS Score &lt; 0.01)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL: CREATE / EDIT AD SLOT */}
      {isSlotModalOpen && editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                <span>{editingSlot.id.startsWith('slot-') && editingSlot.name ? 'Edit Ad Slot' : 'Create New Ad Slot'}</span>
              </h3>
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Slot Display Name *</label>
                <input
                  type="text"
                  value={editingSlot.name}
                  onChange={(e) => setEditingSlot({ ...editingSlot, name: e.target.value })}
                  placeholder="e.g. Header Leaderboard Banner"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Unique Slot Key (ID) *</label>
                <input
                  type="text"
                  value={editingSlot.slotKey}
                  onChange={(e) => setEditingSlot({ ...editingSlot, slotKey: e.target.value })}
                  placeholder="e.g. top-leaderboard"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Category Placement</label>
                <select
                  value={editingSlot.category}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      category: e.target.value as AdSlotConfig['category'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="header">Header Banner</option>
                  <option value="sidebar">Sidebar Tower</option>
                  <option value="in_article">In-Article Mid-Roll</option>
                  <option value="radar">Doppler Radar</option>
                  <option value="highways">Highways &amp; Passes</option>
                  <option value="footer">Footer Billboard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Dimensions (IAB)</label>
                <input
                  type="text"
                  value={editingSlot.dimensions}
                  onChange={(e) => setEditingSlot({ ...editingSlot, dimensions: e.target.value })}
                  placeholder="e.g. 728x90, 300x250, 336x280"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Network Provider Type</label>
                <select
                  value={editingSlot.type}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      type: e.target.value as AdNetworkType,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="google_adsense">Google AdSense</option>
                  <option value="google_ad_manager">Google Ad Manager (GAM)</option>
                  <option value="prebid_header_bidding">Prebid.js Header Bidding</option>
                  <option value="direct_sponsor">Direct Sponsor Banner</option>
                  <option value="affiliate_partner">Affiliate Partner Box</option>
                  <option value="custom_html">Custom HTML / Script</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Target Device</label>
                <select
                  value={editingSlot.targetDevice}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      targetDevice: e.target.value as AdDeviceTarget,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Devices (Responsive)</option>
                  <option value="desktop">Desktop Only (&gt;= 1024px)</option>
                  <option value="tablet">Tablet Only</option>
                  <option value="mobile">Mobile Only (&lt; 768px)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Est. CPM ($ CAD)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingSlot.cpm}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, cpm: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Monthly Impressions Target</label>
                <input
                  type="number"
                  value={editingSlot.monthlyImpressions}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      monthlyImpressions: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Weather Trigger Settings */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <CloudSnow className="w-4 h-4" />
                  <span>Weather-Triggered Automation Rule</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSlot.weatherTrigger?.enabled || false}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        weatherTrigger: {
                          ...editingSlot.weatherTrigger,
                          enabled: e.target.checked,
                          condition: editingSlot.weatherTrigger?.condition || 'any',
                          description: 'Custom trigger',
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-sky-500"
                  />
                  <span className="text-white font-bold">Enable Trigger</span>
                </label>
              </div>

              {editingSlot.weatherTrigger?.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <select
                    value={editingSlot.weatherTrigger.condition}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        weatherTrigger: {
                          ...editingSlot.weatherTrigger,
                          condition: e.target.value as WeatherTriggerCondition,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    {WEATHER_CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={editingSlot.weatherTrigger.description}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        weatherTrigger: {
                          ...editingSlot.weatherTrigger,
                          description: e.target.value,
                        },
                      })
                    }
                    placeholder="Trigger notes / description"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
              )}
            </div>

            {/* Custom Code */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-300">Custom HTML / Ad Tag Script</label>
              <textarea
                rows={4}
                value={editingSlot.customCode}
                onChange={(e) => setEditingSlot({ ...editingSlot, customCode: e.target.value })}
                placeholder="<ins class='adsbygoogle' ...></ins> or <div>Custom banner</div>"
                className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSlotModal}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/25"
              >
                Save Ad Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. MODAL: CREATE / EDIT DIRECT CAMPAIGN */}
      {isCampaignModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-400" />
                <span>
                  {editingCampaign.advertiser ? 'Edit Direct Campaign' : 'Create Direct Campaign'}
                </span>
              </h3>
              <button
                onClick={() => setIsCampaignModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Advertiser / Brand Name *</label>
                <input
                  type="text"
                  value={editingCampaign.advertiser}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, advertiser: e.target.value })
                  }
                  placeholder="e.g. Canadian Tire, Whistler Blackcomb"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Campaign Title *</label>
                <input
                  type="text"
                  value={editingCampaign.campaignName}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, campaignName: e.target.value })
                  }
                  placeholder="e.g. Winter Tire Promotion"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Target Ad Slot</label>
                <select
                  value={editingCampaign.slotKey}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, slotKey: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                >
                  {slots.map((s) => (
                    <option key={s.slotKey} value={s.slotKey}>
                      {s.name} ({s.dimensions})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Campaign Status</label>
                <select
                  value={editingCampaign.status}
                  onChange={(e) =>
                    setEditingCampaign({
                      ...editingCampaign,
                      status: e.target.value as DirectCampaign['status'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="paused">Paused</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Total Budget ($ CAD)</label>
                <input
                  type="number"
                  value={editingCampaign.budgetCAD}
                  onChange={(e) =>
                    setEditingCampaign({
                      ...editingCampaign,
                      budgetCAD: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Max Impressions Cap</label>
                <input
                  type="number"
                  value={editingCampaign.maxImpressions}
                  onChange={(e) =>
                    setEditingCampaign({
                      ...editingCampaign,
                      maxImpressions: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-300">Click Destination URL *</label>
                <input
                  type="url"
                  value={editingCampaign.clickUrl}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, clickUrl: e.target.value })
                  }
                  placeholder="https://advertiser.com/landing-page"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-300">Banner Creative Image URL</label>
                <input
                  type="url"
                  value={editingCampaign.bannerImageUrl || ''}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, bannerImageUrl: e.target.value })
                  }
                  placeholder="https://domain.com/banner-728x90.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsCampaignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCampaignModal}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/25"
              >
                Save Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
