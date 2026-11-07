'use client';

import React from 'react';
import { User, Zap, Shield, Flame } from 'lucide-react';

export function PlayerIntroCard({ payload }) {
  if (!payload) return null;

  const {
    playerName = 'Alex Rivera',
    jerseyNumber = 7,
    position = 'Setter',
    teamName = 'Thunder Volley',
    teamColor = '#dc2626',
    photoUrl = null,
    showStats = true,
    stats = null,
  } = payload;

  // Extract individual volleyball stats with fallbacks
  const kills = payload.kills !== undefined ? payload.kills : (stats?.Kills ?? stats?.kills ?? 0);
  const aces = payload.aces !== undefined ? payload.aces : (stats?.Aces ?? stats?.aces ?? 0);
  const blocks = payload.blocks !== undefined ? payload.blocks : (stats?.Blocks ?? stats?.blocks ?? 0);

  return (
    <div className="absolute bottom-16 left-16 flex items-stretch max-w-xl select-none font-sans drop-shadow-2xl animate-slide-up">
      {/* Team Color Accent Bar */}
      <div className="w-3 rounded-l-2xl shadow-lg" style={{ backgroundColor: teamColor }} />

      {/* Main Lower-Third Card */}
      <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-r-2xl p-5 flex items-center gap-5 shadow-2xl">
        {/* Player Photo or Silhouette Badge */}
        <div className="relative">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={playerName}
              className="h-24 w-24 rounded-xl object-cover border-2 border-slate-600 bg-slate-900"
            />
          ) : (
            <div
              className="h-24 w-24 rounded-xl flex items-center justify-center border-2 border-slate-700/80 shadow-inner"
              style={{ backgroundColor: `${teamColor}22` }}
            >
              <User className="h-12 w-12 text-slate-300" />
            </div>
          )}

          {/* Jersey Number Tag */}
          <div
            className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md font-mono font-black text-white text-base shadow-lg border border-black/40"
            style={{ backgroundColor: teamColor }}
          >
            #{jerseyNumber}
          </div>
        </div>

        {/* Player Info & Stats */}
        <div className="flex-1 space-y-1.5">
          <div className="text-xs font-bold tracking-widest uppercase text-slate-400">
            {teamName} &bull; <span className="text-purple-400">{position}</span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight leading-none">
            {playerName}
          </h2>

          {/* Volleyball Match Performance Stats: Kills, Aces, Blocks */}
          {showStats && (
            <div className="flex items-center gap-3 pt-2 mt-1 border-t border-slate-800">
              {/* Kills Badge */}
              <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-800/60 px-2.5 py-1 rounded-md">
                <Flame className="h-3.5 w-3.5 text-red-400" />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Kills:</span>
                <span className="text-sm font-black font-mono text-red-300">{kills}</span>
              </div>

              {/* Aces Badge */}
              <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-md">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Aces:</span>
                <span className="text-sm font-black font-mono text-amber-300">{aces}</span>
              </div>

              {/* Blocks Badge */}
              <div className="flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-md">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Blocks:</span>
                <span className="text-sm font-black font-mono text-cyan-300">{blocks}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
