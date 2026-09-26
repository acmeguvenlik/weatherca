'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyThemeClass = (newTheme: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (newTheme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
};

const getThemeSnapshot = (): Theme => {
  try {
    const saved = localStorage.getItem('weatherca_theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore
  }
  return 'dark';
};

const getThemeServerSnapshot = (): Theme => 'dark';

const themeSubscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localTheme, setLocalTheme] = useState<Theme | null>(null);
  const storeTheme = React.useSyncExternalStore(themeSubscribe, getThemeSnapshot, getThemeServerSnapshot);
  const theme = localTheme ?? storeTheme;

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setLocalTheme(newTheme);
    applyThemeClass(newTheme);
    try {
      localStorage.setItem('weatherca_theme', newTheme);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
