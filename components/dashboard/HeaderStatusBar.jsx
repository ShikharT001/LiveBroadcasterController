'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Radio,
  Tv,
  Layers,
  Activity,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  PlaySquare,
  Shield,
  Users,
  Settings,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { obsBridgeClient } from '@/lib/obs/bridgeClient';

export function HeaderStatusBar({ currentMatch }) {
  const pathname = usePathname();
  const [bridgeStatus, setBridgeStatus] = useState({
    bridgeOnline: false,
    obsConnected: false,
    currentScene: 'LIVE_MATCH',
    isStreaming: false,
  });

  // Poll OBS Bridge status
  useEffect(() => {
    let isMounted = true;
    const checkBridge = async () => {
      try {
        const data = await obsBridgeClient.getHealth();
        if (data && data.bridge === 'online') {
          if (isMounted) {
            setBridgeStatus({
              bridgeOnline: true,
              obsConnected: data.obsConnected || false,
              currentScene: data.currentScene || 'LIVE_MATCH',
              isStreaming: data.isStreaming || false,
            });
          }
        } else {
          if (isMounted) {
            setBridgeStatus(prev => ({ ...prev, bridgeOnline: false, obsConnected: false }));
          }
        }
      } catch (err) {
        if (isMounted) {
          setBridgeStatus(prev => ({ ...prev, bridgeOnline: false, obsConnected: false }));
        }
      }
    };

    checkBridge();
    const interval = setInterval(checkBridge, 5000);

    const handleSettingsChange = () => {
      checkBridge();
    };

    window.addEventListener('obs_bridge_settings_changed', handleSettingsChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('obs_bridge_settings_changed', handleSettingsChange);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Tv },
    { href: '/match', label: 'Match Control', icon: Activity },
    { href: '/graphics', label: 'Graphics Control', icon: Layers },
    { href: '/obs', label: 'OBS Studio', icon: Radio },
    { href: '/teams', label: 'Teams & Rosters', icon: Users },
  ];

  const matchId = currentMatch?.id || 'demo-volleyball-1';

  return (
    <header className="border-b border-broadcast-border bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Status Bar */}
      <div className="px-4 py-2 border-b border-slate-900 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-purple-400">
            <Radio className="h-4 w-4 animate-pulse text-red-500" />
            <span>AGY BROADCAST ENGINE</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          {/* Current Match Ticker */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase font-mono">Current Match:</span>
            <span className="font-semibold text-slate-200">
              {currentMatch ? `${currentMatch.team_a?.name || 'Team A'} vs ${currentMatch.team_b?.name || 'Team B'}` : 'Volleyball Finals: Spikers vs Titans'}
            </span>
            <Badge variant="live" className="text-[10px] py-0 px-2 h-4">
              LIVE
            </Badge>
          </div>
        </div>

        {/* System & OBS Telemetry Badges */}
        <div className="flex items-center space-x-3">
          {/* OBS Bridge Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Bridge:</span>
            {bridgeStatus.bridgeOnline ? (
              <Badge variant="success" className="text-[10px] py-0 px-1.5 h-4">
                <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> ONLINE
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px] py-0 px-1.5 h-4">
                <AlertTriangle className="h-2.5 w-2.5 mr-1" /> OFFLINE
              </Badge>
            )}
          </div>

          {/* OBS Studio Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">OBS:</span>
            {bridgeStatus.obsConnected ? (
              <Badge variant="success" className="text-[10px] py-0 px-1.5 h-4">
                <Radio className="h-2.5 w-2.5 mr-1 text-emerald-400" /> CONNECTED
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 text-slate-400">
                DISCONNECTED
              </Badge>
            )}
          </div>

          {/* Current Scene */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Scene:</span>
            <span className="font-mono text-purple-300 font-bold bg-purple-950/60 border border-purple-800/60 px-1.5 py-0.5 rounded text-[11px]">
              {bridgeStatus.currentScene}
            </span>
          </div>

          {/* Streaming Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Stream:</span>
            {bridgeStatus.isStreaming ? (
              <Badge variant="live" className="text-[10px] py-0 px-1.5 h-4">
                STREAMING
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                OFFLINE
              </Badge>
            )}
          </div>

          {/* Overlay Link button */}
          <a
            href={`/overlay/${matchId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40 text-[11px] font-medium transition-colors"
          >
            <span>OBS Overlay URL</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Tv className="h-4 w-4 text-white" />
            </div>
            <span>MatchCast<span className="text-purple-400 font-mono text-sm ml-1">PRO</span></span>
          </Link>

          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <Shield className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-slate-400">Operator:</span>
            <span className="font-semibold text-slate-200">Broadcast Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
