-- Productainment database.
-- Paste this whole file into Supabase > SQL Editor and click Run.
-- Safe to run more than once: it only adds what is missing and updates the functions.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  is_pro boolean not null default false,
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

-- True for the first 10 sign-ups only. They get the free week (1 song, days 1 to 7).
alter table public.profiles add column if not exists trial_eligible boolean not null default false;

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null,
  genre text not null,
  about text not null,
  story text not null,
  release_date date not null,
  fear text not null,
  plan jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.completions (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  song_id uuid not null references public.songs on delete cascade,
  day int not null check (day between 1 and 30),
  completed_on date not null,
  created_at timestamptz not null default now(),
  unique (song_id, day)
);

create index if not exists songs_user_id_idx on public.songs (user_id);
create index if not exists completions_user_id_completed_on_idx on public.completions (user_id, completed_on);

-- How many free-week spots there are. Keep it the same as FREE_TRIAL_SPOTS in src/lib/limits.ts.
create or replace function public.trial_spots_total() returns int
language sql immutable as $$ select 10 $$;

-- Every new login gets a profile row. The first 10 get the free week.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  -- One sign-up at a time, so two people can't both take the last free spot.
  perform pg_advisory_xact_lock(81);
  insert into public.profiles (id, trial_eligible)
  values (
    new.id,
    (select count(*) from public.profiles where trial_eligible) < public.trial_spots_total()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Free spots still open. The landing page shows this number, so anyone may call it.
create or replace function public.free_spots_left() returns int
language sql stable security definer set search_path = '' as $$
  select greatest(
    0,
    public.trial_spots_total() - (select count(*)::int from public.profiles where trial_eligible)
  );
$$;

revoke all on function public.free_spots_left() from public;
grant execute on function public.free_spots_left() to anon, authenticated;

-- Row level security: artists only ever see their own data.
alter table public.profiles enable row level security;
alter table public.songs enable row level security;
alter table public.completions enable row level security;

-- Profiles are read-only to artists. Only the Stripe webhook (secret key) changes is_pro.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using ((select auth.uid()) = id);

drop policy if exists "read own songs" on public.songs;
create policy "read own songs" on public.songs
  for select using ((select auth.uid()) = user_id);
drop policy if exists "insert own songs" on public.songs;
create policy "insert own songs" on public.songs
  for insert with check ((select auth.uid()) = user_id);
drop policy if exists "delete own songs" on public.songs;
create policy "delete own songs" on public.songs
  for delete using ((select auth.uid()) = user_id);

drop policy if exists "read own completions" on public.completions;
create policy "read own completions" on public.completions
  for select using ((select auth.uid()) = user_id);
drop policy if exists "insert own completions" on public.completions;
create policy "insert own completions" on public.completions
  for insert with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.songs s where s.id = song_id and s.user_id = (select auth.uid()))
  );
