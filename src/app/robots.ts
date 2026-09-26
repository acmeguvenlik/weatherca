import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og', '/api/sitemap/'],
        disallow: ['/admin/', '/account/', '/auth/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/api/og', '/api/sitemap/'],
        disallow: ['/admin/', '/account/', '/auth/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/api/og', '/api/sitemap/'],
        disallow: ['/admin/', '/account/', '/auth/'],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
  };
}
