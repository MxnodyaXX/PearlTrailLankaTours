-- ════════════════════════════════════════════════════════════════
--  PearlTrail — packages table
--  Run this once in your Supabase project:  SQL Editor → paste → Run
-- ════════════════════════════════════════════════════════════════

create table if not exists public.packages (
  id          text primary key,
  title       text not null,
  tagline     text default '',
  days        text default '',
  price       text default '',
  img         text default '',
  "desc"      text default '',   -- highlight chips (· separated)
  inc         text default '',   -- what's included
  exc         text default '',   -- what's excluded
  overview    text default '',
  itinerary   jsonb not null default '[]'::jsonb,  -- multi-day plan (empty = simple package)
  map         jsonb not null default '{"route":[],"stops":[]}'::jsonb,  -- route line + city markers
  sort        int  default 0,    -- display order
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- If the table already exists from an earlier run, add the columns:
alter table public.packages add column if not exists itinerary jsonb not null default '[]'::jsonb;
alter table public.packages add column if not exists map jsonb not null default '{"route":[],"stops":[]}'::jsonb;

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists packages_touch on public.packages;
create trigger packages_touch before update on public.packages
  for each row execute function public.touch_updated_at();

-- ── Row Level Security ──────────────────────────────────────────
alter table public.packages enable row level security;

-- Anyone (the public website) can READ
drop policy if exists "public read packages" on public.packages;
create policy "public read packages" on public.packages
  for select using (true);

-- Only logged-in admins can WRITE
drop policy if exists "auth insert packages" on public.packages;
create policy "auth insert packages" on public.packages
  for insert to authenticated with check (true);

drop policy if exists "auth update packages" on public.packages;
create policy "auth update packages" on public.packages
  for update to authenticated using (true) with check (true);

drop policy if exists "auth delete packages" on public.packages;
create policy "auth delete packages" on public.packages
  for delete to authenticated using (true);

-- ── Image storage bucket (run once; or create in Storage UI) ────
insert into storage.buckets (id, name, public)
values ('package-images', 'package-images', true)
on conflict (id) do nothing;

-- Public can read images; logged-in admins can upload/replace/delete
drop policy if exists "public read package images" on storage.objects;
create policy "public read package images" on storage.objects
  for select using (bucket_id = 'package-images');

drop policy if exists "auth write package images" on storage.objects;
create policy "auth write package images" on storage.objects
  for all to authenticated
  using (bucket_id = 'package-images')
  with check (bucket_id = 'package-images');
