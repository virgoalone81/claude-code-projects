import { redirect } from "next/navigation";
import { FREE_SONGS, FREE_TRIAL_SPOTS, PRICE_LABEL } from "@/lib/limits";
import { requireUser } from "@/lib/supabase/server";
import { SongForm } from "./SongForm";

// Writing a 30-day plan takes about a minute.
export const maxDuration = 300;

export default async function NewSongPage() {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("is_pro, trial_eligible").eq("id", user.id).single(),
    supabase.from("songs").select("id", { count: "exact", head: true }),
  ]);

  const isPro = profile?.is_pro ?? false;
  const freeWeek = profile?.trial_eligible ?? false;

  if (!isPro && (!freeWeek || (count ?? 0) >= FREE_SONGS)) {
    return (
      <div className="card mx-auto mt-10 max-w-lg space-y-4 border-gold">
        <h1 className="text-2xl font-bold">Unlock the full plan to add this song</h1>
        <p className="text-muted">
          {freeWeek
            ? `Your free week covers ${FREE_SONGS} song.`
            : `The ${FREE_TRIAL_SPOTS} free spots are taken.`}{" "}
          The full plan is {PRICE_LABEL}: unlimited songs, all 30 days, cancel anytime.
        </p>
        <form action="/api/stripe/checkout" method="post">
          <button className="btn">Unlock the full plan</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tell me about your song</h1>
        <p className="text-muted">Answer in your own words. The more honest you are, the better your plan.</p>
      </div>
      <SongForm />
    </div>
  );
}
