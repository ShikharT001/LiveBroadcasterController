'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { OverlayContainer } from '@/components/overlay/OverlayContainer';
import { createClient } from '@/lib/supabase/client';

export default function BroadcastOverlayPage() {
  const params = useParams();
  const matchId = params?.matchId || 'demo-volleyball-1';

  // Graphic state driven by Supabase Realtime
  const [graphicState, setGraphicState] = useState({
    activeGraphic: 'SCOREBOARD',
    isVisible: true,
    payload: {},
  });

  // Current live match score data
  const [matchData, setMatchData] = useState({
    id: matchId,
    tournament: 'VOLLEYBALL CHAMPIONSHIP FINALS',
    currentSet: 1,
    servingTeam: 'A',
    teamA: { name: 'Thunder Volley', code: 'THU', color: '#dc2626', score: 0, sets: 0 },
    teamB: { name: 'Cyclone Spikers', code: 'CYC', color: '#2563eb', score: 0, sets: 0 },
    scoreboardSize: 'normal',
    scoreboardPosition: 'top-left',
  });

  // Video feed configuration (supports YouTube live, video feeds, or transparent background)
  const [videoConfig, setVideoConfig] = useState({
    videoUrl: 'https://www.youtube.com/live/oNRfODgAXvA',
    showVideo: true,
  });

  // Load saved custom match settings from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`match_settings_${matchId}`) || localStorage.getItem('match_settings_volleyball-match-1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.teamA?.score === 21 && parsed.teamB?.score === 19 && parsed.currentSet === 4) {
            // Old mock demo data - reset to clean 0 - 0 in Set 1
            setMatchData((prev) => ({
              ...prev,
              ...parsed,
              currentSet: 1,
              teamA: { ...parsed.teamA, score: 0, sets: 0 },
              teamB: { ...parsed.teamB, score: 0, sets: 0 },
            }));
          } else {
            setMatchData((prev) => ({ ...prev, ...parsed }));
          }
        } catch (e) {}
      }

      const savedVideo = localStorage.getItem('broadcast_video_config');
      if (savedVideo) {
        try {
          setVideoConfig(JSON.parse(savedVideo));
        } catch (e) {}
      }
    }
  }, [matchId]);

  useEffect(() => {
    let supabase = null;
    let channel = null;

    try {
      supabase = createClient();

      // Listen to Supabase Realtime broadcasts for this match's graphic state
      channel = supabase
        .channel(`match-graphics-${matchId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'broadcast_graphic_states',
            filter: `match_id=eq.${matchId}`,
          },
          (payload) => {
            if (payload.new) {
              setGraphicState({
                activeGraphic: payload.new.active_graphic || 'SCOREBOARD',
                isVisible: payload.new.is_visible !== false,
                payload: payload.new.payload || {},
              });
            }
          }
        )
        // Also listen to broadcast events sent directly via Realtime broadcast
        .on('broadcast', { event: 'graphic_change' }, ({ payload }) => {
          if (payload) {
            setGraphicState(payload);
          }
        })
        .on('broadcast', { event: 'score_update' }, ({ payload }) => {
          if (payload) {
            setMatchData((prev) => ({ ...prev, ...payload }));
          }
        })
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription fallback (local mock active):', err);
    }

    // Support window message / local cross-tab sync via BroadcastChannel for zero-latency local testing
    let localBroadcast = null;
    try {
      localBroadcast = new BroadcastChannel(`overlay_${matchId}`);
      localBroadcast.onmessage = (event) => {
        if (event.data?.type === 'GRAPHIC_UPDATE') {
          setGraphicState(event.data.graphicState);
        } else if (event.data?.type === 'SCORE_UPDATE') {
          setMatchData((prev) => ({ ...prev, ...event.data.match }));
        } else if (event.data?.type === 'VIDEO_CONFIG_UPDATE') {
          setVideoConfig(event.data.videoConfig);
        }
      };
    } catch (e) {
      // BroadcastChannel unsupported or restricted
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      if (localBroadcast) {
        localBroadcast.close();
      }
    };
  }, [matchId]);

  return (
    <OverlayContainer graphicState={graphicState} match={matchData} videoConfig={videoConfig} />
  );
}
