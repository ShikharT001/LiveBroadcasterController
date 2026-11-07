-- ====================================================================
-- LIVE BROADCASTER CONTROLLER: 002_RLS_POLICIES.SQL
-- Row Level Security policies for secure broadcast operations
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_graphic_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Allows OBS Browser Source & Viewers to fetch live state)
CREATE POLICY "Allow public read for teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public read for players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public read for matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public read for match_sets" ON public.match_sets FOR SELECT USING (true);
CREATE POLICY "Allow public read for sponsors" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Allow public read for graphic_states" ON public.broadcast_graphic_states FOR SELECT USING (true);
CREATE POLICY "Allow public read for broadcast_designs" ON public.broadcast_designs FOR SELECT USING (true);
CREATE POLICY "Allow public read for score_events" ON public.score_events FOR SELECT USING (true);

-- 2. Authenticated Operator Policies (Allow logged in operators full CRUD on broadcast operations)
CREATE POLICY "Allow authenticated operators to insert/update teams" ON public.teams FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated operators to insert/update players" ON public.players FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated operators to insert/update matches" ON public.matches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated operators to insert/update match_sets" ON public.match_sets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated operators to insert/update score_events" ON public.score_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated operators to insert/update sponsors" ON public.sponsors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated operators to insert/update graphic_states" ON public.broadcast_graphic_states FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated operators to insert/update broadcasts" ON public.broadcasts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated operators to read/write audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Profiles policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
