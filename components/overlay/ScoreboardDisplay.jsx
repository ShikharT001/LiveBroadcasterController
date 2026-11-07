'use client';

import React from 'react';

export function ScoreboardDisplay({ match, visible = true, size = 'normal', position = 'top-left' }) {
  if (!visible) return null;

  const teamA = match?.teamA || { name: 'Thunder Volley', code: 'THU', color: '#dc2626', score: 0, sets: 0 };
  const teamB = match?.teamB || { name: 'Cyclone Spikers', code: 'CYC', color: '#2563eb', score: 0, sets: 0 };
  const currentSet = match?.currentSet || 1;
  const servingTeam = match?.servingTeam || 'A';
  const tournament = match?.tournament || 'CHAMPIONSHIP FINALS';

  // Position mapping
  const positionClasses = {
    'top-left': 'top-10 left-12',
    'top-center': 'top-10 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-12 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-12 left-12',
  }[position] || 'top-10 left-12';

  // Sizing styles
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <div
      className={`absolute ${positionClasses} flex flex-col drop-shadow-2xl select-none font-sans transition-all duration-300 animate-slide-down ${
        isSmall ? 'scale-75 origin-top-left' : isLarge ? 'scale-125 origin-top-left' : 'scale-100'
      }`}
    >
      {/* Top Header Strip */}
      <div className="flex items-center justify-between bg-black/90 backdrop-blur-md px-3.5 py-1 rounded-t-xl border-t border-l border-r border-slate-700/80 text-[11px] font-bold tracking-wider">
        <span className="text-purple-400 font-mono uppercase">{tournament}</span>
        <span className="text-amber-400 font-mono ml-4">SET {currentSet}</span>
      </div>

      {/* Main Scoreboard Container */}
      <div className="flex items-stretch bg-slate-950/95 backdrop-blur-xl rounded-b-xl border border-slate-700/80 overflow-hidden shadow-2xl">
        {/* TEAM A BAR */}
        <div className="flex items-center">
          {/* Color tab */}
          <div className="w-3 self-stretch" style={{ backgroundColor: teamA.color }} />

          {/* Team code & serve dot */}
          <div className="px-4 py-2 flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-wider font-mono">{teamA.code}</span>
            {servingTeam === 'A' && (
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-amber-300 animate-pulse" />
            )}
          </div>

          {/* Sets won */}
          <div className="bg-slate-900/90 px-3 py-2 text-sm font-bold text-slate-300 border-l border-r border-slate-800">
            {teamA.sets}
          </div>

          {/* Current set score */}
          <div className="bg-slate-900/40 px-5 py-2 text-3xl font-black text-white font-mono min-w-[58px] text-center">
            {teamA.score}
          </div>
        </div>

        {/* VS / Set Divider */}
        <div className="w-px bg-slate-700/60 self-stretch" />

        {/* TEAM B BAR */}
        <div className="flex items-center">
          {/* Current set score */}
          <div className="bg-slate-900/40 px-5 py-2 text-3xl font-black text-white font-mono min-w-[58px] text-center">
            {teamB.score}
          </div>

          {/* Sets won */}
          <div className="bg-slate-900/90 px-3 py-2 text-sm font-bold text-slate-300 border-l border-r border-slate-800">
            {teamB.sets}
          </div>

          {/* Team code & serve dot */}
          <div className="px-4 py-2 flex items-center gap-2">
            {servingTeam === 'B' && (
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-amber-300 animate-pulse" />
            )}
            <span className="text-xl font-black text-white tracking-wider font-mono">{teamB.code}</span>
          </div>

          {/* Color tab */}
          <div className="w-3 self-stretch" style={{ backgroundColor: teamB.color }} />
        </div>
      </div>
    </div>
  );
}
