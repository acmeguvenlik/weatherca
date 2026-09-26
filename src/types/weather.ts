export interface Province {
  code: string;
  slug: string;
  name: string;
  nameFr: string;
  capital: string;
  largestCity: string;
  population: number;
  timezone: string;
  lat: number;
  lon: number;
  region: 'Western Canada' | 'Central Canada' | 'Atlantic Canada' | 'Northern Canada';
  climateSummary: string;
  climateSummaryFr: string;
}

export interface CanadianCity {
  slug: string;
  name: string;
  nameFr?: string;
  provinceCode: string;
  lat: number;
  lon: number;
  population: number;
  timezone: string;
  elevation?: number;
  postalCodePrefix?: string[];
  isCapital?: boolean;
  featured?: boolean;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  dewPoint: number;
  isDay: number;
  precipitation: number;
  rain: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex?: number;
  // Canadian Specific Indices
  windChill?: number;
  frostbiteRiskMinutes?: number | null;
  frostbiteRiskLevel?: 'None' | 'Low' | 'Moderate' | 'High' | 'Extreme' | 'Hazardous';
  humidex?: number;
  humidexCategory?: 'Comfortable' | 'Noticeable Discomfort' | 'Evident Discomfort' | 'Great Discomfort' | 'Dangerous';
}

export interface HourlyForecastItem {
  time: string;
  formattedHour: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  isDay: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  pressure: number;
  relativeHumidity: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  dayNameShort: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  snowfallSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
}

export interface AirQualityData {
  aqhi: number; // Canadian AQHI 1 to 10+
  aqhiRiskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';
  healthMessage: string;
  pm25: number;
  pm10: number;
  ozone: number;
  nitrogenDioxide: number;
  carbonMonoxide?: number;
  sulphurDioxide?: number;
}

export interface SevereWeatherAlert {
  id: string;
  type: 'Warning' | 'Watch' | 'Advisory' | 'Statement';
  event: string;
  headline: string;
  description: string;
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor';
  effective: string;
  expires: string;
  source: string;
}

export interface CityWeatherForecast {
  city: CanadianCity;
  province: Province;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  alerts: SevereWeatherAlert[];
  fetchedAt: string;
}
