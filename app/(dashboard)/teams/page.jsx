'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Shirt,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function TeamsPage() {
  const [teams, setTeams] = useState([
    {
      id: 'team-1',
      name: 'Thunder Volley',
      shortCode: 'THU',
      color: '#dc2626',
      coach: 'Marco Rossi',
      players: [
        { id: 'p1', name: 'Alex Rivera', number: 7, position: 'Setter', isCaptain: true, isStarter: true },
        { id: 'p2', name: 'Marcus Chen', number: 10, position: 'Outside Hitter', isCaptain: false, isStarter: true },
        { id: 'p3', name: 'David Okafor', number: 14, position: 'Middle Blocker', isCaptain: false, isStarter: true },
        { id: 'p4', name: 'Liam Vance', number: 3, position: 'Libero', isCaptain: false, isStarter: true },
        { id: 'p5', name: 'Julian Schmidt', number: 9, position: 'Opposite Spiker', isCaptain: false, isStarter: true },
        { id: 'p6', name: 'Mateo Morales', number: 12, position: 'Outside Hitter', isCaptain: false, isStarter: true },
        { id: 'p7a', name: 'Ethan Walker', number: 15, position: 'Middle Blocker', isCaptain: false, isStarter: false },
        { id: 'p8a', name: 'Lucas Ortiz', number: 18, position: 'Defensive Specialist', isCaptain: false, isStarter: false },
        { id: 'p9a', name: 'Noah Bennett', number: 5, position: 'Reserve Setter', isCaptain: false, isStarter: false },
        { id: 'p10a', name: 'Sam Tyler', number: 21, position: 'Outside Hitter', isCaptain: false, isStarter: false },
      ],
    },
    {
      id: 'team-2',
      name: 'Cyclone Spikers',
      shortCode: 'CYC',
      color: '#2563eb',
      coach: 'Elena Petrova',
      players: [
        { id: 'p7', name: 'Nikola Vanev', number: 4, position: 'Setter', isCaptain: true, isStarter: true },
        { id: 'p8', name: 'Kenji Sato', number: 11, position: 'Outside Hitter', isCaptain: false, isStarter: true },
        { id: 'p9', name: 'Lukas Meyer', number: 16, position: 'Middle Blocker', isCaptain: false, isStarter: true },
        { id: 'p10', name: 'Carlos Santos', number: 1, position: 'Libero', isCaptain: false, isStarter: true },
        { id: 'p11', name: 'Gabriel Silva', number: 8, position: 'Opposite Spiker', isCaptain: false, isStarter: true },
        { id: 'p12', name: 'Oliver Hansen', number: 5, position: 'Middle Blocker', isCaptain: false, isStarter: true },
        { id: 'p13b', name: 'Andre Varga', number: 13, position: 'Outside Hitter', isCaptain: false, isStarter: false },
        { id: 'p14b', name: 'Sean Miller', number: 2, position: 'Defensive Specialist', isCaptain: false, isStarter: false },
        { id: 'p15b', name: 'Hiroshi Tanaka', number: 9, position: 'Reserve Setter', isCaptain: false, isStarter: false },
        { id: 'p16b', name: 'Maxim Morozov', number: 17, position: 'Middle Blocker', isCaptain: false, isStarter: false },
      ],
    },
  ]);

  const [selectedTeamId, setSelectedTeamId] = useState('team-1');
  const [addTeamOpen, setAddTeamOpen] = useState(false);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);

  // New team form state
  const [newTeam, setNewTeam] = useState({
    name: '',
    shortCode: '',
    color: '#7c3aed',
    coach: '',
  });

  // New player form state
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    number: '',
    position: 'Outside Hitter',
    isCaptain: false,
    isStarter: true,
    kills: 0,
    aces: 0,
    blocks: 0,
  });

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.shortCode) return;
    const created = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      shortCode: newTeam.shortCode.toUpperCase(),
      color: newTeam.color,
      coach: newTeam.coach || 'Head Coach',
      players: [],
    };
    setTeams([...teams, created]);
    setSelectedTeamId(created.id);
    setNewTeam({ name: '', shortCode: '', color: '#7c3aed', coach: '' });
    setAddTeamOpen(false);
  };

  const handleCreatePlayer = (e) => {
    e.preventDefault();
    if (!newPlayer.name || !newPlayer.number) return;
    const createdPlayer = {
      id: `p-${Date.now()}`,
      name: newPlayer.name,
      number: parseInt(newPlayer.number, 10),
      position: newPlayer.position,
      isCaptain: Boolean(newPlayer.isCaptain),
      isStarter: Boolean(newPlayer.isStarter),
      kills: parseInt(newPlayer.kills || 0, 10),
      aces: parseInt(newPlayer.aces || 0, 10),
      blocks: parseInt(newPlayer.blocks || 0, 10),
      showStats: true,
    };

    setTeams(
      teams.map((t) => {
        if (t.id === selectedTeamId) {
          return {
            ...t,
            players: [...t.players, createdPlayer],
          };
        }
        return t;
      })
    );

    setNewPlayer({
      name: '',
      number: '',
      position: 'Outside Hitter',
      isCaptain: false,
      isStarter: true,
      kills: 0,
      aces: 0,
      blocks: 0,
    });
    setAddPlayerOpen(false);
  };

  const handleDeletePlayer = (playerId) => {
    setTeams(
      teams.map((t) => {
        if (t.id === selectedTeamId) {
          return {
            ...t,
            players: t.players.filter((p) => p.id !== playerId),
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-400" />
            Teams & Player Rosters
          </h1>
          <p className="text-xs text-slate-400">
            Configure teams, jersey numbers, and volleyball positions for on-screen player lower-thirds and intros.
          </p>
        </div>

        <Button variant="broadcast" onClick={() => setAddTeamOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New Team</span>
        </Button>
      </div>

      {/* Main Layout: Team Selector on Left, Roster Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Teams List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Registered Teams ({teams.length})
          </div>

          <div className="space-y-2">
            {teams.map((team) => {
              const isSelected = team.id === selectedTeamId;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-md'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-10 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{team.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-semibold">{team.shortCode}</span>
                        <span>&bull;</span>
                        <span>{team.players.length} Players</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Cols: Active Team Details & Roster */}
        <Card className="lg:col-span-3 border-slate-800 bg-slate-900/90">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div
                className="w-5 h-12 rounded-lg shadow-md"
                style={{ backgroundColor: selectedTeam.color }}
              />
              <div>
                <CardTitle className="text-2xl font-black text-white">
                  {selectedTeam.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-bold text-purple-400">{selectedTeam.shortCode}</span>
                  <span>&bull;</span>
                  <span>Coach: {selectedTeam.coach}</span>
                </CardDescription>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAddPlayerOpen(true)}
              className="gap-1.5 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              <UserPlus className="h-4 w-4 text-purple-400" />
              <span>Add Player to Roster</span>
            </Button>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5"># Jersey</th>
                    <th className="p-3.5">Player Name</th>
                    <th className="p-3.5">Volleyball Position</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {selectedTeam.players.map((player) => (
                    <tr key={player.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <span className="font-black text-base text-white bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                          #{player.number}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-sm text-slate-100 font-sans">
                        {player.name}
                        {player.isCaptain && (
                          <Badge variant="warning" className="ml-2 text-[9px] py-0 px-1.5">
                            CAPTAIN
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 text-purple-300 font-medium font-sans">
                        {player.position}
                      </td>
                      <td className="p-3.5 font-sans">
                        {player.isStarter ? (
                          <span className="text-emerald-400 font-medium">Starter</span>
                        ) : (
                          <span className="text-slate-500">Bench</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-sans">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlayer(player.id)}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {selectedTeam.players.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                        No players registered yet. Click &quot;Add Player to Roster&quot; to add starting lineup.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog: Add New Team */}
      <Dialog open={addTeamOpen} onOpenChange={setAddTeamOpen}>
        <DialogContent onClose={() => setAddTeamOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Volleyball Team</DialogTitle>
            <DialogDescription>
              Enter the team name, 3-letter broadcast code, and primary theme color.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Team Full Name</label>
              <Input
                placeholder="e.g. Thunder Volley"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Short Code (2-4 Chars)</label>
                <Input
                  placeholder="e.g. THU"
                  maxLength={4}
                  value={newTeam.shortCode}
                  onChange={(e) => setNewTeam({ ...newTeam, shortCode: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Team Color (Hex)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={newTeam.color}
                    onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })}
                    className="h-10 w-12 rounded cursor-pointer bg-slate-900 border border-slate-700"
                  />
                  <Input
                    value={newTeam.color}
                    onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })}
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Head Coach</label>
              <Input
                placeholder="e.g. Marco Rossi"
                value={newTeam.coach}
                onChange={(e) => setNewTeam({ ...newTeam, coach: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddTeamOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="broadcast">
                Create Team
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Add Player */}
      <Dialog open={addPlayerOpen} onOpenChange={setAddPlayerOpen}>
        <DialogContent onClose={() => setAddPlayerOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Player to {selectedTeam.name}</DialogTitle>
            <DialogDescription>
              Assign player name, jersey number, and volleyball court position.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlayer} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Player Full Name</label>
              <Input
                placeholder="e.g. Alex Rivera"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Jersey Number</label>
                <Input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="7"
                  value={newPlayer.number}
                  onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Volleyball Position</label>
                <select
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Setter">Setter</option>
                  <option value="Outside Hitter">Outside Hitter</option>
                  <option value="Middle Blocker">Middle Blocker</option>
                  <option value="Libero">Libero</option>
                  <option value="Opposite Spiker">Opposite Spiker</option>
                  <option value="Defensive Specialist">Defensive Specialist</option>
                </select>
              </div>
            </div>

            {/* Match Performance Stats (Kills, Aces, Blocks) */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300">Initial Match Stats (Broadcast)</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-red-400 font-bold uppercase">Kills</label>
                  <Input
                    type="number"
                    min="0"
                    value={newPlayer.kills}
                    onChange={(e) => setNewPlayer({ ...newPlayer, kills: e.target.value })}
                    className="h-8 text-center font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-amber-400 font-bold uppercase">Aces</label>
                  <Input
                    type="number"
                    min="0"
                    value={newPlayer.aces}
                    onChange={(e) => setNewPlayer({ ...newPlayer, aces: e.target.value })}
                    className="h-8 text-center font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-cyan-400 font-bold uppercase">Blocks</label>
                  <Input
                    type="number"
                    min="0"
                    value={newPlayer.blocks}
                    onChange={(e) => setNewPlayer({ ...newPlayer, blocks: e.target.value })}
                    className="h-8 text-center font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPlayer.isCaptain}
                  onChange={(e) => setNewPlayer({ ...newPlayer, isCaptain: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Team Captain</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPlayer.isStarter}
                  onChange={(e) => setNewPlayer({ ...newPlayer, isStarter: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Starting Lineup</span>
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddPlayerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="broadcast">
                Save Player
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
