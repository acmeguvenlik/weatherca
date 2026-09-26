import { CityWeatherForecast } from '@/types/weather';
import { getWeatherConditionInfo } from '@/lib/weather';

export interface CityFaqItem {
  question: string;
  answer: string;
}

export function generateCityFaqs(forecast: CityWeatherForecast): CityFaqItem[] {
  const { city, province, current } = forecast;
  const cityName = city.name;
  const provName = province.name;
  const temp = Math.round(current.temperature);
  const condInfo = getWeatherConditionInfo(current.weatherCode, current.isDay);
  const condition = condInfo.condition;

  return [
    {
      question: `What is the current live weather and temperature in ${cityName}, ${provName}?`,
      answer: `Currently, ${cityName} is reporting an atmospheric temperature of ${temp}°C with ${condition.toLowerCase()} conditions, wind speeds around ${Math.round(current.windSpeed)} km/h, and relative humidity of ${Math.round(current.relativeHumidity)}%. WeatherCA continuously refreshes this telemetry with hourly model cycles.`,
    },
    {
      question: `When does winter snowfall typically begin and end in ${cityName}?`,
      answer: `In ${cityName} (${province.code}), measurable snowfall typically begins arriving between late October and mid-November, continuing through March or early April. Mountainous and northern zones of ${provName} often receive earlier snowpack, while southern valleys experience lighter accumulations.`,
    },
    {
      question: `What are the average summer temperatures in ${cityName}?`,
      answer: `Summer months (June through August) in ${cityName} typically see daytime high temperatures ranging from 20°C to 28°C. Depending on prevailing atmospheric river patterns or continental air masses, heatwaves may elevate humidex readings above 32°C.`,
    },
    {
      question: `How frequently does WeatherCA update the ${cityName} 14-day and hourly forecast?`,
      answer: `WeatherCA synchronizes radar, satellite feeds, and numerical weather prediction models (including high-resolution HRDPS and GEM models) every 60 minutes, ensuring real-time severe weather alert dispatch and precision 14-day forecasts.`,
    },
    {
      question: `Where are the official meteorological observation stations located near ${cityName}?`,
      answer: `Official surface observation stations near ${cityName} operate through Environment Canada and Nav Canada airport automated weather observing systems (AWOS), calibrated for aviation safety and public meteorological warnings across ${provName}.`,
    },
  ];
}

export function generateCityFaqSchema(faqs: CityFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
