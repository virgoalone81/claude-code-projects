import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, supabaseSecretKey } from "@/lib/env";

// Bypasses row level security. Server-only: used by the Stripe webhook.
export function createAdminClient() {
  return createClient(SUPABASE_URL, supabaseSecretKey(), { auth: { persistSession: false } });
}

// Public, logged-out access. Used for the free-spots counter and the daily keep-alive.
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
}

// How many of the free-week spots are still open. Returns null if the database can't be reached.
export async function freeSpotsLeft(): Promise<number | null> {
  try {
    const { data, error } = await createPublicClient().rpc("free_spots_left");
    if (error || typeof data !== "number") return null;
    return data;
  } catch {
    return null;
  }
}
