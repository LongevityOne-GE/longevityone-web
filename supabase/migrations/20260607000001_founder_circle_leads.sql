-- Lead capture table for the Founder Circle 50 CTA
CREATE TABLE founder_circle_leads (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  lang       TEXT NOT NULL DEFAULT 'ka',
  consent    BOOLEAN NOT NULL DEFAULT FALSE,
  source     TEXT DEFAULT 'founder_circle',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE founder_circle_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous users may INSERT leads — no SELECT/UPDATE/DELETE for anon
CREATE POLICY "founder_circle_leads_insert"
  ON founder_circle_leads
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);
