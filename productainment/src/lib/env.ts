// One place for every setting the app reads.
// Each one accepts the name in .env.example or the name Vercel's Supabase integration creates.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const SUPABASE_PUBLISHABLE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

// Server only. Never import this into a "use client" file.
export function supabaseSecretKey() {
  return (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!;
}

// The live address. On Vercel it falls back to the production domain automatically.
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const CONTACT_EMAIL = "info@musicbizmanifesto.com";
