"use server";

import { redirect } from "next/navigation";
import { FREE_SONGS } from "@/lib/limits";
import { generatePlan, type SongInput } from "@/lib/plan";
import { requireUser } from "@/lib/supabase/server";

export type CreateSongState = { error?: string };

const FIELDS = ["title", "genre", "about", "story", "releaseDate", "fear"] as const;

export async function createSong(_prev: CreateSongState, formData: FormData): Promise<CreateSongState> {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");

  const song = {} as SongInput;
  for (const field of FIELDS) {
    const value = String(formData.get(field) ?? "").trim();
    if (!value) return { error: "Please answer every question." };
    if (value.length > 2000) return { error: "Keep each answer under 2,000 characters." };
    song[field] = value;
  }

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("is_pro").eq("id", user.id).single(),
    supabase.from("songs").select("id", { count: "exact", head: true }),
  ]);
  if (!profile?.is_pro && (count ?? 0) >= FREE_SONGS) {
    return { error: "The free plan covers one song. Unlock the full plan to add more." };
  }

  let plan;
  try {
    plan = await generatePlan(song);
  } catch (e) {
    console.error(e);
    return { error: e instanceof Error ? e.message : "Something went wrong. Please try again." };
  }

  const { data, error } = await supabase
    .from("songs")
    .insert({
      title: song.title,
      genre: song.genre,
      about: song.about,
      story: song.story,
      release_date: song.releaseDate,
      fear: song.fear,
      plan,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error(error);
    return { error: "Your plan was written but could not be saved. Please try again." };
  }

  redirect(`/songs/${data.id}`);
}
