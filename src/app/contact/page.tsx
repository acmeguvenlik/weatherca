'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, MapPin, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { PROVINCE_LIST } from '@/data/provinces';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    province: 'ON',
    subject: 'General Meteorological Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
        <Link href="/" className="hover:underline">
          Canada
        </Link>
        <span>/</span>
        <span className="text-slate-300">Contact & Meteorological Inquiries</span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950/60 to-indigo-950/70 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-300">
          <MessageSquare className="w-3.5 h-3.5" />
          Reach Our Atmospheric Specialists
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-200">WeatherCA</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Questions regarding Canadian climate normals, extreme storm reports, municipal API feeds, or media inquiries? Our meteorological team is on call.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 rounded-3xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Dispatched Successfully</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you for contacting WeatherCA. Our on-duty Canadian meteorologist or support engineer will reply to {formData.email} within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Mitchell"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@domain.ca"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Province or Territory</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  >
                    {PROVINCE_LIST.map((p) => (
                      <option key={p.code} value={p.code} className="bg-slate-900 text-white">
                        {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Inquiry Department</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                  >
                    <option value="General Inquiry">General Weather Inquiry</option>
                    <option value="Severe Weather Report">Severe Weather & Storm Eyewitness Report</option>
                    <option value="API & Commercial Data">API & Commercial Developer Access</option>
                    <option value="Media & Press">Media & Press Inquiries</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Message / Observation Details</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide detailed meteorological questions or location observation notes..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
              >
                <span>Dispatch Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Office Locations & Support Info */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
              <MapPin className="w-4 h-4" />
              <span>Toronto Hub</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              100 University Avenue, Suite 1400<br />
              Toronto, ON M5J 1V6, Canada
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              ops@weatherca.net
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <MapPin className="w-4 h-4" />
              <span>Montréal Bureau</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              1000 Rue De La Gauchetière Ouest<br />
              Montréal, QC H3B 4W5, Canada
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              meteo@weatherca.net
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
