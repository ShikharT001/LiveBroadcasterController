'use client';

import React from 'react';

export function SetResultsCard({ payload }) {
  if (!payload) return null;

  const {
    matchTitle = 'National Volleyball Championship — Semifinal 1',
    teamAName = 'Thunder Volley',
    teamBName = 'Cyclone Spikers',
    teamAColor = '#dc2626',
    teamBColor = '#2563eb',
    sets = [
      { setNumber: 1, scoreA: 25, scoreB: 21, winner: 'A' },
      { setNumber: 2, scoreA: 22, scoreB: 25, winner: 'B' },
      { setNumber: 3, scoreA: 25, scoreB: 23, winner: 'A' },
      { setNumber: 4, scoreA: 25, scoreB: 19, winner: 'A' },
    ],
    teamASetsWon = 3,
    teamBSetsWon = 1,
  } = payload;

  return (
    <div className="absolute inset-0 flex items-center justify-center select-none font-sans drop-shadow-2xl animate-slide-up">
      <div className="w-full max-w-2xl bg-slate-950/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="text-center space-y-1 mb-6 border-b border-slate-800 pb-4">
          <div className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">
            SET RESULTS & STATISTICAL BREAKDOWN
          </div>
          <h2 className="text-xl font-black text-white">{matchTitle}</h2>
        </div>

        {/* Teams Head-to-Head Header */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-10 rounded-full" style={{ backgroundColor: teamAColor }} />
            <div>
              <div className="text-lg font-black text-white">{teamAName}</div>
              <div className="text-xs text-slate-400 font-mono">Sets: <span className="font-bold text-red-400 text-sm">{teamASetsWon}</span></div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 text-right">
            <div>
              <div className="text-lg font-black text-white">{teamBName}</div>
              <div className="text-xs text-slate-400 font-mono">Sets: <span className="font-bold text-blue-400 text-sm">{teamBSetsWon}</span></div>
            </div>
            <div className="w-3 h-10 rounded-full" style={{ backgroundColor: teamBColor }} />
          </div>
        </div>

        {/* Set-by-Set Score Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <table className="w-full text-sm text-center">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 text-xs">
              <tr>
                <th className="p-3">SET</th>
                <th className="p-3">{teamAName}</th>
                <th className="p-3"></th>
                <th className="p-3">{teamBName}</th>
                <th className="p-3">WINNER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {sets.map((s) => (
                <tr key={s.setNumber} className="hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-purple-400">Set {s.setNumber}</td>
                  <td className={`p-3.5 font-black text-base ${s.winner === 'A' ? 'text-white' : 'text-slate-400'}`}>
                    {s.scoreA}
                  </td>
                  <td className="p-3.5 text-slate-600 font-bold">&mdash;</td>
                  <td className={`p-3.5 font-black text-base ${s.winner === 'B' ? 'text-white' : 'text-slate-400'}`}>
                    {s.scoreB}
                  </td>
                  <td className="p-3.5 font-sans">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        s.winner === 'A'
                          ? 'bg-red-950 text-red-300 border border-red-800/60'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                      }`}
                    >
                      {s.winner === 'A' ? teamAName : teamBName}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
