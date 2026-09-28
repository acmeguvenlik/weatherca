import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/auth/',
          '/api/',
          '/*?*format=',
        ],
        crawlDelay: 2,
      },
      // Block known aggressive scrapers & AI miners that burn serverless bandwidth & CPU
      {
        userAgent: [
          'Bytespider',
          'PetalBot',
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'DataForSeoBot',
          'BLEXBot',
          'Amazonbot',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'CCBot',
          'anthropic-ai',
          'cohere-ai',
        ],
        disallow: '/',
      },
      // Search engines: Google & Bing
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/account/', '/auth/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/account/', '/auth/', '/api/'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
  };
}
