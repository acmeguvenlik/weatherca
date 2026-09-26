import { Metadata } from 'next';
import { CanadianCity, CityWeatherForecast, Province } from '@/types/weather';
import { getWeatherConditionInfo } from './weather';

export const SITE_CONFIG = {
  name: 'WeatherCA',
  domain: 'https://weatherca.net',
  titleTemplate: '%s | WeatherCA - Canada Meteorological Network',
  description:
    'Real-time Canadian weather forecasts, live radar, Environment Canada alerts, Wind Chill, Humidex, and Air Quality (AQHI) for over 5,000 cities and communities across Canada.',
  locale: 'en_CA',
  alternateLocale: 'fr_CA',
};

/**
 * Generate metadata for City Forecast page
 */
export function generateCityMetadata(forecast: CityWeatherForecast): Metadata {
  const { city, province, current } = forecast;
  const cond = getWeatherConditionInfo(current.weatherCode, current.isDay);

  const title = `${city.name}, ${province.code} Weather Forecast - ${current.temperature}°C ${cond.condition}`;
  const description = `Live weather forecast for ${city.name}, ${province.name}. Current temperature: ${current.temperature}°C (${cond.condition}), Feels like: ${current.apparentTemperature}°C${current.windChill !== undefined && current.windChill < 0 ? `, Wind Chill: ${current.windChill}°C` : ''}. 14-day outlook, hourly trends, precipitation radar, and Canadian AQHI health index.`;
  const url = `${SITE_CONFIG.domain}/${province.slug}/${city.slug}`;

  return {
    title,
    description,
    keywords: [
      `${city.name} weather`,
      `${city.name} ${province.code} forecast`,
      `${city.name} radar`,
      `${city.name} wind chill`,
      `${city.name} humidex`,
      `${city.name} 14 day forecast`,
      `Environment Canada ${city.name}`,
      `AQHI ${city.name}`,
      `${province.name} weather`,
      ...(city.postalCodePrefix ? city.postalCodePrefix.map((fsa) => `${fsa} weather`) : []),
    ],
    alternates: {
      canonical: url,
      languages: {
        'en-CA': url,
        'fr-CA': `${url}?lang=fr`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      alternateLocale: SITE_CONFIG.alternateLocale,
      type: 'website',
      images: [
        {
          url: `${SITE_CONFIG.domain}/api/og?city=${encodeURIComponent(city.name)}&prov=${province.code}`,
          width: 1200,
          height: 630,
          alt: `${city.name}, ${province.code} Weather Forecast`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        `${SITE_CONFIG.domain}/api/og?city=${encodeURIComponent(city.name)}&prov=${province.code}`,
      ],
    },
  };
}

/**
 * Generate metadata for Province Forecast page
 */
export function generateProvinceMetadata(province: Province): Metadata {
  const title = `${province.name} Weather, Live Radar & Provincial Forecasts (${province.code})`;
  const description = `Comprehensive weather forecasts, live storm radar, and Environment Canada warnings for all cities and regions across ${province.name}. Capital: ${province.capital}, Population: ${province.population.toLocaleString()}.`;
  const url = `${SITE_CONFIG.domain}/${province.slug}`;

  return {
    title,
    description,
    keywords: [
      `${province.name} weather`,
      `${province.code} forecast`,
      `${province.name} radar`,
      `${province.name} weather warnings`,
      `${province.name} storm alerts`,
    ],
    alternates: {
      canonical: url,
      languages: {
        'en-CA': url,
        'fr-CA': `${url}?lang=fr`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Generate Schema.org JSON-LD Structured Data for Rich Results
 */
export function generateWeatherSchema(forecast: CityWeatherForecast) {
  const { city, province, current, daily } = forecast;
  const cond = getWeatherConditionInfo(current.weatherCode, current.isDay);
  const canonicalUrl = `${SITE_CONFIG.domain}/${province.slug}/${city.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Breadcrumbs
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Canada Weather',
            item: SITE_CONFIG.domain,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: province.name,
            item: `${SITE_CONFIG.domain}/${province.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: city.name,
            item: canonicalUrl,
          },
        ],
      },
      // Place / City
      {
        '@type': 'Place',
        name: city.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: city.name,
          addressRegion: province.code,
          addressCountry: 'CA',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: city.lat,
          longitude: city.lon,
        },
      },
      // Weather Forecast
      {
        '@type': 'WeatherForecast',
        name: `Weather for ${city.name}, ${province.name}`,
        url: canonicalUrl,
        validFrom: new Date().toISOString(),
        temperature: {
          '@type': 'QuantitativeValue',
          value: current.temperature,
          unitCode: 'CEL',
        },
        description: `Current condition: ${cond.condition}. Feels like: ${current.apparentTemperature}°C with ${current.relativeHumidity}% relative humidity and winds from ${current.windDirection}° at ${current.windSpeed} km/h.`,
      },
      // FAQ Schema (Very high click-through in Canadian search results)
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the current temperature and weather in ${city.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The current temperature in ${city.name}, ${province.code} is ${current.temperature}°C with ${cond.condition}. The apparent temperature (feels like) is ${current.apparentTemperature}°C.`,
            },
          },
          {
            '@type': 'Question',
            name: `What is the wind chill or humidex in ${city.name} today?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: current.windChill !== undefined && current.windChill < 0
                ? `The Canadian Wind Chill in ${city.name} is currently ${current.windChill}°C with a frostbite risk category of ${current.frostbiteRiskLevel}.`
                : `The Humidex in ${city.name} is currently ${current.humidex ?? current.temperature} (${current.humidexCategory ?? 'Comfortable'}).`,
            },
          },
          {
            '@type': 'Question',
            name: `What is the 7-day weather outlook for ${city.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: daily
                .slice(0, 7)
                .map((d) => `${d.dayName}: High ${d.temperatureMax}°C, Low ${d.temperatureMin}°C`)
                .join('. '),
            },
          },
        ],
      },
    ],
  };
}
