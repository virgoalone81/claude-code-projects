"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { localDateString } from "@/lib/dates";
import type { PlanDay } from "@/lib/plan";
import { markPosted } from "./actions";

const subscribe = () => () => {};

type Props = {
  songId: string;
  task: PlanDay | null;
  locked: boolean;
  completions: { day: number; completed_on: string }[];
};

export function TodayCard({ songId, task, locked, completions }: Props) {
  const today = useSyncExternalStore(subscribe, () => localDateString(), () => null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  if (!today) return <div className="card h-64 animate-pulse" />;

  if (!task) {
    return (
      <div className="card space-y-2 border-gold">
        <h2 className="text-2xl font-bold">All 30 days done.</h2>
        <p className="text-muted">You showed up for your music every day. Add your next song and do it again.</p>
      </div>
    );
  }

  if (completions.some((c) => c.completed_on === today)) {
    return (
      <div className="card space-y-2 border-gold">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Done for today</p>
        <h2 className="text-2xl font-bold">You posted. That took courage.</h2>
        <p className="text-muted">Come back tomorrow for Day {task.day}: {task.title}.</p>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="card space-y-3 border-gold">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Day {task.day}</p>
        <h2 className="text-2xl font-bold">You finished your free week.</h2>
        <p className="text-muted">Unlock the rest of your plan to keep your streak going.</p>
        <form action="/api/stripe/checkout" method="post">
          <button className="btn">Unlock the full plan</button>
        </form>
      </div>
    );
  }

  function onPosted() {
    setError("");
    startTransition(async () => {
      const result = await markPosted(songId, task!.day, today!);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="card space-y-5 border-gold">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Today · Day {task.day} of 30</p>
        <h2 className="mt-1 text-2xl font-bold">{task.title}</h2>
      </div>

      <Section label="Your hook (first 2 seconds)">
        <p className="text-lg font-medium">&ldquo;{task.hook}&rdquo;</p>
      </Section>
      <Section label="What to film">
        <p className="whitespace-pre-line">{task.film}</p>
      </Section>
      <Section label="Caption">
        <CopyBlock text={task.caption} />
      </Section>
      <div className="rounded-xl bg-gold/10 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold">Read this before you post</p>
        <p className="text-cream">{task.confidence}</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button className="btn w-full" onClick={onPosted} disabled={pending}>
        {pending ? "Saving..." : "I posted it"}
      </button>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
      {children}
    </div>
  );
}

function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line p-3">
      <p className="flex-1 whitespace-pre-line text-sm">{text}</p>
      <button
        type="button"
        className="text-sm font-semibold text-gold"
        onClick={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
