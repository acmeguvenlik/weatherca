import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/lib/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: 'WeatherCA - Canada Live Weather Forecasts & Doppler Radar',
    template: '%s | WeatherCA',
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Canada weather',
    'Canadian weather forecast',
    'Environment Canada radar',
    'Wind chill Canada',
    'Humidex Canada',
    'Toronto weather',
    'Montreal weather',
    'Vancouver weather',
    'Calgary weather',
    'Canada AQHI air quality',
  ],
  authors: [{ name: 'WeatherCA Canada' }],
  creator: 'WeatherCA',
  publisher: 'WeatherCA',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: SITE_CONFIG.domain,
    title: 'WeatherCA - Canada Live Weather & Doppler Radar',
    description: SITE_CONFIG.description,
    siteName: 'WeatherCA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeatherCA - Canada Live Weather & Doppler Radar',
    description: SITE_CONFIG.description,
  },
};

import { UnitProvider } from '@/context/UnitContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AIChatProvider } from '@/context/AIChatContext';
import { MainLayoutShell } from '@/components/MainLayoutShell';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased h-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://api.open-meteo.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://air-quality-api.open-meteo.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://air-quality-api.open-meteo.com" />
      </head>
      <body className="min-h-full flex flex-col selection:bg-sky-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AIChatProvider>
            <AuthProvider>
              <LanguageProvider>
                <SettingsProvider>
                  <UnitProvider>
                    <MainLayoutShell>{children}</MainLayoutShell>
                  </UnitProvider>
                </SettingsProvider>
              </LanguageProvider>
            </AuthProvider>
          </AIChatProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
