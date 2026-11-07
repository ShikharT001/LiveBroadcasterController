'use client';

import React from 'react';
import { Award } from 'lucide-react';

export function SponsorBannerDisplay({ payload }) {
  if (!payload) return null;

  const {
    sponsorName = 'Apex Sports Nutrition',
    logoUrl = null,
    tagline = 'Fueling Champions Every Spike',
    subtitle = 'OFFICIAL BROADCAST PARTNER',
  } = payload;

  return (
    <div className="absolute bottom-16 right-16 flex items-center select-none font-sans drop-shadow-2xl animate-slide-up">
      <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
        {/* Brand Icon or Logo */}
        <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-amber-500/20 to-purple-600/30 border border-amber-500/30 flex items-center justify-center shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt={sponsorName} className="h-12 w-12 object-contain" />
          ) : (
            <Award className="h-8 w-8 text-amber-400" />
          )}
        </div>

        {/* Text Details */}
        <div className="pr-4 space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">
            {subtitle}
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            {sponsorName}
          </div>
          <div className="text-xs text-slate-300 font-medium max-w-xs">
            {tagline}
          </div>
        </div>
      </div>
    </div>
  );
}
