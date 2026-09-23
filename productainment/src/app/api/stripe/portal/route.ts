import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireUser } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url), 303);

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();
  if (!profile?.stripe_customer_id) {
    return NextResponse.redirect(new URL("/dashboard", request.url), 303);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
  });
  return NextResponse.redirect(session.url, 303);
}
