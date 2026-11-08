import { notFound, redirect } from "next/navigation";
import { Streak } from "@/components/Streak";
import { FREE_DAYS } from "@/lib/limits";
import type { PlanDay } from "@/lib/plan";
import { requireUser } from "@/lib/supabase/server";
import { TodayCard } from "./TodayCard";

export default async function SongPage({ params }: PageProps<"/songs/[id]">) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");

  const [{ data: song }, { data: profile }, { data: allCompletions }] = await Promise.all([
    supabase.from("songs").select("id, title, genre, release_date, plan").eq("id", id).maybeSingle(),
    supabase.from("profiles").select("is_pro, trial_eligible").eq("id", user.id).single(),
    supabase.from("completions").select("song_id, day, completed_on"),
  ]);
  if (!song) notFound();

  const isPro = profile?.is_pro ?? false;
  // Only the first 10 sign-ups get the free week. Everyone else needs the full plan.
  const freeDays = profile?.trial_eligible ? FREE_DAYS : 0;
  const plan = song.plan as PlanDay[];
  const completions = (allCompletions ?? []).filter((c) => c.song_id === song.id);
  const doneDays = new Set(completions.map((c) => c.day));
  const task = plan.find((d) => !doneDays.has(d.day)) ?? null;
  const locked = !!task && task.day > freeDays && !isPro;

  return (
    <div className="space-y-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold">{song.title}</h1>
        <p className="text-muted">
          {song.genre} · releases {song.release_date}
        </p>
      </div>

      <Streak dates={(allCompletions ?? []).map((c) => c.completed_on)} />

      <TodayCard
        songId={song.id}
        task={locked ? { ...task!, hook: "", film: "", caption: "", confidence: "" } : task}
        locked={locked}
        hadFreeWeek={freeDays > 0}
        completions={completions}
      />

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your 30 days</h2>
        <ol className="grid gap-2">
          {plan.map((d) => {
            const done = doneDays.has(d.day);
            const hidden = d.day > freeDays && !isPro;
            return (
              <li
                key={d.day}
                className={`flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm ${
                  d.day === task?.day ? "border-gold" : ""
                }`}
              >
                <span className="w-14 shrink-0 text-muted tabular-nums">Day {d.day}</span>
                <span className={`flex-1 ${done ? "text-muted line-through" : ""}`}>
                  {hidden ? "Unlock the full plan to see this day" : d.title}
                </span>
                {done && <span className="text-gold">Posted</span>}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
