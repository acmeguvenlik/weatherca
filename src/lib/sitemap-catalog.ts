import { MetadataRoute } from 'next';
import { PROVINCE_LIST } from '@/data/provinces';
import { CANADIAN_CITIES, ALL_CANADIAN_SETTLEMENTS } from '@/data/canadian-cities';
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
    maxCapacity: 5000,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 1,
    name: 'Ontario Municipalities & Towns (Part 1)',
    code: 'ON-MUNICIPALITIES-1',
    description: 'First sector of 3,500+ incorporated cities, towns, townships, and postal sectors across Ontario.',
    maxCapacity: 5000,
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  {
    id: 2,
    name: 'Ontario Part 2 & Quebec Part 1',
    code: 'ON-QC-MUNICIPALITIES',
    description: 'Northern Ontario districts and first 1,500 Quebec MRC municipalities and parishes.',
    maxCapacity: 5000,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  {
    id: 3,
    name: 'Quebec Municipalities & Cantons (Part 2)',
    code: 'QC-MUNICIPALITIES',
    description: '4,000+ Quebec cantons, coastal Gaspésie villages, Laurentian valleys, and northern communities.',
    maxCapacity: 5000,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 4,
    name: 'British Columbia Municipalities & Islands',
    code: 'BC-MUNICIPALITIES',
    description: '4,200+ BC coastal cities, Okanagan valleys, Kootenay mountain communities, and island outposts.',
    maxCapacity: 5000,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 5,
    name: 'Prairies (Alberta, Saskatchewan & Manitoba)',
    code: 'PRAIRIES-MUNICIPALITIES',
    description: '5,000+ prairie cities, rural municipalities (RMs), hamlets, and agricultural weather hubs.',
    maxCapacity: 6000,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 6,
    name: 'Atlantic Canada & Northern Territories',
    code: 'ATLANTIC-NORTH',
    description: '4,100+ Atlantic coastal harbours, Newfoundland outports, PEI lots, and Arctic settlements (YT, NT, NU).',
    maxCapacity: 5000,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
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
 * Returns the settlements belonging to a specific shard ID.
 */
export function getSettlementsForShard(shardId: number) {
  if (shardId === 1) {
    return ALL_CANADIAN_SETTLEMENTS.filter((s) => s.provinceCode === 'ON').slice(0, 3500);
  }
  if (shardId === 2) {
    const onRemaining = ALL_CANADIAN_SETTLEMENTS.filter((s) => s.provinceCode === 'ON').slice(3500);
    const qcPart1 = ALL_CANADIAN_SETTLEMENTS.filter((s) => s.provinceCode === 'QC').slice(0, 1500);
    return [...onRemaining, ...qcPart1];
  }
  if (shardId === 3) {
    return ALL_CANADIAN_SETTLEMENTS.filter((s) => s.provinceCode === 'QC').slice(1500);
  }
  if (shardId === 4) {
    return ALL_CANADIAN_SETTLEMENTS.filter((s) => s.provinceCode === 'BC');
  }
  if (shardId === 5) {
    return ALL_CANADIAN_SETTLEMENTS.filter((s) => ['AB', 'SK', 'MB'].includes(s.provinceCode));
  }
  if (shardId === 6) {
    return ALL_CANADIAN_SETTLEMENTS.filter((s) =>
      ['NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU'].includes(s.provinceCode)
    );
  }
  return [];
}

/**
 * Returns the exact routes for a given shard ID.
 * Follows Next.js MetadataRoute.Sitemap specifications.
 */
export function getSitemapRoutesForShard(shardId: number, customBaseUrl?: string): MetadataRoute.Sitemap {
  const baseUrl = customBaseUrl || SITE_CONFIG.domain;
  
  // Stable timestamps: Compute deterministic start-of-week and start-of-month dates.
  // This prevents crawlers (Googlebot, Bingbot) from seeing a newly incremented timestamp on every request
  // and flooding the infrastructure with continuous emergency re-crawling.
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const stableWeeklyDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday));
  const stableMonthlyDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const routes: MetadataRoute.Sitemap = [];

  // ==========================================
  // SHARD 0: Core Hubs, Ski, Blog & Tools
  // ==========================================
  if (shardId === 0) {
    // Root & Essential Hubs
    routes.push(
      { url: baseUrl, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 1.0 },
      { url: `${baseUrl}/provinces`, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 0.95 },
      { url: `${baseUrl}/radar`, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 0.95 },
      { url: `${baseUrl}/alerts`, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 0.95 },
      { url: `${baseUrl}/ski`, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/blog`, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 0.85 },
      { url: `${baseUrl}/tools/calculator`, lastModified: stableMonthlyDate, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/tools/compare`, lastModified: stableWeeklyDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/tools/aurora`, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 0.85 },
      { url: `${baseUrl}/tools/air-quality`, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/tools/widget`, lastModified: stableMonthlyDate, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/almanac`, lastModified: stableWeeklyDate, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${baseUrl}/highways`, lastModified: stableWeeklyDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/about`, lastModified: stableMonthlyDate, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/contact`, lastModified: stableMonthlyDate, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/methodology`, lastModified: stableMonthlyDate, changeFrequency: 'monthly', priority: 0.75 },
      { url: `${baseUrl}/faq`, lastModified: stableMonthlyDate, changeFrequency: 'monthly', priority: 0.75 }
    );

    // 13 Province & Territory Hubs
    for (const prov of PROVINCE_LIST) {
      routes.push({
        url: `${baseUrl}/${prov.slug}`,
        lastModified: stableWeeklyDate,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }

    // 12 Canadian Ski Resorts
    for (const resort of CANADIAN_SKI_RESORTS) {
      routes.push({
        url: `${baseUrl}/ski/${resort.slug}`,
        lastModified: stableWeeklyDate,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }

    // Flagship Meteorological Stories
    for (const post of FLAGSHIP_POSTS) {
      routes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: stableWeeklyDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // High-Intent Programmatic SEO Sub-Routes (Hourly, 14-Day, Radar, Air-Quality, History) for Major Hubs
    const topHubs = CANADIAN_CITIES.filter((c) => c.featured);
    const subRouteKeys = [
      { path: '14-day', priority: 0.85, changeFrequency: 'daily' as const },
      { path: 'hourly', priority: 0.85, changeFrequency: 'hourly' as const },
      { path: 'radar', priority: 0.85, changeFrequency: 'always' as const },
      { path: 'air-quality', priority: 0.8, changeFrequency: 'hourly' as const },
      { path: 'history', priority: 0.75, changeFrequency: 'monthly' as const },
    ];

    for (const city of topHubs) {
      const prov = PROVINCE_LIST.find((p) => p.code === city.provinceCode);
      const provSlug = prov ? prov.slug : city.provinceCode.toLowerCase();

      for (const sub of subRouteKeys) {
        routes.push({
          url: `${baseUrl}/${provSlug}/${city.slug}/${sub.path}`,
          lastModified: stableWeeklyDate,
          changeFrequency: sub.changeFrequency,
          priority: sub.priority,
        });
      }
    }
  }

  // ==========================================
  // SHARDS 1 to 6: Canadian Settlements (26k+)
  // ==========================================
  else if (shardId >= 1 && shardId < SITEMAP_SHARDS.length) {
    const settlements = getSettlementsForShard(shardId);
    for (const city of settlements) {
      const prov = PROVINCE_LIST.find((p) => p.code === city.provinceCode);
      const provSlug = prov ? prov.slug : city.provinceCode.toLowerCase();

      routes.push({
        url: `${baseUrl}/${provSlug}/${city.slug}`,
        lastModified: stableMonthlyDate,
        changeFrequency: 'weekly',
        priority: city.featured ? 0.85 : 0.65,
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

  // High-Intent Programmatic Sub-Routes in Shard 0
  const topHubs = CANADIAN_CITIES.filter((c) => c.featured);
  for (const city of topHubs) {
    const prov = PROVINCE_LIST.find((p) => p.code === city.provinceCode);
    const provSlug = prov ? prov.slug : city.provinceCode.toLowerCase();
    const subs = [
      { key: '14-day', label: '14-Day Long Range Trend', freq: 'daily' as const, pri: 0.85 },
      { key: 'hourly', label: 'Hourly Doppler Forecast', freq: 'hourly' as const, pri: 0.85 },
      { key: 'radar', label: 'Precipitation Radar', freq: 'always' as const, pri: 0.85 },
      { key: 'air-quality', label: 'Air Quality & AQHI', freq: 'hourly' as const, pri: 0.8 },
      { key: 'history', label: '30-Year Climate Normals', freq: 'monthly' as const, pri: 0.75 },
    ];
    for (const sub of subs) {
      entries.push({
        id: `sub-${city.slug}-${sub.key}`,
        url: `${baseUrl}/${provSlug}/${city.slug}/${sub.key}`,
        shardId: 0,
        category: 'city',
        entityName: `${city.name} ${sub.label}`,
        changeFrequency: sub.freq,
        priority: sub.pri,
        lastModified: now,
      });
    }
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
