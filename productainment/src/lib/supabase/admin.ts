import { createClient } from "@supabase/supabase-js";

// Bypasses row level security. Server-only: used by the Stripe webhook.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
}
