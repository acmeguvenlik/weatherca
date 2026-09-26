'use client';

import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMounted } from '@/lib/useMounted';

export const BroadcastBanner: React.FC = () => {
  const { broadcastAlert } = useAuth();
  const [dismissed, setDismissed] = React.useState(false);
  const mounted = useMounted();

  if (!mounted || !broadcastAlert || !broadcastAlert.active || dismissed) {
    return null;
  }

  const isWarning = broadcastAlert.severity === 'warning';
  const isWatch = broadcastAlert.severity === 'watch';

  return (
    <div
      className={`w-full py-2 px-4 text-xs font-bold transition-all flex items-center justify-between gap-3 z-50 ${
        isWarning
          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
          : isWatch
          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
          : 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2.5 flex-1 truncate">
        <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
        <span className="truncate">{broadcastAlert.message}</span>
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/20 text-white shrink-0">
          {broadcastAlert.issuedAt}
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-black/20 rounded-lg text-white/80 hover:text-white transition-colors"
        title="Dismiss Alert Banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
