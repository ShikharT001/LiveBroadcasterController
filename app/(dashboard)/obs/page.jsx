'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Tv,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  RefreshCw,
  Layers,
  Eye,
  EyeOff,
  Settings,
  HelpCircle,
  ExternalLink,
  Shield,
  Activity,
  Cpu,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { obsBridgeClient } from '@/lib/obs/bridgeClient';

export default function OBSControlPage() {
  const [bridgeUrl, setBridgeUrl] = useState('http://localhost:4000');
  const [bridgeSecret, setBridgeSecret] = useState('broadcaster-secure-secret-2025');
  const [isSaved, setIsSaved] = useState(false);

  // Load saved preferences on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('obs_bridge_url');
      const savedSecret = localStorage.getItem('obs_bridge_secret');
      if (savedUrl) setBridgeUrl(savedUrl);
      else if (process.env.NEXT_PUBLIC_OBS_BRIDGE_URL) setBridgeUrl(process.env.NEXT_PUBLIC_OBS_BRIDGE_URL);

      if (savedSecret) setBridgeSecret(savedSecret);
      else if (process.env.NEXT_PUBLIC_OBS_BRIDGE_SECRET) setBridgeSecret(process.env.NEXT_PUBLIC_OBS_BRIDGE_SECRET);
    }
  }, []);

  const [bridgeStatus, setBridgeStatus] = useState({
    bridgeOnline: false,
    obsConnected: false,
    currentScene: 'LIVE_MATCH',
    isStreaming: false,
    lastError: null,
  });

  const [scenes, setScenes] = useState([
    { name: 'LIVE_MATCH' },
    { name: 'PLAYER_INTRO' },
    { name: 'SPONSOR_BREAK' },
    { name: 'SET_RESULTS' },
    { name: 'MATCH_WINNER' },
  ]);

  const [sources, setSources] = useState([
    { id: 1, name: 'Match Video (Camera)', type: 'dshow_input', enabled: true },
    { id: 2, name: 'NextJS Broadcast Overlay', type: 'browser_source', enabled: true },
    { id: 3, name: 'Court Ambient Audio', type: 'wasapi_input_capture', enabled: true },
  ]);

  const [streamStats, setStreamStats] = useState({
    timecode: '01:24:18',
    fps: 60,
    cpu: '4.2%',
    kbitsPerSec: 6500,
  });

  const [loading, setLoading] = useState(false);
  const [confirmStreamStopOpen, setConfirmStreamStopOpen] = useState(false);
  const [confirmStreamStartOpen, setConfirmStreamStartOpen] = useState(false);

  // Poll bridge status
  const checkStatus = async () => {
    setLoading(true);
    try {
      obsBridgeClient.setBridgeUrl(bridgeUrl);
      obsBridgeClient.setSecret(bridgeSecret);

      const health = await obsBridgeClient.getHealth();
      if (health.bridge === 'online') {
        setBridgeStatus({
          bridgeOnline: true,
          obsConnected: health.obsConnected || false,
          currentScene: health.currentScene || 'LIVE_MATCH',
          isStreaming: health.isStreaming || false,
          lastError: health.lastError || null,
        });

        // Try to fetch real scenes from OBS
        if (health.obsConnected) {
          try {
            const sceneData = await obsBridgeClient.getScenes();
            if (sceneData?.scenes?.length > 0) {
              setScenes(sceneData.scenes);
            }
          } catch (e) {
            // Keep default list
          }

          try {
            const sourceData = await obsBridgeClient.getSources(health.currentScene);
            if (sourceData?.sources?.length > 0) {
              setSources(sourceData.sources);
            }
          } catch (e) {
            // Keep default list
          }
        }
      } else {
        setBridgeStatus({
          bridgeOnline: false,
          obsConnected: false,
          currentScene: 'LIVE_MATCH',
          isStreaming: false,
          lastError: health.error || 'Bridge service unreachable at ' + bridgeUrl,
        });
      }
    } catch (err) {
      setBridgeStatus({
        bridgeOnline: false,
        obsConnected: false,
        currentScene: 'LIVE_MATCH',
        isStreaming: false,
        lastError: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 6000);
    return () => clearInterval(interval);
  }, [bridgeUrl, bridgeSecret]);

  // Switch scene action
  const handleSwitchScene = async (sceneName) => {
    try {
      if (bridgeStatus.obsConnected) {
        await obsBridgeClient.switchScene(sceneName);
      }
      setBridgeStatus((prev) => ({ ...prev, currentScene: sceneName }));
    } catch (err) {
      alert(`Failed to switch scene in OBS: ${err.message}`);
    }
  };

  // Toggle source visibility
  const handleToggleSource = async (sourceId, currentEnabled) => {
    const nextState = !currentEnabled;
    try {
      if (bridgeStatus.obsConnected) {
        await obsBridgeClient.setSourceVisibility(bridgeStatus.currentScene, sourceId, nextState);
      }
      setSources((prev) =>
        prev.map((s) => (s.id === sourceId ? { ...s, enabled: nextState } : s))
      );
    } catch (err) {
      alert(`Failed to toggle source visibility: ${err.message}`);
    }
  };

  // Stream controls
  const handleStartStream = async () => {
    try {
      if (bridgeStatus.obsConnected) {
        await obsBridgeClient.startStream();
      }
      setBridgeStatus((prev) => ({ ...prev, isStreaming: true }));
      setConfirmStreamStartOpen(false);
    } catch (err) {
      alert(`Failed to start streaming: ${err.message}`);
    }
  };

  const handleStopStream = async () => {
    try {
      if (bridgeStatus.obsConnected) {
        await obsBridgeClient.stopStream();
      }
      setBridgeStatus((prev) => ({ ...prev, isStreaming: false }));
      setConfirmStreamStopOpen(false);
    } catch (err) {
      alert(`Failed to stop streaming: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="live">OBS BROADCAST CONTROLLER</Badge>
            <span className="text-xs text-slate-400 font-mono">OBS STUDIO v28+ &bull; WEBSOCKET :4455</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Radio className="h-6 w-6 text-purple-400" />
            OBS Studio & Stream Controller
          </h1>
          <p className="text-xs text-slate-400">
            Control video compositions, switch scenes, toggle capture sources, and manage YouTube Live streaming safely via the local bridge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            disabled={loading}
            className="gap-1.5 border-slate-700 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </Button>

          {bridgeStatus.isStreaming ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmStreamStopOpen(true)}
              className="gap-1.5 broadcast-glow-red"
            >
              <Square className="h-3.5 w-3.5" />
              <span>Stop Streaming</span>
            </Button>
          ) : (
            <Button
              variant="broadcast"
              size="sm"
              onClick={() => setConfirmStreamStartOpen(true)}
              className="gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Start Streaming</span>
            </Button>
          )}
        </div>
      </div>

      {/* Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Bridge Online */}
        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Local OBS Bridge</div>
              <div className="text-base font-black text-white mt-1">
                {bridgeStatus.bridgeOnline ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            <div
              className={`p-2.5 rounded-lg border ${
                bridgeStatus.bridgeOnline
                  ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                  : 'bg-red-950/60 border-red-800/60 text-red-400'
              }`}
            >
              {bridgeStatus.bridgeOnline ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* OBS Studio Status */}
        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">OBS Studio (Port 4455)</div>
              <div className="text-base font-black text-white mt-1">
                {bridgeStatus.obsConnected ? 'WebSocket Active' : 'Disconnected'}
              </div>
            </div>
            <div
              className={`p-2.5 rounded-lg border ${
                bridgeStatus.obsConnected
                  ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <Radio className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Current Scene */}
        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Active Program Scene</div>
              <div className="text-base font-black text-purple-400 font-mono mt-1">
                {bridgeStatus.currentScene}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-400">
              <Tv className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Streaming State */}
        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">YouTube Live Output</div>
              <div className="text-base font-black text-white mt-1 flex items-center gap-2">
                <span>{bridgeStatus.isStreaming ? 'ON AIR' : 'OFFLINE'}</span>
                {bridgeStatus.isStreaming && (
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
            </div>
            <div
              className={`p-2.5 rounded-lg border ${
                bridgeStatus.isStreaming
                  ? 'bg-red-950/80 border-red-500 text-red-400 broadcast-glow-red'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Scene Switcher + Source Visibility + Connection Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Scene Switcher & Source Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Scene Switcher Card */}
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tv className="h-4 w-4 text-purple-400" />
                    OBS Scene Switching
                  </CardTitle>
                  <CardDescription>
                    Switch live broadcast scene compositions. Only changes video layouts; graphics state is preserved.
                  </CardDescription>
                </div>
                <Badge variant="live" className="text-[10px]">
                  PROGRAM: {bridgeStatus.currentScene}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scenes.map((scene) => {
                  const isActive = bridgeStatus.currentScene === scene.name;
                  return (
                    <button
                      key={scene.name}
                      onClick={() => handleSwitchScene(scene.name)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-purple-600 text-white font-bold shadow-xl border-purple-400 scale-[1.01]'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            isActive ? 'bg-white' : 'bg-slate-700'
                          }`}
                        />
                        <span className="font-mono text-sm tracking-wide">{scene.name}</span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] uppercase font-bold bg-purple-950 px-2 py-0.5 rounded text-purple-200">
                          ON AIR
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Sources Inside Active Scene Card */}
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                Scene Sources ({bridgeStatus.currentScene})
              </CardTitle>
              <CardDescription>
                Toggle visibility of individual capture inputs and browser overlays inside OBS.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          source.enabled ? 'bg-emerald-400' : 'bg-slate-700'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{source.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{source.type}</div>
                      </div>
                    </div>

                    <Button
                      variant={source.enabled ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleSource(source.id, source.enabled)}
                      className={`text-xs gap-1.5 h-8 ${
                        source.enabled ? 'text-emerald-300 bg-slate-800' : 'text-slate-500'
                      }`}
                    >
                      {source.enabled ? (
                        <>
                          <Eye className="h-3 w-3 text-emerald-400" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 text-slate-500" />
                          <span>Muted</span>
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 5 Cols: Bridge Configuration & Setup Guide */}
        <div className="lg:col-span-5 space-y-6">
          {/* Bridge Connection Settings */}
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-400" />
                OBS Bridge Connection
              </CardTitle>
              <CardDescription className="text-xs">
                Local companion service parameters
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {/* Multi-Device / 2nd System Notice */}
              <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/60 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-purple-300">
                  <Radio className="h-3.5 w-3.5 text-purple-400" />
                  <span>Connecting from a 2nd System / Device?</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <span className="font-mono text-purple-300 font-bold">127.0.0.1</span> refers to the loopback address of <em>this</em> device. If this browser is on a separate machine from OBS, use the host machine's Wi-Fi / LAN IP:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBridgeUrl('http://192.168.0.103:4000');
                      obsBridgeClient.setBridgeUrl('http://192.168.0.103:4000');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-purple-900/60 border border-purple-600/40 text-purple-200 text-[10px] font-mono font-bold transition-colors"
                  >
                    Use Host LAN IP: http://192.168.0.103:4000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBridgeUrl('http://localhost:4000');
                      obsBridgeClient.setBridgeUrl('http://localhost:4000');
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono transition-colors"
                  >
                    Reset Localhost
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Bridge URL</label>
                <Input
                  value={bridgeUrl}
                  onChange={(e) => setBridgeUrl(e.target.value)}
                  placeholder="http://192.168.0.103:4000 or http://localhost:4000"
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Bridge Secret Token</label>
                <Input
                  type="password"
                  value={bridgeSecret}
                  onChange={(e) => setBridgeSecret(e.target.value)}
                  placeholder="••••••••••••"
                  className="font-mono text-xs"
                />
              </div>

              {bridgeStatus.lastError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Connection Issue:</div>
                    <div className="text-[11px] mt-0.5">{bridgeStatus.lastError}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="broadcast"
                  size="sm"
                  onClick={() => {
                    obsBridgeClient.setBridgeUrl(bridgeUrl);
                    obsBridgeClient.setSecret(bridgeSecret);
                    setIsSaved(true);
                    setTimeout(() => setIsSaved(false), 2500);
                    checkStatus();
                  }}
                  className="flex-1 text-xs"
                >
                  {isSaved ? 'Settings Saved & Reconnecting...' : 'Save & Connect'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkStatus}
                  className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-purple-400" />
                OBS Studio Setup Checklist
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 shrink-0 font-bold text-[10px]">
                  1
                </div>
                <div>
                  <span className="font-bold text-white">Enable OBS WebSocket:</span> In OBS Studio, open{' '}
                  <span className="font-mono text-purple-300">Tools &rarr; WebSocket Server Settings</span>. Enable port <span className="font-mono text-purple-300">4455</span>.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 shrink-0 font-bold text-[10px]">
                  2
                </div>
                <div>
                  <span className="font-bold text-white">Start OBS Bridge Service:</span> Run{' '}
                  <span className="font-mono text-purple-300">npm run dev</span> inside the{' '}
                  <span className="font-mono text-purple-300">obs-bridge/</span> folder on the broadcasting computer.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 shrink-0 font-bold text-[10px]">
                  3
                </div>
                <div>
                  <span className="font-bold text-white">Add Overlay Browser Source:</span> In OBS, add a Browser Source with URL{' '}
                  <span className="font-mono text-purple-300">http://localhost:3000/overlay/demo-volleyball-1</span> at 1920&times;1080.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog: Stop Stream */}
      <Dialog open={confirmStreamStopOpen} onOpenChange={setConfirmStreamStopOpen}>
        <DialogContent onClose={() => setConfirmStreamStopOpen(false)}>
          <DialogHeader>
            <DialogTitle>Stop Live YouTube Stream?</DialogTitle>
            <DialogDescription>
              Are you sure you want to stop broadcasting? This will terminate the YouTube Live stream for all current viewers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmStreamStopOpen(false)}>
              Keep Streaming
            </Button>
            <Button variant="destructive" onClick={handleStopStream}>
              Yes, Stop Stream
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog: Start Stream */}
      <Dialog open={confirmStreamStartOpen} onOpenChange={setConfirmStreamStartOpen}>
        <DialogContent onClose={() => setConfirmStreamStartOpen(false)}>
          <DialogHeader>
            <DialogTitle>Start Live YouTube Stream?</DialogTitle>
            <DialogDescription>
              This will send the command to OBS Studio to start video encoding and output to YouTube Live.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmStreamStartOpen(false)}>
              Cancel
            </Button>
            <Button variant="broadcast" onClick={handleStartStream}>
              Start Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
