-- Productainment database. Paste this whole file into Supabase > SQL Editor and click Run.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  is_pro boolean not null default false,
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

create table public.songs (
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

create table public.completions (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  song_id uuid not null references public.songs on delete cascade,
  day int not null check (day between 1 and 30),
  completed_on date not null,
  created_at timestamptz not null default now(),
  unique (song_id, day)
);

create index on public.songs (user_id);
create index on public.completions (user_id, completed_on);

-- Every new login gets a profile row.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row level security: artists only ever see their own data.
alter table public.profiles enable row level security;
alter table public.songs enable row level security;
alter table public.completions enable row level security;

-- Profiles are read-only to artists. Only the Stripe webhook (secret key) changes is_pro.
create policy "read own profile" on public.profiles
  for select using ((select auth.uid()) = id);

create policy "read own songs" on public.songs
  for select using ((select auth.uid()) = user_id);
create policy "insert own songs" on public.songs
  for insert with check ((select auth.uid()) = user_id);
create policy "delete own songs" on public.songs
  for delete using ((select auth.uid()) = user_id);

create policy "read own completions" on public.completions
  for select using ((select auth.uid()) = user_id);
create policy "insert own completions" on public.completions
  for insert with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.songs s where s.id = song_id and s.user_id = (select auth.uid()))
  );
