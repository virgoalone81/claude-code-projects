import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions";
import { Streak } from "@/components/Streak";
import { FREE_DAYS, FREE_SONGS, FREE_TRIAL_SPOTS, PRICE_LABEL } from "@/lib/limits";
import { requireUser } from "@/lib/supabase/server";

export default async function Dashboard({ searchParams }: PageProps<"/dashboard">) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: songs }, { data: completions }] = await Promise.all([
    supabase.from("profiles").select("is_pro, trial_eligible").eq("id", user.id).single(),
    supabase.from("songs").select("id, title, genre, release_date").order("created_at", { ascending: false }),
    supabase.from("completions").select("song_id, completed_on"),
  ]);

  const isPro = profile?.is_pro ?? false;
  const freeWeek = profile?.trial_eligible ?? false;
  const canAddSong = isPro || (freeWeek && (songs?.length ?? 0) < FREE_SONGS);
  const { upgraded } = await searchParams;

  return (
    <div className="space-y-8 pt-6">
      {upgraded && (
        <div className="card border-gold text-sm">
          You&apos;re on the full plan. All 30 days are unlocked.
        </div>
      )}

      <Streak dates={(completions ?? []).map((c) => c.completed_on)} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My songs</h1>
          {canAddSong && (
            <Link href="/songs/new" className="btn">
              Add a song
            </Link>
          )}
        </div>

        {!songs?.length && canAddSong && (
          <div className="card text-muted">Add your first song to get your 30-day plan.</div>
        )}

        {songs?.map((song) => {
          const done = completions?.filter((c) => c.song_id === song.id).length ?? 0;
          return (
            <Link key={song.id} href={`/songs/${song.id}`} className="card block transition hover:border-gold">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{song.title}</div>
                  <div className="text-sm text-muted">
                    {song.genre} · releases {song.release_date}
                  </div>
                </div>
                <div className="text-right text-sm text-muted tabular-nums">{done}/30 posted</div>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="card space-y-3">
        {isPro ? (
          <>
            <h2 className="font-semibold">Full plan</h2>
            <p className="text-sm text-muted">Unlimited songs and all 30 days.</p>
            <form action="/api/stripe/portal" method="post">
              <button className="btn-ghost">Manage billing</button>
            </form>
          </>
        ) : freeWeek ? (
          <>
            <h2 className="font-semibold">Your free week</h2>
            <p className="text-sm text-muted">
              You got one of the first {FREE_TRIAL_SPOTS} spots: {FREE_SONGS} song and the first {FREE_DAYS} days
              free. Unlock all 30 days and unlimited songs for {PRICE_LABEL}.
            </p>
            <form action="/api/stripe/checkout" method="post">
              <button className="btn">Unlock the full plan</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="font-semibold">Start your 30-day plan</h2>
            <p className="text-sm text-muted">
              The {FREE_TRIAL_SPOTS} free spots are taken. Get your full 30-day plan and unlimited songs for{" "}
              {PRICE_LABEL}. Cancel anytime.
            </p>
            <form action="/api/stripe/checkout" method="post">
              <button className="btn">Start the full plan</button>
            </form>
          </>
        )}
      </section>

      <form action={signOut}>
        <button className="text-sm text-muted underline">Log out</button>
      </form>
    </div>
  );
}
