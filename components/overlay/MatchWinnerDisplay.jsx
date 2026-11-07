'use client';

import React from 'react';
import { Trophy, Award } from 'lucide-react';

export function MatchWinnerDisplay({ payload }) {
  if (!payload) return null;

  const {
    winnerName = 'Thunder Volley',
    winnerColor = '#dc2626',
    finalScoreText = '3 - 1 (Sets)',
    tournamentTitle = 'VOLLEYBALL NATIONAL CHAMPIONSHIP',
    runnerUpName = 'Cyclone Spikers',
  } = payload;

  return (
    <div className="absolute inset-0 flex items-center justify-center select-none font-sans drop-shadow-2xl animate-slide-up">
      <div className="w-full max-w-2xl bg-slate-950/95 backdrop-blur-2xl border-2 border-amber-500/50 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden">
        {/* Golden celebratory glow background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
          <Trophy className="h-10 w-10 text-black" />
        </div>

        <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-2">
          {tournamentTitle} &bull; MATCH WINNER
        </div>

        <h1
          className="text-5xl font-black tracking-tight my-2"
          style={{ color: winnerColor }}
        >
          {winnerName}
        </h1>

        <div className="text-2xl font-black text-white font-mono tracking-wider my-4">
          FINAL RESULT: {finalScoreText}
        </div>

        {runnerUpName && (
          <div className="text-xs text-slate-400 border-t border-slate-800 pt-4 mt-6">
            Runner Up: <span className="font-semibold text-slate-200">{runnerUpName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
