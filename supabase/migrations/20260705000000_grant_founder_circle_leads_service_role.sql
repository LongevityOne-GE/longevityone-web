-- Ensure the service role can read/write the lead-capture table.
--
-- Background: the /api/founder-circle route writes with the SERVICE_ROLE key.
-- RLS is enabled and there are no anon/authenticated policies (leads are
-- server-only), but an RLS policy is NOT the same as a table GRANT — Postgres
-- also requires the role to hold table privileges. This grant was applied by
-- hand during an earlier incident ("permission denied for table
-- founder_circle_leads") but was never committed as a migration, so a fresh
-- project (restore, branch, or rebuild from migrations) would drop it and break
-- every lead submission again. Committing it here makes it permanent.
--
-- Idempotent: GRANT is safe to re-run.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.founder_circle_leads TO service_role;
