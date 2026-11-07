'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Award,
  RotateCcw,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Clock,
  Radio,
  Layers,
  ChevronRight,
  Shield,
  Volume2,
  Undo2,
  Edit3,
  Settings,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function MatchControlPage() {
  // Live editable match & tournament metadata
  const [tournament, setTournament] = useState('VOLLEYBALL CHAMPIONSHIP FINALS');
  const [court, setCourt] = useState('Main Court');
  const [teamA, setTeamA] = useState({ name: 'Thunder Volley', code: 'THU', color: '#dc2626' });
  const [teamB, setTeamB] = useState({ name: 'Cyclone Spikers', code: 'CYC', color: '#2563eb' });

  // Dialog state for editing match metadata
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    tournament: 'VOLLEYBALL CHAMPIONSHIP FINALS',
    court: 'Main Court',
    teamAName: 'Thunder Volley',
    teamACode: 'THU',
    teamAColor: '#dc2626',
    teamBName: 'Cyclone Spikers',
    teamBCode: 'CYC',
    teamBColor: '#2563eb',
  });

  // Mock live match state with realistic volleyball rules
  const [matchStatus, setMatchStatus] = useState('live'); // scheduled, live, paused, completed
  const [currentSet, setCurrentSet] = useState(1);
  const [servingTeam, setServingTeam] = useState('A');
  const [setScores, setSetScores] = useState({
    1: { a: 0, b: 0, winner: null },
    2: { a: 0, b: 0, winner: null },
    3: { a: 0, b: 0, winner: null },
    4: { a: 0, b: 0, winner: null },
    5: { a: 0, b: 0, winner: null },
  });

  const [timeouts, setTimeouts] = useState({
    a: 0, // used out of 2
    b: 0, // used out of 2
  });

  const [scoreHistory, setScoreHistory] = useState([]);

  // Dialog states
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Reset match to fresh 0 - 0 for tournament start
  const handleResetMatch = () => {
    const freshScores = {
      1: { a: 0, b: 0, winner: null },
      2: { a: 0, b: 0, winner: null },
      3: { a: 0, b: 0, winner: null },
      4: { a: 0, b: 0, winner: null },
      5: { a: 0, b: 0, winner: null },
    };
    setCurrentSet(1);
    setServingTeam('A');
    setSetScores(freshScores);
    setTimeouts({ a: 0, b: 0 });
    setScoreHistory([]);
    setMatchStatus('live');
    broadcastSync({
      currentSet: 1,
      scoreA: 0,
      scoreB: 0,
      setsWonA: 0,
      setsWonB: 0,
      servingTeam: 'A',
      setScores: freshScores,
    });
    setConfirmResetOpen(false);
  };

  // Load saved preferences on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('match_settings_volleyball-match-1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.tournament) setTournament(parsed.tournament);
          if (parsed.teamA) setTeamA(parsed.teamA);
          if (parsed.teamB) setTeamB(parsed.teamB);
          // If the saved state is the old hardcoded mock 21-19, clean reset to 0 - 0
          if (parsed.teamA?.score === 21 && parsed.teamB?.score === 19 && parsed.currentSet === 4) {
            handleResetMatch();
          } else {
            if (parsed.currentSet) setCurrentSet(parsed.currentSet);
            if (parsed.servingTeam) setServingTeam(parsed.servingTeam);
            if (parsed.setScores) setSetScores(parsed.setScores);
          }
          setEditForm({
            tournament: parsed.tournament || 'VOLLEYBALL CHAMPIONSHIP FINALS',
            court: parsed.court || 'Main Court',
            teamAName: parsed.teamA?.name || 'Thunder Volley',
            teamACode: parsed.teamA?.code || 'THU',
            teamAColor: parsed.teamA?.color || '#dc2626',
            teamBName: parsed.teamB?.name || 'Cyclone Spikers',
            teamBCode: parsed.teamB?.code || 'CYC',
            teamBColor: parsed.teamB?.color || '#2563eb',
          });
        } catch (e) {}
      }
    }
  }, []);

  const currentScoreA = setScores[currentSet]?.a || 0;
  const currentScoreB = setScores[currentSet]?.b || 0;

  // Volleyball target points: Set 1-4 is 25 pts, Set 5 (tiebreak) is 15 pts
  const targetScore = currentSet === 5 ? 15 : 25;

  // Calculate sets won
  const setsWonA = Object.values(setScores).filter((s) => s.winner === 'A').length;
  const setsWonB = Object.values(setScores).filter((s) => s.winner === 'B').length;

  // Synchronize with OBS Browser Source Overlay via BroadcastChannel and localStorage
  const broadcastSync = (override = {}) => {
    const curA = override.scoreA !== undefined ? override.scoreA : currentScoreA;
    const curB = override.scoreB !== undefined ? override.scoreB : currentScoreB;
    const srv = override.servingTeam !== undefined ? override.servingTeam : servingTeam;
    const cSet = override.currentSet !== undefined ? override.currentSet : currentSet;
    const tA = override.teamA || teamA;
    const tB = override.teamB || teamB;
    const tour = override.tournament || tournament;
    const sWonA = override.setsWonA !== undefined ? override.setsWonA : setsWonA;
    const sWonB = override.setsWonB !== undefined ? override.setsWonB : setsWonB;
    const sScores = override.setScores || setScores;

    const payload = {
      id: 'volleyball-match-1',
      tournament: tour,
      currentSet: cSet,
      servingTeam: srv,
      setScores: sScores,
      teamA: { ...tA, score: curA, sets: sWonA },
      teamB: { ...tB, score: curB, sets: sWonB },
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('match_settings_volleyball-match-1', JSON.stringify(payload));
      localStorage.setItem('match_settings_demo-volleyball-1', JSON.stringify(payload));
      ['overlay_volleyball-match-1', 'overlay_demo-volleyball-1'].forEach((ch) => {
        try {
          const bc = new BroadcastChannel(ch);
          bc.postMessage({ type: 'SCORE_UPDATE', match: payload });
          bc.close();
        } catch (e) {}
      });
    }
  };

  // Save customized match details
  const handleSaveDetails = (e) => {
    e.preventDefault();
    const newTA = { name: editForm.teamAName, code: editForm.teamACode.toUpperCase(), color: editForm.teamAColor };
    const newTB = { name: editForm.teamBName, code: editForm.teamBCode.toUpperCase(), color: editForm.teamBColor };
    setTournament(editForm.tournament);
    setCourt(editForm.court);
    setTeamA(newTA);
    setTeamB(newTB);
    broadcastSync({ tournament: editForm.tournament, teamA: newTA, teamB: newTB });
    setEditDetailsOpen(false);
  };

  // Point scoring action
  const handleAddPoint = (team) => {
    if (matchStatus === 'completed' || matchStatus === 'paused') return;

    const current = setScores[currentSet];
    const newA = team === 'A' ? current.a + 1 : current.a;
    const newB = team === 'B' ? current.b + 1 : current.b;

    setSetScores((prev) => {
      // Check if set is won (must reach target score with >= 2 points difference)
      let winner = null;
      if (newA >= targetScore && newA - newB >= 2) {
        winner = 'A';
      } else if (newB >= targetScore && newB - newA >= 2) {
        winner = 'B';
      }

      const updated = {
        ...prev,
        [currentSet]: { ...current, a: newA, b: newB, winner },
      };

      // Add to history
      const now = new Date().toLocaleTimeString();
      setScoreHistory((hPrev) => [
        {
          id: Date.now(),
          set: currentSet,
          team,
          scoreA: newA,
          scoreB: newB,
          time: now,
          type: 'Point',
        },
        ...hPrev.slice(0, 19),
      ]);

      return updated;
    });

    setServingTeam(team);
    broadcastSync({ scoreA: newA, scoreB: newB, servingTeam: team });
  };

  // Score correction (-1 point)
  const handleDecrementPoint = (team) => {
    const current = setScores[currentSet];
    const newA = team === 'A' ? Math.max(0, current.a - 1) : current.a;
    const newB = team === 'B' ? Math.max(0, current.b - 1) : current.b;

    setSetScores((prev) => ({
      ...prev,
      [currentSet]: { ...current, a: newA, b: newB, winner: null },
    }));

    broadcastSync({ scoreA: newA, scoreB: newB });
  };

  // Undo last point
  const handleUndo = () => {
    if (scoreHistory.length === 0) return;
    const prevHistory = scoreHistory.slice(1);
    setScoreHistory(prevHistory);

    if (prevHistory.length > 0) {
      const prevEntry = prevHistory[0];
      setSetScores((prev) => ({
        ...prev,
        [currentSet]: { ...prev[currentSet], a: prevEntry.scoreA, b: prevEntry.scoreB, winner: null },
      }));
      setServingTeam(prevEntry.team);
      broadcastSync({ scoreA: prevEntry.scoreA, scoreB: prevEntry.scoreB, servingTeam: prevEntry.team });
    } else {
      handleDecrementPoint(scoreHistory[0].team);
    }
  };

  // Advance Set
  const handleAdvanceSet = () => {
    if (currentSet < 5) {
      const nextSet = currentSet + 1;
      setCurrentSet(nextSet);
      broadcastSync({
        currentSet: nextSet,
        scoreA: setScores[nextSet]?.a || 0,
        scoreB: setScores[nextSet]?.b || 0,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="live" className="uppercase">{matchStatus}</Badge>
            <span className="text-xs text-purple-400 font-mono font-bold uppercase">{tournament}</span>
            <span className="text-xs text-slate-500 font-mono">&bull; {court}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Match Scoring & Set Control
          </h1>
          <p className="text-xs text-slate-400">
            Real-time volleyball scoreboard synchronization. Points instantly propagate to the live OBS overlay.
          </p>
        </div>

        {/* Match State Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmResetOpen(true)}
            className="gap-1.5 text-rose-400 border-rose-800/60 hover:bg-rose-950/40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Match (0 - 0)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDetailsOpen(true)}
            className="gap-1.5 text-purple-300 border-purple-800/60 hover:bg-purple-950/40"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Teams & Tournament</span>
          </Button>

          {matchStatus === 'live' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMatchStatus('paused')}
              className="gap-1.5 text-amber-400 border-amber-800/60 hover:bg-amber-950/40"
            >
              <Pause className="h-3.5 w-3.5" />
              <span>Pause Match</span>
            </Button>
          ) : (
            <Button
              variant="broadcast"
              size="sm"
              onClick={() => setMatchStatus('live')}
              className="gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Resume Match</span>
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmCompleteOpen(true)}
            className="gap-1.5"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Complete Match</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={scoreHistory.length === 0}
            className="gap-1.5 text-slate-300 border-slate-700 hover:bg-slate-800"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Undo Point</span>
          </Button>
        </div>
      </div>

      {/* Set Selector Bar */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Clock className="h-4 w-4 text-purple-400" />
          <span>SETS:</span>
        </div>

        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((s) => {
            const isCurrent = currentSet === s;
            const setObj = setScores[s];
            return (
              <button
                key={s}
                onClick={() => setCurrentSet(s)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center ${
                  isCurrent
                    ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400/50'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>SET {s} {s === 5 ? '(Tiebreak)' : ''}</span>
                <span className="font-mono text-[11px] mt-0.5">
                  {setObj.a} - {setObj.b}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAdvanceSet}
          disabled={currentSet >= 5}
          className="text-xs text-purple-400 border-slate-800 hover:bg-purple-950/30"
        >
          Next Set <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>

      {/* Live Scoring Duel Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TEAM A SCORING PANEL */}
        <Card className="border-slate-800 bg-slate-900/90 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-400 tracking-wider font-mono">TEAM A</span>
                <CardTitle className="text-2xl font-black text-white">{teamA.name}</CardTitle>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Sets Won</span>
                <div className="text-2xl font-black text-red-500 font-mono">{setsWonA}</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display & Serve State */}
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/80 flex flex-col items-center relative">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setServingTeam('A')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    servingTeam === 'A'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  <span>{servingTeam === 'A' ? 'SERVING' : 'Set Serve'}</span>
                </button>

                <div className="text-xs text-slate-500 font-mono">
                  Timeouts: <span className="font-bold text-slate-300">{timeouts.a}/2</span>
                </div>
              </div>

              {/* Huge Point Number */}
              <div className="text-8xl font-black text-white font-mono tracking-tighter my-2">
                {currentScoreA}
              </div>

              <div className="text-xs text-slate-400">
                Target: <span className="text-purple-400 font-semibold">{targetScore}</span> (Lead by 2)
              </div>
            </div>

            {/* Score Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="broadcast"
                size="huge"
                onClick={() => handleAddPoint('A')}
                className="col-span-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-2xl font-black shadow-xl"
              >
                +1 POINT
              </Button>

              <Button
                variant="outline"
                size="huge"
                onClick={() => handleDecrementPoint('A')}
                className="border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-red-400 text-lg font-bold"
              >
                -1
              </Button>
            </div>

            {/* Volleyball Specific Quick Event Tagging */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddPoint('A')}
                className="text-xs bg-slate-800/80 hover:bg-red-950 text-slate-300"
              >
                Ace (+1)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddPoint('A')}
                className="text-xs bg-slate-800/80 hover:bg-red-950 text-slate-300"
              >
                Block (+1)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setTimeouts((t) => ({ ...t, a: Math.min(2, t.a + 1) }))}
                className="text-xs bg-slate-800/80 hover:bg-amber-950 text-amber-300"
              >
                Timeout ({timeouts.a}/2)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TEAM B SCORING PANEL */}
        <Card className="border-slate-800 bg-slate-900/90 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-400 tracking-wider font-mono">TEAM B</span>
                <CardTitle className="text-2xl font-black text-white">{teamB.name}</CardTitle>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Sets Won</span>
                <div className="text-2xl font-black text-blue-500 font-mono">{setsWonB}</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display & Serve State */}
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/80 flex flex-col items-center relative">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setServingTeam('B')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    servingTeam === 'B'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  <span>{servingTeam === 'B' ? 'SERVING' : 'Set Serve'}</span>
                </button>

                <div className="text-xs text-slate-500 font-mono">
                  Timeouts: <span className="font-bold text-slate-300">{timeouts.b}/2</span>
                </div>
              </div>

              {/* Huge Point Number */}
              <div className="text-8xl font-black text-white font-mono tracking-tighter my-2">
                {currentScoreB}
              </div>

              <div className="text-xs text-slate-400">
                Target: <span className="text-purple-400 font-semibold">{targetScore}</span> (Lead by 2)
              </div>
            </div>

            {/* Score Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="broadcast"
                size="huge"
                onClick={() => handleAddPoint('B')}
                className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-2xl font-black shadow-xl"
              >
                +1 POINT
              </Button>

              <Button
                variant="outline"
                size="huge"
                onClick={() => handleDecrementPoint('B')}
                className="border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-blue-400 text-lg font-bold"
              >
                -1
              </Button>
            </div>

            {/* Volleyball Specific Quick Event Tagging */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddPoint('B')}
                className="text-xs bg-slate-800/80 hover:bg-blue-950 text-slate-300"
              >
                Ace (+1)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAddPoint('B')}
                className="text-xs bg-slate-800/80 hover:bg-blue-950 text-slate-300"
              >
                Block (+1)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setTimeouts((t) => ({ ...t, b: Math.min(2, t.b + 1) }))}
                className="text-xs bg-slate-800/80 hover:bg-amber-950 text-amber-300"
              >
                Timeout ({timeouts.b}/2)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Point History & Score Audit Table */}
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-400" />
              Score Event History & Audit Ledger
            </CardTitle>
            <CardDescription>Chronological log of points scored in this match</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={scoreHistory.length === 0}
            className="text-xs gap-1 border-slate-700"
          >
            <Undo2 className="h-3 w-3" />
            Undo Last Point
          </Button>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Set</th>
                  <th className="p-3">Scoring Team</th>
                  <th className="p-3">Event</th>
                  <th className="p-3 font-mono">Running Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {scoreHistory.map((item, idx) => (
                  <tr key={item.id} className={idx === 0 ? 'bg-purple-950/20' : 'hover:bg-slate-800/40'}>
                    <td className="p-3 text-slate-400">{item.time}</td>
                    <td className="p-3 text-slate-300 font-bold">Set {item.set}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          item.team === 'A'
                            ? 'bg-red-950 text-red-300 border border-red-800/50'
                            : 'bg-blue-950 text-blue-300 border border-blue-800/50'
                        }`}
                      >
                        {item.team === 'A' ? teamA.name : teamB.name}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{item.type}</td>
                    <td className="p-3 font-bold text-white text-sm">
                      {item.scoreA} &mdash; {item.scoreB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog: Complete Match */}
      <Dialog open={confirmCompleteOpen} onOpenChange={setConfirmCompleteOpen}>
        <DialogContent onClose={() => setConfirmCompleteOpen(false)}>
          <DialogHeader>
            <DialogTitle>Complete Live Match?</DialogTitle>
            <DialogDescription>
              Are you sure you want to conclude this volleyball match? This will finalize all set scores, declare the winning team, and record the match completion.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400">Final Set Breakdown:</div>
            <div className="font-mono text-slate-200">
              {teamA.name} ({setsWonA}) vs {teamB.name} ({setsWonB})
            </div>
            <div className="font-bold text-purple-400 mt-2">
              Winner: {setsWonA > setsWonB ? teamA.name : teamB.name}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCompleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setMatchStatus('completed');
                setConfirmCompleteOpen(false);
              }}
            >
              Conclude Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Match & Teams Dialog */}
      <Dialog open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
        <DialogContent onClose={() => setEditDetailsOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-purple-400" />
              Customize Match & Teams
            </DialogTitle>
            <DialogDescription>
              Changes propagate immediately to the on-screen OBS scoreboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tournament / League</label>
                <Input
                  value={editForm.tournament}
                  onChange={(e) => setEditForm({ ...editForm, tournament: e.target.value })}
                  placeholder="e.g. Volleyball Championship"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Court / Stage</label>
                <Input
                  value={editForm.court}
                  onChange={(e) => setEditForm({ ...editForm, court: e.target.value })}
                  placeholder="e.g. Court 1 - Semifinals"
                />
              </div>
            </div>

            {/* Team A Details */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Team A (Home)</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] text-slate-400">Team Name</label>
                  <Input
                    value={editForm.teamAName}
                    onChange={(e) => setEditForm({ ...editForm, teamAName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Code (3-4 ch)</label>
                  <Input
                    maxLength={4}
                    value={editForm.teamACode}
                    onChange={(e) => setEditForm({ ...editForm, teamACode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Team Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={editForm.teamAColor}
                    onChange={(e) => setEditForm({ ...editForm, teamAColor: e.target.value })}
                    className="h-9 w-12 rounded cursor-pointer bg-slate-900 border border-slate-700"
                  />
                  <Input
                    value={editForm.teamAColor}
                    onChange={(e) => setEditForm({ ...editForm, teamAColor: e.target.value })}
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Team B Details */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Team B (Away)</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] text-slate-400">Team Name</label>
                  <Input
                    value={editForm.teamBName}
                    onChange={(e) => setEditForm({ ...editForm, teamBName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Code (3-4 ch)</label>
                  <Input
                    maxLength={4}
                    value={editForm.teamBCode}
                    onChange={(e) => setEditForm({ ...editForm, teamBCode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Team Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={editForm.teamBColor}
                    onChange={(e) => setEditForm({ ...editForm, teamBColor: e.target.value })}
                    className="h-9 w-12 rounded cursor-pointer bg-slate-900 border border-slate-700"
                  />
                  <Input
                    value={editForm.teamBColor}
                    onChange={(e) => setEditForm({ ...editForm, teamBColor: e.target.value })}
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDetailsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="broadcast">
                Save & Update Scoreboard
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Resetting Match to 0 - 0 */}
      <Dialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-400">
              <RotateCcw className="h-5 w-5" />
              Reset Match to 0 - 0?
            </DialogTitle>
            <DialogDescription>
              This will reset the match score to Set 1, 0 - 0 for both teams, clear timeouts, and reset point history for a fresh tournament start. Team names and tournament settings remain saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setConfirmResetOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetMatch}>
              Yes, Reset Scoreboard to 0 - 0
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
