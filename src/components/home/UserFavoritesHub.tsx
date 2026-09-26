'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  Plus,
  Trash2,
  ExternalLink,
  Bell,
  BellRing,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { getProvinceByCode } from '@/data/provinces';

interface FavoriteCityItem {
  slug: string;
  name: string;
  province: string;
  provinceCode: string;
  temp: number;
  condition: string;
  icon: string;
}

const DEFAULT_FAVORITES: FavoriteCityItem[] = [
  { slug: 'toronto', name: 'Toronto', province: 'Ontario', provinceCode: 'ON', temp: 22, condition: 'Partly Cloudy', icon: '⛅' },
  { slug: 'vancouver', name: 'Vancouver', province: 'British Columbia', provinceCode: 'BC', temp: 18, condition: 'Mild Rain', icon: '🌧️' },
  { slug: 'montreal', name: 'Montréal', province: 'Quebec', provinceCode: 'QC', temp: 21, condition: 'Sunny', icon: '☀️' },
  { slug: 'calgary', name: 'Calgary', province: 'Alberta', provinceCode: 'AB', temp: 19, condition: 'Clear', icon: '☀️' },
];

export function UserFavoritesHub() {
  const [favorites, setFavorites] = useState<FavoriteCityItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('weatherca_user_favorites');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_FAVORITES;
  });

  const [notificationStatus, setNotificationStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationStatus(Notification.permission as 'default' | 'granted' | 'denied');
    }
  }, []);

  const saveFavorites = (items: FavoriteCityItem[]) => {
    setFavorites(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('weatherca_user_favorites', JSON.stringify(items));
    }
  };

  const removeFavorite = (slug: string) => {
    const next = favorites.filter((f) => f.slug !== slug);
    saveFavorites(next);
  };

  const addFavorite = (city: (typeof CANADIAN_CITIES)[0]) => {
    if (favorites.some((f) => f.slug === city.slug)) return;
    const prov = getProvinceByCode(city.provinceCode);
    const item: FavoriteCityItem = {
      slug: city.slug,
      name: city.name,
      province: prov?.name || city.provinceCode,
      provinceCode: city.provinceCode,
      temp: 20,
      condition: 'Sunny',
      icon: '☀️',
    };
    saveFavorites([...favorites, item]);
    setShowAddModal(false);
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Your browser does not support Web Notifications.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        new Notification('WeatherCA Canada Alerts Active', {
          body: 'You are now subscribed to severe weather warnings across Canada.',
          icon: '/favicon.ico',
        });
        setTestNotificationSent(true);
      }
    } catch {
      // ignore
    }
  };

  const filteredCities = CANADIAN_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provinceCode.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/10 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>My Weather Hub &amp; Pinned Cities</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {favorites.length} Saved
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Quick access dashboard with instant telemetry and browser push alerts
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {notificationStatus !== 'granted' ? (
            <button
              onClick={requestNotificationPermission}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Push Alerts</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Alerts Active</span>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Pin Location</span>
          </button>
        </div>
      </div>

      {/* Grid of Favorite Location Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {favorites.map((fav) => (
          <div
            key={fav.slug}
            className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between group relative overflow-hidden shadow-lg hover:shadow-sky-500/10"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-black text-white group-hover:text-sky-400 transition-colors">
                    {fav.name}
                  </h4>
                  <div className="text-xs text-slate-400 font-semibold">{fav.province}</div>
                </div>
                <button
                  onClick={() => removeFavorite(fav.slug)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors opacity-80 group-hover:opacity-100"
                  title="Unpin location"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Temperature & Condition */}
              <div className="flex items-center gap-3 my-3">
                <span className="text-3xl">{fav.icon}</span>
                <div>
                  <div className="text-2xl font-black text-white">{fav.temp}°C</div>
                  <div className="text-[11px] text-slate-300 font-medium">{fav.condition}</div>
                </div>
              </div>
            </div>

            {/* Link to Full City Forecast */}
            <Link
              href={`/${fav.province.toLowerCase().replace(/\s+/g, '-')}/${fav.slug}`}
              className="mt-2 text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center justify-between pt-2 border-t border-white/5"
            >
              <span>Full 14-Day Outlook</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      {/* Modal to add more cities */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-black text-white">Pin Canadian Settlement</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Close
              </button>
            </div>

            <input
              type="text"
              placeholder="Type city or province (e.g., Ottawa, Banff)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />

            <div className="max-h-60 overflow-y-auto space-y-1.5 no-scrollbar">
              {filteredCities.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => addFavorite(city)}
                  className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/5 text-left flex items-center justify-between text-xs font-bold text-white transition-colors"
                >
                  <span>
                    {city.name}, <span className="text-slate-400 font-normal">{city.provinceCode}</span>
                  </span>
                  <Plus className="w-4 h-4 text-sky-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
