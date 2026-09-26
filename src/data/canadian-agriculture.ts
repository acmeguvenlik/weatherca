export interface AgriZone {
  id: string;
  name: string;
  province: string;
  provinceCode: string;
  lat: number;
  lon: number;
  primaryCrops: string[];
  currentSoilTemp10cmC: number;
  soilMoisturePct: number;
  moistureStatus: 'Deficit / Drought' | 'Optimal' | 'Surplus / Saturated';
  frostRiskLevel: 'None' | 'Low Risk' | 'Moderate Warning' | 'Severe Frost Threat';
  minOvernightForecastC: number;
  gddBase5Accumulated: number; // Base 5°C Growing Degree Days
  gddBase10Accumulated: number; // Base 10°C Growing Degree Days (Corn/Soy)
  historicalGddAverage: number;
  cropStageStatus: string;
  agronomyRecommendation: string;
}

export const CANADIAN_AGRI_ZONES: AgriZone[] = [
  {
    id: 'agri-prairie-sk',
    name: 'Saskatchewan Central Grain Belt (Rosetown / Regina Plains)',
    province: 'Saskatchewan',
    provinceCode: 'SK',
    lat: 51.55,
    lon: -107.98,
    primaryCrops: ['Canola', 'Spring Wheat', 'Durum', 'Lentils', 'Barley'],
    currentSoilTemp10cmC: 14.8,
    soilMoisturePct: 62,
    moistureStatus: 'Optimal',
    frostRiskLevel: 'None',
    minOvernightForecastC: 6.2,
    gddBase5Accumulated: 1420,
    gddBase10Accumulated: 890,
    historicalGddAverage: 1380,
    cropStageStatus: 'Grain filling & canopy drydown prior to harvest swathing.',
    agronomyRecommendation: 'Favorable harvesting window. Low moisture dry-down rates optimal across the plains.',
  },
  {
    id: 'agri-niagara-on',
    name: 'Niagara Tender Fruit & Wine Belt',
    province: 'Ontario',
    provinceCode: 'ON',
    lat: 43.15,
    lon: -79.24,
    primaryCrops: ['Pinot Noir / Riesling Grapes', 'Peaches', 'Cherries', 'Apples'],
    currentSoilTemp10cmC: 18.4,
    soilMoisturePct: 78,
    moistureStatus: 'Optimal',
    frostRiskLevel: 'None',
    minOvernightForecastC: 11.5,
    gddBase5Accumulated: 1890,
    gddBase10Accumulated: 1240,
    historicalGddAverage: 1820,
    cropStageStatus: 'Brix sugar accumulation peak; late grape varietal ripening.',
    agronomyRecommendation: 'Monitor evening relative humidity for powdery mildew risk. Excellent diurnal thermal spread.',
  },
  {
    id: 'agri-okanagan-bc',
    name: 'Okanagan Valley Orchards & Vineyards (Oliver / Kelowna)',
    province: 'British Columbia',
    provinceCode: 'BC',
    lat: 49.88,
    lon: -119.49,
    primaryCrops: ['Apples', 'Sweet Cherries', 'VQA Grapes', 'Soft Fruits'],
    currentSoilTemp10cmC: 17.2,
    soilMoisturePct: 45,
    moistureStatus: 'Deficit / Drought',
    frostRiskLevel: 'None',
    minOvernightForecastC: 8.8,
    gddBase5Accumulated: 1760,
    gddBase10Accumulated: 1120,
    historicalGddAverage: 1710,
    cropStageStatus: 'Late apple harvesting; vine hardening preparation.',
    agronomyRecommendation: 'Drip irrigation recommended to prevent canopy water stress in benchland parcels.',
  },
  {
    id: 'agri-annapolis-ns',
    name: 'Annapolis Valley Apple & Berry District (Kentville)',
    province: 'Nova Scotia',
    provinceCode: 'NS',
    lat: 45.07,
    lon: -64.50,
    primaryCrops: ['Honeycrisp Apples', 'Blueberries', 'Cool-Climate Grapes'],
    currentSoilTemp10cmC: 15.1,
    soilMoisturePct: 82,
    moistureStatus: 'Surplus / Saturated',
    frostRiskLevel: 'Low Risk',
    minOvernightForecastC: 3.8,
    gddBase5Accumulated: 1380,
    gddBase10Accumulated: 780,
    historicalGddAverage: 1340,
    cropStageStatus: 'Commercial Honeycrisp picking and cold-storage sorting.',
    agronomyRecommendation: 'Inspect low-lying valley bottoms for radiation frost pockets if winds calm overnight.',
  },
  {
    id: 'agri-red-river-mb',
    name: 'Red River Valley Black Soil Zone (Winnipeg / Morris)',
    province: 'Manitoba',
    provinceCode: 'MB',
    lat: 49.35,
    lon: -97.36,
    primaryCrops: ['Soybeans', 'Corn', 'Canola', 'Sunflowers'],
    currentSoilTemp10cmC: 13.9,
    soilMoisturePct: 70,
    moistureStatus: 'Optimal',
    frostRiskLevel: 'Low Risk',
    minOvernightForecastC: 4.1,
    gddBase5Accumulated: 1510,
    gddBase10Accumulated: 960,
    historicalGddAverage: 1470,
    cropStageStatus: 'Soybean leaf drop R7-R8 maturity phase.',
    agronomyRecommendation: 'Watch for early autumn frost line. GDD accumulation is tracking 40 units ahead of normal.',
  },
  {
    id: 'agri-holland-marsh-on',
    name: 'Holland Marsh Muck Soil Basin (Bradford / King)',
    province: 'Ontario',
    provinceCode: 'ON',
    lat: 44.11,
    lon: -79.62,
    primaryCrops: ['Carrots', 'Onions', 'Celery', 'Leafy Greens'],
    currentSoilTemp10cmC: 16.5,
    soilMoisturePct: 85,
    moistureStatus: 'Surplus / Saturated',
    frostRiskLevel: 'None',
    minOvernightForecastC: 9.2,
    gddBase5Accumulated: 1720,
    gddBase10Accumulated: 1080,
    historicalGddAverage: 1690,
    cropStageStatus: 'Root vegetable mechanical extraction in full progress.',
    agronomyRecommendation: 'Canal drainage pumping operating at standard baseline.',
  },
];
