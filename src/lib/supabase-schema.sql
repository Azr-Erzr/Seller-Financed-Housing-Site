-- HomeMatch — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New Query → Paste & Run

-- ── Listings ──────────────────────────────────────────────────────────
create table listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,

  title text not null,
  address text,
  city text not null,
  state text default 'ON',
  image text,

  price integer not null,
  down_payment integer,
  interest_min numeric(5,3),
  interest_max numeric(5,3),
  term integer default 25,

  deal_type text,
  deal_types text[],
  property_type text,
  bedrooms integer,
  bathrooms numeric(3,1),
  sqft integer,
  lot text,

  description text,
  badges text[],
  docs_locked boolean default true,

  is_active boolean default true
);

-- ── Profiles (buyers) ─────────────────────────────────────────────────
create table profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,

  name text not null,
  city text,
  bio text,
  avatar text,

  budget integer,
  down_payment integer,
  payment_budget integer,
  monthly_income integer,
  monthly_debt integer default 0,
  interest_max numeric(5,3),
  interest_range text,

  deal_preference text,
  deal_preferences text[],
  risk_tolerance text default 'Moderate',
  badges text[],

  is_active boolean default true
);

-- ── Saved items ────────────────────────────────────────────────────────
create table saved_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  saved_at timestamptz default now(),
  unique(user_id, listing_id)
);

create table saved_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  saved_at timestamptz default now(),
  unique(user_id, profile_id)
);

-- ── Row-level security ─────────────────────────────────────────────────
-- Listings: anyone can read, only owner can write
alter table listings enable row level security;
create policy "listings_public_read"  on listings for select using (true);
create policy "listings_owner_insert" on listings for insert with check (auth.uid() = user_id);
create policy "listings_owner_update" on listings for update using (auth.uid() = user_id);
create policy "listings_owner_delete" on listings for delete using (auth.uid() = user_id);

-- Profiles: anyone can read, only owner can write
alter table profiles enable row level security;
create policy "profiles_public_read"  on profiles for select using (true);
create policy "profiles_owner_insert" on profiles for insert with check (auth.uid() = user_id);
create policy "profiles_owner_update" on profiles for update using (auth.uid() = user_id);
create policy "profiles_owner_delete" on profiles for delete using (auth.uid() = user_id);

-- Saved: users only see their own saved items
alter table saved_listings enable row level security;
create policy "saved_listings_owner" on saved_listings using (auth.uid() = user_id);

alter table saved_profiles enable row level security;
create policy "saved_profiles_owner" on saved_profiles using (auth.uid() = user_id);
