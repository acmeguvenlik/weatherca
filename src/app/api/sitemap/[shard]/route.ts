import { NextRequest, NextResponse } from 'next/server';
import {
  getSitemapRoutesForShard,
  generateSitemapXml,
  generateSitemapIndexXml,
  getAllSitemapCatalogEntries,
  getShardStats,
  SITEMAP_SHARDS,
} from '@/lib/sitemap-catalog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shard: string }> }
) {
  const { shard } = await params;
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get('format'); // 'xml' | 'json'
  const origin = request.nextUrl.origin;

  // Master index requested
  if (shard === 'index' || shard === 'master') {
    if (format === 'json') {
      return NextResponse.json({
        type: 'sitemapindex',
        shards: getShardStats(origin),
      });
    }
    const xml = generateSitemapIndexXml(origin);
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  }

  // All entries dump for admin / analytics
  if (shard === 'all') {
    const entries = getAllSitemapCatalogEntries(origin);
    return NextResponse.json({
      totalCount: entries.length,
      entries,
    });
  }

  // Specific numeric shard (0 to SITEMAP_SHARDS.length - 1)
  const shardId = parseInt(shard, 10);
  if (isNaN(shardId) || shardId < 0 || shardId >= SITEMAP_SHARDS.length) {
    return NextResponse.json({
      error: `Invalid shard ID. Supported shards: 0 through ${SITEMAP_SHARDS.length - 1}, index, all`
    }, { status: 400 });
  }

  const routes = getSitemapRoutesForShard(shardId, origin);

  if (format === 'json') {
    return NextResponse.json({
      shardId,
      count: routes.length,
      routes,
    });
  }

  const xml = generateSitemapXml(routes);
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
