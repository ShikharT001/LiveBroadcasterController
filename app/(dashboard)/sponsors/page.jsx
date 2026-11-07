'use client';

import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Eye,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([
    {
      id: 'sp-1',
      name: 'Apex Sports Nutrition',
      tagline: 'Fueling Champions Every Spike',
      tier: 'title',
      isActive: true,
      logoUrl: '',
    },
    {
      id: 'sp-2',
      name: 'Vortex Athletics',
      tagline: 'Official Performance Footwear & Apparel',
      tier: 'gold',
      isActive: true,
      logoUrl: '',
    },
    {
      id: 'sp-3',
      name: 'HydraPure Electrolytes',
      tagline: 'Fast Rehydration for Elite Athletes',
      tier: 'silver',
      isActive: true,
      logoUrl: '',
    },
  ]);

  const [addSponsorOpen, setAddSponsorOpen] = useState(false);
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    tagline: '',
    tier: 'partner',
    isActive: true,
  });

  const [activeOnScreenSponsor, setActiveOnScreenSponsor] = useState(null);

  const handleCreateSponsor = (e) => {
    e.preventDefault();
    if (!newSponsor.name) return;

    const created = {
      id: `sp-${Date.now()}`,
      name: newSponsor.name,
      tagline: newSponsor.tagline || 'Official Broadcast Partner',
      tier: newSponsor.tier,
      isActive: newSponsor.isActive,
      logoUrl: '',
    };

    setSponsors([...sponsors, created]);
    setNewSponsor({ name: '', tagline: '', tier: 'partner', isActive: true });
    setAddSponsorOpen(false);
  };

  const handleDeleteSponsor = (id) => {
    setSponsors(sponsors.filter((s) => s.id !== id));
  };

  const handleTriggerSponsor = (sponsor) => {
    setActiveOnScreenSponsor(sponsor.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-400" />
            Sponsors & Commercial Graphics
          </h1>
          <p className="text-xs text-slate-400">
            Manage commercial broadcast sponsors and trigger pop-up banners during timeouts and set breaks.
          </p>
        </div>

        <Button variant="broadcast" onClick={() => setAddSponsorOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New Sponsor</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => {
          const isTriggered = activeOnScreenSponsor === sponsor.id;
          return (
            <Card
              key={sponsor.id}
              className={`border transition-all ${
                isTriggered
                  ? 'border-purple-500 bg-purple-950/20 shadow-xl'
                  : 'border-slate-800 bg-slate-900/80 hover:bg-slate-900'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      sponsor.tier === 'title'
                        ? 'live'
                        : sponsor.tier === 'gold'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="text-[10px] uppercase font-bold"
                  >
                    {sponsor.tier} Sponsor
                  </Badge>

                  {isTriggered && (
                    <Badge variant="live" className="text-[10px] py-0 px-2 animate-pulse">
                      ON AIR
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-bold text-white mt-2">
                  {sponsor.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  {sponsor.tagline}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 font-bold mb-2">
                    {sponsor.name.charAt(0)}
                  </div>
                  <div className="text-xs font-semibold text-slate-300">{sponsor.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{sponsor.tagline}</div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <Button
                    variant={isTriggered ? 'live' : 'secondary'}
                    size="sm"
                    onClick={() => handleTriggerSponsor(sponsor)}
                    className="flex-1 text-xs gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{isTriggered ? 'Live on Screen' : 'Trigger Banner'}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSponsor(sponsor.id)}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog: Add Sponsor */}
      <Dialog open={addSponsorOpen} onOpenChange={setAddSponsorOpen}>
        <DialogContent onClose={() => setAddSponsorOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Broadcast Sponsor</DialogTitle>
            <DialogDescription>
              Enter brand name, promotional message or tagline, and tier.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSponsor} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Brand / Sponsor Name</label>
              <Input
                placeholder="e.g. Apex Sports"
                value={newSponsor.name}
                onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tagline / On-Screen Message</label>
              <Input
                placeholder="e.g. Official Fuel of Volleyball Champions"
                value={newSponsor.tagline}
                onChange={(e) => setNewSponsor({ ...newSponsor, tagline: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Sponsorship Tier</label>
              <select
                value={newSponsor.tier}
                onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                className="w-full h-10 px-3 rounded-md bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="title">Title Sponsor</option>
                <option value="gold">Gold Partner</option>
                <option value="silver">Silver Partner</option>
                <option value="partner">Official Partner</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddSponsorOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="broadcast">
                Add Sponsor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
