'use client';

import React, { createContext, useContext, useState } from 'react';

type TemperatureUnit = 'C' | 'F';

interface UnitContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
  formatTemp: (celsius: number) => string;
  convertTemp: (celsius: number) => number;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

const getUnitSnapshot = (): TemperatureUnit => {
  try {
    const saved = localStorage.getItem('weatherca_unit');
    if (saved === 'C' || saved === 'F') return saved;
  } catch {
    // ignore
  }
  return 'C';
};

const getUnitServerSnapshot = (): TemperatureUnit => 'C';

const unitSubscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localUnit, setLocalUnit] = useState<TemperatureUnit | null>(null);
  const storeUnit = React.useSyncExternalStore(unitSubscribe, getUnitSnapshot, getUnitServerSnapshot);
  const unit = localUnit ?? storeUnit;

  const setUnit = (newUnit: TemperatureUnit) => {
    setLocalUnit(newUnit);
    try {
      localStorage.setItem('weatherca_unit', newUnit);
    } catch {
      // ignore
    }
  };

  const toggleUnit = () => {
    const next: TemperatureUnit = unit === 'C' ? 'F' : 'C';
    setUnit(next);
  };

  const convertTemp = (celsius: number): number => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const formatTemp = (celsius: number): string => {
    return `${convertTemp(celsius)}°${unit}`;
  };

  return (
    <UnitContext.Provider value={{ unit, setUnit, toggleUnit, formatTemp, convertTemp }}>
      {children}
    </UnitContext.Provider>
  );
};

export function useUnit() {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
}
