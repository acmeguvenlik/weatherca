'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { CityFaqItem } from '@/lib/city-faq';

interface CityFaqSectionProps {
  cityName: string;
  provinceName: string;
  faqs: CityFaqItem[];
}

export const CityFaqSection: React.FC<CityFaqSectionProps> = ({
  cityName,
  provinceName,
  faqs,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm shadow-sm">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Weather Questions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Climate normals, seasonal patterns, and observation data for {cityName}, {provinceName}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>SEO Verified</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? 'bg-white dark:bg-slate-900/90 border-sky-400/40 dark:border-sky-500/30 shadow-md shadow-sky-500/5'
                  : 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
