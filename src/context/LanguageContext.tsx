'use client';

import React, { createContext, useContext, useState } from 'react';

export type Language = 'EN' | 'FR';

export interface Translations {
  [key: string]: {
    EN: string;
    FR: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation
  nav_canada: { EN: 'Canada', FR: 'Canada' },
  nav_provinces: { EN: 'Provinces', FR: 'Provinces' },
  nav_radar: { EN: 'Live Radar', FR: 'Radar en direct' },
  nav_alerts: { EN: 'Alerts', FR: 'Alertes' },
  nav_ski: { EN: 'Ski & Snow', FR: 'Ski & Neige' },
  nav_tools: { EN: 'Tools', FR: 'Outils' },
  nav_calculator: { EN: 'Wind Chill / Humidex', FR: 'Refroidissement / Humidex' },
  nav_compare: { EN: 'Compare Cities', FR: 'Comparer les villes' },
  nav_aurora: { EN: 'Northern Lights', FR: 'Aurores Boréales' },

  // Search
  search_placeholder: { EN: 'Search Canada (e.g. Toronto, Montreal, M5V)...', FR: 'Rechercher au Canada (ex. Montréal, Québec, H2Y)...' },
  search_quick: { EN: 'Search Canada...', FR: 'Rechercher...' },

  // Common Weather
  feels_like: { EN: 'Feels like', FR: 'Température ressentie' },
  wind_chill: { EN: 'Wind Chill', FR: 'Refroidissement éolien' },
  humidex: { EN: 'Humidex', FR: 'Indice Humidex' },
  air_quality: { EN: 'Air Quality (AQHI)', FR: "Qualité de l'air (CASQ)" },
  snowfall: { EN: 'Snowfall', FR: 'Chutes de neige' },
  wind_speed: { EN: 'Wind Speed', FR: 'Vitesse du vent' },
  humidity: { EN: 'Humidity', FR: 'Humidité' },
  forecast_14d: { EN: '14-Day Trend', FR: 'Tendance 14 jours' },
  hourly_forecast: { EN: '48-Hour Hourly', FR: 'Heure par heure (48h)' },
  history_normals: { EN: 'Climate Normals', FR: 'Normales climatiques' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getLanguageSnapshot = (): Language => {
  try {
    const saved = localStorage.getItem('weatherca_lang');
    if (saved === 'EN' || saved === 'FR') return saved;
  } catch {
    // ignore
  }
  return 'EN';
};

const getLanguageServerSnapshot = (): Language => 'EN';

const languageSubscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localLang, setLocalLang] = useState<Language | null>(null);
  const storeLang = React.useSyncExternalStore(languageSubscribe, getLanguageSnapshot, getLanguageServerSnapshot);
  const language = localLang ?? storeLang;

  const setLanguage = (newLang: Language) => {
    setLocalLang(newLang);
    try {
      localStorage.setItem('weatherca_lang', newLang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const next: Language = language === 'EN' ? 'FR' : 'EN';
    setLanguage(next);
  };

  const t = (key: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
