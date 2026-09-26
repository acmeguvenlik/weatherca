export interface TideEvent {
  time: string;
  heightMeters: number;
  heightFeet: number;
  type: 'High Tide' | 'Low Tide';
}

export interface MarineStation {
  id: string;
  name: string;
  bodyOfWater: string;
  province: string;
  provinceCode: string;
  lat: number;
  lon: number;
  currentWaterTempC: number;
  waveHeightMeters: number;
  swellPeriodSec: number;
  windSpeedKt: number;
  windDirection: string;
  tidalRangeMeters: number;
  tidalRangeCategory: 'Extreme (Macrotidal)' | 'Moderate (Mesotidal)' | 'Microtidal';
  todayTides: TideEvent[];
  tomorrowTides: TideEvent[];
  marineAdvisory: string;
  notableFeature: string;
}

export const CANADIAN_MARINE_STATIONS: MarineStation[] = [
  {
    id: 'tide-fundy',
    name: 'Hopewell Cape & Burntcoat Head (Bay of Fundy)',
    bodyOfWater: 'Bay of Fundy / Minas Basin',
    province: 'New Brunswick / Nova Scotia',
    provinceCode: 'NB',
    lat: 45.82,
    lon: -64.57,
    currentWaterTempC: 13.8,
    waveHeightMeters: 1.2,
    swellPeriodSec: 7,
    windSpeedKt: 18,
    windDirection: 'SW',
    tidalRangeMeters: 14.5, // World record tidal range
    tidalRangeCategory: 'Extreme (Macrotidal)',
    todayTides: [
      { time: '04:15 AM', heightMeters: 13.8, heightFeet: 45.3, type: 'High Tide' },
      { time: '10:40 AM', heightMeters: 0.8, heightFeet: 2.6, type: 'Low Tide' },
      { time: '04:42 PM', heightMeters: 14.2, heightFeet: 46.6, type: 'High Tide' },
      { time: '11:05 PM', heightMeters: 0.6, heightFeet: 2.0, type: 'Low Tide' },
    ],
    tomorrowTides: [
      { time: '05:08 AM', heightMeters: 14.0, heightFeet: 45.9, type: 'High Tide' },
      { time: '11:32 AM', heightMeters: 0.7, heightFeet: 2.3, type: 'Low Tide' },
      { time: '05:35 PM', heightMeters: 14.4, heightFeet: 47.2, type: 'High Tide' },
      { time: '11:58 PM', heightMeters: 0.5, heightFeet: 1.6, type: 'Low Tide' },
    ],
    marineAdvisory: 'Rapid tidal bore advance. Walkers on the ocean floor must exit 3 hours before high tide.',
    notableFeature: 'Highest tidal resonance in the world with 160 billion tonnes of seawater flushing twice daily.',
  },
  {
    id: 'tide-vancouver',
    name: 'Vancouver Harbour & English Bay (Point Atkinson)',
    bodyOfWater: 'Strait of Georgia / Salish Sea',
    province: 'British Columbia',
    provinceCode: 'BC',
    lat: 49.33,
    lon: -123.26,
    currentWaterTempC: 15.2,
    waveHeightMeters: 0.6,
    swellPeriodSec: 5,
    windSpeedKt: 10,
    windDirection: 'WNW',
    tidalRangeMeters: 4.8,
    tidalRangeCategory: 'Moderate (Mesotidal)',
    todayTides: [
      { time: '02:30 AM', heightMeters: 4.2, heightFeet: 13.8, type: 'High Tide' },
      { time: '09:15 AM', heightMeters: 1.4, heightFeet: 4.6, type: 'Low Tide' },
      { time: '03:45 PM', heightMeters: 4.5, heightFeet: 14.8, type: 'High Tide' },
      { time: '10:20 PM', heightMeters: 2.1, heightFeet: 6.9, type: 'Low Tide' },
    ],
    tomorrowTides: [
      { time: '03:15 AM', heightMeters: 4.3, heightFeet: 14.1, type: 'High Tide' },
      { time: '10:00 AM', heightMeters: 1.2, heightFeet: 3.9, type: 'Low Tide' },
      { time: '04:30 PM', heightMeters: 4.6, heightFeet: 15.1, type: 'High Tide' },
      { time: '11:05 PM', heightMeters: 1.9, heightFeet: 6.2, type: 'Low Tide' },
    ],
    marineAdvisory: 'Mild chop in Burrard Inlet; Fraser River freshet current confluence near First Narrows.',
    notableFeature: 'Mixed semidiurnal tidal regime with strong tidal rips through First and Second Narrows.',
  },
  {
    id: 'tide-halifax',
    name: 'Halifax Harbour & Bedford Basin',
    bodyOfWater: 'Atlantic Ocean',
    province: 'Nova Scotia',
    provinceCode: 'NS',
    lat: 44.67,
    lon: -63.58,
    currentWaterTempC: 14.1,
    waveHeightMeters: 1.8,
    swellPeriodSec: 9,
    windSpeedKt: 14,
    windDirection: 'S',
    tidalRangeMeters: 2.1,
    tidalRangeCategory: 'Moderate (Mesotidal)',
    todayTides: [
      { time: '01:10 AM', heightMeters: 1.9, heightFeet: 6.2, type: 'High Tide' },
      { time: '07:25 AM', heightMeters: 0.3, heightFeet: 1.0, type: 'Low Tide' },
      { time: '01:38 PM', heightMeters: 2.0, heightFeet: 6.6, type: 'High Tide' },
      { time: '07:50 PM', heightMeters: 0.4, heightFeet: 1.3, type: 'Low Tide' },
    ],
    tomorrowTides: [
      { time: '02:00 AM', heightMeters: 2.0, heightFeet: 6.6, type: 'High Tide' },
      { time: '08:15 AM', heightMeters: 0.3, heightFeet: 1.0, type: 'Low Tide' },
      { time: '02:25 PM', heightMeters: 2.1, heightFeet: 6.9, type: 'High Tide' },
      { time: '08:40 PM', heightMeters: 0.4, heightFeet: 1.3, type: 'Low Tide' },
    ],
    marineAdvisory: 'Atlantic sea fog patches extending past Chebucto Head with swell of 1.8m.',
    notableFeature: 'Major deep-water ice-free commercial and naval harbour with open Atlantic ocean exposure.',
  },
  {
    id: 'tide-tofino',
    name: 'Tofino & Clayoquot Sound (Pacific Rim)',
    bodyOfWater: 'Open Pacific Ocean',
    province: 'British Columbia',
    provinceCode: 'BC',
    lat: 49.15,
    lon: -125.90,
    currentWaterTempC: 13.5,
    waveHeightMeters: 2.9,
    swellPeriodSec: 13,
    windSpeedKt: 16,
    windDirection: 'W',
    tidalRangeMeters: 3.8,
    tidalRangeCategory: 'Moderate (Mesotidal)',
    todayTides: [
      { time: '03:45 AM', heightMeters: 3.4, heightFeet: 11.2, type: 'High Tide' },
      { time: '09:55 AM', heightMeters: 0.8, heightFeet: 2.6, type: 'Low Tide' },
      { time: '04:10 PM', heightMeters: 3.6, heightFeet: 11.8, type: 'High Tide' },
      { time: '10:30 PM', heightMeters: 0.9, heightFeet: 3.0, type: 'Low Tide' },
    ],
    tomorrowTides: [
      { time: '04:30 AM', heightMeters: 3.5, heightFeet: 11.5, type: 'High Tide' },
      { time: '10:40 AM', heightMeters: 0.7, heightFeet: 2.3, type: 'Low Tide' },
      { time: '04:55 PM', heightMeters: 3.7, heightFeet: 12.1, type: 'High Tide' },
      { time: '11:15 PM', heightMeters: 0.8, heightFeet: 2.6, type: 'Low Tide' },
    ],
    marineAdvisory: 'Heavy Pacific groundswell. Surf hazard and rip currents active along Chesterman and Cox Bay.',
    notableFeature: 'Canada’s premier cold-water surfing capital exposed to unbroken Gulf of Alaska storm swells.',
  },
  {
    id: 'tide-stjohns',
    name: 'St. John’s Harbour & The Narrows',
    bodyOfWater: 'North Atlantic Ocean / Grand Banks',
    province: 'Newfoundland and Labrador',
    provinceCode: 'NL',
    lat: 47.57,
    lon: -52.70,
    currentWaterTempC: 11.8,
    waveHeightMeters: 2.4,
    swellPeriodSec: 11,
    windSpeedKt: 22,
    windDirection: 'ENE',
    tidalRangeMeters: 1.5,
    tidalRangeCategory: 'Microtidal',
    todayTides: [
      { time: '05:20 AM', heightMeters: 1.4, heightFeet: 4.6, type: 'High Tide' },
      { time: '11:40 AM', heightMeters: 0.4, heightFeet: 1.3, type: 'Low Tide' },
      { time: '05:50 PM', heightMeters: 1.5, heightFeet: 4.9, type: 'High Tide' },
      { time: '11:55 PM', heightMeters: 0.3, heightFeet: 1.0, type: 'Low Tide' },
    ],
    tomorrowTides: [
      { time: '06:05 AM', heightMeters: 1.5, heightFeet: 4.9, type: 'High Tide' },
      { time: '12:25 PM', heightMeters: 0.3, heightFeet: 1.0, type: 'Low Tide' },
      { time: '06:35 PM', heightMeters: 1.6, heightFeet: 5.2, type: 'High Tide' },
    ],
    marineAdvisory: 'Gale force gusts near Cape Spear; icebergs occasionally drift through offshore coastal zone in spring.',
    notableFeature: 'Easternmost harbor in North America shielded by sheer rock cliffs forming The Narrows.',
  },
];
