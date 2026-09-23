import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const ACTIVE = new Set(["active", "trialing", "past_due"]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      request.headers.get("stripe-signature") ?? "",
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.client_reference_id && session.customer) {
      const { error } = await db
        .from("profiles")
        .update({ is_pro: true, stripe_customer_id: String(session.customer) })
        .eq("id", session.client_reference_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const isPro = event.type === "customer.subscription.updated" && ACTIVE.has(sub.status);
    const { error } = await db
      .from("profiles")
      .update({ is_pro: isPro })
      .eq("stripe_customer_id", String(sub.customer));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
