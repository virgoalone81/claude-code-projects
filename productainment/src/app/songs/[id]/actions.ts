"use server";

import { revalidatePath } from "next/cache";
import { isPlausibleToday } from "@/lib/dates";
import { FREE_DAYS, PLAN_DAYS } from "@/lib/limits";
import { requireUser } from "@/lib/supabase/server";

export async function markPosted(songId: string, day: number, localDate: string) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Please log in again." };
  if (!Number.isInteger(day) || day < 1 || day > PLAN_DAYS) return { error: "Invalid day." };
  if (!isPlausibleToday(localDate)) return { error: "Your device date looks off. Check your clock." };

  const [{ data: profile }, { data: done }] = await Promise.all([
    supabase.from("profiles").select("is_pro").eq("id", user.id).single(),
    supabase.from("completions").select("day, completed_on").eq("song_id", songId),
  ]);

  if (day > FREE_DAYS && !profile?.is_pro) return { error: "Unlock the full plan to keep going." };

  const doneDays = new Set(done?.map((c) => c.day));
  let next = 1;
  while (doneDays.has(next)) next++;
  if (day !== next) return { error: "Finish your days in order." };
  if (done?.some((c) => c.completed_on === localDate)) {
    return { error: "You already posted for this song today. Come back tomorrow." };
  }

  const { error } = await supabase
    .from("completions")
    .insert({ song_id: songId, day, completed_on: localDate });
  if (error) {
    console.error(error);
    return { error: "Could not save. Please try again." };
  }

  revalidatePath(`/songs/${songId}`);
  revalidatePath("/dashboard");
  return {};
}
