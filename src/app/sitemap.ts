import { MetadataRoute } from 'next';
import { SITEMAP_SHARDS, getSitemapRoutesForShard } from '@/lib/sitemap-catalog';

export const revalidate = 86400; // 24-hour cache for sitemaps

/**
 * Generates multiple sitemaps (shards) partitioned into 5 logical clusters.
 * Next.js automatically emits:
 * - /sitemap.xml (Sitemap Index file)
 * - /sitemap/0.xml (Core & Hubs)
 * - /sitemap/1.xml (Western & Northern Cities)
 * - /sitemap/2.xml (Eastern & Atlantic Cities)
 * - /sitemap/3.xml (Hourly & 14-Day Deep Forecasts)
 * - /sitemap/4.xml (Environmental Telemetry, AQHI & History)
 *
 * Each shard is capped at maximum 5,000 URLs to ensure lightning-fast crawler ingestion.
 */
export async function generateSitemaps() {
  return SITEMAP_SHARDS.map((shard) => ({ id: shard.id }));
}

export default async function sitemap(props?: {
  id?: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  let shardId = 0;

  if (props?.id) {
    const resolvedId = await props.id;
    const parsed = parseInt(resolvedId, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < SITEMAP_SHARDS.length) {
      shardId = parsed;
    }
  }

  return getSitemapRoutesForShard(shardId);
}
