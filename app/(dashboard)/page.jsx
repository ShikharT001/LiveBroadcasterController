'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Layers,
  Radio,
  Tv,
  Users,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Sparkles,
  Award,
  Video,
  Play,
  Square,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardOverview() {
  const [activeGraphic, setActiveGraphic] = useState('SCOREBOARD');
  const [isScoreboardVisible, setIsScoreboardVisible] = useState(true);

  // Live match state preview synced from match control
  const [match, setMatch] = useState({
    id: 'volleyball-match-1',
    name: 'VOLLEYBALL CHAMPIONSHIP FINALS',
    teamA: { name: 'Thunder Volley', code: 'THU', score: 0, sets: 0, color: 'bg-red-600' },
    teamB: { name: 'Cyclone Spikers', code: 'CYC', score: 0, sets: 0, color: 'bg-blue-600' },
    currentSet: 1,
    servingTeam: 'A',
    status: 'LIVE',
  });

  const obsScenes = ['LIVE_MATCH', 'PLAYER_INTRO', 'SPONSOR_BREAK', 'SET_RESULTS', 'MATCH_WINNER'];
  const [currentScene, setCurrentScene] = useState('LIVE_MATCH');

  // Load and listen for match updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('match_settings_volleyball-match-1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.teamA?.score === 21 && parsed.teamB?.score === 19 && parsed.currentSet === 4) {
            setMatch((prev) => ({
              ...prev,
              currentSet: 1,
              teamA: { ...prev.teamA, name: parsed.teamA?.name || 'Thunder Volley', code: parsed.teamA?.code || 'THU', score: 0, sets: 0 },
              teamB: { ...prev.teamB, name: parsed.teamB?.name || 'Cyclone Spikers', code: parsed.teamB?.code || 'CYC', score: 0, sets: 0 },
            }));
          } else {
            setMatch((prev) => ({
              ...prev,
              name: parsed.tournament || prev.name,
              currentSet: parsed.currentSet || 1,
              servingTeam: parsed.servingTeam || 'A',
              teamA: { ...prev.teamA, ...parsed.teamA },
              teamB: { ...prev.teamB, ...parsed.teamB },
            }));
          }
        } catch (e) {}
      }

      try {
        const bc = new BroadcastChannel('overlay_volleyball-match-1');
        bc.onmessage = (event) => {
          if (event.data?.type === 'SCORE_UPDATE' && event.data.match) {
            const m = event.data.match;
            setMatch((prev) => ({
              ...prev,
              name: m.tournament || prev.name,
              currentSet: m.currentSet || 1,
              servingTeam: m.servingTeam || 'A',
              teamA: { ...prev.teamA, ...m.teamA },
              teamB: { ...prev.teamB, ...m.teamB },
            }));
          }
        };
        return () => bc.close();
      } catch (e) {}
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="live">LIVE BROADCAST</Badge>
            <span className="text-xs text-slate-400 font-mono">COURT A &bull; MATCH #04</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Volleyball Broadcast Controller
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time score keeping, automated broadcast graphics, and OBS Studio scene switching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/match">
            <Button variant="broadcast" className="gap-2">
              <Activity className="h-4 w-4" />
              <span>Open Match Scoring</span>
            </Button>
          </Link>

          <Link href="/graphics">
            <Button variant="secondary" className="gap-2 border border-slate-700">
              <Layers className="h-4 w-4 text-purple-400" />
              <span>Graphics Control</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Match Summary + Telemetry Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Match Scoreboard Card */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">
                <Activity className="h-5 w-5 text-purple-400" />
                Live Volleyball Scoreboard
              </CardTitle>
              <CardDescription>Set {match.currentSet} of 5 &bull; Best of 5 Sets</CardDescription>
            </div>
            <Link href="/match">
              <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300 gap-1">
                Full Controls <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Scoreboard visual preview */}
            <div className="grid grid-cols-2 gap-4">
              {/* Team A */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                {match.servingTeam === 'A' && (
                  <span className="absolute top-2.5 right-3 text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/60">
                    SERVING &bull;
                  </span>
                )}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{match.teamA.code}</span>
                <span className="text-lg font-bold text-white text-center mt-0.5">{match.teamA.name}</span>
                <div className="text-5xl font-black text-white my-3 font-mono tracking-tight">{match.teamA.score}</div>
                <div className="text-xs text-slate-400">
                  Sets Won: <span className="font-bold text-purple-400 text-sm ml-1">{match.teamA.sets}</span>
                </div>
              </div>

              {/* Team B */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                {match.servingTeam === 'B' && (
                  <span className="absolute top-2.5 right-3 text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/60">
                    SERVING &bull;
                  </span>
                )}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{match.teamB.code}</span>
                <span className="text-lg font-bold text-white text-center mt-0.5">{match.teamB.name}</span>
                <div className="text-5xl font-black text-white my-3 font-mono tracking-tight">{match.teamB.score}</div>
                <div className="text-xs text-slate-400">
                  Sets Won: <span className="font-bold text-purple-400 text-sm ml-1">{match.teamB.sets}</span>
                </div>
              </div>
            </div>

            {/* Quick Scoring Actions */}
            <div className="border-t border-slate-800 pt-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Quick Point Controls</span>
                <span className="text-[11px] text-slate-500">Updates live overlay instantly</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 bg-slate-800 hover:bg-red-950 hover:text-red-300 font-bold">
                    +1 Point {match.teamA.code}
                  </Button>
                  <Button variant="outline" size="sm" className="px-3 text-slate-400 hover:text-red-400">
                    -1
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 bg-slate-800 hover:bg-blue-950 hover:text-blue-300 font-bold">
                    +1 Point {match.teamB.code}
                  </Button>
                  <Button variant="outline" size="sm" className="px-3 text-slate-400 hover:text-blue-400">
                    -1
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Col: OBS Status & Scene Controls */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Radio className="h-4 w-4 text-purple-400" />
                  OBS Studio Control
                </CardTitle>
                <Link href="/obs">
                  <Button variant="ghost" size="sm" className="text-xs text-purple-400">Settings</Button>
                </Link>
              </div>
              <CardDescription>Live scene switcher & broadcast triggers</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-xs text-slate-400 font-medium">Select Active Scene:</div>
              <div className="grid grid-cols-1 gap-1.5">
                {obsScenes.map((scene) => {
                  const isActive = currentScene === scene;
                  return (
                    <button
                      key={scene}
                      onClick={() => setCurrentScene(scene)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all text-left ${
                        isActive
                          ? 'bg-purple-600 text-white font-bold shadow-md'
                          : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>{scene}</span>
                      {isActive && <Badge variant="live" className="text-[9px] py-0 px-1.5 h-3.5">ACTIVE</Badge>}
                    </button>
                  );
                })}
              </div>

              {/* Streaming state action */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">YouTube Stream</span>
                <Badge variant="secondary" className="text-[10px]">Ready to Stream</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Active Graphic & Overlay Preview */}
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                Active Graphic State
              </CardTitle>
              <CardDescription>Graphics currently rendered on OBS overlay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-200">{activeGraphic}</span>
                </div>
                <Badge variant={isScoreboardVisible ? 'success' : 'secondary'} className="text-[10px]">
                  {isScoreboardVisible ? 'VISIBLE' : 'HIDDEN'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsScoreboardVisible(!isScoreboardVisible)}
                  className="text-xs gap-1"
                >
                  {isScoreboardVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {isScoreboardVisible ? 'Hide Scoreboard' : 'Show Scoreboard'}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setActiveGraphic('NONE');
                    setIsScoreboardVisible(false);
                  }}
                  className="text-xs gap-1"
                >
                  <Square className="h-3 w-3" />
                  Clear All Graphics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Access Modules Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/match" className="block">
          <Card className="hover:border-purple-500/50 transition-all cursor-pointer bg-slate-900/50 hover:bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Volleyball Scorer</div>
                <div className="text-xs text-slate-400">Sets, points & timeouts</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/graphics" className="block">
          <Card className="hover:border-cyan-500/50 transition-all cursor-pointer bg-slate-900/50 hover:bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Broadcast Graphics</div>
                <div className="text-xs text-slate-400">Intros, sponsors & results</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/obs" className="block">
          <Card className="hover:border-blue-500/50 transition-all cursor-pointer bg-slate-900/50 hover:bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">OBS Studio Bridge</div>
                <div className="text-xs text-slate-400">Scenes, sources & streaming</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/teams" className="block">
          <Card className="hover:border-indigo-500/50 transition-all cursor-pointer bg-slate-900/50 hover:bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Teams & Rosters</div>
                <div className="text-xs text-slate-400">Player numbers & positions</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
