# Grocerly — Connect Supabase (staging first)

## Confirmed project

- Supabase Project URL: `https://qbmcsqvyeozgetznlgjc.supabase.co`
- Repository: `JeremiahReyes23/Grocerly-Demo`
- Development branch: `feature/supabase-foundation`

The Project URL identifies the API endpoint. **It does not grant database access, connect authentication or execute the schema.**

## Step 1 — Apply the schema

1. Sign in to [Supabase](https://supabase.com/dashboard/project/qbmcsqvyeozgetznlgjc).
2. Open **SQL Editor** and create a new query.
3. Paste the contents of `supabase/migrations/001_foundation.sql`, review the changes, then run it. Prefer a staging Supabase project for the first execution if one is available.
4. Under **Table Editor**, verify `profiles`, `grocery_budgets`, `inventory_items`, `recipes`, `shopping_trips`, and `user_documents`.
5. Verify that Row Level Security (RLS) is enabled on every new public table.

Only run trusted SQL from this repository. No application user data is migrated by this script.

## Step 2 — Retrieve the *publishable* key

In Supabase open **Project Settings → API Keys**. Find **Publishable key** (often starts with `sb_publishable_`). The older **anon** key can also be used where supported. Keep service-role / secret keys out of browser code.

The publishable key and project URL will eventually be configured in a preview deployment. **The existing Grocerly demo is plain HTML/JS with an Express backend, not a Vite build**, so `VITE_` variables are not automatically available to the browser. A controlled config delivery approach is required before activating authentication.

## Step 3 — Configure Auth

In **Authentication → Providers**, enable email/password. In **Authentication → URL Configuration**, set the Site URL and exact allowed redirect URLs for the preview and eventual production environment. Email confirmation should remain enabled. Configure verified SMTP for public email signup/reset; the default email sender is only appropriate for limited testing.

Do **not** turn on public registration while the old plaintext-password login endpoints and email-based data routes still exist.

## Step 4 — Preview checks before merging

- New account receives an email confirmation when configured.
- Invalid credentials cannot establish a session.
- One account cannot read, modify or delete any other account's rows.
- Password-reset email completes successfully and safely.
- Guest data remains device-only until the user explicitly chooses an import, and guest data isn't deleted until import is acknowledged.
- Legacy `/api/profile`, `/api/inventory`, `/api/recipes`, `/api/trips`, admin APIs and other personalized endpoints cannot be accessed just by supplying an email or user ID.
- No secrets are included in HTML, JS, repository, logs or screenshots.

## Status

The schema and project URL are prepared. The SQL has **not** been run in your Supabase project by the GitHub changes, and the existing website's login/data access has **not** been switched over yet. Do not merge this branch as a finished authentication implementation.
