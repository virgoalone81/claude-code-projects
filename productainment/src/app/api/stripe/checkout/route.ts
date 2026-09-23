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

  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    client_reference_id: user.id,
    ...(profile?.stripe_customer_id
      ? { customer: profile.stripe_customer_id }
      : { customer_email: user.email }),
    success_url: `${site}/dashboard?upgraded=1`,
    cancel_url: `${site}/dashboard`,
  });

  return NextResponse.redirect(session.url!, 303);
}
