export type AdNetworkType =
  | 'google_adsense'
  | 'google_ad_manager'
  | 'prebid_header_bidding'
  | 'direct_sponsor'
  | 'affiliate_partner'
  | 'custom_html';

export type AdDeviceTarget = 'all' | 'desktop' | 'tablet' | 'mobile';

export type WeatherTriggerCondition =
  | 'any'
  | 'temp_below_zero'
  | 'temp_above_30'
  | 'snow_falling'
  | 'rain_storm'
  | 'high_aqhi_smoke'
  | 'severe_weather_alert'
  | 'aurora_active';

export interface WeatherTriggerRule {
  enabled: boolean;
  condition: WeatherTriggerCondition;
  description: string;
  customThreshold?: number;
}

export interface AdSlotConfig {
  id: string;
  name: string;
  slotKey: string;
  category: 'header' | 'sidebar' | 'in_article' | 'radar' | 'highways' | 'footer' | 'interstitial';
  dimensions: string;
  placement: string;
  type: AdNetworkType;
  enabled: boolean;
  cpm: number;
  monthlyImpressions: number;
  revenueEst: number;
  customCode: string;
  targetDevice: AdDeviceTarget;
  geoTargetProvinces: string[]; // e.g. ['ALL'] or ['ON', 'QC', 'BC', 'AB']
  weatherTrigger: WeatherTriggerRule;
  refreshIntervalSec: number; // 0 = no refresh, 30, 60, 90
  lazyLoad: boolean;
  priorityWeight: number; // 1 to 10
  fallbackHtml?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DirectCampaign {
  id: string;
  advertiser: string;
  campaignName: string;
  slotKey: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired' | 'paused';
  budgetCAD: number;
  cpm: number;
  clicks: number;
  impressions: number;
  maxImpressions: number;
  bannerImageUrl?: string;
  clickUrl: string;
  htmlCreative?: string;
  targetProvinces: string[];
  weatherTrigger: WeatherTriggerRule;
  createdAt: string;
}

export interface GlobalAdSettings {
  masterAdsEnabled: boolean;
  publisherId: string;
  headerBiddingEnabled: boolean;
  adblockFallbackEnabled: boolean;
  adblockFallbackText: string;
  autoAdsEnabled: boolean;
  refreshVisibleSlots: boolean;
  lazyLoadOffsetPx: number;
  cmpProvider: string;
  adsTxtContent: string;
}
