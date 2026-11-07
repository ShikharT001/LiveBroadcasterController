import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(2, 'Team name must have at least 2 characters'),
  short_code: z.string().min(2).max(5, 'Short code must be 2-5 characters'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Color must be a valid hex code (e.g. #FF0000)'),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Secondary color must be a valid hex code').optional(),
  logo_url: z.string().url().nullable().optional(),
  coach: z.string().optional(),
});

export const playerSchema = z.object({
  team_id: z.string().uuid().or(z.string().min(1)),
  name: z.string().min(2, 'Player name is required'),
  jersey_number: z.number().int().min(0).max(99, 'Jersey number must be between 0 and 99'),
  position: z.enum(['Setter', 'Outside Hitter', 'Middle Blocker', 'Libero', 'Opposite Spiker', 'Defensive Specialist']),
  photo_url: z.string().url().nullable().optional(),
  is_captain: z.boolean().default(false),
  is_starter: z.boolean().default(false),
});

export const matchSchema = z.object({
  sport: z.literal('volleyball').default('volleyball'),
  team_a_id: z.string().min(1),
  team_b_id: z.string().min(1),
  scheduled_at: z.string().datetime().optional(),
  court: z.string().default('Main Court'),
  tournament: z.string().default('Championship'),
  best_of_sets: z.number().int().min(1).max(5).default(5),
  status: z.enum(['scheduled', 'live', 'paused', 'completed']).default('scheduled'),
});

export const scoreUpdateSchema = z.object({
  match_id: z.string().min(1),
  set_number: z.number().int().min(1).max(5),
  scoring_team: z.enum(['A', 'B']),
  point_delta: z.number().int().min(-1).max(1), // +1 or -1 correction
  event_type: z.enum(['point', 'ace', 'kill', 'block', 'opponent_error', 'correction']).default('point'),
  current_score_a: z.number().int().min(0),
  current_score_b: z.number().int().min(0),
  serving_team: z.enum(['A', 'B']).optional(),
});

export const sponsorSchema = z.object({
  name: z.string().min(2, 'Sponsor name is required'),
  logo_url: z.string().url().nullable().optional(),
  tagline: z.string().max(120).optional(),
  is_active: z.boolean().default(true),
  tier: z.enum(['title', 'gold', 'silver', 'partner']).default('partner'),
});
