import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/landing/legal-doc";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of service — Naano",
  description: "The rules for using the Naano creator marketplace.",
};

// Draft written to match how this app actually works (fixed per-post prices,
// request -> accept/decline -> deliver, no payment processing yet). Not a copy
// of naano.com's Terms of Sale & Use, and not reviewed by a lawyer.
const SECTIONS: LegalSection[] = [
  {
    heading: "About these terms",
    body: (
      <p>
        These terms cover your use of Naano, a marketplace where B2B companies book LinkedIn creators for sponsored
        posts. By creating an account you agree to them. If you use Naano on behalf of a company, you confirm you are
        allowed to accept these terms for that company.
      </p>
    ),
  },
  {
    heading: "Your account",
    body: (
      <ul>
        <li>You sign up as either a company or a creator, and the information you give us must be accurate.</li>
        <li>Keep your password private. You are responsible for activity on your account.</li>
        <li>One person or company per account. Do not create accounts on someone else&apos;s behalf without permission.</li>
      </ul>
    ),
  },
  {
    heading: "How bookings work",
    body: (
      <>
        <p>
          Each creator sets a <strong>fixed price per post</strong>. That listed price is the price of a booking; there
          is no bidding or negotiation inside Naano.
        </p>
        <ul>
          <li>A company sends a booking request to a creator, optionally with a due date.</li>
          <li>The creator accepts or declines. A declined request is closed and nothing is owed.</li>
          <li>
            Once accepted, the creator publishes the post on their own LinkedIn account and adds the link to mark it
            delivered.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Payments",
    body: (
      <p>
        Naano does not process payments yet. A creator&apos;s Earnings page shows the total of their delivered
        bookings, but no payout method is connected, so any payment is arranged directly between the company and the
        creator. We will update these terms before payments are handled through Naano.
      </p>
    ),
  },
  {
    heading: "Posts and content",
    body: (
      <ul>
        <li>
          Posts are published on the creator&apos;s own LinkedIn account and stay on their profile. The creator keeps
          ownership of what they write.
        </li>
        <li>
          Creators must clearly disclose sponsored content and follow LinkedIn&apos;s rules and any advertising laws that
          apply to them.
        </li>
        <li>Companies are responsible for the accuracy of anything they ask a creator to say about their product.</li>
      </ul>
    ),
  },
  {
    heading: "Acceptable use",
    body: (
      <p>
        Do not use Naano to mislead audiences, promote anything unlawful, harass other users, scrape the marketplace,
        or interfere with the service. We may suspend accounts that break these rules.
      </p>
    ),
  },
  {
    heading: "Availability and liability",
    body: (
      <p>
        We work to keep Naano running smoothly, but the service is provided as is and may change or be interrupted.
        Naano is not a party to the agreement between a company and a creator and is not responsible for the
        performance of a post.
      </p>
    ),
  },
  {
    heading: "Changes to these terms",
    body: (
      <p>
        We may update these terms as the product evolves. When we make meaningful changes, we will update the date at
        the top of this page.
      </p>
    ),
  },
  {
    heading: "Contact us",
    body: (
      <p>
        Questions about these terms, or want to report a problem with an account or booking? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of service"
      updated="September 26, 2026"
      intro={<p>The ground rules for companies and creators using Naano, in plain language.</p>}
      sections={SECTIONS}
    />
  );
}
