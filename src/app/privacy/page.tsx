import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/landing/legal-doc";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy policy — Naano",
  description: "What data Naano collects, why, and who can see it.",
};

// Draft written from what this app actually stores (see prisma/schema.prisma)
// and which third parties it talks to. Not a copy of naano.com's policy, and
// not reviewed by a lawyer.
const SECTIONS: LegalSection[] = [
  {
    heading: "What we collect",
    body: (
      <ul>
        <li>
          <strong>Account details:</strong> your name, email address, whether you are a company or a creator, and your
          password. We never store the password itself, only a one-way hash of it.
        </li>
        <li>
          <strong>Creator profiles:</strong> headline, country, LinkedIn profile URL, industries and price per post.
        </li>
        <li>
          <strong>Company profiles:</strong> company name and, if you add it, your website.
        </li>
        <li>
          <strong>Collaborations:</strong> who booked whom, the price, status, optional due date, and the link to the
          published post.
        </li>
      </ul>
    ),
  },
  {
    heading: "How we use it",
    body: (
      <p>
        Only to run the marketplace: to sign you in, show creator profiles to companies, pass booking requests between
        the two sides, and show each of you the status of your collaborations and earnings. We do not sell your data
        or use it for advertising.
      </p>
    ),
  },
  {
    heading: "Who can see what",
    body: (
      <ul>
        <li>
          Creator profiles (name, country, headline, industries, price and LinkedIn URL) are visible to signed-in
          companies in the marketplace.
        </li>
        <li>
          The first few marketplace creators are also featured on our public home page with their name, country,
          headline, industries and price.
        </li>
        <li>
          A collaboration is only visible to the company and the creator involved. Email addresses are not shown to
          other users.
        </li>
      </ul>
    ),
  },
  {
    heading: "Cookies and local storage",
    body: (
      <ul>
        <li>One essential cookie keeps you signed in. It is removed when you sign out.</li>
        <li>Your light or dark theme choice is saved in your browser&apos;s local storage.</li>
        <li>We do not use analytics, advertising or tracking cookies.</li>
      </ul>
    ),
  },
  {
    heading: "Service providers",
    body: (
      <ul>
        <li>The app is hosted on Vercel, and your data is stored in a PostgreSQL database hosted by Neon.</li>
        <li>
          Decorative placeholder images on our home page are loaded from pravatar.cc, which means that service receives
          your browser&apos;s request (including your IP address) when you view the page.
        </li>
        <li>
          Founder photos on our home and About pages are loaded from naano.com in the same way.
        </li>
      </ul>
    ),
  },
  {
    heading: "Keeping and deleting data",
    body: (
      <p>
        We keep your data for as long as your account exists. Deleting an account removes its profile and the
        collaborations attached to it. You can ask us to access, correct or delete your data at any time by
        emailing{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
  {
    heading: "Changes to this policy",
    body: (
      <p>
        If what we collect or how we use it changes, we will update this page and the date at the top.
      </p>
    ),
  },
  {
    heading: "Contact us",
    body: (
      <p>
        For any privacy question or request, email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy policy"
      updated="September 26, 2026"
      intro={<p>What we collect, why we collect it, and who can see it.</p>}
      sections={SECTIONS}
    />
  );
}
