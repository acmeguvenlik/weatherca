'use client';

import React, { useState, useEffect } from 'react';
import { AdSlotConfig, WeatherTriggerCondition } from '@/types/ads';
import { ShieldCheck, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';

interface AdBannerProps {
  slotKey: string;
  className?: string;
  currentTemp?: number;
  currentCondition?: string;
  currentAqhi?: number;
  currentProvince?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotKey,
  className = '',
  currentTemp,
  currentCondition,
  currentAqhi,
  currentProvince = 'ALL',
}) => {
  const [slot, setSlot] = useState<AdSlotConfig | null>(null);
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [adBlocked, setAdBlocked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('weatherca_ads_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.masterAdsEnabled === 'boolean') {
          setMasterEnabled(parsed.masterAdsEnabled);
        }
        if (Array.isArray(parsed.slots)) {
          const match = parsed.slots.find((s: AdSlotConfig) => s.slotKey === slotKey);
          if (match) {
            setSlot(match);
          }
        }
      }
    } catch {
      // ignore
    }
  }, [slotKey]);

  if (!isMounted || !masterEnabled) return null;
  if (!slot || !slot.enabled) return null;

  // Check Geo-Targeting
  if (
    slot.geoTargetProvinces &&
    !slot.geoTargetProvinces.includes('ALL') &&
    currentProvince !== 'ALL' &&
    !slot.geoTargetProvinces.includes(currentProvince)
  ) {
    return null;
  }

  // Check Weather Triggers
  if (slot.weatherTrigger && slot.weatherTrigger.enabled) {
    const cond = slot.weatherTrigger.condition;
    if (cond === 'temp_below_zero' && typeof currentTemp === 'number' && currentTemp >= 0) {
      return null;
    }
    if (cond === 'temp_above_30' && typeof currentTemp === 'number' && currentTemp <= 30) {
      return null;
    }
    if (cond === 'high_aqhi_smoke' && typeof currentAqhi === 'number' && currentAqhi < 4) {
      return null;
    }
    if (
      cond === 'snow_falling' &&
      currentCondition &&
      !currentCondition.toLowerCase().includes('snow')
    ) {
      return null;
    }
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl p-4 text-center my-6 shadow-xl ${className}`}
    >
      <div className="flex items-center justify-between text-[10px] uppercase font-mono text-slate-500 mb-2 border-b border-white/5 pb-1">
        <span className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>Sponsored Weather Telemetry</span>
        </span>
        <span className="text-[9px] text-slate-500">{slot.dimensions}</span>
      </div>

      {/* Ad Content Container */}
      <div className="flex items-center justify-center min-h-[90px] w-full">
        {slot.customCode ? (
          <div
            dangerouslySetInnerHTML={{ __html: slot.customCode }}
            className="w-full flex items-center justify-center overflow-hidden"
          />
        ) : (
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/20 text-sky-200 text-xs font-semibold">
            {slot.name} Active Insertion Point
          </div>
        )}
      </div>

      <div className="mt-2 text-[9px] text-slate-500 flex items-center justify-between">
        <span>Verified Partner</span>
        <span className="text-slate-600 font-mono">WeatherCA Ads ID: {slot.slotKey}</span>
      </div>
    </div>
  );
};
