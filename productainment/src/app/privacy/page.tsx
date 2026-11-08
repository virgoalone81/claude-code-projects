import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/env";

export const metadata: Metadata = { title: "Privacy Policy | Productainment" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>This page explains what Productainment collects, why, and how you can have it deleted.</p>

      <h2>What we collect</h2>
      <ul>
        <li>Your email address, to log you in and contact you about your account.</li>
        <li>
          What you tell us about your songs: the title, genre, what the song is about, the story behind it, the
          release date, and what scares you about promoting it.
        </li>
        <li>The plans written for you and the days you mark as posted.</li>
        <li>
          If you subscribe: your Stripe customer number and whether your plan is active. Stripe handles your card. We
          never see the card number.
        </li>
        <li>A login cookie that keeps you signed in. We don&apos;t use ad trackers.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To write your plan, show your progress, run your subscription, and answer you when you write to us. We
        don&apos;t sell your information, and we don&apos;t use your answers to train AI.
      </p>

      <h2>Who helps us run the app</h2>
      <ul>
        <li>Supabase: our database and login emails.</li>
        <li>Vercel: hosts the app.</li>
        <li>Anthropic (Claude): writes your plan from your song answers.</li>
        <li>Stripe: handles payments.</li>
      </ul>
      <p>Each one handles your information only to provide its service to us.</p>

      <h2>Keeping and deleting your information</h2>
      <p>
        We keep your account until you ask us to delete it. Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the email address on your account, and we&apos;ll
        delete your account and songs within 30 days. Stripe keeps payment records for as long as the law requires.
      </p>

      <h2>Security</h2>
      <p>
        Every account can see only its own songs and plans, and all connections to the app are encrypted.
      </p>

      <h2>Children</h2>
      <p>Productainment isn&apos;t for children under 13, and we don&apos;t knowingly collect their information.</p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we&apos;ll update the date at the top. For important changes, we&apos;ll also email
        account holders.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}
