"use client";

import { useSyncExternalStore } from "react";
import { currentStreak, localDateString } from "@/lib/dates";

const subscribe = () => () => {};

export function Streak({ dates }: { dates: string[] }) {
  // Streak depends on the viewer's local date, so it only renders in the browser.
  const today = useSyncExternalStore(subscribe, () => localDateString(), () => null);
  const streak = today ? currentStreak(dates, today) : null;

  return (
    <div className="card flex items-center gap-5">
      <div className="text-5xl font-bold text-gold tabular-nums">{streak ?? "–"}</div>
      <div>
        <div className="font-semibold">Day streak</div>
        <div className="text-sm text-muted">
          {streak ? "Days in a row you've posted. Keep it going." : "Post today to start your streak."}
        </div>
      </div>
    </div>
  );
}
