"use client";

import { useActionState } from "react";
import { createSong, type CreateSongState } from "./actions";

const questions = [
  { name: "title", label: "Song title", type: "input" },
  { name: "genre", label: "Genre", type: "input", placeholder: "Gospel, R&B, hip-hop..." },
  { name: "about", label: "What is the song about?", type: "textarea" },
  { name: "story", label: "What's the story behind it? Why did you write it?", type: "textarea" },
  { name: "releaseDate", label: "Release date", type: "date" },
  { name: "fear", label: "What scares you about promoting this song?", type: "textarea" },
] as const;

export function SongForm() {
  const [state, action, pending] = useActionState<CreateSongState, FormData>(createSong, {});

  return (
    <form action={action} className="space-y-5">
      {questions.map((q) => (
        <label key={q.name} className="block space-y-2">
          <span className="font-medium">{q.label}</span>
          {q.type === "textarea" ? (
            <textarea name={q.name} required rows={3} maxLength={2000} className="field" />
          ) : (
            <input
              name={q.name}
              required
              type={q.type === "date" ? "date" : "text"}
              maxLength={200}
              placeholder={"placeholder" in q ? q.placeholder : undefined}
              className="field"
            />
          )}
        </label>
      ))}

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button className="btn w-full" disabled={pending}>
        {pending ? "Writing your 30-day plan... (about a minute)" : "Build my 30-day plan"}
      </button>
    </form>
  );
}
