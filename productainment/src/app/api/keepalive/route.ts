import { NextResponse } from "next/server";
import { freeSpotsLeft } from "@/lib/supabase/admin";

// Vercel calls this once a day (see vercel.json), so the free Supabase project
// never gets paused for inactivity again.
export const dynamic = "force-dynamic";

export async function GET() {
  const left = await freeSpotsLeft();
  return NextResponse.json({ ok: left !== null });
}
