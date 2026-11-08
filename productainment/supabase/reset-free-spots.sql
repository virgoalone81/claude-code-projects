-- Run this ONCE, right before you announce the app, after you finish testing.
-- It gives the free spots back, so your test accounts don't use up any of the 10.
-- Supabase > SQL Editor > paste > Run.

update public.profiles set trial_eligible = false;

select public.free_spots_left() as free_spots_left; -- should say 10
