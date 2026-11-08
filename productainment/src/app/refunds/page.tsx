import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/env";

export const metadata: Metadata = { title: "Refunds and Cancellations | Productainment" };

export default function RefundsPage() {
  return (
    <LegalPage title="Refunds and cancellations">
      <ul>
        <li>
          <strong>Cancel anytime.</strong> Open My songs, click Manage billing, then cancel. No email or phone call
          needed.
        </li>
        <li>
          <strong>You keep what you paid for.</strong> After you cancel, the full plan stays on until the end of the
          month you paid for, and you won&apos;t be charged again.
        </li>
        <li>
          <strong>All sales are final.</strong> We don&apos;t refund partial months or unused time.
        </li>
        <li>
          <strong>Billing mistakes get fixed.</strong> If you were charged after you canceled, or charged twice for the
          same month, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> within 30 days and we&apos;ll
          correct it.
        </li>
      </ul>
    </LegalPage>
  );
}
