'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  User,
  Award,
  Trophy,
  Megaphone,
  Radio,
  Tv,
  CheckCircle,
  Square,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Video,
  Sliders,
  Maximize2,
  Minimize2,
  MonitorPlay,
  Plus,
  UserPlus,
  Shield,
  Edit2,
  Flame,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { OverlayContainer } from '@/components/overlay/OverlayContainer';

export default function GraphicsControlPage() {
  const matchId = 'demo-volleyball-1';

  // Live match state with customizable layout
  const [match, setMatch] = useState({
    id: matchId,
    tournament: 'VOLLEYBALL CHAMPIONSHIP FINALS',
    currentSet: 1,
    servingTeam: 'A',
    teamA: { name: 'Thunder Volley', code: 'THU', color: '#dc2626', score: 0, sets: 0 },
    teamB: { name: 'Cyclone Spikers', code: 'CYC', color: '#2563eb', score: 0, sets: 0 },
    scoreboardSize: 'normal', // small, normal, large
    scoreboardPosition: 'top-left', // top-left, top-center, bottom-center, bottom-left
  });

  // Video feed configuration
  const [videoConfig, setVideoConfig] = useState({
    videoUrl: 'https://www.youtube.com/live/oNRfODgAXvA',
    showVideo: true,
  });

  // Full default volleyball tournament rosters for both teams with initial match performance stats
  const DEFAULT_ROSTERS = {
    A: [
      { id: 'p1', name: 'Alex Rivera', number: 7, position: 'Setter', isCaptain: true, isStarter: true, kills: 4, aces: 3, blocks: 2, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p2', name: 'Marcus Chen', number: 10, position: 'Outside Hitter', isCaptain: false, isStarter: true, kills: 14, aces: 2, blocks: 3, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p3', name: 'David Okafor', number: 14, position: 'Middle Blocker', isCaptain: false, isStarter: true, kills: 9, aces: 1, blocks: 6, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p4', name: 'Liam Vance', number: 3, position: 'Libero', isCaptain: false, isStarter: true, kills: 0, aces: 0, blocks: 0, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p5', name: 'Julian Schmidt', number: 9, position: 'Opposite Spiker', isCaptain: false, isStarter: true, kills: 12, aces: 4, blocks: 1, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p6', name: 'Mateo Morales', number: 12, position: 'Outside Hitter', isCaptain: false, isStarter: true, kills: 10, aces: 2, blocks: 2, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p7a', name: 'Ethan Walker', number: 15, position: 'Middle Blocker', isCaptain: false, isStarter: false, kills: 5, aces: 1, blocks: 3, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p8a', name: 'Lucas Ortiz', number: 18, position: 'Defensive Specialist', isCaptain: false, isStarter: false, kills: 1, aces: 1, blocks: 0, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p9a', name: 'Noah Bennett', number: 5, position: 'Reserve Setter', isCaptain: false, isStarter: false, kills: 2, aces: 1, blocks: 1, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
      { id: 'p10a', name: 'Sam Tyler', number: 21, position: 'Outside Hitter', isCaptain: false, isStarter: false, kills: 6, aces: 2, blocks: 1, showStats: true, teamName: 'Thunder Volley', color: '#dc2626' },
    ],
    B: [
      { id: 'p7', name: 'Nikola Vanev', number: 4, position: 'Setter', isCaptain: true, isStarter: true, kills: 5, aces: 2, blocks: 3, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p8', name: 'Kenji Sato', number: 11, position: 'Outside Hitter', isCaptain: false, isStarter: true, kills: 13, aces: 3, blocks: 2, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p9', name: 'Lukas Meyer', number: 16, position: 'Middle Blocker', isCaptain: false, isStarter: true, kills: 8, aces: 1, blocks: 5, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p10', name: 'Carlos Santos', number: 1, position: 'Libero', isCaptain: false, isStarter: true, kills: 0, aces: 0, blocks: 0, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p11', name: 'Gabriel Silva', number: 8, position: 'Opposite Spiker', isCaptain: false, isStarter: true, kills: 11, aces: 3, blocks: 2, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p12', name: 'Oliver Hansen', number: 5, position: 'Middle Blocker', isCaptain: false, isStarter: true, kills: 7, aces: 2, blocks: 4, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p13b', name: 'Andre Varga', number: 13, position: 'Outside Hitter', isCaptain: false, isStarter: false, kills: 6, aces: 1, blocks: 1, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p14b', name: 'Sean Miller', number: 2, position: 'Defensive Specialist', isCaptain: false, isStarter: false, kills: 1, aces: 0, blocks: 0, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p15b', name: 'Hiroshi Tanaka', number: 9, position: 'Reserve Setter', isCaptain: false, isStarter: false, kills: 3, aces: 1, blocks: 1, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
      { id: 'p16b', name: 'Maxim Morozov', number: 17, position: 'Middle Blocker', isCaptain: false, isStarter: false, kills: 4, aces: 1, blocks: 3, showStats: true, teamName: 'Cyclone Spikers', color: '#2563eb' },
    ],
  };

  const [rosters, setRosters] = useState(DEFAULT_ROSTERS);
  const [rosterFilter, setRosterFilter] = useState('all'); // 'all', 'starters', 'bench'
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [newPlayerForm, setNewPlayerForm] = useState({
    name: '',
    number: '',
    position: 'Outside Hitter',
    team: 'A',
    isCaptain: false,
    isStarter: false,
    kills: 0,
    aces: 0,
    blocks: 0,
    showStats: true,
  });

  // Edit Player Dialog State
  const [editPlayerOpen, setEditPlayerOpen] = useState(false);
  const [editPlayerForm, setEditPlayerForm] = useState({
    id: '',
    name: '',
    number: '',
    position: 'Outside Hitter',
    team: 'A',
    isCaptain: false,
    isStarter: true,
    kills: 0,
    aces: 0,
    blocks: 0,
    showStats: true,
  });

  const sponsorsList = [
    { name: 'Apex Sports Nutrition', tagline: 'Fueling Champions Every Spike', subtitle: 'OFFICIAL NUTRITION PARTNER' },
    { name: 'Vortex Athletics', tagline: 'Official Footwear & Gear Provider', subtitle: 'EQUIPMENT SPONSOR' },
    { name: 'HydraPure Electrolytes', tagline: 'Maximum Hydration On The Court', subtitle: 'HYDRATION PARTNER' },
  ];

  // Active Graphic State
  const [activeGraphic, setActiveGraphic] = useState('SCOREBOARD');
  const [isGraphicVisible, setIsGraphicVisible] = useState(true);
  const [currentPayload, setCurrentPayload] = useState({});

  // Form states for triggers
  const [selectedTeamRoster, setSelectedTeamRoster] = useState('A');
  const [selectedPlayer, setSelectedPlayer] = useState(DEFAULT_ROSTERS.A[0]);
  const [selectedSponsor, setSelectedSponsor] = useState(sponsorsList[0]);
  const [customTitle, setCustomTitle] = useState('OFFICIAL TIMEOUT');
  const [customMsg, setCustomMsg] = useState('Technical timeout called by Head Coach Marco Rossi (Thunder Volley)');
  const [customBadge, setCustomBadge] = useState('ANNOUNCEMENT');

  // Load preferences and rosters from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMatch = localStorage.getItem('match_settings_volleyball-match-1');
      if (savedMatch) {
        try {
          const parsed = JSON.parse(savedMatch);
          if (parsed.teamA?.score === 21 && parsed.teamB?.score === 19 && parsed.currentSet === 4) {
            setMatch((prev) => ({
              ...prev,
              ...parsed,
              currentSet: 1,
              teamA: { ...parsed.teamA, score: 0, sets: 0 },
              teamB: { ...parsed.teamB, score: 0, sets: 0 },
            }));
          } else {
            setMatch((prev) => ({ ...prev, ...parsed }));
          }
        } catch (e) {}
      }

      const savedVideo = localStorage.getItem('broadcast_video_config');
      if (savedVideo) {
        try {
          setVideoConfig(JSON.parse(savedVideo));
        } catch (e) {}
      }

      const savedRosters = localStorage.getItem('broadcaster_rosters');
      if (savedRosters) {
        try {
          const parsedR = JSON.parse(savedRosters);
          if (parsedR.A && parsedR.B) {
            setRosters(parsedR);
            if (parsedR.A.length > 0) setSelectedPlayer(parsedR.A[0]);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Quick Add Player Handler
  const handleAddNewPlayer = (e) => {
    e.preventDefault();
    if (!newPlayerForm.name || !newPlayerForm.number) return;
    const targetTeam = newPlayerForm.team; // 'A' or 'B'
    const teamObj = targetTeam === 'A' ? match.teamA : match.teamB;
    const created = {
      id: `p-${Date.now()}`,
      name: newPlayerForm.name,
      number: parseInt(newPlayerForm.number, 10),
      position: newPlayerForm.position,
      isCaptain: Boolean(newPlayerForm.isCaptain),
      isStarter: Boolean(newPlayerForm.isStarter),
      kills: parseInt(newPlayerForm.kills || 0, 10),
      aces: parseInt(newPlayerForm.aces || 0, 10),
      blocks: parseInt(newPlayerForm.blocks || 0, 10),
      showStats: newPlayerForm.showStats !== false,
      teamName: teamObj.name,
      color: teamObj.color,
    };

    const updatedRosters = {
      ...rosters,
      [targetTeam]: [...rosters[targetTeam], created],
    };

    setRosters(updatedRosters);
    if (typeof window !== 'undefined') {
      localStorage.setItem('broadcaster_rosters', JSON.stringify(updatedRosters));
    }

    setSelectedPlayer(created);
    setSelectedTeamRoster(targetTeam);
    setNewPlayerForm({
      name: '',
      number: '',
      position: 'Outside Hitter',
      team: targetTeam,
      isCaptain: false,
      isStarter: false,
      kills: 0,
      aces: 0,
      blocks: 0,
      showStats: true,
    });
    setAddPlayerOpen(false);
  };

  // Open Edit Player & Stats Dialog
  const handleOpenEditPlayer = (player, team) => {
    setEditPlayerForm({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
      team,
      isCaptain: Boolean(player.isCaptain),
      isStarter: Boolean(player.isStarter),
      kills: player.kills !== undefined ? player.kills : 0,
      aces: player.aces !== undefined ? player.aces : 0,
      blocks: player.blocks !== undefined ? player.blocks : 0,
      showStats: player.showStats !== false,
    });
    setEditPlayerOpen(true);
  };

  // Save Player Details & Stats
  const handleSavePlayerEdit = (e) => {
    e.preventDefault();
    const team = editPlayerForm.team;
    const teamObj = team === 'A' ? match.teamA : match.teamB;

    const updatedPlayer = {
      ...rosters[team].find((p) => p.id === editPlayerForm.id),
      name: editPlayerForm.name,
      number: parseInt(editPlayerForm.number, 10),
      position: editPlayerForm.position,
      isCaptain: Boolean(editPlayerForm.isCaptain),
      isStarter: Boolean(editPlayerForm.isStarter),
      kills: parseInt(editPlayerForm.kills || 0, 10),
      aces: parseInt(editPlayerForm.aces || 0, 10),
      blocks: parseInt(editPlayerForm.blocks || 0, 10),
      showStats: Boolean(editPlayerForm.showStats),
      teamName: teamObj.name,
      color: teamObj.color,
    };

    const updatedRosters = {
      ...rosters,
      [team]: rosters[team].map((p) => (p.id === editPlayerForm.id ? updatedPlayer : p)),
    };

    setRosters(updatedRosters);
    if (typeof window !== 'undefined') {
      localStorage.setItem('broadcaster_rosters', JSON.stringify(updatedRosters));
    }

    if (selectedPlayer?.id === editPlayerForm.id) {
      setSelectedPlayer(updatedPlayer);
      // If currently on air, live update the graphic immediately
      if (activeGraphic === 'PLAYER_INTRO' && isGraphicVisible) {
        dispatchGraphic(
          'PLAYER_INTRO',
          {
            playerName: updatedPlayer.name,
            jerseyNumber: updatedPlayer.number,
            position: updatedPlayer.position,
            teamName: updatedPlayer.teamName,
            teamColor: updatedPlayer.color,
            kills: updatedPlayer.kills,
            aces: updatedPlayer.aces,
            blocks: updatedPlayer.blocks,
            showStats: updatedPlayer.showStats !== false,
          },
          true
        );
      }
    }

    setEditPlayerOpen(false);
  };

  // Quick 1-click stat adjuster for currently selected player (+1 / -1)
  const handleAdjustStat = (statName, delta) => {
    if (!selectedPlayer) return;
    const team = selectedTeamRoster;
    const currentVal = selectedPlayer[statName] || 0;
    const newVal = Math.max(0, currentVal + delta);

    const updatedPlayer = {
      ...selectedPlayer,
      [statName]: newVal,
    };

    const updatedRosters = {
      ...rosters,
      [team]: rosters[team].map((p) => (p.id === selectedPlayer.id ? updatedPlayer : p)),
    };

    setRosters(updatedRosters);
    setSelectedPlayer(updatedPlayer);
    if (typeof window !== 'undefined') {
      localStorage.setItem('broadcaster_rosters', JSON.stringify(updatedRosters));
    }

    // If currently displaying this player on air, immediately update overlay
    if (activeGraphic === 'PLAYER_INTRO' && isGraphicVisible) {
      dispatchGraphic(
        'PLAYER_INTRO',
        {
          playerName: updatedPlayer.name,
          jerseyNumber: updatedPlayer.number,
          position: updatedPlayer.position,
          teamName: updatedPlayer.teamName,
          teamColor: updatedPlayer.color,
          kills: updatedPlayer.kills,
          aces: updatedPlayer.aces,
          blocks: updatedPlayer.blocks,
          showStats: updatedPlayer.showStats !== false,
        },
        true
      );
    }
  };

  // Sync Video settings to Overlay & localStorage
  const updateVideoConfig = (newConfig) => {
    const updated = { ...videoConfig, ...newConfig };
    setVideoConfig(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('broadcast_video_config', JSON.stringify(updated));
      try {
        const bc = new BroadcastChannel(`overlay_${matchId}`);
        bc.postMessage({ type: 'VIDEO_CONFIG_UPDATE', videoConfig: updated });
        bc.close();
      } catch (e) {}
      try {
        const bc2 = new BroadcastChannel('overlay_volleyball-match-1');
        bc2.postMessage({ type: 'VIDEO_CONFIG_UPDATE', videoConfig: updated });
        bc2.close();
      } catch (e) {}
    }
  };

  // Sync Scoreboard layout (Size & Position)
  const updateScoreboardLayout = (layoutChanges) => {
    const updatedMatch = { ...match, ...layoutChanges };
    setMatch(updatedMatch);
    if (typeof window !== 'undefined') {
      localStorage.setItem('match_settings_volleyball-match-1', JSON.stringify(updatedMatch));
      try {
        const bc = new BroadcastChannel(`overlay_${matchId}`);
        bc.postMessage({ type: 'SCORE_UPDATE', match: updatedMatch });
        bc.close();
      } catch (e) {}
      try {
        const bc2 = new BroadcastChannel('overlay_volleyball-match-1');
        bc2.postMessage({ type: 'SCORE_UPDATE', match: updatedMatch });
        bc2.close();
      } catch (e) {}
    }
  };

  // Broadcast dispatch to OBS Overlay
  const dispatchGraphic = (type, payload = {}, visible = true) => {
    setActiveGraphic(type);
    setIsGraphicVisible(visible);
    setCurrentPayload(payload);

    const graphicState = {
      activeGraphic: type,
      isVisible: visible,
      payload,
    };

    // Send via local BroadcastChannel for instant testing in same browser
    if (typeof window !== 'undefined') {
      try {
        const bc = new BroadcastChannel(`overlay_${matchId}`);
        bc.postMessage({ type: 'GRAPHIC_UPDATE', graphicState });
        bc.close();
      } catch (e) {}
      try {
        const bc2 = new BroadcastChannel('overlay_volleyball-match-1');
        bc2.postMessage({ type: 'GRAPHIC_UPDATE', graphicState });
        bc2.close();
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="live">ALL-IN-ONE BROADCAST SUITE</Badge>
            <span className="text-xs text-slate-400 font-mono">COMPLETE VIDEO & GRAPHICS ENGINE</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Broadcast Graphics & Video Control
          </h1>
          <p className="text-xs text-slate-400">
            Control video stream, scoreboard size, player slides, and sponsor breaks without touching OBS Studio.
          </p>
        </div>

        {/* Master Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatchGraphic('SCOREBOARD', {}, true)}
            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 text-purple-400" />
            <span>Reset to Scoreboard</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => dispatchGraphic('NONE', {}, false)}
            className="gap-1.5"
          >
            <Square className="h-3.5 w-3.5" />
            <span>Clear All Graphics</span>
          </Button>

          <a
            href={`/overlay/volleyball-match-1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 hover:text-cyan-200 text-xs font-semibold transition-colors"
          >
            <span>Open OBS Overlay Link</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: Left Control Tabs & Right Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Trigger Tabs */}
        <div className="lg:col-span-7 space-y-4">
          <Tabs defaultValue="scoreboard" className="w-full">
            <TabsList className="grid grid-cols-6 w-full bg-slate-950 border border-slate-800 h-12">
              <TabsTrigger value="scoreboard" className="text-xs">Scoreboard</TabsTrigger>
              <TabsTrigger value="video" className="text-xs">Video Feed</TabsTrigger>
              <TabsTrigger value="players" className="text-xs">Player Intro</TabsTrigger>
              <TabsTrigger value="sponsors" className="text-xs">Sponsors</TabsTrigger>
              <TabsTrigger value="results" className="text-xs">Set Results</TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs">Lower Third</TabsTrigger>
            </TabsList>

            {/* TAB 1: SCOREBOARD SIZING & POSITIONING */}
            <TabsContent value="scoreboard">
              <Card className="border-slate-800 bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tv className="h-4 w-4 text-purple-400" />
                    Scoreboard Visibility, Size & Position
                  </CardTitle>
                  <CardDescription>
                    Configure scorecard scale (small, normal, big) and on-screen position in real time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Status Banner */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">
                        {match.teamA.name} ({match.teamA.score}) vs {match.teamB.name} ({match.teamB.score})
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Size: <span className="text-purple-400 font-bold uppercase">{match.scoreboardSize || 'normal'}</span> &bull; Position: <span className="text-purple-400 font-bold uppercase">{match.scoreboardPosition || 'top-left'}</span>
                      </div>
                    </div>
                    <Badge variant={activeGraphic === 'SCOREBOARD' && isGraphicVisible ? 'success' : 'secondary'}>
                      {activeGraphic === 'SCOREBOARD' && isGraphicVisible ? 'ACTIVE ON AIR' : 'STANDBY'}
                    </Badge>
                  </div>

                  {/* Size Switcher (Big, Normal, Small) */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-purple-400" />
                      <span>Scorecard Size (Scale)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateScoreboardLayout({ scoreboardSize: 'small' })}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                          match.scoreboardSize === 'small'
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Small / Compact
                      </button>

                      <button
                        type="button"
                        onClick={() => updateScoreboardLayout({ scoreboardSize: 'normal' })}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                          match.scoreboardSize === 'normal' || !match.scoreboardSize
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Standard / Normal
                      </button>

                      <button
                        type="button"
                        onClick={() => updateScoreboardLayout({ scoreboardSize: 'large' })}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                          match.scoreboardSize === 'large'
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Big / Prominent
                      </button>
                    </div>
                  </div>

                  {/* Position Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Tv className="h-3.5 w-3.5 text-purple-400" />
                      <span>Scorecard Screen Position</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'top-left', label: 'Top Left' },
                        { id: 'top-center', label: 'Top Center' },
                        { id: 'bottom-center', label: 'Bottom Bar' },
                        { id: 'bottom-left', label: 'Bottom Left' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => updateScoreboardLayout({ scoreboardPosition: pos.id })}
                          className={`p-2 rounded-lg border text-xs font-bold transition-all text-center ${
                            match.scoreboardPosition === pos.id
                              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Show / Hide Scoreboard */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <Button
                      variant="broadcast"
                      onClick={() => dispatchGraphic('SCOREBOARD', {}, true)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Display Scoreboard</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => dispatchGraphic('SCOREBOARD', {}, false)}
                      className="border-slate-700 text-slate-400 hover:text-white"
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      <span>Hide Scoreboard</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: VIDEO FEED EMBED & MANAGEMENT */}
            <TabsContent value="video">
              <Card className="border-slate-800 bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Video className="h-4 w-4 text-cyan-400" />
                    Broadcast Video Source Configuration
                  </CardTitle>
                  <CardDescription>
                    Embed live video (YouTube live, camera feed, or mp4) directly inside your overlay so OBS needs ONLY ONE Browser Source!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Live Video URL (YouTube Live / MP4 / Stream)</label>
                    <Input
                      value={videoConfig.videoUrl}
                      onChange={(e) => updateVideoConfig({ videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/live/oNRfODgAXvA"
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => updateVideoConfig({ videoUrl: 'https://www.youtube.com/live/oNRfODgAXvA', showVideo: true })}
                      className="text-xs bg-slate-800 text-purple-300 hover:bg-slate-700"
                    >
                      Use Test YouTube Video (oNRfODgAXvA)
                    </Button>
                  </div>

                  {/* Toggle: Render Video in Overlay */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">Render Video Feed inside Overlay Canvas</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {videoConfig.showVideo
                          ? 'ENABLED: The overlay serves the entire broadcast (Video + Scoreboard + Graphics) together in 1 single OBS source.'
                          : 'DISABLED: Background is transparent (use this if you capture a camera feed directly inside OBS).'}
                      </p>
                    </div>
                    <Button
                      variant={videoConfig.showVideo ? 'live' : 'outline'}
                      size="sm"
                      onClick={() => updateVideoConfig({ showVideo: !videoConfig.showVideo })}
                      className="text-xs"
                    >
                      {videoConfig.showVideo ? 'Video Active' : 'Transparent (OBS Video)'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: PLAYER INTRO */}
            <TabsContent value="players">
              <Card className="border-slate-800 bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-400" />
                    Player Introduction Lower-Third
                  </CardTitle>
                  <CardDescription>
                    Spotlight individual players with jersey number, position, and live stats.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Select Team */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSelectedTeamRoster('A');
                        if (rosters.A && rosters.A.length > 0) {
                          setSelectedPlayer(rosters.A[0]);
                        }
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedTeamRoster === 'A'
                          ? 'bg-red-950/40 border-red-500 shadow-md ring-1 ring-red-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">Team A</span>
                        <span className="text-[10px] text-red-300 font-mono bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800/60">
                          {rosters.A?.length || 0} Players
                        </span>
                      </div>
                      <div className="text-sm font-black text-red-400 mt-1">{match.teamA.name}</div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTeamRoster('B');
                        if (rosters.B && rosters.B.length > 0) {
                          setSelectedPlayer(rosters.B[0]);
                        }
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedTeamRoster === 'B'
                          ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">Team B</span>
                        <span className="text-[10px] text-blue-300 font-mono bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/60">
                          {rosters.B?.length || 0} Players
                        </span>
                      </div>
                      <div className="text-sm font-black text-blue-400 mt-1">{match.teamB.name}</div>
                    </button>
                  </div>

                  {/* Roster Controls: Filter & Quick Add Player */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                      {['all', 'starters', 'bench'].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setRosterFilter(f)}
                          className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition-all ${
                            rosterFilter === f
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewPlayerForm((prev) => ({ ...prev, team: selectedTeamRoster }));
                        setAddPlayerOpen(true);
                      }}
                      className="gap-1.5 text-xs text-purple-300 border-purple-800/60 hover:bg-purple-950/40 h-8"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>+ Add Player</span>
                    </Button>
                  </div>

                  {/* Select Player List */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                      <span>Select Player to Spotlight</span>
                      <span className="text-[10px] text-slate-500">Click row to select, or click "On Air" to show immediately</span>
                    </label>

                    <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                      {(rosters[selectedTeamRoster] || [])
                        .filter((p) => {
                          if (rosterFilter === 'starters') return p.isStarter;
                          if (rosterFilter === 'bench') return !p.isStarter;
                          return true;
                        })
                        .map((p) => {
                          const isSelected = selectedPlayer?.id === p.id;
                          const currentTeam = selectedTeamRoster === 'A' ? match.teamA : match.teamB;
                          return (
                            <div
                              key={p.id}
                              onClick={() => setSelectedPlayer(p)}
                              className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-purple-950/50 border-purple-500 shadow-md ring-1 ring-purple-500/40'
                                  : 'bg-slate-950 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="font-mono font-black text-sm px-2.5 py-1 rounded-md text-white shadow-sm"
                                  style={{ backgroundColor: currentTeam.color }}
                                >
                                  #{p.number}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-xs">{p.name}</span>
                                    {p.isCaptain && (
                                      <span className="text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded">
                                        CAPTAIN
                                      </span>
                                    )}
                                    {p.isStarter ? (
                                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                                        STARTER
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                                        BENCH
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <span className="text-purple-300 font-medium">{p.position}</span>
                                  </div>

                                  {/* Live Player Match Stats (Kills, Aces, Blocks) */}
                                  <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono">
                                    <span className="text-red-400 font-bold bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/40">
                                      Kills: {p.kills !== undefined ? p.kills : 0}
                                    </span>
                                    <span className="text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/40">
                                      Aces: {p.aces !== undefined ? p.aces : 0}
                                    </span>
                                    <span className="text-cyan-400 font-bold bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/40">
                                      Blocks: {p.blocks !== undefined ? p.blocks : 0}
                                    </span>
                                    {p.showStats === false && (
                                      <span className="text-slate-500 italic">(Stats Hidden)</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {isSelected && <Badge variant="live" className="text-[9px]">SELECTED</Badge>}
                                
                                {/* Edit Player & Stats Button */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs px-2 text-purple-300 border-purple-800/60 hover:bg-purple-950/40 gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditPlayer(p, selectedTeamRoster);
                                  }}
                                  title="Edit player details, position, and stats"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  <span>Stats</span>
                                </Button>

                                {/* Direct Trigger to Air */}
                                <Button
                                  size="sm"
                                  variant="broadcast"
                                  className="h-7 text-xs px-2.5 gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPlayer(p);
                                    dispatchGraphic(
                                      'PLAYER_INTRO',
                                      {
                                        playerName: p.name,
                                        jerseyNumber: p.number,
                                        position: p.position,
                                        teamName: currentTeam.name,
                                        teamColor: currentTeam.color,
                                        kills: p.kills !== undefined ? p.kills : 0,
                                        aces: p.aces !== undefined ? p.aces : 0,
                                        blocks: p.blocks !== undefined ? p.blocks : 0,
                                        showStats: p.showStats !== false,
                                      },
                                      true
                                    );
                                  }}
                                  title="Push player card with stats directly to live broadcast"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>On Air</span>
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Selected Player Quick Live Stat Controller (+ / -) */}
                  {selectedPlayer && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">#{selectedPlayer.number} {selectedPlayer.name}</span>
                          <span className="text-[11px] text-purple-400 font-mono">({selectedPlayer.position})</span>
                          {selectedPlayer.showStats === false && (
                            <Badge variant="outline" className="text-[9px] text-slate-400 border-slate-700">Stats Hidden</Badge>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenEditPlayer(selectedPlayer, selectedTeamRoster)}
                          className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit Full Details & Stats</span>
                        </button>
                      </div>

                      {/* Live Volleyball Stat Quick Adjusters */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* KILLS */}
                        <div className="flex items-center justify-between bg-red-950/30 border border-red-900/50 p-2 rounded-lg">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
                              <Flame className="h-3 w-3" /> Kills
                            </div>
                            <div className="text-lg font-black font-mono text-white leading-tight">
                              {selectedPlayer.kills !== undefined ? selectedPlayer.kills : 0}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => handleAdjustStat('kills', 1)}
                              className="w-5 h-5 bg-red-600 hover:bg-red-500 active:scale-95 text-white rounded text-xs font-black flex items-center justify-center transition-all shadow-sm"
                              title="+1 Kill"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustStat('kills', -1)}
                              className="w-5 h-5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded text-xs font-black flex items-center justify-center transition-all"
                              title="-1 Kill"
                            >
                              -
                            </button>
                          </div>
                        </div>

                        {/* ACES */}
                        <div className="flex items-center justify-between bg-amber-950/30 border border-amber-900/50 p-2 rounded-lg">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                              <Zap className="h-3 w-3" /> Aces
                            </div>
                            <div className="text-lg font-black font-mono text-white leading-tight">
                              {selectedPlayer.aces !== undefined ? selectedPlayer.aces : 0}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => handleAdjustStat('aces', 1)}
                              className="w-5 h-5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white rounded text-xs font-black flex items-center justify-center transition-all shadow-sm"
                              title="+1 Ace"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustStat('aces', -1)}
                              className="w-5 h-5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded text-xs font-black flex items-center justify-center transition-all"
                              title="-1 Ace"
                            >
                              -
                            </button>
                          </div>
                        </div>

                        {/* BLOCKS */}
                        <div className="flex items-center justify-between bg-cyan-950/30 border border-cyan-900/50 p-2 rounded-lg">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                              <Shield className="h-3 w-3" /> Blocks
                            </div>
                            <div className="text-lg font-black font-mono text-white leading-tight">
                              {selectedPlayer.blocks !== undefined ? selectedPlayer.blocks : 0}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => handleAdjustStat('blocks', 1)}
                              className="w-5 h-5 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white rounded text-xs font-black flex items-center justify-center transition-all shadow-sm"
                              title="+1 Block"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustStat('blocks', -1)}
                              className="w-5 h-5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded text-xs font-black flex items-center justify-center transition-all"
                              title="-1 Block"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex gap-3">
                    <Button
                      variant="broadcast"
                      className="flex-1 gap-2"
                      disabled={!selectedPlayer}
                      onClick={() => {
                        if (!selectedPlayer) return;
                        const currentTeam = selectedTeamRoster === 'A' ? match.teamA : match.teamB;
                        dispatchGraphic(
                          'PLAYER_INTRO',
                          {
                            playerName: selectedPlayer.name,
                            jerseyNumber: selectedPlayer.number,
                            position: selectedPlayer.position,
                            teamName: currentTeam.name,
                            teamColor: currentTeam.color,
                            kills: selectedPlayer.kills !== undefined ? selectedPlayer.kills : 0,
                            aces: selectedPlayer.aces !== undefined ? selectedPlayer.aces : 0,
                            blocks: selectedPlayer.blocks !== undefined ? selectedPlayer.blocks : 0,
                            showStats: selectedPlayer.showStats !== false,
                          },
                          true
                        );
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span>Trigger Selected Player Card</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => dispatchGraphic('SCOREBOARD', {}, true)}
                      className="border-slate-700 text-slate-400"
                    >
                      Dismiss Card
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: SPONSORS */}
            <TabsContent value="sponsors">
              <Card className="border-slate-800 bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    Sponsor Commercial Banner
                  </CardTitle>
                  <CardDescription>
                    Trigger sponsor advertisements during timeouts, rotations, and set transitions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {sponsorsList.map((sp) => {
                      const isSelected = selectedSponsor.name === sp.name;
                      return (
                        <div
                          key={sp.name}
                          onClick={() => setSelectedSponsor(sp)}
                          className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-950/30 border-amber-500'
                              : 'bg-slate-950 border-slate-800 hover:bg-slate-800/60'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-mono font-bold text-amber-400">{sp.subtitle}</div>
                            <div className="font-bold text-white text-sm">{sp.name}</div>
                            <div className="text-xs text-slate-400">{sp.tagline}</div>
                          </div>
                          {isSelected && <Badge variant="warning" className="text-[9px]">SELECTED</Badge>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button
                      variant="broadcast"
                      className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-bold gap-2"
                      onClick={() =>
                        dispatchGraphic(
                          'SPONSOR_BREAK',
                          {
                            sponsorName: selectedSponsor.name,
                            tagline: selectedSponsor.tagline,
                            subtitle: selectedSponsor.subtitle,
                          },
                          true
                        )
                      }
                    >
                      <Eye className="h-4 w-4" />
                      <span>Trigger Sponsor Banner</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => dispatchGraphic('SCOREBOARD', {}, true)}
                      className="border-slate-700 text-slate-400"
                    >
                      Dismiss Banner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5: SET RESULTS & WINNER */}
            <TabsContent value="results">
              <Card className="border-slate-800 bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-purple-400" />
                    Set Results & Match Victory Graphics
                  </CardTitle>
                  <CardDescription>
                    Full-canvas breakdown cards for between-set intervals and match conclusion.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">Full Set Breakdown</div>
                        <p className="text-xs text-slate-400 mt-1">
                          Displays Set 1 through 4 scores with winners highlighted.
                        </p>
                      </div>
                      <Button
                        variant="broadcast"
                        size="sm"
                        className="mt-4"
                        onClick={() =>
                          dispatchGraphic(
                            'SET_RESULTS',
                            {
                              matchTitle: match.tournament,
                              teamAName: match.teamA.name,
                              teamBName: match.teamB.name,
                              teamAColor: match.teamA.color,
                              teamBColor: match.teamB.color,
                              sets: [
                                { setNumber: 1, scoreA: 25, scoreB: 21, winner: 'A' },
                                { setNumber: 2, scoreA: 22, scoreB: 25, winner: 'B' },
                                { setNumber: 3, scoreA: 25, scoreB: 23, winner: 'A' },
                                { setNumber: 4, scoreA: 25, scoreB: 19, winner: 'A' },
                              ],
                              teamASetsWon: 3,
                              teamBSetsWon: 1,
                            },
                            true
                          )
                        }
                      >
                        Display Set Results
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">Match Winner Celebration</div>
                        <p className="text-xs text-slate-400 mt-1">
                          Celebratory victory card announcing champion team.
                        </p>
                      </div>
                      <Button
                        variant="broadcast"
                        size="sm"
                        className="mt-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-bold hover:from-amber-500 hover:to-yellow-400"
                        onClick={() =>
                          dispatchGraphic(
                            'MATCH_WINNER',
                            {
                              winnerName: match.teamA.name,
                              winnerColor: match.teamA.color,
                              finalScoreText: '3 - 1 (Sets)',
                              tournamentTitle: match.tournament,
                              runnerUpName: match.teamB.name,
                            },
                            true
                          )
                        }
                      >
                        Announce Winner
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 6: CUSTOM LOWER THIRD */}
            <TabsContent value="announcements">
              <Card className="border-slate-800 bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-purple-400" />
                    Custom Lower-Third Announcement
                  </CardTitle>
                  <CardDescription>
                    Broadcast custom text messages, injury notices, or referee explanations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Badge Label</label>
                      <Input
                        value={customBadge}
                        onChange={(e) => setCustomBadge(e.target.value)}
                        placeholder="e.g. TIMEOUT"
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Announcement Title</label>
                      <Input
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="e.g. OFFICIAL TIMEOUT"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Message Text</label>
                    <textarea
                      value={customMsg}
                      onChange={(e) => setCustomMsg(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. Challenge confirmed - ball ruled inside court boundary."
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button
                      variant="broadcast"
                      className="flex-1 gap-2"
                      onClick={() =>
                        dispatchGraphic(
                          'CUSTOM_ANNOUNCEMENT',
                          {
                            title: customTitle,
                            message: customMsg,
                            badgeText: customBadge,
                          },
                          true
                        )
                      }
                    >
                      <Eye className="h-4 w-4" />
                      <span>Display Lower-Third</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => dispatchGraphic('SCOREBOARD', {}, true)}
                      className="border-slate-700 text-slate-400"
                    >
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right 5 Columns: Interactive 16:9 Live Preview Canvas Simulator with Real Video */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-800 bg-slate-900/90 sticky top-24">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Radio className="h-4 w-4 text-red-500 animate-pulse" />
                  Live Broadcast Video & Overlay Monitor
                </CardTitle>
                <Badge variant={isGraphicVisible ? 'live' : 'secondary'} className="text-[10px]">
                  {isGraphicVisible ? activeGraphic : 'MUTED'}
                </Badge>
              </div>
              <CardDescription className="text-[11px]">
                Real-time 16:9 monitor showing your actual match video feed with live scoreboard & graphics
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              {/* Scaled 16:9 Aspect Ratio Container for 1920x1080 canvas */}
              <div className="relative w-full aspect-video bg-black rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
                {/* Scaled Overlay Container with Real Playing Video */}
                <div
                  className="absolute top-0 left-0 origin-top-left pointer-events-none"
                  style={{
                    transform: 'scale(0.245)',
                    width: '1920px',
                    height: '1080px',
                  }}
                >
                  <OverlayContainer
                    graphicState={{
                      activeGraphic,
                      isVisible: isGraphicVisible,
                      payload: currentPayload,
                    }}
                    match={match}
                    videoConfig={videoConfig}
                  />
                </div>
              </div>

              {/* Monitor Footer Info */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Active: <span className="font-bold text-white">{activeGraphic}</span></span>
                <span>Canvas: 1920&times;1080 (Full HD)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Add Player Dialog */}
      <Dialog open={addPlayerOpen} onOpenChange={setAddPlayerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <UserPlus className="h-5 w-5 text-purple-400" />
              Add Player to Roster
            </DialogTitle>
            <DialogDescription>
              Add a new volleyball player to Team {newPlayerForm.team} ({newPlayerForm.team === 'A' ? match.teamA.name : match.teamB.name}) for on-air lower-third spotlights.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddNewPlayer} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Assign to Team</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewPlayerForm({ ...newPlayerForm, team: 'A' })}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                    newPlayerForm.team === 'A'
                      ? 'bg-red-950/60 border-red-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Team A ({match.teamA.code})
                </button>
                <button
                  type="button"
                  onClick={() => setNewPlayerForm({ ...newPlayerForm, team: 'B' })}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                    newPlayerForm.team === 'B'
                      ? 'bg-blue-950/60 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Team B ({match.teamB.code})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Player Name</label>
                <Input
                  value={newPlayerForm.name}
                  onChange={(e) => setNewPlayerForm({ ...newPlayerForm, name: e.target.value })}
                  placeholder="e.g. Jordan Lee"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Jersey #</label>
                <Input
                  type="number"
                  min="0"
                  max="99"
                  value={newPlayerForm.number}
                  onChange={(e) => setNewPlayerForm({ ...newPlayerForm, number: e.target.value })}
                  placeholder="23"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Volleyball Position</label>
              <select
                value={newPlayerForm.position}
                onChange={(e) => setNewPlayerForm({ ...newPlayerForm, position: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Setter">Setter (S)</option>
                <option value="Outside Hitter">Outside Hitter (OH)</option>
                <option value="Middle Blocker">Middle Blocker (MB)</option>
                <option value="Opposite Spiker">Opposite Spiker (OPP)</option>
                <option value="Libero">Libero (L)</option>
                <option value="Defensive Specialist">Defensive Specialist (DS)</option>
                <option value="Serving Specialist">Serving Specialist (SS)</option>
              </select>
            </div>

            {/* Performance Stats: Kills, Aces, Blocks */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Match Performance Stats</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-purple-400">
                  <input
                    type="checkbox"
                    checked={newPlayerForm.showStats}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, showStats: e.target.checked })}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Show on Screen</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1 bg-red-950/20 border border-red-900/40 p-2 rounded-lg">
                  <label className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">
                    <Flame className="h-3 w-3" /> Kills
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newPlayerForm.kills}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, kills: e.target.value })}
                    className="h-8 font-mono font-bold text-center bg-slate-900 border-red-900/60"
                  />
                </div>

                <div className="space-y-1 bg-amber-950/20 border border-amber-900/40 p-2 rounded-lg">
                  <label className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Aces
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newPlayerForm.aces}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, aces: e.target.value })}
                    className="h-8 font-mono font-bold text-center bg-slate-900 border-amber-900/60"
                  />
                </div>

                <div className="space-y-1 bg-cyan-950/20 border border-cyan-900/40 p-2 rounded-lg">
                  <label className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Blocks
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newPlayerForm.blocks}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, blocks: e.target.value })}
                    className="h-8 font-mono font-bold text-center bg-slate-900 border-cyan-900/60"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPlayerForm.isStarter}
                  onChange={(e) => setNewPlayerForm({ ...newPlayerForm, isStarter: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-300">Starting 6</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPlayerForm.isCaptain}
                  onChange={(e) => setNewPlayerForm({ ...newPlayerForm, isCaptain: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-300">Team Captain</span>
              </label>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setAddPlayerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="broadcast">
                Save & Add to Roster
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Player & Match Stats Dialog */}
      <Dialog open={editPlayerOpen} onOpenChange={setEditPlayerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Edit2 className="h-5 w-5 text-purple-400" />
              Edit Player & Match Stats
            </DialogTitle>
            <DialogDescription>
              Update player profile, position, and volleyball performance stats (Kills, Aces, Blocks) shown on the broadcast.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePlayerEdit} className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Player Name</label>
                <Input
                  value={editPlayerForm.name}
                  onChange={(e) => setEditPlayerForm({ ...editPlayerForm, name: e.target.value })}
                  placeholder="Player Name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Jersey #</label>
                <Input
                  type="number"
                  min="0"
                  max="99"
                  value={editPlayerForm.number}
                  onChange={(e) => setEditPlayerForm({ ...editPlayerForm, number: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Volleyball Position</label>
              <select
                value={editPlayerForm.position}
                onChange={(e) => setEditPlayerForm({ ...editPlayerForm, position: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Setter">Setter (S)</option>
                <option value="Outside Hitter">Outside Hitter (OH)</option>
                <option value="Middle Blocker">Middle Blocker (MB)</option>
                <option value="Opposite Spiker">Opposite Spiker (OPP)</option>
                <option value="Libero">Libero (L)</option>
                <option value="Defensive Specialist">Defensive Specialist (DS)</option>
                <option value="Serving Specialist">Serving Specialist (SS)</option>
              </select>
            </div>

            {/* Performance Stats: Kills, Aces, Blocks */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Broadcast Performance Stats</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-purple-400">
                  <input
                    type="checkbox"
                    checked={editPlayerForm.showStats}
                    onChange={(e) => setEditPlayerForm({ ...editPlayerForm, showStats: e.target.checked })}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Show on Screen</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1 bg-red-950/20 border border-red-900/40 p-2 rounded-lg">
                  <label className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">
                    <Flame className="h-3 w-3" /> Kills
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editPlayerForm.kills}
                    onChange={(e) => setEditPlayerForm({ ...editPlayerForm, kills: e.target.value })}
                    className="h-8 font-mono font-bold text-center bg-slate-900 border-red-900/60"
                  />
                </div>

                <div className="space-y-1 bg-amber-950/20 border border-amber-900/40 p-2 rounded-lg">
                  <label className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Aces
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editPlayerForm.aces}
                    onChange={(e) => setEditPlayerForm({ ...editPlayerForm, aces: e.target.value })}
                    className="h-8 font-mono font-bold text-center bg-slate-900 border-amber-900/60"
                  />
                </div>

                <div className="space-y-1 bg-cyan-950/20 border border-cyan-900/40 p-2 rounded-lg">
                  <label className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Blocks
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editPlayerForm.blocks}
                    onChange={(e) => setEditPlayerForm({ ...editPlayerForm, blocks: e.target.value })}
                    className="h-8 font-mono font-bold text-center bg-slate-900 border-cyan-900/60"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPlayerForm.isStarter}
                  onChange={(e) => setEditPlayerForm({ ...editPlayerForm, isStarter: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-300">Starting 6</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPlayerForm.isCaptain}
                  onChange={(e) => setEditPlayerForm({ ...editPlayerForm, isCaptain: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-300">Team Captain</span>
              </label>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setEditPlayerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="broadcast">
                Save & Update Live
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
