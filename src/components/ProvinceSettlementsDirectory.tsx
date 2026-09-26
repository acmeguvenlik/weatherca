'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, ChevronLeft, Building2 } from 'lucide-react';
export interface SettlementLite {
  slug: string;
  name: string;
  provinceCode: string;
  isCapital?: boolean;
  featured?: boolean;
  population?: number;
  postalCodePrefix?: string[];
}

interface ProvinceSettlementsDirectoryProps {
  provinceName: string;
  provinceSlug: string;
  provinceCode: string;
  settlements: SettlementLite[];
  totalCount?: number;
}

const SETTLEMENTS_PER_PAGE = 48;

export function ProvinceSettlementsDirectory({
  provinceName,
  provinceSlug,
  provinceCode: _provinceCode,
  settlements,
  totalCount,
}: ProvinceSettlementsDirectoryProps) {
  const displayTotal = totalCount || settlements.length;
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Available Alphabetical Letters
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    settlements.forEach((s) => {
      const firstChar = s.name.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar);
      }
    });
    return Array.from(letters).sort();
  }, [settlements]);

  // Filtered settlements
  const filteredSettlements = useMemo(() => {
    const q = search.trim().toLowerCase();
    return settlements.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.postalCodePrefix?.some((fsa: string) => fsa.toLowerCase().startsWith(q));

      const matchesLetter =
        selectedLetter === 'ALL' ||
        s.name.charAt(0).toUpperCase() === selectedLetter;

      return matchesSearch && matchesLetter;
    });
  }, [settlements, search, selectedLetter]);

  const totalPages = Math.ceil(filteredSettlements.length / SETTLEMENTS_PER_PAGE) || 1;
  const paginated = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * SETTLEMENTS_PER_PAGE;
    return filteredSettlements.slice(start, start + SETTLEMENTS_PER_PAGE);
  }, [filteredSettlements, currentPage, totalPages]);

  return (
    <div className="space-y-6 rounded-3xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>
              All {provinceName} Municipalities, Towns &amp; Settlements ({displayTotal.toLocaleString()})
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Browse complete weather telemetry and 14-day forecasts for every community and weather station across {provinceName}.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${provinceName} communities, towns, FSA codes...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-80"
          />
        </div>
      </div>

      {/* A-Z Alphabet Filter Strip */}
      <div className="flex flex-wrap items-center gap-1.5 py-1">
        <button
          onClick={() => setSelectedLetter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedLetter === 'ALL'
              ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          All ({displayTotal.toLocaleString()})
        </button>

        {availableLetters.map((letter) => {
          const isSelected = selectedLetter === letter;
          return (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                isSelected
                  ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Filter Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span>
          Showing <strong className="text-slate-800 dark:text-white">{filteredSettlements.length.toLocaleString()}</strong> of{' '}
          <strong className="text-slate-800 dark:text-white">{settlements.length.toLocaleString()}</strong> locations
        </span>
        {totalPages > 1 && (
          <span>
            Page <strong className="text-slate-800 dark:text-white">{currentPage}</strong> of <strong className="text-slate-800 dark:text-white">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Settlements Grid */}
      {filteredSettlements.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-2">
          <MapPin className="w-8 h-8 mx-auto text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-white">No settlements matched &quot;{search}&quot;</p>
          <p className="text-xs text-slate-500">Try clearing the search box or selecting another letter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {paginated.map((item) => (
            <Link
              key={`${item.provinceCode}-${item.slug}`}
              href={`/${provinceSlug}/${item.slug}`}
              className="p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] hover:bg-sky-50/80 dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/5 hover:border-sky-300 dark:hover:border-sky-500/40 transition-all group flex items-center justify-between shadow-sm dark:shadow-none"
            >
              <div className="truncate pr-2">
                <div className="font-semibold text-xs text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors truncate flex items-center gap-1.5">
                  <span className="truncate">{item.name}</span>
                  {item.isCapital && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[9px] font-bold border border-amber-500/30 shrink-0">
                      Cap
                    </span>
                  )}
                  {item.featured && (
                    <span className="px-1.5 py-0.2 rounded bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[9px] font-bold border border-sky-500/30 shrink-0">
                      Metro
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  {typeof item.population === 'number' && item.population > 0 && (
                    <span>Pop: {item.population.toLocaleString()}</span>
                  )}
                  {item.postalCodePrefix && item.postalCodePrefix.length > 0 && (
                    <span className="font-mono text-slate-400 dark:text-slate-500">
                      FSA: {item.postalCodePrefix[0]}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing {(currentPage - 1) * SETTLEMENTS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * SETTLEMENTS_PER_PAGE, filteredSettlements.length)} of{' '}
            {filteredSettlements.length} communities
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                currentPage === 1
                  ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-white/10 hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = currentPage === pageNum;

              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-md shadow-sky-500/30'
                        : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <span key={pageNum} className="px-1 text-slate-400 dark:text-slate-600 text-xs">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                currentPage === totalPages
                  ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-white/10 hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
