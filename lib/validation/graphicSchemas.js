import { z } from 'zod';

export const graphicTypeEnum = z.enum([
  'SCOREBOARD',
  'PLAYER_INTRO',
  'SPONSOR_BREAK',
  'SET_RESULTS',
  'MATCH_WINNER',
  'CUSTOM_ANNOUNCEMENT',
  'NONE',
]);

export const playerIntroPayloadSchema = z.object({
  playerName: z.string().min(1),
  jerseyNumber: z.number().int().min(0).max(99),
  position: z.string().min(1),
  photoUrl: z.string().url().nullable().optional(),
  teamName: z.string().min(1),
  teamColor: z.string().default('#7c3aed'),
  stats: z.record(z.string(), z.any()).optional(),
});

export const sponsorPayloadSchema = z.object({
  sponsorName: z.string().min(1),
  logoUrl: z.string().url().nullable().optional(),
  tagline: z.string().optional(),
  subtitle: z.string().default('Official Broadcast Partner'),
});

export const setResultsPayloadSchema = z.object({
  matchTitle: z.string().optional(),
  teamAName: z.string().min(1),
  teamBName: z.string().min(1),
  teamAColor: z.string().default('#dc2626'),
  teamBColor: z.string().default('#2563eb'),
  sets: z.array(
    z.object({
      setNumber: z.number().int().min(1).max(5),
      scoreA: z.number().int().min(0),
      scoreB: z.number().int().min(0),
      winner: z.enum(['A', 'B']),
    })
  ),
  teamASetsWon: z.number().int().min(0),
  teamBSetsWon: z.number().int().min(0),
});

export const matchWinnerPayloadSchema = z.object({
  winnerName: z.string().min(1),
  winnerColor: z.string().default('#7c3aed'),
  winnerLogo: z.string().url().nullable().optional(),
  finalScoreText: z.string().min(1),
  tournamentTitle: z.string().default('Championship Finals'),
  runnerUpName: z.string().optional(),
});

export const customAnnouncementPayloadSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  badgeText: z.string().default('ANNOUNCEMENT'),
});

export const graphicStateSchema = z.object({
  matchId: z.string().min(1),
  activeGraphic: graphicTypeEnum,
  isVisible: z.boolean().default(true),
  payload: z.record(z.string(), z.any()).default({}),
  updatedAt: z.string().optional(),
});
