import { db, env, json, sameOrigin } from './_shared/ngcc-profile-db.mjs';

// Gates the Agency Login entry point (agency-login.html) with a promo
// code, mirroring NAT-CORP's advisor-access.mjs / natcorp_agency_pilot_logins
// (NAT-CORP-CONTRACT-EXCHANGE, added 2026-08-24/25). RFCP has no separate
// "advisor" flow the way NAT-CORP does for Albert's team -- just the one
// Agency Pilot Program code -- so this is a single-code version of that
// pattern, not the two-code one.
//
// A code redemption here does NOT create the business profile itself --
// agency-login.html calls this first to verify the code, then calls
// /api/capability-profile (action:start) separately with the business's
// intake fields. That second call is what actually skips the $99/mo
// paywall by creating a real intake session directly, the same way
// NAT-CORP's Agency Login form does.
function isExpired(expiresRaw) {
  if (!expiresRaw) return false;
  const expires = new Date(expiresRaw);
  if (Number.isNaN(expires.getTime())) return false;
  return Date.now() > expires.getTime();
}

export default async function handler(req) {
  if (!sameOrigin(req)) return json(403, { ok: false, error: 'Invalid request origin.' });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'POST only.' });

  const code = env('AGENCY_PROMO_CODE');
  if (!code) return json(500, { ok: false, error: 'Access is not configured.' });
  const expiresRaw = env('AGENCY_CODE_EXPIRES');

  let payload;
  try { payload = await req.json(); } catch { return json(400, { ok: false, error: 'Invalid JSON.' }); }
  // Case-insensitive: a code like "AGENCY30" reads like something typed
  // in lowercase or mixed case, which would otherwise fail with no hint
  // why.
  const supplied = String(payload?.code ?? '').trim().toUpperCase();
  if (supplied !== code.trim().toUpperCase()) return json(401, { ok: false, error: 'Incorrect access code.' });
  if (isExpired(expiresRaw)) return json(401, { ok: false, error: 'This access code has expired.' });

  const name = String(payload?.name ?? '').trim();
  const agencyName = String(payload?.agency_name ?? '').trim();
  const businessName = String(payload?.business_name ?? '').trim();
  if (name && agencyName) {
    await db('rfcp_agency_pilot_logins', 'POST', '', [{ name, agency_name: agencyName, business_name: businessName || null, code_used: supplied }], 'return=minimal').catch((error) => {
      console.error('[advisor-access] agency login-tracking insert failed', error);
    });
  }

  return json(200, { ok: true });
}

export const config = {
  path: '/api/advisor-access',
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ['ip'] },
};
