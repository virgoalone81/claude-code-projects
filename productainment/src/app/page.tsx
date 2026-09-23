import Link from "next/link";
import { FREE_DAYS, PLAN_DAYS, PRICE_LABEL } from "@/lib/limits";

const steps = [
  ["Tell it about your song", "Title, genre, the story behind it, and what scares you about promoting it."],
  ["Get your 30-day plan", "One TikTok and YouTube Shorts video a day: the hook, what to film, the caption."],
  ["Do today's task. That's it.", "Read your confidence note, post, tap Posted, and watch your streak grow."],
];

export default function Home() {
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
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/login" className="btn">
            Build my plan free
          </Link>
          <span className="text-sm text-muted">
            First {FREE_DAYS} days free. Full plan {PRICE_LABEL}.
          </span>
        </div>
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
