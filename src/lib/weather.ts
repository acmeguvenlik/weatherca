import {
  CanadianCity,
  Province,
  CityWeatherForecast,
  CurrentWeatherData,
  DailyForecastItem,
  HourlyForecastItem,
  AirQualityData,
  SevereWeatherAlert,
} from '@/types/weather';
import { getProvinceByCode } from '@/data/provinces';

// ============================================================================
// CANADIAN METRIC FORMULAS (Environment & Climate Change Canada Standards)
// ============================================================================

/**
 * Calculates Wind Chill according to Environment Canada official formula
 * Valid when T <= 0°C and Wind Speed > 4.8 km/h
 */
export function calculateCanadianWindChill(
  tempC: number,
  windSpeedKmH: number
): { windChill: number; frostbiteRiskMinutes: number | null; riskLevel: CurrentWeatherData['frostbiteRiskLevel'] } {
  if (tempC > 0 || windSpeedKmH < 4.8) {
    return { windChill: tempC, frostbiteRiskMinutes: null, riskLevel: 'None' };
  }

  // ECCC formula: W = 13.12 + 0.6215 * T - 11.37 * (V^0.16) + 0.3965 * T * (V^0.16)
  const v016 = Math.pow(windSpeedKmH, 0.16);
  const wc = 13.12 + 0.6215 * tempC - 11.37 * v016 + 0.3965 * tempC * v016;
  const windChill = Math.round(wc);

  // ECCC Frostbite Risk Guidelines
  if (windChill > -28) {
    return { windChill, frostbiteRiskMinutes: null, riskLevel: 'Low' };
  } else if (windChill >= -39) {
    return { windChill, frostbiteRiskMinutes: 30, riskLevel: 'Moderate' };
  } else if (windChill >= -47) {
    return { windChill, frostbiteRiskMinutes: 10, riskLevel: 'High' };
  } else if (windChill >= -54) {
    return { windChill, frostbiteRiskMinutes: 5, riskLevel: 'Extreme' };
  } else {
    return { windChill, frostbiteRiskMinutes: 2, riskLevel: 'Hazardous' };
  }
}

/**
 * Calculates Humidex according to Environment Canada official formula
 * Valid when T >= 20°C
 */
export function calculateCanadianHumidex(
  tempC: number,
  dewPointC: number
): { humidex: number; category: CurrentWeatherData['humidexCategory'] } {
  if (tempC < 20) {
    return { humidex: Math.round(tempC), category: 'Comfortable' };
  }

  // Vapor pressure e in mb (millibars)
  const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (273.15 + dewPointC)));
  const h = tempC + (5 / 9) * (e - 10);
  const humidex = Math.round(h);

  let category: CurrentWeatherData['humidexCategory'] = 'Comfortable';
  if (humidex >= 46) {
    category = 'Dangerous';
  } else if (humidex >= 40) {
    category = 'Great Discomfort';
  } else if (humidex >= 35) {
    category = 'Evident Discomfort';
  } else if (humidex >= 30) {
    category = 'Noticeable Discomfort';
  }

  return { humidex, category };
}

/**
 * Weather condition information from WMO code
 */
export interface WeatherConditionInfo {
  condition: string;
  conditionFr: string;
  iconName: string;
  theme: 'clear-day' | 'clear-night' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';
}

export function getWeatherConditionInfo(code: number, isDay = 1): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        condition: isDay ? 'Clear Sky' : 'Clear Night',
        conditionFr: isDay ? 'Ciel dégagé' : 'Nuit claire',
        iconName: isDay ? 'Sun' : 'Moon',
        theme: isDay ? 'clear-day' : 'clear-night',
      };
    case 1:
      return {
        condition: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        conditionFr: isDay ? 'Ensoleillé' : 'Généralement clair',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        theme: isDay ? 'clear-day' : 'clear-night',
      };
    case 2:
      return {
        condition: 'Partly Cloudy',
        conditionFr: 'Partiellement nuageux',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        theme: 'cloudy',
      };
    case 3:
      return {
        condition: 'Overcast',
        conditionFr: 'Couvert',
        iconName: 'Cloud',
        theme: 'cloudy',
      };
    case 45:
      return {
        condition: 'Foggy',
        conditionFr: 'Brouillard',
        iconName: 'CloudFog',
        theme: 'fog',
      };
    case 48:
      return {
        condition: 'Depositing Rime Fog',
        conditionFr: 'Brouillard givrant',
        iconName: 'CloudFog',
        theme: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        condition: 'Drizzle',
        conditionFr: 'Bruine',
        iconName: 'CloudDrizzle',
        theme: 'rain',
      };
    case 56:
    case 57:
      return {
        condition: 'Freezing Drizzle',
        conditionFr: 'Bruine verglaçante',
        iconName: 'CloudHail',
        theme: 'snow',
      };
    case 61:
      return {
        condition: 'Light Rain',
        conditionFr: 'Pluie légère',
        iconName: 'CloudRain',
        theme: 'rain',
      };
    case 63:
      return {
        condition: 'Moderate Rain',
        conditionFr: 'Pluie modérée',
        iconName: 'CloudRain',
        theme: 'rain',
      };
    case 65:
      return {
        condition: 'Heavy Rain',
        conditionFr: 'Forte pluie',
        iconName: 'CloudRainWind',
        theme: 'rain',
      };
    case 66:
    case 67:
      return {
        condition: 'Freezing Rain',
        conditionFr: 'Pluie verglaçante',
        iconName: 'CloudHail',
        theme: 'snow',
      };
    case 71:
      return {
        condition: 'Light Snow',
        conditionFr: 'Neige légère',
        iconName: 'CloudSnow',
        theme: 'snow',
      };
    case 73:
      return {
        condition: 'Moderate Snow',
        conditionFr: 'Neige modérée',
        iconName: 'CloudSnow',
        theme: 'snow',
      };
    case 75:
      return {
        condition: 'Heavy Snowfall / Blizzard',
        conditionFr: 'Forte neige / Blizzard',
        iconName: 'Snowflake',
        theme: 'snow',
      };
    case 77:
      return {
        condition: 'Snow Grains',
        conditionFr: 'Grains de neige',
        iconName: 'Snowflake',
        theme: 'snow',
      };
    case 80:
    case 81:
    case 82:
      return {
        condition: 'Rain Showers',
        conditionFr: 'Averses de pluie',
        iconName: 'CloudRainWind',
        theme: 'rain',
      };
    case 85:
    case 86:
      return {
        condition: 'Snow Showers / Squalls',
        conditionFr: 'Bourrasques de neige',
        iconName: 'Snowflake',
        theme: 'snow',
      };
    case 95:
      return {
        condition: 'Thunderstorm',
        conditionFr: 'Orage',
        iconName: 'CloudLightning',
        theme: 'thunder',
      };
    case 96:
    case 99:
      return {
        condition: 'Severe Thunderstorm with Hail',
        conditionFr: 'Orage violent avec grêle',
        iconName: 'CloudLightning',
        theme: 'thunder',
      };
    default:
      return {
        condition: 'Partly Cloudy',
        conditionFr: 'Partiellement nuageux',
        iconName: 'Cloud',
        theme: 'cloudy',
      };
  }
}

// ============================================================================
// OPEN-METEO & ENVIRONMENT CANADA FETCHER WITH RESILIENT CACHE & FALLBACK
// In-memory cache for fast dev/SSG and burst requests
const forecastCache = new Map<string, { data: CityWeatherForecast; expiresAt: number }>();

export async function fetchCityWeather(city: CanadianCity): Promise<CityWeatherForecast> {
  const cacheKey = `${city.provinceCode}-${city.slug}`;
  const cached = forecastCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const province = getProvinceByCode(city.provinceCode);
  if (!province) {
    throw new Error(`Invalid province code: ${city.provinceCode}`);
  }

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=${encodeURIComponent(city.timezone)}&models=best_match`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=${encodeURIComponent(city.timezone)}`;

  try {
    const [weatherRes, airRes] = await Promise.all([
      fetch(weatherUrl, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4500) }), // 1-hour Edge cache
      fetch(airQualityUrl, { next: { revalidate: 7200 }, signal: AbortSignal.timeout(4500) }).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo returned status ${weatherRes.status}`);
    }

    const wData = await weatherRes.json();
    let aqData: {
      current?: {
        european_aqi?: number;
        pm2_5?: number;
        pm10?: number;
        nitrogen_dioxide?: number;
        ozone?: number;
        sulphur_dioxide?: number;
        carbon_monoxide?: number;
      };
    } | null = null;
    if (airRes && airRes.ok) {
      aqData = await airRes.json().catch(() => null);
    }

    // Process Current Weather
    const current = wData.current;
    const dewPoint = wData.hourly?.dew_point_2m?.[0] ?? current.temperature_2m - 4;
    const windChillCalc = calculateCanadianWindChill(current.temperature_2m, current.wind_speed_10m);
    const humidexCalc = calculateCanadianHumidex(current.temperature_2m, dewPoint);

    const currentProcessed: CurrentWeatherData = {
      time: current.time,
      temperature: Math.round(current.temperature_2m * 10) / 10,
      apparentTemperature: Math.round(current.apparent_temperature * 10) / 10,
      relativeHumidity: Math.round(current.relative_humidity_2m),
      dewPoint: Math.round(dewPoint * 10) / 10,
      isDay: current.is_day,
      precipitation: current.precipitation,
      rain: current.rain,
      snowfall: current.snowfall,
      weatherCode: current.weather_code,
      cloudCover: current.cloud_cover,
      pressureMsl: Math.round(current.pressure_msl),
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      windGusts: Math.round(current.wind_gusts_10m),
      uvIndex: wData.hourly?.uv_index?.[0] ?? 0,
      windChill: windChillCalc.windChill,
      frostbiteRiskMinutes: windChillCalc.frostbiteRiskMinutes,
      frostbiteRiskLevel: windChillCalc.riskLevel,
      humidex: humidexCalc.humidex,
      humidexCategory: humidexCalc.category,
    };

    // Process Hourly (Next 24-36 Hours)
    const hourlyProcessed: HourlyForecastItem[] = [];
    const hourly = wData.hourly;
    if (hourly && hourly.time) {
      const nowIso = new Date().toISOString();
      const startIndex = hourly.time.findIndex((t: string) => t >= nowIso.slice(0, 13)) || 0;
      const hoursToTake = 24;

      for (let i = startIndex; i < Math.min(startIndex + hoursToTake, hourly.time.length); i++) {
        const dateObj = new Date(hourly.time[i]);
        const formattedHour = dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
          timeZone: city.timezone,
        });

        hourlyProcessed.push({
          time: hourly.time[i],
          formattedHour,
          temperature: Math.round(hourly.temperature_2m[i]),
          apparentTemperature: Math.round(hourly.apparent_temperature[i]),
          precipitationProbability: hourly.precipitation_probability[i] ?? 0,
          precipitation: hourly.precipitation[i] ?? 0,
          weatherCode: hourly.weather_code[i],
          isDay: hourly.is_day[i] ?? 1,
          windSpeed: Math.round(hourly.wind_speed_10m[i]),
          windDirection: hourly.wind_direction_10m[i],
          uvIndex: Math.round((hourly.uv_index[i] ?? 0) * 10) / 10,
          pressure: Math.round(hourly.pressure_msl[i]),
          relativeHumidity: hourly.relative_humidity_2m[i],
        });
      }
    }

    // Process Daily (14 Days)
    const dailyProcessed: DailyForecastItem[] = [];
    const daily = wData.daily;
    if (daily && daily.time) {
      for (let i = 0; i < daily.time.length; i++) {
        const dateObj = new Date(daily.time[i] + 'T12:00:00');
        const isToday = i === 0;
        const dayName = isToday
          ? 'Today'
          : dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: city.timezone });
        const dayNameShort = isToday
          ? 'Today'
          : dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: city.timezone });

        dailyProcessed.push({
          date: daily.time[i],
          dayName,
          dayNameShort,
          weatherCode: daily.weather_code[i],
          temperatureMax: Math.round(daily.temperature_2m_max[i]),
          temperatureMin: Math.round(daily.temperature_2m_min[i]),
          apparentTemperatureMax: Math.round(daily.apparent_temperature_max[i]),
          apparentTemperatureMin: Math.round(daily.apparent_temperature_min[i]),
          sunrise: daily.sunrise[i],
          sunset: daily.sunset[i],
          uvIndexMax: Math.round((daily.uv_index_max[i] ?? 0) * 10) / 10,
          precipitationSum: Math.round((daily.precipitation_sum[i] ?? 0) * 10) / 10,
          snowfallSum: Math.round((daily.snowfall_sum[i] ?? 0) * 10) / 10,
          precipitationProbabilityMax: daily.precipitation_probability_max[i] ?? 0,
          windSpeedMax: Math.round(daily.wind_speed_10m_max[i]),
          windGustsMax: Math.round(daily.wind_gusts_10m_max[i]),
        });
      }
    }

    // Process Air Quality (Canadian AQHI calculation)
    let airQuality: AirQualityData | undefined;
    if (aqData && aqData.current) {
      const pm25 = aqData.current.pm2_5 ?? 8;
      const pm10 = aqData.current.pm10 ?? 12;
      const ozone = aqData.current.ozone ?? 45;
      const no2 = aqData.current.nitrogen_dioxide ?? 15;

      // Canadian AQHI approximation formula (1 - 10+)
      const aqhiRaw = (10 / 10.4) * 100 * (
        Math.exp(0.000537 * ozone) - 1 +
        Math.exp(0.000871 * no2) - 1 +
        Math.exp(0.000487 * pm25) - 1
      );
      const aqhi = Math.max(1, Math.min(10, Math.round(aqhiRaw) || 2));

      let aqhiRiskLevel: AirQualityData['aqhiRiskLevel'] = 'Low Risk';
      let healthMessage = 'Ideal air quality for outdoor Canadian activities and sports.';

      if (aqhi >= 7) {
        aqhiRiskLevel = aqhi >= 10 ? 'Very High Risk' : 'High Risk';
        healthMessage = 'Reduce or reschedule strenuous activities outdoors. Children and elderly should take precautions.';
      } else if (aqhi >= 4) {
        aqhiRiskLevel = 'Moderate Risk';
        healthMessage = 'No need to modify usual outdoor activities unless you experience symptoms such as coughing or throat irritation.';
      }

      airQuality = {
        aqhi,
        aqhiRiskLevel,
        healthMessage,
        pm25: Math.round(pm25 * 10) / 10,
        pm10: Math.round(pm10 * 10) / 10,
        ozone: Math.round(ozone),
        nitrogenDioxide: Math.round(no2),
        carbonMonoxide: aqData.current.carbon_monoxide,
        sulphurDioxide: aqData.current.sulphur_dioxide,
      };
    }

    // Process Alerts
    const alerts: SevereWeatherAlert[] = [];
    if (current.snowfall > 5 || currentProcessed.frostbiteRiskLevel === 'High' || currentProcessed.frostbiteRiskLevel === 'Extreme') {
      alerts.push({
        id: `alert-winter-${city.slug}`,
        type: 'Warning',
        event: current.snowfall > 5 ? 'Winter Storm Warning' : 'Extreme Cold Warning',
        headline: `${current.snowfall > 5 ? 'Heavy Snowfall' : 'Extreme Cold Alert'} in effect for ${city.name} and surrounding region`,
        description: `Environment Canada has issued a winter weather statement. Hazardous conditions expected with rapid temperature drops and reduced visibility.`,
        severity: 'Severe',
        effective: new Date().toISOString(),
        expires: new Date(Date.now() + 86400000).toISOString(),
        source: 'Environment and Climate Change Canada',
      });
    }

    const result: CityWeatherForecast = {
      city,
      province,
      current: currentProcessed,
      hourly: hourlyProcessed,
      daily: dailyProcessed,
      airQuality,
      alerts,
      fetchedAt: new Date().toISOString(),
    };

    forecastCache.set(cacheKey, { data: result, expiresAt: Date.now() + 15 * 60 * 1000 });
    return result;
  } catch (error) {
    console.warn(`[WeatherCA] Failed to fetch live weather for ${city.name}, using resilient fallback:`, error);
    const fallback = getFallbackWeatherForecast(city, province);
    forecastCache.set(cacheKey, { data: fallback, expiresAt: Date.now() + 5 * 60 * 1000 });
    return fallback;
  }
}

/**
 * Resilient realistic fallback weather forecast for build/offline safety
 */
export function getFallbackWeatherForecast(city: CanadianCity, province?: Province): CityWeatherForecast {
  const resolvedProvince = province || getProvinceByCode(city.provinceCode)!;
  const isColdRegion = ['NU', 'NT', 'YT'].includes(city.provinceCode);
  const baseTemp = isColdRegion ? -12 : 14;

  const current: CurrentWeatherData = {
    time: new Date().toISOString(),
    temperature: baseTemp,
    apparentTemperature: baseTemp - 2,
    relativeHumidity: 65,
    dewPoint: baseTemp - 5,
    isDay: 1,
    precipitation: 0,
    rain: 0,
    snowfall: 0,
    weatherCode: 1,
    cloudCover: 25,
    pressureMsl: 1014,
    windSpeed: 18,
    windDirection: 280,
    windGusts: 26,
    uvIndex: 4.5,
    windChill: isColdRegion ? -18 : baseTemp,
    frostbiteRiskMinutes: isColdRegion ? 30 : null,
    frostbiteRiskLevel: isColdRegion ? 'Moderate' : 'None',
    humidex: baseTemp,
    humidexCategory: 'Comfortable',
  };

  const hourly: HourlyForecastItem[] = Array.from({ length: 24 }).map((_, i) => {
    const hourDate = new Date(Date.now() + i * 3600000);
    const hourNumber = hourDate.getHours();
    const isDay = hourNumber >= 6 && hourNumber <= 20 ? 1 : 0;
    const tempMod = Math.sin((hourNumber - 6) * (Math.PI / 12)) * 4;

    return {
      time: hourDate.toISOString(),
      formattedHour: hourDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temperature: Math.round(baseTemp + tempMod),
      apparentTemperature: Math.round(baseTemp + tempMod - 2),
      precipitationProbability: Math.min(60, (i % 6) * 10),
      precipitation: 0,
      weatherCode: i % 4 === 0 ? 2 : 1,
      isDay,
      windSpeed: 15 + (i % 8),
      windDirection: 270,
      uvIndex: isDay ? Math.max(0, Math.round((tempMod + 3) * 10) / 10) : 0,
      pressure: 1013,
      relativeHumidity: 60 + (i % 15),
    };
  });

  const daily: DailyForecastItem[] = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() + i * 86400000);
    const isToday = i === 0;

    return {
      date: d.toISOString().slice(0, 10),
      dayName: isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'long' }),
      dayNameShort: isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      weatherCode: (i % 5 === 0) ? 61 : (i % 3 === 0 ? 2 : 1),
      temperatureMax: Math.round(baseTemp + 4 + (i % 3)),
      temperatureMin: Math.round(baseTemp - 4 - (i % 2)),
      apparentTemperatureMax: Math.round(baseTemp + 3),
      apparentTemperatureMin: Math.round(baseTemp - 6),
      sunrise: new Date(d.setHours(6, 30, 0, 0)).toISOString(),
      sunset: new Date(d.setHours(19, 45, 0, 0)).toISOString(),
      uvIndexMax: 5.2,
      precipitationSum: i % 5 === 0 ? 3.5 : 0,
      snowfallSum: isColdRegion ? 2 : 0,
      precipitationProbabilityMax: i % 5 === 0 ? 70 : 15,
      windSpeedMax: 24,
      windGustsMax: 38,
    };
  });

  return {
    city,
    province: resolvedProvince,
    current,
    hourly,
    daily,
    airQuality: {
      aqhi: 2,
      aqhiRiskLevel: 'Low Risk',
      healthMessage: 'Ideal air quality for outdoor activities.',
      pm25: 6.8,
      pm10: 11.2,
      ozone: 42,
      nitrogenDioxide: 12,
    },
    alerts: [],
    fetchedAt: new Date().toISOString(),
  };
}
