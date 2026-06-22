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

-- ════════════════════════════════════════════════════════════════
--  Vehicles (rent-a-car fleet)
-- ════════════════════════════════════════════════════════════════
create table if not exists public.vehicles (
  id           text primary key,
  name         text not null,
  category     text default 'Other',
  models       text default '',
  seats        int  default 4,
  fuel         text default 'Petrol',
  transmission text default 'Auto',
  rating       numeric default 4.8,
  price        int  default 0,            -- LKR per day
  emoji        text default '🚗',
  image        text default '',
  badge_label  text default '',           -- optional ribbon, e.g. "Popular"
  badge_tone   text default 'gold',       -- gold | emerald | blue | purple | teal
  active       boolean default true,      -- only active vehicles show on the site
  sort         int  default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- If the table already exists from an earlier run, add the column:
alter table public.vehicles add column if not exists active boolean default true;

drop trigger if exists vehicles_touch on public.vehicles;
create trigger vehicles_touch before update on public.vehicles
  for each row execute function public.touch_updated_at();

alter table public.vehicles enable row level security;

drop policy if exists "public read vehicles" on public.vehicles;
create policy "public read vehicles" on public.vehicles
  for select using (true);

drop policy if exists "auth insert vehicles" on public.vehicles;
create policy "auth insert vehicles" on public.vehicles
  for insert to authenticated with check (true);

drop policy if exists "auth update vehicles" on public.vehicles;
create policy "auth update vehicles" on public.vehicles
  for update to authenticated using (true) with check (true);

drop policy if exists "auth delete vehicles" on public.vehicles;
create policy "auth delete vehicles" on public.vehicles
  for delete to authenticated using (true);

-- ════════════════════════════════════════════════════════════════
--  Services (travel-assistance)
-- ════════════════════════════════════════════════════════════════
create table if not exists public.services (
  id         text primary key,
  icon       text default '✨',
  title      text not null,
  "desc"     text default '',
  href       text default '/contact',
  active     boolean default true,
  sort       int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists services_touch on public.services;
create trigger services_touch before update on public.services
  for each row execute function public.touch_updated_at();

alter table public.services enable row level security;
drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (true);
drop policy if exists "auth insert services" on public.services;
create policy "auth insert services" on public.services for insert to authenticated with check (true);
drop policy if exists "auth update services" on public.services;
create policy "auth update services" on public.services for update to authenticated using (true) with check (true);
drop policy if exists "auth delete services" on public.services;
create policy "auth delete services" on public.services for delete to authenticated using (true);

-- ════════════════════════════════════════════════════════════════
--  Gallery photos
-- ════════════════════════════════════════════════════════════════
create table if not exists public.gallery (
  id         text primary key,
  src        text not null,
  label      text default '',
  active     boolean default true,
  sort       int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists gallery_touch on public.gallery;
create trigger gallery_touch before update on public.gallery
  for each row execute function public.touch_updated_at();

alter table public.gallery enable row level security;
drop policy if exists "public read gallery" on public.gallery;
create policy "public read gallery" on public.gallery for select using (true);
drop policy if exists "auth insert gallery" on public.gallery;
create policy "auth insert gallery" on public.gallery for insert to authenticated with check (true);
drop policy if exists "auth update gallery" on public.gallery;
create policy "auth update gallery" on public.gallery for update to authenticated using (true) with check (true);
drop policy if exists "auth delete gallery" on public.gallery;
create policy "auth delete gallery" on public.gallery for delete to authenticated using (true);

-- ════════════════════════════════════════════════════════════════
--  Site settings (contact info + social links) — single row id='main'
-- ════════════════════════════════════════════════════════════════
create table if not exists public.settings (
  id         text primary key default 'main',
  whatsapp   text default '',
  phone      text default '',
  telegram   text default '',
  email      text default '',
  address    text default '',
  facebook   text default '',
  instagram  text default '',
  tiktok     text default '',
  youtube    text default '',
  updated_at timestamptz default now()
);

insert into public.settings (id, whatsapp, phone, telegram, email, address, facebook, instagram, tiktok, youtube)
values ('main', '94717179956', '+94 71 717 9956', '+94717179956', 'pearltraillankatours@gmail.com', 'Colombo, Sri Lanka',
  'https://facebook.com/pearltraillankatours', 'https://instagram.com/pearltraillankatours',
  'https://tiktok.com/@pearltraillankatours', 'https://youtube.com/@pearltraillankatours')
on conflict (id) do nothing;

drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

alter table public.settings enable row level security;

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);

drop policy if exists "auth update settings" on public.settings;
create policy "auth update settings" on public.settings
  for update to authenticated using (true) with check (true);

drop policy if exists "auth insert settings" on public.settings;
create policy "auth insert settings" on public.settings
  for insert to authenticated with check (true);

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
