-- Second-touch attribution, contact-form capture, and form typing.
--
-- Why:
--  1. First touch alone under-credits paid media for a high-consideration
--     service. Someone clicks an ad, thinks for a week, returns directly, then
--     books. Google Ads attributes last click, so storing only first touch makes
--     the two systems disagree and neither can be reconciled. We now store both.
--  2. Contact-form enquiries are leads too, but were email-only and therefore
--     invisible in the dashboard. They now record the same metadata.
--     NOTE: the contact MESSAGE BODY is deliberately NOT stored. Free text on a
--     medical site can contain health information; the inbox stays the only
--     record of it. Only who enquired and which campaign sent them is persisted.
--  3. form_type separates the two so the dashboard can label and filter them.
--
-- Every column is nullable or defaulted. Existing rows are backfilled to
-- 'lead_form', which is what they all are.

ALTER TABLE public.founder_circle_leads
  ADD COLUMN IF NOT EXISTS form_type         TEXT NOT NULL DEFAULT 'lead_form',
  ADD COLUMN IF NOT EXISTS last_utm_source   TEXT,
  ADD COLUMN IF NOT EXISTS last_utm_medium   TEXT,
  ADD COLUMN IF NOT EXISTS last_utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS last_utm_content  TEXT,
  ADD COLUMN IF NOT EXISTS last_utm_term     TEXT,
  ADD COLUMN IF NOT EXISTS last_gclid        TEXT,
  ADD COLUMN IF NOT EXISTS last_fbclid       TEXT,
  ADD COLUMN IF NOT EXISTS last_landing_page TEXT,
  ADD COLUMN IF NOT EXISTS last_referrer     TEXT,
  -- How many separate visits preceded the submission. A blunt but useful
  -- signal of how long this service takes to decide on.
  ADD COLUMN IF NOT EXISTS touch_count       INTEGER;

-- Constrain to the two known form types so a typo in code cannot silently
-- create a third category the dashboard filter would then miss.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'founder_circle_leads_form_type_check'
  ) THEN
    ALTER TABLE public.founder_circle_leads
      ADD CONSTRAINT founder_circle_leads_form_type_check
      CHECK (form_type IN ('lead_form', 'contact_form'));
  END IF;
END $$;

-- The dashboard filters by form type within a date range.
CREATE INDEX IF NOT EXISTS founder_circle_leads_form_type_idx
  ON public.founder_circle_leads (form_type, created_at DESC);
