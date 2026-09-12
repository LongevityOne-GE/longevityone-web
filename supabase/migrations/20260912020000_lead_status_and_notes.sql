-- Lead outcome tracking.
--
-- Why this exists: without an outcome, campaigns can only be judged on lead
-- volume, which is a vanity metric. A campaign producing 20 leads of which one
-- books is worse than one producing 8 of which four book. Recording what
-- happened is what turns cost-per-lead into cost-per-booked-patient, and it is
-- the prerequisite for feeding qualified conversions back to the ad platforms.
--
-- `notes` is for operational context ("call after 18:00", "wants VO2 max").
-- It is NOT for clinical information: this table is readable by the ad manager
-- and is not a medical record. The UI carries that warning above the field.

ALTER TABLE public.founder_circle_leads
  ADD COLUMN IF NOT EXISTS status            TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS notes             TEXT,
  ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ,
  -- The page the visitor submitted from, captured automatically. Gives the
  -- marketer service-level interest without anyone having to type it, which is
  -- always more reliable than a dropdown staff must remember to fill.
  ADD COLUMN IF NOT EXISTS submitted_from    TEXT;

-- Constrain to known values so a typo in code cannot create a silent fifth
-- category that the dashboard filter would then miss.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'founder_circle_leads_status_check'
  ) THEN
    ALTER TABLE public.founder_circle_leads
      ADD CONSTRAINT founder_circle_leads_status_check
      CHECK (status IN ('new', 'contacted', 'booked', 'not_interested'));
  END IF;
END $$;

-- The dashboard filters by status within a date range.
CREATE INDEX IF NOT EXISTS founder_circle_leads_status_idx
  ON public.founder_circle_leads (status, created_at DESC);
