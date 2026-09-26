import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/data/blog-posts';

export async function GET() {
  const baseUrl = 'https://weatherca.net';

  const rssItems = BLOG_POSTS.slice(0, 50)
    .map((post) => {
      const pubDate = new Date(post.publishedAt).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <category>${post.category}</category>
      <author><![CDATA[${post.author.name}]]></author>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${baseUrl}${post.featuredImage}" length="0" type="image/svg+xml" />
    </item>`;
    })
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WeatherCA Meteorological Insights &amp; Scientific Treatises</title>
    <link>${baseUrl}/blog</link>
    <description>Authoritative Canadian atmospheric science, severe storms analysis, winter polar physics, and climate research.</description>
    <language>en-ca</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
