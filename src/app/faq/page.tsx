'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does WeatherCA calculate Canadian Wind Chill?',
    answer:
      'We use the official 2001 Environment Canada formula. Wind Chill is not an actual temperature that can be measured on a thermometer; rather, it represents the rate of convective heat loss from exposed human skin and equates it to what temperature would produce that same loss under calm conditions.',
  },
  {
    question: 'What models and radar data sources power the forecasts?',
    answer:
      'Our atmospheric data is ingested from Environment and Climate Change Canada (ECCC) High-Resolution Deterministic Prediction System (HRDPS 2.5km) combined with live dual-polarization S-Band and C-Band radar feeds from MSC GeoMet across 31 national radar sites.',
  },
  {
    question: 'Can I view temperatures in Fahrenheit (°F) instead of Celsius (°C)?',
    answer:
      'Yes! WeatherCA features a global temperature unit switcher located in the top navigation bar. When you click °C / °F, all temperatures, hourly forecasts, 14-day trends, ski resort reports, and wind chill indexes instantly convert across all pages and persist in your browser.',
  },
  {
    question: 'What is the Air Quality Health Index (AQHI)?',
    answer:
      'The AQHI is a Canadian scale from 1 to 10+ indicating the health risk associated with local air quality. Unlike standard AQI, Canada AQHI assesses the cumulative risk of three key pollutants simultaneously: Ground-level Ozone (O3), Fine Particulate Matter (PM2.5), and Nitrogen Dioxide (NO2).',
  },
  {
    question: 'How frequently are severe weather warnings updated?',
    answer:
      'Severe weather statements, watches, and warnings issued by Environment Canada are polled and validated every 2 to 5 minutes via the national Common Alerting Protocol (CAP-CP) feed, triggering real-time alert banners on affected municipality pages.',
  },
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // Schema.org FAQPage JSON-LD
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Frequently Asked Questions</span>
      </div>

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/60 to-indigo-950/70 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-300">
          <HelpCircle className="w-3.5 h-3.5" />
          Canadian Weather Help Center
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-200">Questions</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Common inquiries about Canadian climate indexes, radar updates, unit conversions, and our high-resolution forecast models.
        </p>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white/[0.05] border border-white/10 overflow-hidden transition-all backdrop-blur-xl"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-sky-300 transition-colors"
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
