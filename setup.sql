-- Run this in your Supabase project: SQL Editor → New Query → paste this → Run

create table if not exists planner_profiles (
  id            text primary key,
  plan          jsonb default '{}'::jsonb,
  session       jsonb default '{}'::jsonb,
  food_checked  jsonb default '{}'::jsonb,
  cleaning      jsonb default '[]'::jsonb,
  other         jsonb default '[]'::jsonb,
  manual_food   jsonb default '[]'::jsonb,
  locked_weeks  jsonb default '[]'::jsonb,
  pantry        jsonb default '[]'::jsonb,
  updated_at    timestamptz default now()
);

-- Allow public access (no login needed for this app)
alter table planner_profiles enable row level security;

create policy "Public read" on planner_profiles
  for select using (true);

create policy "Public write" on planner_profiles
  for insert with check (true);

create policy "Public update" on planner_profiles
  for update using (true);
