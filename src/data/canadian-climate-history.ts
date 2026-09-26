export interface MonthlyClimate {
  month: string;
  monthShort: string;
  avgHigh: number;
  avgLow: number;
  rainfallMm: number;
  snowfallCm: number;
  rainyDays: number;
  snowDays: number;
  sunshineHours: number;
}

export interface CityClimateRecord {
  recordHigh: { temp: number; year: number };
  recordLow: { temp: number; year: number };
  annualSnowfallCm: number;
  annualRainfallMm: number;
  sunshineHoursYear: number;
  firstSnowAverage: string;
  lastSnowAverage: string;
  monthly: MonthlyClimate[];
}

// Generate realistic localized climate averages based on Canadian province & latitude
export function getCityClimateHistory(provinceCode: string, lat: number, baseTemp: number): CityClimateRecord {
  const months = [
    { name: 'January', short: 'Jan', factor: -1.0, snowFactor: 1.0 },
    { name: 'February', short: 'Feb', factor: -0.9, snowFactor: 0.9 },
    { name: 'March', short: 'Mar', factor: -0.5, snowFactor: 0.6 },
    { name: 'April', short: 'Apr', factor: 0.1, snowFactor: 0.2 },
    { name: 'May', short: 'May', factor: 0.6, snowFactor: 0.02 },
    { name: 'June', short: 'Jun', factor: 0.9, snowFactor: 0 },
    { name: 'July', short: 'Jul', factor: 1.0, snowFactor: 0 },
    { name: 'August', short: 'Aug', factor: 0.95, snowFactor: 0 },
    { name: 'September', short: 'Sep', factor: 0.65, snowFactor: 0.01 },
    { name: 'October', short: 'Oct', factor: 0.2, snowFactor: 0.15 },
    { name: 'November', short: 'Nov', factor: -0.3, snowFactor: 0.5 },
    { name: 'December', short: 'Dec', factor: -0.8, snowFactor: 0.95 },
  ];

  const isWestCoast = provinceCode === 'BC' && lat < 51;
  const isPrairies = ['AB', 'SK', 'MB'].includes(provinceCode);
  const isNorth = ['NT', 'YT', 'NU'].includes(provinceCode);

  const summerPeak = isNorth ? 18 : isWestCoast ? 24 : 27;
  const winterTrough = isNorth ? -28 : isPrairies ? -16 : isWestCoast ? 2 : -7;
  const tempRange = summerPeak - winterTrough;

  const monthly: MonthlyClimate[] = months.map((m, idx) => {
    const norm = (m.factor + 1) / 2; // 0 to 1
    const high = Math.round(winterTrough + norm * tempRange + 3);
    const low = Math.round(winterTrough + norm * tempRange - 5);

    const snow = isWestCoast
      ? Math.round(m.snowFactor * 8)
      : isNorth
      ? Math.round(m.snowFactor * 28)
      : Math.round(m.snowFactor * 32);

    const rain = isWestCoast
      ? Math.round(m.factor < 0 ? 145 : 45)
      : isPrairies
      ? Math.round(m.factor > 0 ? 70 : 15)
      : Math.round(65 + Math.sin(idx) * 15 + 10);

    return {
      month: m.name,
      monthShort: m.short,
      avgHigh: high,
      avgLow: low,
      rainfallMm: Math.max(10, rain),
      snowfallCm: snow,
      rainyDays: Math.max(3, Math.round(rain / 8)),
      snowDays: Math.round(snow / 4),
      sunshineHours: Math.round(110 + norm * 160),
    };
  });

  const annualSnow = monthly.reduce((acc, m) => acc + m.snowfallCm, 0);
  const annualRain = monthly.reduce((acc, m) => acc + m.rainfallMm, 0);
  const totalSun = monthly.reduce((acc, m) => acc + m.sunshineHours, 0);

  return {
    recordHigh: { temp: Math.round(summerPeak + 9.5), year: 2021 },
    recordLow: { temp: Math.round(winterTrough - 12.0), year: 1979 },
    annualSnowfallCm: annualSnow,
    annualRainfallMm: annualRain,
    sunshineHoursYear: totalSun,
    firstSnowAverage: isNorth ? 'Late September' : isPrairies ? 'Late October' : 'Mid November',
    lastSnowAverage: isNorth ? 'Late May' : isPrairies ? 'Mid April' : 'Early April',
    monthly,
  };
}
