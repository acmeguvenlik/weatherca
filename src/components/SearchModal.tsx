'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Navigation, X, Sparkles, Building2 } from 'lucide-react';
import { searchCanadianCities, CANADIAN_CITIES } from '@/data/canadian-cities';
import { getProvinceByCode } from '@/data/provinces';
import { CanadianCity } from '@/types/weather';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(() => {
    if (query.trim().length > 0) {
      return searchCanadianCities(query, 12);
    }
    return [];
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectCity = (city: CanadianCity) => {
    const prov = getProvinceByCode(city.provinceCode);
    const provSlug = prov ? prov.slug : city.provinceCode.toLowerCase();
    router.push(`/${provSlug}/${city.slug}`);
    onClose();
  };

  // Find nearest Canadian city using Haversine distance
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearestCity = CANADIAN_CITIES[0];
        let minDistance = Infinity;

        for (const city of CANADIAN_CITIES) {
          const dLat = (city.lat - latitude) * (Math.PI / 180);
          const dLon = (city.lon - longitude) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude * (Math.PI / 180)) *
              Math.cos(city.lat * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = 6371 * c; // in km

          if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
          }
        }

        setIsLocating(false);
        handleSelectCity(nearestCity);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve your location. Please search manually.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 pb-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl text-slate-800 dark:text-slate-100 my-auto sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-white/10 gap-3 bg-slate-50/80 dark:bg-transparent">
          <Search className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any Canadian city, town or postal code (e.g. Toronto, Banff, M5V)..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/70 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Action: Use Geolocation */}
        <div className="px-4 py-2.5 bg-sky-50 dark:bg-sky-500/10 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between">
          <button
            onClick={handleGeolocation}
            disabled={isLocating}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 transition-colors"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating nearest Canadian city...' : 'Use My Current Location'}</span>
          </button>
          <span className="text-[11px] text-sky-600/80 dark:text-sky-400/70 font-mono hidden sm:inline">
            Canada HRDPS GPS
          </span>
        </div>

        {/* Search Results List */}
        <div className="max-h-[55dvh] sm:max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-white/5">
          {results.length > 0 ? (
            results.map((city: CanadianCity) => {
              const prov = getProvinceByCode(city.provinceCode);
              return (
                <button
                  key={`${city.provinceCode}-${city.slug}`}
                  onClick={() => handleSelectCity(city)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                        {city.name}
                        {city.nameFr && city.nameFr !== city.name && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                            ({city.nameFr})
                          </span>
                        )}
                        {city.isCapital && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            Capital
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{prov?.name || city.provinceCode}</span>
                        <span>•</span>
                        <span>Pop: {city.population.toLocaleString()}</span>
                        {city.postalCodePrefix && city.postalCodePrefix.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400/80">
                              {city.postalCodePrefix.slice(0, 3).join(', ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-slate-600 dark:text-slate-400 font-mono px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:border-slate-300 dark:group-hover:border-white/20 shrink-0">
                    {city.provinceCode}
                  </span>
                </button>
              );
            })
          ) : query.trim().length > 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No matching Canadian locations found for{' '}
              <span className="text-slate-900 dark:text-white font-semibold">&quot;{query}&quot;</span>.
              Try searching by city name or province (e.g. Ontario, Calgary, M5V).
            </div>
          ) : (
            <div className="p-3 sm:p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Popular Canadian Hubs
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CANADIAN_CITIES.filter((c) => c.featured)
                  .slice(0, 9)
                  .map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => handleSelectCity(c)}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/5 text-left transition-all group"
                    >
                      <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors truncate">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{c.provinceCode}</div>
                    </button>
                  ))}
              </div>

              {/* Canadian Postal Code (FSA) Chips */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 mb-2 flex items-center gap-1.5">
                  <span className="text-sky-600 dark:text-sky-400 font-mono">FSA</span>
                  <span>Quick Postal Code Lookup</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { fsa: 'M5V', city: 'Toronto Downtown' },
                    { fsa: 'V6B', city: 'Vancouver Yaletown' },
                    { fsa: 'T2P', city: 'Calgary Downtown' },
                    { fsa: 'H3A', city: 'Montréal Downtown' },
                    { fsa: 'K1P', city: 'Ottawa Downtown' },
                    { fsa: 'B3J', city: 'Halifax Waterfront' },
                    { fsa: 'R3C', city: 'Winnipeg Downtown' },
                  ].map((chip) => (
                    <button
                      key={chip.fsa}
                      onClick={() => setQuery(chip.fsa)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 dark:bg-white/5 dark:hover:bg-sky-500/20 border border-slate-200 dark:border-white/5 hover:border-sky-300 dark:hover:border-sky-500/30 text-xs text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 transition-all font-mono"
                    >
                      <strong className="text-slate-900 dark:text-white">{chip.fsa}</strong>{' '}
                      <span className="text-slate-500 text-[10px] hidden sm:inline">({chip.city})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
