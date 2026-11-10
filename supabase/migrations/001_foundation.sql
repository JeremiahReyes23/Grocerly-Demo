-- Grocerly foundation / run only in a NEW Supabase project's SQL editor.
-- Data ownership is always derived from auth.uid(), never from client-supplied email.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Grocerly Member',
  household_size integer not null default 1 check (household_size between 1 and 100),
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grocery_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  period text not null default 'monthly' check (period in ('weekly','biweekly','monthly')),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  category text,
  quantity numeric(12,3) not null default 1 check (quantity >= 0),
  unit text,
  price numeric(12,2) check (price >= 0),
  purchased_on date,
  expires_on date,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shopping_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  store text,
  trip_date date,
  total numeric(12,2) check (total >= 0),
  items jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Transitional model for existing app's arrays/maps. Do not place passwords,
-- auth tokens, email credentials or payment card details in payload.
create table if not exists public.user_documents (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  document_type text not null check (document_type in (
    'inventory', 'recipes', 'trips', 'notifications', 'wasteLogs', 'calendar', 'customStores'
  )),
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, document_type)
);

create index if not exists inventory_items_owner_idx on public.inventory_items(user_id);
create index if not exists recipes_owner_idx on public.recipes(user_id);
create index if not exists shopping_trips_owner_idx on public.shopping_trips(user_id);
create index if not exists grocery_budgets_owner_idx on public.grocery_budgets(user_id);

alter table public.profiles enable row level security;
alter table public.grocery_budgets enable row level security;
alter table public.inventory_items enable row level security;
alter table public.recipes enable row level security;
alter table public.shopping_trips enable row level security;
alter table public.user_documents enable row level security;

-- Explicit policies for authenticated accounts only.
create policy "own profile select" on public.profiles for select to authenticated using (user_id = (select auth.uid()));
create policy "own profile insert" on public.profiles for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own profile update" on public.profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own profile delete" on public.profiles for delete to authenticated using (user_id = (select auth.uid()));

create policy "own budgets select" on public.grocery_budgets for select to authenticated using (user_id = (select auth.uid()));
create policy "own budgets insert" on public.grocery_budgets for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own budgets update" on public.grocery_budgets for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own budgets delete" on public.grocery_budgets for delete to authenticated using (user_id = (select auth.uid()));

create policy "own inventory select" on public.inventory_items for select to authenticated using (user_id = (select auth.uid()));
create policy "own inventory insert" on public.inventory_items for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own inventory update" on public.inventory_items for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own inventory delete" on public.inventory_items for delete to authenticated using (user_id = (select auth.uid()));

create policy "own recipes select" on public.recipes for select to authenticated using (user_id = (select auth.uid()));
create policy "own recipes insert" on public.recipes for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own recipes update" on public.recipes for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own recipes delete" on public.recipes for delete to authenticated using (user_id = (select auth.uid()));

create policy "own trips select" on public.shopping_trips for select to authenticated using (user_id = (select auth.uid()));
create policy "own trips insert" on public.shopping_trips for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own trips update" on public.shopping_trips for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own trips delete" on public.shopping_trips for delete to authenticated using (user_id = (select auth.uid()));

create policy "own documents select" on public.user_documents for select to authenticated using (user_id = (select auth.uid()));
create policy "own documents insert" on public.user_documents for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own documents update" on public.user_documents for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own documents delete" on public.user_documents for delete to authenticated using (user_id = (select auth.uid()));

-- Role checks are database-owned. Premium/admin access MUST NOT be granted
-- based on an editable profile field or a browser-supplied email address.
-- Configure billing after beta with signed Stripe webhook events.

-- Example account isolation tests for two distinct signed-in test users:
-- Alice can insert/select her own rows; Bob cannot select/update/delete Alice's rows.
-- anon should be denied for all six tables.
