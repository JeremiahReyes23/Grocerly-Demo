# Grocerly Supabase Migration — NOT LIVE YET

This branch contains the proposed database foundation. **It does not switch the app to Supabase.**
The existing demo currently has insecure account handling and must not be used for real customer data.

## Current security audit (2026-11-09)

- `dbService.js` stores passwords as plaintext in a JSON file.
- `server.js` accepts email / userId query and body values as an identity claim without session verification for profile, inventory, recipes, trips, calendar, and related APIs.
- Google sign-in falls back to decoding an unverified token or accepting an email string; this is not authentication.
- The frontend includes simulated social login and local API fallback.
- Admin routes lack a verified admin authorization check; admin state is also inferred from an email string.
- `/api/save-icon` writes user-supplied paths and needs to be removed or properly restricted.
- Local storage login flags do not prove authentication.
- On serverless deployments, filesystem JSON storage is not a reliable persistent database.

**Do not invite beta users or collect real passwords until the old login/CRUD/admin endpoints are retired and tested.**

## Account setup required from owner

1. Create a **new Supabase project** for Grocerly; keep it separate from other ventures.
2. Execute `supabase/migrations/001_foundation.sql` in a development/staging project first, then verify RLS with two distinct test users.
3. In Supabase Auth, configure the Site URL and redirect allowlist for the exact Vercel preview and eventual production host.
4. Enable email/password authentication, email verification, and test signup/recovery flows. Configure a verified custom SMTP sender before public invitations.
5. Add `SUPABASE_URL` and the **publishable/anon key only** to the deployment environment. Secret/service-role keys stay in server-only environment variables if ever needed; do not place them in a browser bundle or Git.
6. Set up a separate Vercel Preview environment before production rollout. Review plan eligibility before commercial launch.
7. Stripe is not needed for account testing. Introduce it later with webhooks and backend-only entitlements.

## Planned implementation order

1. Replace plaintext signup/login with Supabase Auth and verified sessions; remove unverified Google fallback and simulated social login.
2. Replace email-parameter-based CRUD with queries authorized by the authenticated user. Do not trust `State.user.email` for authorization.
3. Migrate UI state: inventory, recipes, trips, budget, waste logs, calendar, stores. `user_documents` is a transition store for existing arrays/maps; normalized tables support future queryable features. Pick a single canonical storage path per dataset, not both at once.
4. Guest mode: local-only, isolated browser storage; visibly mark it as device-only. On signup, show a one-time import review, perform a conflict-safe copy after verified login, and clear local guest data **only after server acknowledgment**.
5. Implement password-reset flow, account export and deletion, privacy disclosures, error handling, and retry-safe sync.
6. Lock admin features behind server-verified roles and add test coverage for cross-account access, user-content escaping, and auth state transitions.
7. Introduce Stripe in test mode only after beta; verify webhook signatures server-side and manage entitlements on the server.

## Important migration limitation

Old `db.json` accounts cannot safely be lifted into production: existing passwords are plaintext and must be discarded. Users must establish new credentials through Supabase Auth. Imported user data should be associated with verified owners, never matched automatically solely on user-editable email.

## Configuration

Never commit real keys. URL + publishable/anon key may be used by an authenticated browser client with RLS; they are not authorization by themselves. The browser must never see a Supabase secret/service-role key. Never deploy the old backend's email-based endpoints to a public production environment with real user data.
