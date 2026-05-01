-- ─── PATIENTS ──────────────────────────────────────────────────────────────
CREATE TABLE patients (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT,
  date_of_birth   DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients see own record" ON patients
  FOR ALL USING (auth.uid() = auth_user_id);

-- ─── CONSENT_LOG ───────────────────────────────────────────────────────────
CREATE TABLE consent_log (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_email    TEXT NOT NULL,
  consent_version  TEXT NOT NULL DEFAULT 'v1.0',
  consent_given    BOOLEAN NOT NULL DEFAULT FALSE,
  ip_hash          TEXT,   -- hashed IP, never plain IP
  user_agent       TEXT,
  consented_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;

-- Service role only — no direct client access
CREATE POLICY "Service role only" ON consent_log
  FOR ALL USING (FALSE);

-- ─── ASSESSMENTS ───────────────────────────────────────────────────────────
CREATE TABLE assessments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id       UUID REFERENCES patients(id) ON DELETE CASCADE,
  assessment_type  TEXT NOT NULL, -- 'pnoe' | 'visbody' | 'vo2max' | 'intake'
  data             JSONB NOT NULL DEFAULT '{}',
  assessed_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients see own assessments" ON assessments
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid())
  );

-- ─── BIOMARKER_READINGS ────────────────────────────────────────────────────
CREATE TABLE biomarker_readings (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id       UUID REFERENCES patients(id) ON DELETE CASCADE,
  marker_name      TEXT NOT NULL,
  value            NUMERIC,
  unit             TEXT,
  reference_range  TEXT,
  measured_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE biomarker_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients see own biomarkers" ON biomarker_readings
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid())
  );
