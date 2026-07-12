-- Exécute ce SQL dans Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS visits (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER DEFAULT 0,
  pages TEXT DEFAULT '/',
  type TEXT DEFAULT 'visit'
);

CREATE POLICY "public_insert" ON visits FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select" ON visits FOR SELECT USING (true);
