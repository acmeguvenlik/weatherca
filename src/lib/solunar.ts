// Solunar & Marine Activity Calculation Engine for Canadian Waters

export interface SolunarDailyData {
  date: string;
  dayOfWeek: string;
  moonPhaseName: string;
  moonPhaseIcon: string;
  moonIlluminationPct: number;
  moonRise: string;
  moonSet: string;
  sunRise: string;
  sunSet: string;
  majorPeriod1: string; // Peak overhead feeding (~2 hrs)
  majorPeriod2: string; // Peak underfoot feeding (~2 hrs)
  minorPeriod1: string; // Moonrise feeding (~1 hr)
  minorPeriod2: string; // Moonset feeding (~1 hr)
  activityScore: number; // 0 to 100 rating
  activityRating: 'Poor' | 'Fair' | 'Good' | 'Excellent' | 'Peak Trophy Window';
  waterTempEstimatedC: number;
  bestSpeciesTarget: string[];
}

export interface FishingHotspot {
  id: string;
  name: string;
  province: string;
  provinceCode: string;
  type: 'Freshwater Lake' | 'River / Estuary' | 'Coastal Marine' | 'Boreal Shield Lake';
  lat: number;
  lon: number;
  dominantSpecies: string[];
  seasonalAdvice: string;
}

export const CANADIAN_FISHING_HOTSPOTS: FishingHotspot[] = [
  {
    id: 'spot-simcoe',
    name: 'Lake Simcoe & Cook’s Bay',
    province: 'Ontario',
    provinceCode: 'ON',
    type: 'Freshwater Lake',
    lat: 44.45,
    lon: -79.37,
    dominantSpecies: ['Yellow Perch', 'Lake Trout', 'Smallmouth Bass', 'Whitefish'],
    seasonalAdvice: 'Prime morning hard-water and spring open-water troll for lakers and jumbo perch along 30ft weed edges.',
  },
  {
    id: 'spot-fraser',
    name: 'Fraser River & Harrison Confluence',
    province: 'British Columbia',
    provinceCode: 'BC',
    type: 'River / Estuary',
    lat: 49.23,
    lon: -121.94,
    dominantSpecies: ['White Sturgeon', 'Chinook Salmon', 'Coho Salmon', 'Steelhead'],
    seasonalAdvice: 'Target deep gravel troughs during rising tides. Solunar major feed windows trigger explosive sturgeon bites.',
  },
  {
    id: 'spot-woods',
    name: 'Lake of the Woods (Clearwater / Keewatin)',
    province: 'Ontario',
    provinceCode: 'ON',
    type: 'Boreal Shield Lake',
    lat: 49.62,
    lon: -94.65,
    dominantSpecies: ['Walleye', 'Muskellunge', 'Northern Pike', 'Crappie'],
    seasonalAdvice: 'World-class Muskie trophy hunting on rocky reefs during new and full moon major moon transit periods.',
  },
  {
    id: 'spot-tobin',
    name: 'Tobin Lake (Saskatchewan River)',
    province: 'Saskatchewan',
    provinceCode: 'SK',
    type: 'Freshwater Lake',
    lat: 53.58,
    lon: -103.52,
    dominantSpecies: ['Giant Walleye', 'Trophy Northern Pike', 'Burbot'],
    seasonalAdvice: 'Nationally famous for record walleye. Focus on drop-offs right before evening minor solunar window.',
  },
  {
    id: 'spot-quinte',
    name: 'Bay of Quinte (Lake Ontario)',
    province: 'Ontario',
    provinceCode: 'ON',
    type: 'Freshwater Lake',
    lat: 44.15,
    lon: -77.30,
    dominantSpecies: ['Trophy Walleye (10lb+)', 'Largemouth Bass', 'Gar'],
    seasonalAdvice: 'Autumn night trolling along Telegraph Narrows produces monster migratory walleye.',
  },
  {
    id: 'spot-miramichi',
    name: 'Miramichi River System',
    province: 'New Brunswick',
    provinceCode: 'NB',
    type: 'River / Estuary',
    lat: 47.01,
    lon: -65.50,
    dominantSpecies: ['Atlantic Salmon', 'Striped Bass', 'Brook Trout'],
    seasonalAdvice: 'Fly fishing pools during early morning major transit coinciding with tidal slack water.',
  },
  {
    id: 'spot-slave',
    name: 'Great Slave Lake (East Arm)',
    province: 'Northwest Territories',
    provinceCode: 'NT',
    type: 'Boreal Shield Lake',
    lat: 62.45,
    lon: -114.37,
    dominantSpecies: ['Lake Trout (40lb+)', 'Arctic Grayling', 'Inconnu'],
    seasonalAdvice: 'Crystal clear cold water allows sight-fishing monster lake trout casting spoons over drop-offs.',
  },
];

export function calculateSolunarForecast(days = 7, baseDate = new Date()): SolunarDailyData[] {
  const result: SolunarDailyData[] = [];
  const moonPhases = [
    { name: 'New Moon', icon: '🌑', scoreBonus: 30, illumination: 2 },
    { name: 'Waxing Crescent', icon: '🌒', scoreBonus: 10, illumination: 18 },
    { name: 'First Quarter', icon: '🌓', scoreBonus: 15, illumination: 50 },
    { name: 'Waxing Gibbous', icon: '🌔', scoreBonus: 20, illumination: 78 },
    { name: 'Full Moon', icon: '🌕', scoreBonus: 35, illumination: 99 },
    { name: 'Waning Gibbous', icon: '🌖', scoreBonus: 20, illumination: 82 },
    { name: 'Last Quarter', icon: '🌗', scoreBonus: 15, illumination: 50 },
    { name: 'Waning Crescent', icon: '🌘', scoreBonus: 10, illumination: 14 },
  ];

  for (let i = 0; i < days; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);

    // Calculate simulated moon phase cycle
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const phaseIndex = (dayOfYear + i * 2) % moonPhases.length;
    const phase = moonPhases[phaseIndex];

    // Base activity score based on moon alignment + randomness
    const baseScore = 50 + phase.scoreBonus;
    const randomizedVariance = ((i * 7) % 15) - 5;
    const finalScore = Math.min(Math.max(baseScore + randomizedVariance, 25), 98);

    let rating: SolunarDailyData['activityRating'] = 'Fair';
    if (finalScore >= 88) rating = 'Peak Trophy Window';
    else if (finalScore >= 75) rating = 'Excellent';
    else if (finalScore >= 60) rating = 'Good';
    else if (finalScore < 40) rating = 'Poor';

    const dayName = d.toLocaleDateString('en-CA', { weekday: 'short' });
    const dateStr = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });

    // Major and Minor time windows (calculating shifting daily transit)
    const baseHourMajor1 = (6 + i * 0.8) % 12;
    const major1Start = `${Math.floor(baseHourMajor1).toString().padStart(2, '0')}:${Math.floor(
      (baseHourMajor1 % 1) * 60
    )
      .toString()
      .padStart(2, '0')} AM`;
    const major1End = `${Math.floor(baseHourMajor1 + 2).toString().padStart(2, '0')}:${Math.floor(
      (baseHourMajor1 % 1) * 60
    )
      .toString()
      .padStart(2, '0')} AM`;

    const baseHourMajor2 = (6 + i * 0.8) % 12;
    const major2Start = `${Math.floor(baseHourMajor2).toString().padStart(2, '0')}:${Math.floor(
      (baseHourMajor2 % 1) * 60
    )
      .toString()
      .padStart(2, '0')} PM`;
    const major2End = `${Math.floor(baseHourMajor2 + 2).toString().padStart(2, '0')}:${Math.floor(
      (baseHourMajor2 % 1) * 60
    )
      .toString()
      .padStart(2, '0')} PM`;

    const minor1 = `${Math.floor((baseHourMajor1 + 5.5) % 12).toString().padStart(2, '0')}:15 AM`;
    const minor2 = `${Math.floor((baseHourMajor2 + 5.5) % 12).toString().padStart(2, '0')}:45 PM`;

    result.push({
      date: dateStr,
      dayOfWeek: dayName,
      moonPhaseName: phase.name,
      moonPhaseIcon: phase.icon,
      moonIlluminationPct: phase.illumination,
      moonRise: `${Math.floor((baseHourMajor1 + 4) % 12)}:20 PM`,
      moonSet: `${Math.floor((baseHourMajor1 + 10) % 12)}:45 AM`,
      sunRise: '06:18 AM',
      sunSet: '07:44 PM',
      majorPeriod1: `${major1Start} - ${major1End}`,
      majorPeriod2: `${major2Start} - ${major2End}`,
      minorPeriod1: `${minor1} (1h)`,
      minorPeriod2: `${minor2} (1h)`,
      activityScore: finalScore,
      activityRating: rating,
      waterTempEstimatedC: 16.5 + (i % 3) * 0.4,
      bestSpeciesTarget: ['Walleye', 'Smallmouth Bass', 'Lake Trout', 'Northern Pike'],
    });
  }

  return result;
}
