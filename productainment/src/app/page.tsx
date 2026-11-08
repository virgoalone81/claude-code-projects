import Link from "next/link";
import { FREE_DAYS, FREE_TRIAL_SPOTS, PLAN_DAYS, PRICE_LABEL } from "@/lib/limits";
import { freeSpotsLeft } from "@/lib/supabase/admin";

// Re-check the free-spots counter at most once a minute.
export const revalidate = 60;

const steps = [
  ["Tell it about your song", "Title, genre, the story behind it, and what scares you about promoting it."],
  ["Get your 30-day plan", "One TikTok and YouTube Shorts video a day: the hook, what to film, the caption."],
  ["Do today's task. That's it.", "Read your confidence note, post, tap Posted, and watch your streak grow."],
];

export default async function Home() {
  const left = await freeSpotsLeft();

  return (
    <div className="space-y-16 pt-10">
      <section className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">For artists who make music</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Stop wondering what to post.
          <br />
          Start posting with confidence.
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Enter one song. Productainment writes your {PLAN_DAYS}-day release plan and hands you one
          video to make each day, with a note to read before you hit post.
        </p>

        <FreeSpots left={left} />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map(([title, body], i) => (
          <div key={title} className="card space-y-2">
            <div className="text-2xl font-bold text-gold">{i + 1}</div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-muted">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function FreeSpots({ left }: { left: number | null }) {
  if (left === 0) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/login" className="btn">
          Start my {PLAN_DAYS}-day plan
        </Link>
        <span className="text-sm text-muted">
          All {FREE_TRIAL_SPOTS} free spots are taken. Full plan {PRICE_LABEL}. Cancel anytime.
        </span>
      </div>
    );
  }

  if (left === null) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/login" className="btn">
          Build my plan
        </Link>
        <span className="text-sm text-muted">
          The first {FREE_TRIAL_SPOTS} artists get {FREE_DAYS} days free. Full plan {PRICE_LABEL}.
        </span>
      </div>
    );
  }

  const taken = FREE_TRIAL_SPOTS - left;
  return (
    <div className="card max-w-xl space-y-4 border-gold">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {left} of {FREE_TRIAL_SPOTS} free spots left
      </p>
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: FREE_TRIAL_SPOTS }, (_, i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${i < taken ? "bg-gold" : "bg-line"}`} />
        ))}
      </div>
      <p className="text-muted">
        The first {FREE_TRIAL_SPOTS} artists who sign up get their first {FREE_DAYS} days free. After that,
        the full plan is {PRICE_LABEL}.
      </p>
      <Link href="/login" className="btn">
        Claim 1 of the {FREE_TRIAL_SPOTS} free spots
      </Link>
    </div>
  );
}
