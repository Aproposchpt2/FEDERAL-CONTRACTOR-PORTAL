-- RFCP's own Agency Login (Agency Pilot Program), mirroring NAT-CORP's
-- natcorp_agency_pilot_logins (see NAT-CORP-CONTRACT-EXCHANGE migration
-- 20260825020000). Jeff, 2026-08-25: 'do the same for RFCP' -- a
-- code-gated Agency Login that skips the $99/mo paywall entirely and
-- starts the business's real profile intake immediately, same as
-- NAT-CORP's AGENCY30 flow. business_name included from the start this
-- time (NAT-CORP's table needed a follow-up migration to add it).
create table if not exists public.rfcp_agency_pilot_logins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  agency_name text not null,
  business_name text,
  code_used text not null,
  logged_in_at timestamptz not null default now()
);

comment on table public.rfcp_agency_pilot_logins is
  'One row per successful RFCP Agency Login redemption -- name/agency/business self-reported at login, not independently verified.';

create index if not exists rfcp_agency_pilot_logins_logged_in_at_idx
  on public.rfcp_agency_pilot_logins (logged_in_at desc);

alter table public.rfcp_agency_pilot_logins enable row level security;
revoke all on public.rfcp_agency_pilot_logins from anon, authenticated;
