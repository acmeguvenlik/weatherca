'use client';

import React, { createContext, useContext, useState } from 'react';

export interface SiteSettings {
  siteName: string;
  tagline: string;
  defaultUnit: 'C' | 'F';
  defaultLanguage: 'EN' | 'FR';
  maintenanceMode: boolean;
  apiPollingMinutes: number;
  cacheTtlSeconds: number;
  googleAnalyticsId: string;
  gscVerificationToken: string;
}

export interface SeoSettings {
  metaTitleTemplate: string;
  defaultMetaDescription: string;
  keywords: string[];
  ogImageUrl: string;
  twitterHandle: string;
  robotsTxt: string;
  schemaJsonLdEnabled: boolean;
}

export interface SitemapEntry {
  id: string;
  url: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  priority: number;
  lastModified: string;
  isCustom?: boolean;
}

interface SettingsContextType {
  siteSettings: SiteSettings;
  seoSettings: SeoSettings;
  sitemapEntries: SitemapEntry[];
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  updateSeoSettings: (settings: Partial<SeoSettings>) => void;
  addSitemapEntry: (entry: Omit<SitemapEntry, 'id' | 'lastModified'>) => void;
  updateSitemapEntry: (id: string, entry: Partial<SitemapEntry>) => void;
  deleteSitemapEntry: (id: string) => void;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'WeatherCA',
  tagline: 'Canada Meteorological Network 2026',
  defaultUnit: 'C',
  defaultLanguage: 'EN',
  maintenanceMode: false,
  apiPollingMinutes: 3,
  cacheTtlSeconds: 900,
  googleAnalyticsId: 'G-WEATHERCA2026',
  gscVerificationToken: 'google-site-verification=weatherca_ca_gsc_auth_2026',
};

const DEFAULT_SEO_SETTINGS: SeoSettings = {
  metaTitleTemplate: '%s | WeatherCA - Canadian Live Weather Network',
  defaultMetaDescription:
    'Real-time Canadian weather radar, 14-day forecasts, Environment Canada severe alerts, and official Wind Chill / Humidex data for all 10 provinces & 3 territories.',
  keywords: [
    'Canada weather',
    'Environment Canada radar',
    'Wind chill Canada',
    'Humidex Canada',
    'Toronto weather',
    'Montreal weather',
    'Vancouver weather',
    'Météo Canada',
    'Canadian ski reports',
  ],
  ogImageUrl: 'https://weatherca.net/api/og',
  twitterHandle: '@weatherca_net',
  robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /account/\n\nSitemap: https://weatherca.net/sitemap.xml`,
  schemaJsonLdEnabled: true,
};

const DEFAULT_SITEMAP_ENTRIES: SitemapEntry[] = [
  { id: 'sm-1', url: 'https://weatherca.net', changeFrequency: 'always', priority: 1.0, lastModified: '2026-09-15' },
  { id: 'sm-2', url: 'https://weatherca.net/provinces', changeFrequency: 'daily', priority: 0.95, lastModified: '2026-09-15' },
  { id: 'sm-3', url: 'https://weatherca.net/radar', changeFrequency: 'always', priority: 0.9, lastModified: '2026-09-15' },
  { id: 'sm-4', url: 'https://weatherca.net/alerts', changeFrequency: 'hourly', priority: 0.85, lastModified: '2026-09-15' },
  { id: 'sm-5', url: 'https://weatherca.net/ski', changeFrequency: 'hourly', priority: 0.9, lastModified: '2026-09-15' },
  { id: 'sm-6', url: 'https://weatherca.net/blog', changeFrequency: 'daily', priority: 0.85, lastModified: '2026-09-15' },
  { id: 'sm-7', url: 'https://weatherca.net/tools/calculator', changeFrequency: 'monthly', priority: 0.85, lastModified: '2026-09-15' },
  { id: 'sm-8', url: 'https://weatherca.net/tools/compare', changeFrequency: 'daily', priority: 0.85, lastModified: '2026-09-15' },
  { id: 'sm-9', url: 'https://weatherca.net/tools/aurora', changeFrequency: 'hourly', priority: 0.85, lastModified: '2026-09-15' },
  { id: 'sm-10', url: 'https://weatherca.net/about', changeFrequency: 'monthly', priority: 0.7, lastModified: '2026-09-15' },
  { id: 'sm-11', url: 'https://weatherca.net/contact', changeFrequency: 'monthly', priority: 0.7, lastModified: '2026-09-15' },
  { id: 'sm-12', url: 'https://weatherca.net/methodology', changeFrequency: 'monthly', priority: 0.75, lastModified: '2026-09-15' },
  { id: 'sm-13', url: 'https://weatherca.net/faq', changeFrequency: 'monthly', priority: 0.75, lastModified: '2026-09-15' },
];

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weatherca_site_settings');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [seoSettings, setSeoSettings] = useState<SeoSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weatherca_seo_settings');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_SEO_SETTINGS;
  });

  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weatherca_sitemap_entries');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_SITEMAP_ENTRIES;
  });

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const next = { ...prev, ...settings };
      localStorage.setItem('weatherca_site_settings', JSON.stringify(next));
      return next;
    });
  };

  const updateSeoSettings = (settings: Partial<SeoSettings>) => {
    setSeoSettings((prev) => {
      const next = { ...prev, ...settings };
      localStorage.setItem('weatherca_seo_settings', JSON.stringify(next));
      return next;
    });
  };

  const addSitemapEntry = (entry: Omit<SitemapEntry, 'id' | 'lastModified'>) => {
    const newEntry: SitemapEntry = {
      ...entry,
      id: `sm-cust-${Date.now()}`,
      lastModified: new Date().toISOString().split('T')[0],
      isCustom: true,
    };
    setSitemapEntries((prev) => {
      const next = [newEntry, ...prev];
      localStorage.setItem('weatherca_sitemap_entries', JSON.stringify(next));
      return next;
    });
  };

  const updateSitemapEntry = (id: string, entry: Partial<SitemapEntry>) => {
    setSitemapEntries((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...entry } : item));
      localStorage.setItem('weatherca_sitemap_entries', JSON.stringify(next));
      return next;
    });
  };

  const deleteSitemapEntry = (id: string) => {
    setSitemapEntries((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem('weatherca_sitemap_entries', JSON.stringify(next));
      return next;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        siteSettings,
        seoSettings,
        sitemapEntries,
        updateSiteSettings,
        updateSeoSettings,
        addSitemapEntry,
        updateSitemapEntry,
        deleteSitemapEntry,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
