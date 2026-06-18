-- Security hardening: remove the anonymous direct-INSERT path into lead capture.
--
-- Rationale: the public anon key is shipped to the browser, so the prior
-- "founder_circle_leads_insert" policy (TO anon, WITH CHECK (TRUE)) let anyone
-- insert rows straight through the Supabase REST API, bypassing the API route's
-- Zod validation, honeypot, and rate limiting. The /api/founder-circle route
-- writes with the service-role key, which is unaffected by RLS, so legitimate
-- inserts keep working after this change.
--
-- Net effect: RLS stays ENABLED, anon/authenticated have no INSERT/SELECT/
-- UPDATE/DELETE on this table; only the server (service role) can write or read.

DROP POLICY IF EXISTS "founder_circle_leads_insert" ON founder_circle_leads;
