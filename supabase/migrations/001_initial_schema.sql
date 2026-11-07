-- ====================================================================
-- LIVE BROADCASTER CONTROLLER: 001_INITIAL_SCHEMA.SQL
-- Full PostgreSQL schema for live sports broadcast graphics & scoring
-- Initial sport focus: Volleyball (adaptable to other sports)
-- ====================================================================

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'operator', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_code VARCHAR(10) NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#7c3aed',
  secondary_color VARCHAR(7) DEFAULT '#2563eb',
  logo_url TEXT,
  coach TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Players Table
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  jersey_number INTEGER NOT NULL CHECK (jersey_number >= 0 AND jersey_number <= 99),
  position TEXT NOT NULL CHECK (position IN ('Setter', 'Outside Hitter', 'Middle Blocker', 'Libero', 'Opposite Spiker', 'Defensive Specialist')),
  photo_url TEXT,
  is_captain BOOLEAN NOT NULL DEFAULT false,
  is_starter BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport TEXT NOT NULL DEFAULT 'volleyball',
  team_a_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE RESTRICT,
  team_b_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE RESTRICT,
  tournament TEXT DEFAULT 'Live Championship',
  court TEXT DEFAULT 'Main Arena',
  best_of_sets INTEGER NOT NULL DEFAULT 5,
  current_set INTEGER NOT NULL DEFAULT 1 CHECK (current_set >= 1 AND current_set <= 5),
  serving_team TEXT CHECK (serving_team IN ('A', 'B')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'paused', 'completed')),
  winner_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Match Sets Table
CREATE TABLE IF NOT EXISTS public.match_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL CHECK (set_number >= 1 AND set_number <= 5),
  score_team_a INTEGER NOT NULL DEFAULT 0 CHECK (score_team_a >= 0),
  score_team_b INTEGER NOT NULL DEFAULT 0 CHECK (score_team_b >= 0),
  timeouts_team_a INTEGER NOT NULL DEFAULT 0 CHECK (timeouts_team_a >= 0 AND timeouts_team_a <= 2),
  timeouts_team_b INTEGER NOT NULL DEFAULT 0 CHECK (timeouts_team_b >= 0 AND timeouts_team_b <= 2),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  winner_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  UNIQUE (match_id, set_number)
);

-- 6. Score Events Table (Point-by-point audit trail & undo ledger)
CREATE TABLE IF NOT EXISTS public.score_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  scoring_team TEXT NOT NULL CHECK (scoring_team IN ('A', 'B')),
  event_type TEXT NOT NULL DEFAULT 'point' CHECK (event_type IN ('point', 'ace', 'kill', 'block', 'opponent_error', 'correction')),
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  score_team_a INTEGER NOT NULL,
  score_team_b INTEGER NOT NULL,
  is_undone BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Sponsors Table
CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  logo_url TEXT,
  tier TEXT NOT NULL DEFAULT 'partner' CHECK (tier IN ('title', 'gold', 'silver', 'partner')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Broadcast Graphic States Table (Realtime State for OBS Overlay)
CREATE TABLE IF NOT EXISTS public.broadcast_graphic_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES public.matches(id) ON DELETE CASCADE,
  active_graphic TEXT NOT NULL DEFAULT 'SCOREBOARD' CHECK (active_graphic IN ('SCOREBOARD', 'PLAYER_INTRO', 'SPONSOR_BREAK', 'SET_RESULTS', 'MATCH_WINNER', 'CUSTOM_ANNOUNCEMENT', 'NONE')),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Broadcast Designs Table (Overlay themes & styling)
CREATE TABLE IF NOT EXISTS public.broadcast_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Default Modern Dark',
  scoreboard_position TEXT NOT NULL DEFAULT 'top-left' CHECK (scoreboard_position IN ('top-left', 'top-center', 'bottom-center', 'bottom-left')),
  accent_color VARCHAR(7) NOT NULL DEFAULT '#7c3aed',
  font_family TEXT NOT NULL DEFAULT 'Inter, sans-serif',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Broadcasts Table (OBS Scene mapping & stream configuration)
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  bridge_url TEXT NOT NULL DEFAULT 'http://localhost:4000',
  current_obs_scene TEXT NOT NULL DEFAULT 'LIVE_MATCH',
  is_streaming BOOLEAN NOT NULL DEFAULT false,
  scene_mappings JSONB NOT NULL DEFAULT '{
    "live": "LIVE_MATCH",
    "player_intro": "PLAYER_INTRO",
    "sponsor": "SPONSOR_BREAK",
    "set_results": "SET_RESULTS",
    "winner": "MATCH_WINNER"
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Match Operators Table (Role assignment per match)
CREATE TABLE IF NOT EXISTS public.match_operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_role TEXT NOT NULL DEFAULT 'scorer' CHECK (assigned_role IN ('lead', 'scorer', 'graphics_director')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(match_id, user_id)
);

-- 12. Audit Logs Table (Full historical trace of operator actions)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_players_team ON public.players(team_id);
CREATE INDEX IF NOT EXISTS idx_match_sets_match ON public.match_sets(match_id);
CREATE INDEX IF NOT EXISTS idx_score_events_match_set ON public.score_events(match_id, set_number);
CREATE INDEX IF NOT EXISTS idx_graphic_states_match ON public.broadcast_graphic_states(match_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_match ON public.audit_logs(match_id);

-- Enable Supabase Realtime Publication for instant overlay updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcast_graphic_states;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_sets;
