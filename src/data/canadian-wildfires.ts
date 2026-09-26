export interface WildfireIncident {
  id: string;
  name: string;
  province: string;
  provinceCode: string;
  lat: number;
  lon: number;
  hectares: number;
  status: 'out-of-control' | 'being-held' | 'under-control';
  stageOfControl: string;
  discoveredDate: string;
  smokeIntensity: 'low' | 'moderate' | 'high' | 'extreme';
  pm25Level: number; // in µg/m³
  aqhiRating: number; // 1-10+
  closestSettlement: string;
  distanceKm: number;
  dangerRating: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  evacuationStatus: 'none' | 'alert' | 'order';
}

export interface SmokeForecastZone {
  id: string;
  region: string;
  province: string;
  currentAQHI: number;
  forecast24h: number;
  forecast48h: number;
  dominantPlumeOrigin: string;
  windBearing: string;
  windSpeedKmh: number;
  advisoryLevel: 'Good' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';
  healthRecommendation: string;
}

export const CANADIAN_WILDFIRES: WildfireIncident[] = [
  {
    id: 'BC-2026-041',
    name: 'Donnie Creek Complex',
    province: 'British Columbia',
    provinceCode: 'BC',
    lat: 57.54,
    lon: -121.95,
    hectares: 142500,
    status: 'out-of-control',
    stageOfControl: 'Active - Heavy Suppression',
    discoveredDate: '2026-06-12',
    smokeIntensity: 'extreme',
    pm25Level: 185,
    aqhiRating: 10,
    closestSettlement: 'Fort St. John',
    distanceKm: 145,
    dangerRating: 'Extreme',
    evacuationStatus: 'alert',
  },
  {
    id: 'BC-2026-088',
    name: 'Adams Lake Bluffs',
    province: 'British Columbia',
    provinceCode: 'BC',
    lat: 51.04,
    lon: -119.55,
    hectares: 18200,
    status: 'being-held',
    stageOfControl: 'Containment Line Established',
    discoveredDate: '2026-07-02',
    smokeIntensity: 'high',
    pm25Level: 94,
    aqhiRating: 7,
    closestSettlement: 'Chase / Kamloops',
    distanceKm: 32,
    dangerRating: 'Very High',
    evacuationStatus: 'alert',
  },
  {
    id: 'AB-2026-019',
    name: 'Fox Creek Wildfire',
    province: 'Alberta',
    provinceCode: 'AB',
    lat: 54.40,
    lon: -116.80,
    hectares: 31400,
    status: 'out-of-control',
    stageOfControl: 'Active Ground & Aerial Water Bombing',
    discoveredDate: '2026-06-25',
    smokeIntensity: 'high',
    pm25Level: 122,
    aqhiRating: 8,
    closestSettlement: 'Fox Creek',
    distanceKm: 18,
    dangerRating: 'Extreme',
    evacuationStatus: 'order',
  },
  {
    id: 'AB-2026-077',
    name: 'Fort Chipewyan Athabasca',
    province: 'Alberta',
    provinceCode: 'AB',
    lat: 58.71,
    lon: -111.15,
    hectares: 67800,
    status: 'being-held',
    stageOfControl: 'Perimeter Monitored',
    discoveredDate: '2026-06-18',
    smokeIntensity: 'moderate',
    pm25Level: 45,
    aqhiRating: 5,
    closestSettlement: 'Fort Chipewyan',
    distanceKm: 24,
    dangerRating: 'High',
    evacuationStatus: 'none',
  },
  {
    id: 'SK-2026-033',
    name: 'Besnard Lake Northern Boreal',
    province: 'Saskatchewan',
    provinceCode: 'SK',
    lat: 55.42,
    lon: -105.98,
    hectares: 45200,
    status: 'under-control',
    stageOfControl: 'Smoldering / Mop-up Stage',
    discoveredDate: '2026-07-10',
    smokeIntensity: 'low',
    pm25Level: 22,
    aqhiRating: 3,
    closestSettlement: 'La Ronge',
    distanceKm: 85,
    dangerRating: 'Moderate',
    evacuationStatus: 'none',
  },
  {
    id: 'ON-2026-012',
    name: 'Red Lake 38',
    province: 'Ontario',
    provinceCode: 'ON',
    lat: 51.02,
    lon: -93.83,
    hectares: 24600,
    status: 'being-held',
    stageOfControl: 'Firebreaks Held by Water Sprinklers',
    discoveredDate: '2026-07-14',
    smokeIntensity: 'moderate',
    pm25Level: 58,
    aqhiRating: 6,
    closestSettlement: 'Red Lake',
    distanceKm: 22,
    dangerRating: 'High',
    evacuationStatus: 'alert',
  },
  {
    id: 'QC-2026-054',
    name: 'Lebel-sur-Quevillon Nord',
    province: 'Quebec',
    provinceCode: 'QC',
    lat: 49.03,
    lon: -76.98,
    hectares: 89300,
    status: 'under-control',
    stageOfControl: 'SOPFEU Ground Patrol Active',
    discoveredDate: '2026-06-08',
    smokeIntensity: 'low',
    pm25Level: 18,
    aqhiRating: 2,
    closestSettlement: 'Lebel-sur-Quevillon',
    distanceKm: 42,
    dangerRating: 'Moderate',
    evacuationStatus: 'none',
  },
  {
    id: 'NWT-2026-009',
    name: 'South Slave Enterprise Fire',
    province: 'Northwest Territories',
    provinceCode: 'NT',
    lat: 60.55,
    lon: -116.14,
    hectares: 112000,
    status: 'being-held',
    stageOfControl: 'Protected Structural Enclaves',
    discoveredDate: '2026-06-29',
    smokeIntensity: 'high',
    pm25Level: 110,
    aqhiRating: 8,
    closestSettlement: 'Hay River',
    distanceKm: 38,
    dangerRating: 'Very High',
    evacuationStatus: 'alert',
  },
];

export const SMOKE_FORECAST_ZONES: SmokeForecastZone[] = [
  {
    id: 'zone-bc-interior',
    region: 'BC Southern Interior & Okanagan',
    province: 'British Columbia',
    currentAQHI: 7,
    forecast24h: 8,
    forecast48h: 5,
    dominantPlumeOrigin: 'Adams Lake & Northern BC complexes',
    windBearing: 'NW',
    windSpeedKmh: 18,
    advisoryLevel: 'High Risk',
    healthRecommendation: 'At-risk individuals should stay indoors. Keep windows sealed with HEPA filtration.',
  },
  {
    id: 'zone-ab-calgary-edmonton',
    region: 'Calgary - Edmonton Corridor',
    province: 'Alberta',
    currentAQHI: 6,
    forecast24h: 5,
    forecast48h: 3,
    dominantPlumeOrigin: 'Fox Creek & Northern Alberta drift',
    windBearing: 'WNW',
    windSpeedKmh: 24,
    advisoryLevel: 'Moderate Risk',
    healthRecommendation: 'Consider reducing prolonged outdoor strenuous exercise if experiencing coughing or throat irritation.',
  },
  {
    id: 'zone-sk-mb-prairies',
    region: 'Saskatchewan & Manitoba Plains',
    province: 'Saskatchewan',
    currentAQHI: 4,
    forecast24h: 3,
    forecast48h: 2,
    dominantPlumeOrigin: 'Dispersed high-altitude plume',
    windBearing: 'SW',
    windSpeedKmh: 30,
    advisoryLevel: 'Moderate Risk',
    healthRecommendation: 'Air quality generally acceptable for general population. Sensitive groups monitor symptoms.',
  },
  {
    id: 'zone-on-gta',
    region: 'Greater Toronto Area & Golden Horseshoe',
    province: 'Ontario',
    currentAQHI: 3,
    forecast24h: 3,
    forecast48h: 2,
    dominantPlumeOrigin: 'Clear Atlantic airmass dominant',
    windBearing: 'S',
    windSpeedKmh: 14,
    advisoryLevel: 'Good',
    healthRecommendation: 'Ideal conditions for outdoor recreation. No smoke advisories active.',
  },
  {
    id: 'zone-qc-montreal',
    region: 'Greater Montreal & St. Lawrence Valley',
    province: 'Quebec',
    currentAQHI: 2,
    forecast24h: 2,
    forecast48h: 2,
    dominantPlumeOrigin: 'Clean easterly flow',
    windBearing: 'NE',
    windSpeedKmh: 12,
    advisoryLevel: 'Good',
    healthRecommendation: 'Excellent atmospheric clarity.',
  },
];
