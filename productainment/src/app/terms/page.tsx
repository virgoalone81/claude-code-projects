import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/env";
import { FREE_DAYS, FREE_TRIAL_SPOTS, PLAN_DAYS, PRICE_LABEL } from "@/lib/limits";

export const metadata: Metadata = { title: "Terms of Service | Productainment" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms cover your use of Productainment. When you create an account, you agree to them. If you
        don&apos;t agree, don&apos;t use the app.
      </p>

      <h2>Who runs Productainment</h2>
      <p>
        Productainment is made by Terrance Wilburn and provided by VIRGO 81 LLC. Questions go to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>What you get</h2>
      <p>
        You tell Productainment about one of your songs. It uses AI (Claude, made by Anthropic) to write a{" "}
        {PLAN_DAYS}-day posting plan: one short video a day, with a hook, what to film, a caption, and a note to
        read before you post. You mark each day when you post, and the app tracks your streak.
      </p>

      <h2>The free week</h2>
      <p>
        The first {FREE_TRIAL_SPOTS} people who create an account get their first {FREE_DAYS} days free for one
        song. No card is needed for the free week. Once those {FREE_TRIAL_SPOTS} spots are taken, new accounts start
        on the full plan.
      </p>

      <h2>The full plan and billing</h2>
      <ul>
        <li>
          The full plan costs {PRICE_LABEL}. It unlocks all {PLAN_DAYS} days and unlimited songs.
        </li>
        <li>Stripe processes every payment. We never see or store your card number.</li>
        <li>Your plan renews every month on the same date until you cancel.</li>
        <li>You can cancel anytime from My songs, under Manage billing.</li>
      </ul>

      <h2>Refunds</h2>
      <p>
        All sales are final. We don&apos;t refund partial months. When you cancel, you keep the full plan until the
        end of the month you paid for. The details are on the <Link href="/refunds">Refunds and cancellations</Link>{" "}
        page.
      </p>

      <h2>Your songs and your posts</h2>
      <p>
        Your answers about your songs and the plans written for you are yours. You give us permission to store them
        and send them to our AI provider so it can write your plan. You are responsible for what you post on TikTok,
        YouTube or anywhere else, including following each platform&apos;s rules and having the rights to any music,
        images or footage you use.
      </p>

      <h2>No guaranteed results</h2>
      <p>
        Your plan is a set of ideas, not a promise. We can&apos;t guarantee views, followers, streams or income. AI
        can make mistakes, so read every day&apos;s plan before you use it.
      </p>

      <h2>Using the app fairly</h2>
      <p>
        Don&apos;t use Productainment for anything illegal, don&apos;t try to break, copy or resell it, and
        don&apos;t share your account. We can suspend accounts that do.
      </p>

      <h2>Changes</h2>
      <p>
        We may change features, prices or these terms. If the price of your plan changes, we&apos;ll email you at
        least 14 days before it takes effect. The app may sometimes be down for updates or outages.
      </p>

      <h2>Limits on our responsibility</h2>
      <p>
        As far as the law allows, Productainment is provided &ldquo;as is,&rdquo; and our total responsibility for
        any claim is limited to what you paid us in the 3 months before the claim.
      </p>

      <h2>Age</h2>
      <p>
        You must be at least 13 to use Productainment. If you&apos;re under 18, a parent or guardian must agree to
        these terms and handle payment.
      </p>

      <h2>Law</h2>
      <p>These terms are governed by the laws of the State of Florida, USA.</p>
    </LegalPage>
  );
}
