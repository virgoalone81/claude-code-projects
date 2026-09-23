import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { PLAN_DAYS } from "./limits";

export const PlanDaySchema = z.object({
  day: z.number().int(),
  title: z.string(),
  hook: z.string(),
  film: z.string(),
  caption: z.string(),
  confidence: z.string(),
});

const PlanSchema = z.object({ days: z.array(PlanDaySchema) });

export type PlanDay = z.infer<typeof PlanDaySchema>;

export type SongInput = {
  title: string;
  genre: string;
  about: string;
  story: string;
  releaseDate: string;
  fear: string;
};

const SYSTEM = `You are the marketing brain inside Productainment, an app that gives independent music artists a 30-day short-form video plan for one song, built for TikTok and YouTube Shorts.

The artist is one person filming on a phone, with no team and no budget. Their biggest obstacle is not ideas, it is the fear of posting. Every day you write must be something they can film alone in under 20 minutes.

Write exactly ${PLAN_DAYS} days, numbered 1 to ${PLAN_DAYS}. Day 1 is today. Build the arc around the release date: tease before it, celebrate on it, keep the song alive after it. Mix these formats across the month: the story behind the song, a performance or snippet, the making-of in the studio, a talking-to-camera moment, a reaction or duet invite, a behind-the-scenes day, and a direct question to the audience. Never repeat the same format two days in a row.

For each day:
- title: the task in 3 to 6 words.
- hook: the exact first line they say or put on screen in the first 2 seconds.
- film: plain step-by-step instructions for what to film, where to point the phone, and how long the video is.
- caption: the ready-to-paste caption with 3 to 5 hashtags.
- confidence: two or three sentences they read to themselves right before posting. Speak directly to them. Use their stated fear to make this specific. Be encouraging and honest, never cheesy.

Use the artist's own story and words. Write in plain, everyday language. No puns, no wordplay, no marketing jargon.`;

const client = new Anthropic();

export async function generatePlan(song: SongInput): Promise<PlanDay[]> {
  const response = await client.beta.messages.parse({
    model: "claude-opus-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "medium",
      format: betaZodOutputFormat(PlanSchema),
    },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Song title: ${song.title}
Genre: ${song.genre}
What the song is about: ${song.about}
The story behind it: ${song.story}
Release date: ${song.releaseDate}
Today's date: ${new Date().toISOString().slice(0, 10)}
What scares me about promoting it: ${song.fear}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("The plan could not be written for this song. Try rewording your answers.");
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("The plan came back too long. Please try again.");
  }

  const days = response.parsed_output?.days;
  if (!days || days.length < PLAN_DAYS) {
    throw new Error("The plan came back incomplete. Please try again.");
  }

  return days.slice(0, PLAN_DAYS).map((d, i) => ({ ...d, day: i + 1 }));
}
