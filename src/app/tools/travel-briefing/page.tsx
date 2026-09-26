import { Metadata } from 'next';
import Link from 'next/link';
import { Printer, ArrowLeft, Car, FileText } from 'lucide-react';
import { TravelBriefingReport } from '@/components/tools/TravelBriefingReport';

export const metadata: Metadata = {
  title: 'Canada Travel Weather Briefing | Printable 7-Day Road Trip & Weather PDF',
  description:
    'Generate and print custom 7-day Canadian travel weather briefings for road trips, vacations, and business journeys with route hazard matrix, precipitation probabilities, and seasonal packing guides.',
  keywords: [
    'Canada travel weather report',
    'printable weather forecast Canada',
    'road trip weather PDF Canada',
    'Toronto to Montreal highway weather',
    'Banff travel weather briefing',
  ],
};

export default function TravelBriefingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold print:hidden">
          <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <Link href="/tools/calculator" className="hover:text-sky-400 transition-colors">
            Tools &amp; Studios
          </Link>
          <span>/</span>
          <span className="text-sky-400">Travel Weather Briefing PDF Studio</span>
        </div>

        {/* Travel Briefing Interactive & Printable Component */}
        <TravelBriefingReport />
      </div>
    </div>
  );
}
