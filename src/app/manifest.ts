import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WeatherCA - Canada Meteorological Network',
    short_name: 'WeatherCA',
    description:
      'Real-time Canadian weather forecasts, live Doppler radar, Environment Canada alerts, Wind Chill, Humidex, and AQHI air quality.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060913',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
