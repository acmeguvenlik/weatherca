import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Enable Gzip and Brotli compression for all dynamic and static responses
  compress: true,

  // 2. Remove X-Powered-By header for security and response header size reduction
  poweredByHeader: false,

  // 3. React Strict Mode for robust rendering performance
  reactStrictMode: true,

  // 4. Package Import Optimization: Tree-shakes heavy icon and chart libraries
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      'framer-motion',
    ],
  },

  // 5. Image & SVG Optimization settings
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 6. Sitemaps Index Rewrite
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap/index',
      },
    ];
  },

  // 7. High-Performance Caching & DNS Prefetch Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
