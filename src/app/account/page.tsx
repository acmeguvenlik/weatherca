'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Heart,
  Bell,
  Shield,
  LogOut,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CANADIAN_CITIES } from '@/data/canadian-cities';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, toggleFavorite } = useAuth();

  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const favoriteCities = CANADIAN_CITIES.filter((c) => user.favorites.includes(c.slug));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">My Account</span>
      </div>

      {/* User Header Profile Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950/60 to-indigo-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-xl">
            {user.avatar || '🍁'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  user.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : user.role === 'editor'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                }`}
              >
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-300">{user.email}</p>
            <p className="text-[11px] text-slate-500">Member since {user.createdAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(user.role === 'admin' || user.role === 'editor') && (
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Control Center</span>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Favorite Cities Grid */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />
              <span>My Favorite Canadian Cities</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pinned locations for quick weather checks and localized severe alerts
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white/5 text-slate-300">
            {favoriteCities.length} Saved
          </span>
        </div>

        {favoriteCities.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center space-y-3">
            <MapPin className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">No favorite cities saved yet.</p>
            <p className="text-xs text-slate-500">
              Browse Canadian cities or use search to add them to your personalized dashboard.
            </p>
            <Link
              href="/provinces"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/20"
            >
              <span>Explore Provinces</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCities.map((city) => (
              <div
                key={city.slug}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group"
              >
                <Link
                  href={`/${city.provinceCode.toLowerCase()}/${city.slug}`}
                  className="space-y-0.5 flex-1"
                >
                  <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    {city.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {city.provinceCode} • Pop: {city.population.toLocaleString()}
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/${city.provinceCode.toLowerCase()}/${city.slug}`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="View Forecast"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => toggleFavorite(city.slug)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification & Meteorological Preferences */}
      <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <span>Severe Weather Alert Subscriptions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-white">Environment Canada Red Alerts</div>
              <div className="text-slate-400">Blizzards, Tornado Warnings, Severe Thunderstorms</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-white">Sub-Zero Wind Chill Warnings</div>
              <div className="text-slate-400">Notified when Wind Chill drops below -28°C</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
