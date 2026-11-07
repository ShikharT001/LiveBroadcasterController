'use client';

import React from 'react';
import { ScoreboardDisplay } from './ScoreboardDisplay';
import { PlayerIntroCard } from './PlayerIntroCard';
import { SponsorBannerDisplay } from './SponsorBannerDisplay';
import { SetResultsCard } from './SetResultsCard';
import { MatchWinnerDisplay } from './MatchWinnerDisplay';
import { CustomAnnouncementBar } from './CustomAnnouncementBar';
import { getEmbedVideoUrl, isDirectVideoFile } from '@/lib/utils/videoHelper';

export function OverlayContainer({ graphicState, match, videoConfig }) {
  const { activeGraphic = 'SCOREBOARD', isVisible = true, payload = {} } = graphicState || {};

  const showVideo = videoConfig?.showVideo !== false;
  const rawVideoUrl = videoConfig?.videoUrl || match?.videoUrl || 'https://www.youtube.com/live/oNRfODgAXvA';
  const embedUrl = showVideo && rawVideoUrl ? getEmbedVideoUrl(rawVideoUrl) : null;
  const isDirect = isDirectVideoFile(rawVideoUrl);

  const scoreboardSize = match?.scoreboardSize || 'normal';
  const scoreboardPosition = match?.scoreboardPosition || 'top-left';

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-transparent select-none">
      {/* 0. Live Match Video Layer (If enabled, renders directly inside overlay for complete broadcast composition) */}
      {showVideo && embedUrl && (
        <div className="absolute inset-0 w-full h-full -z-10 bg-black pointer-events-none overflow-hidden">
          {isDirect ? (
            <video
              src={embedUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0 scale-[1.05]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Broadcast Live Match Video Feed"
            />
          )}
        </div>
      )}

      {/* 1. Scoreboard (Rendered if activeGraphic is SCOREBOARD, or as persistent score if lower third is active) */}
      {isVisible && (activeGraphic === 'SCOREBOARD' || activeGraphic === 'PLAYER_INTRO' || activeGraphic === 'CUSTOM_ANNOUNCEMENT' || activeGraphic === 'SPONSOR_BREAK') && (
        <ScoreboardDisplay
          match={match}
          visible={isVisible}
          size={scoreboardSize}
          position={scoreboardPosition}
        />
      )}

      {/* 2. Player Introduction Lower Third */}
      {isVisible && activeGraphic === 'PLAYER_INTRO' && (
        <PlayerIntroCard payload={payload} />
      )}

      {/* 3. Sponsor Banner */}
      {isVisible && activeGraphic === 'SPONSOR_BREAK' && (
        <SponsorBannerDisplay payload={payload} />
      )}

      {/* 4. Set Results Card */}
      {isVisible && activeGraphic === 'SET_RESULTS' && (
        <SetResultsCard payload={payload} />
      )}

      {/* 5. Match Winner Graphic */}
      {isVisible && activeGraphic === 'MATCH_WINNER' && (
        <MatchWinnerDisplay payload={payload} />
      )}

      {/* 6. Custom Lower-Third Announcement */}
      {isVisible && activeGraphic === 'CUSTOM_ANNOUNCEMENT' && (
        <CustomAnnouncementBar payload={payload} />
      )}
    </div>
  );
}
