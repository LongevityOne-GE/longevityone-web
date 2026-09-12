-- Campaign attribution for lead capture.
--
-- Records which ad / campaign / referrer brought the visitor in, so paid spend
-- can be tied to the leads it actually produced. Every column is nullable:
-- organic visitors carry no UTM params, and a lead must never be rejected for
-- lacking attribution.
--
-- Written server-side by /api/founder-circle with the service-role key. RLS
-- stays enabled on this table and no anon policy is added, so these columns are
-- no more reachable from the browser than the existing ones.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS is safe to re-run.

ALTER TABLE public.founder_circle_leads
  ADD COLUMN IF NOT EXISTS utm_source   TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium   TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content  TEXT,
  ADD COLUMN IF NOT EXISTS utm_term     TEXT,
  ADD COLUMN IF NOT EXISTS gclid        TEXT,
  ADD COLUMN IF NOT EXISTS fbclid       TEXT,
  ADD COLUMN IF NOT EXISTS landing_page TEXT,
  ADD COLUMN IF NOT EXISTS referrer     TEXT;

-- The leads dashboard lists newest-first; this keeps that ordering cheap as the
-- table grows.
CREATE INDEX IF NOT EXISTS founder_circle_leads_created_at_idx
  ON public.founder_circle_leads (created_at DESC);
