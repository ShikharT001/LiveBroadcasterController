'use client';

import React from 'react';
import { Megaphone } from 'lucide-react';

export function CustomAnnouncementBar({ payload }) {
  if (!payload) return null;

  const {
    title = 'OFFICIAL TIMEOUT',
    message = 'Technical timeout called by Head Coach Marco Rossi (Thunder Volley)',
    badgeText = 'ANNOUNCEMENT',
  } = payload;

  return (
    <div className="absolute bottom-16 left-16 right-16 flex items-stretch select-none font-sans drop-shadow-2xl animate-slide-up">
      {/* Accent gradient border */}
      <div className="w-3 rounded-l-2xl bg-gradient-to-b from-purple-500 to-indigo-600" />

      {/* Main Bar */}
      <div className="flex-1 bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 rounded-r-2xl p-5 flex items-center gap-5 shadow-2xl">
        <div className="h-12 w-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
          <Megaphone className="h-6 w-6 text-purple-400" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
              {badgeText}
            </span>
            <h3 className="text-xl font-black text-white">{title}</h3>
          </div>
          <p className="text-sm text-slate-300 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
