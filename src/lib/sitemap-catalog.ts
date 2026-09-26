import { MetadataRoute } from 'next';
import { PROVINCE_LIST } from '@/data/provinces';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { CANADIAN_SKI_RESORTS } from '@/data/canadian-ski-resorts';
import { FLAGSHIP_POSTS } from '@/data/blog-posts';
import { SITE_CONFIG } from '@/lib/seo';

export interface SitemapShardMeta {
  id: number;
  name: string;
  code: string;
  description: string;
  maxCapacity: number;
  badgeColor: string;
}

export const SITEMAP_SHARDS: SitemapShardMeta[] = [
  {
    id: 0,
    name: 'Core Hubs, Ski & Science Blog',
    code: 'CORE-HUB',
    description: 'National portal root, 13 provincial radar hubs, alpine ski resorts, meteorological press and operational tools.',
    maxCapacity: 500,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 1,
    name: 'Ontario & Quebec Primary Centers',
    code: 'ON-QC-CITIES',
    description: '100 major incorporated cities and census metropolitan areas across Ontario and Quebec.',
    maxCapacity: 1000,
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  {
    id: 2,
    name: 'Western, Atlantic & Northern Hubs',
    code: 'WEST-ATL-NORTH',
    description: '122 primary urban centers across BC, Prairies (AB, SK, MB), Atlantic provinces and Territories.',
    maxCapacity: 1000,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
];

export interface SitemapCatalogEntry {
  id: string;
  url: string;
  shardId: number;
  category: 'core' | 'province' | 'ski' | 'blog' | 'city' | 'hourly' | '14-day' | 'air-quality' | 'radar' | 'history' | 'tool' | 'custom';
  entityName: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  priority: number;
  lastModified: string;
}

/**
 * Returns the cities belonging to a specific shard ID.
 */
export function getSettlementsForShard(shardId: number) {
  if (shardId === 1) {
    return CANADIAN_CITIES.filter((s) => ['ON', 'QC'].includes(s.provinceCode));
  }
  if (shardId === 2) {
    return CANADIAN_CITIES.filter((s) => !['ON', 'QC'].includes(s.provinceCode));
  }
  return [];
}

/**
 * Returns the exact routes for a given shard ID.
 * Follows Next.js MetadataRoute.Sitemap specifications.
 */
export function getSitemapRoutesForShard(shardId: number, customBaseUrl?: string): MetadataRoute.Sitemap {
  const baseUrl = customBaseUrl || SITE_CONFIG.domain;
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [];

  // ==========================================
  // SHARD 0: Core Hubs, Ski, Blog & Tools
  // ==========================================
  if (shardId === 0) {
    // Root & Essential Hubs
    routes.push(
      { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
      { url: `${baseUrl}/provinces`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
      { url: `${baseUrl}/radar`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
      { url: `${baseUrl}/alerts`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
      { url: `${baseUrl}/ski`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
      { url: `${baseUrl}/tools/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/tools/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/tools/aurora`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
      { url: `${baseUrl}/tools/air-quality`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/tools/widget`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/almanac`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${baseUrl}/highways`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
      { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 }
    );

    // 13 Province & Territory Hubs
    for (const prov of PROVINCE_LIST) {
      routes.push({
        url: `${baseUrl}/${prov.slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }

    // 12 Canadian Ski Resorts
    for (const resort of CANADIAN_SKI_RESORTS) {
      routes.push({
        url: `${baseUrl}/ski/${resort.slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }

    // Flagship Meteorological Stories
    for (const post of FLAGSHIP_POSTS) {
      routes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // ==========================================
  // SHARDS 1 & 2: Primary Canadian Cities
  // ==========================================
  else if (shardId >= 1 && shardId < SITEMAP_SHARDS.length) {
    const settlements = getSettlementsForShard(shardId);
    for (const city of settlements) {
      const prov = PROVINCE_LIST.find((p) => p.code === city.provinceCode);
      const provSlug = prov ? prov.slug : city.provinceCode.toLowerCase();

      routes.push({
        url: `${baseUrl}/${provSlug}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: city.featured ? 0.85 : 0.7,
      });
    }
  }

  return routes;
}

/**
 * Returns all catalog entries with complete metadata for administrative audit.
 */
export function getAllSitemapCatalogEntries(customBaseUrl?: string): SitemapCatalogEntry[] {
  const baseUrl = customBaseUrl || SITE_CONFIG.domain;
  const now = new Date().toISOString().split('T')[0];
  const entries: SitemapCatalogEntry[] = [];

  // Core & Hubs (Shard 0)
  entries.push(
    { id: 'core-root', url: baseUrl, shardId: 0, category: 'core', entityName: 'National Portal Root', changeFrequency: 'always', priority: 1.0, lastModified: now },
    { id: 'core-provinces', url: `${baseUrl}/provinces`, shardId: 0, category: 'province', entityName: 'Provinces Hub', changeFrequency: 'daily', priority: 0.95, lastModified: now },
    { id: 'core-radar', url: `${baseUrl}/radar`, shardId: 0, category: 'radar', entityName: 'National S-Band Radar', changeFrequency: 'always', priority: 0.95, lastModified: now },
    { id: 'core-alerts', url: `${baseUrl}/alerts`, shardId: 0, category: 'core', entityName: 'Emergency Dispatch Alerts', changeFrequency: 'hourly', priority: 0.95, lastModified: now },
    { id: 'core-ski', url: `${baseUrl}/ski`, shardId: 0, category: 'ski', entityName: 'Alpine Skiing Portal', changeFrequency: 'hourly', priority: 0.9, lastModified: now },
    { id: 'core-blog', url: `${baseUrl}/blog`, shardId: 0, category: 'blog', entityName: 'Meteorological Science Blog', changeFrequency: 'daily', priority: 0.85, lastModified: now },
    { id: 'tool-calculator', url: `${baseUrl}/tools/calculator`, shardId: 0, category: 'tool', entityName: 'Wind Chill & Humidex Calculator', changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { id: 'tool-compare', url: `${baseUrl}/tools/compare`, shardId: 0, category: 'tool', entityName: 'Canadian City Comparison', changeFrequency: 'daily', priority: 0.8, lastModified: now },
    { id: 'tool-aurora', url: `${baseUrl}/tools/aurora`, shardId: 0, category: 'tool', entityName: 'Aurora Borealis Tracker', changeFrequency: 'hourly', priority: 0.85, lastModified: now },
    { id: 'tool-air-quality', url: `${baseUrl}/tools/air-quality`, shardId: 0, category: 'tool', entityName: 'Air Quality & Wildfire Smoke Index', changeFrequency: 'hourly', priority: 0.9, lastModified: now },
    { id: 'tool-widget', url: `${baseUrl}/tools/widget`, shardId: 0, category: 'tool', entityName: 'Weather Widget Studio', changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { id: 'core-almanac', url: `${baseUrl}/almanac`, shardId: 0, category: 'tool', entityName: 'Historical Climate Almanac', changeFrequency: 'weekly', priority: 0.85, lastModified: now },
    { id: 'core-highways', url: `${baseUrl}/highways`, shardId: 0, category: 'tool', entityName: 'Mountain Pass Highway Weather', changeFrequency: 'hourly', priority: 0.9, lastModified: now }
  );

  // 13 Province Hubs
  for (const prov of PROVINCE_LIST) {
    entries.push({
      id: `prov-${prov.slug}`,
      url: `${baseUrl}/${prov.slug}`,
      shardId: 0,
      category: 'province',
      entityName: `${prov.name} Weather Hub`,
      changeFrequency: 'hourly',
      priority: 0.9,
      lastModified: now,
    });
  }

  // Ski Resorts
  for (const resort of CANADIAN_SKI_RESORTS) {
    entries.push({
      id: `ski-${resort.slug}`,
      url: `${baseUrl}/ski/${resort.slug}`,
      shardId: 0,
      category: 'ski',
      entityName: `${resort.name} Snowpack`,
      changeFrequency: 'hourly',
      priority: 0.85,
      lastModified: now,
    });
  }

  // Blog Posts (Flagship)
  for (const post of FLAGSHIP_POSTS) {
    entries.push({
      id: `blog-${post.slug}`,
      url: `${baseUrl}/blog/${post.slug}`,
      shardId: 0,
      category: 'blog',
      entityName: post.title,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: now,
    });
  }

  // Shards 1 to N Cities
  for (let sId = 1; sId < SITEMAP_SHARDS.length; sId++) {
    const settlements = getSettlementsForShard(sId);
    for (const city of settlements) {
      const prov = PROVINCE_LIST.find((p) => p.code === city.provinceCode);
      const provSlug = prov ? prov.slug : city.provinceCode.toLowerCase();

      entries.push({
        id: `settlement-${city.provinceCode}-${city.slug}`,
        url: `${baseUrl}/${provSlug}/${city.slug}`,
        shardId: sId,
        category: 'city',
        entityName: `${city.name} (${city.provinceCode}) Forecast`,
        changeFrequency: 'daily',
        priority: city.featured ? 0.85 : 0.7,
        lastModified: now,
      });
    }
  }

  return entries;
}

/**
 * Generates standards-compliant W3C XML string for a single sitemap shard.
 */
export function generateSitemapXml(routes: MetadataRoute.Sitemap): string {
  const items = routes
    .map((r) => {
      const dateStr =
        r.lastModified instanceof Date
          ? r.lastModified.toISOString()
          : typeof r.lastModified === 'string'
          ? r.lastModified
          : new Date().toISOString();

      return `  <url>
    <loc>${r.url}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>${r.changeFrequency || 'daily'}</changefreq>
    <priority>${(r.priority || 0.7).toFixed(2)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

/**
 * Generates standards-compliant W3C Sitemap Index XML file.
 */
export function generateSitemapIndexXml(customBaseUrl?: string): string {
  const baseUrl = customBaseUrl || SITE_CONFIG.domain;
  const now = new Date().toISOString();

  const shardsXml = SITEMAP_SHARDS.map((s) => {
    return `  <sitemap>
    <loc>${baseUrl}/sitemap/${s.id}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${shardsXml}
</sitemapindex>`;
}

/**
 * Calculates current status and metrics across all shards.
 */
export function getShardStats(customBaseUrl?: string) {
  const baseUrl = customBaseUrl || SITE_CONFIG.domain;

  return SITEMAP_SHARDS.map((shard) => {
    let count = 0;
    if (shard.id === 0) {
      count =
        16 +
        PROVINCE_LIST.length +
        CANADIAN_SKI_RESORTS.length +
        FLAGSHIP_POSTS.length;
    } else {
      count = getSettlementsForShard(shard.id).length;
    }

    const percentFilled = Math.min(100, Math.round((count / shard.maxCapacity) * 100));

    return {
      ...shard,
      url: `${baseUrl}/sitemap/${shard.id}.xml`,
      count,
      percentFilled,
    };
  });
}
