// Fixed vocabulary for the industry multi-select (creator profile + marketplace
// filter). Plain strings on CreatorProfile.industries, not a DB-backed table —
// matches the brief's "keep it minimal" schema.
export const INDUSTRIES = [
  "SaaS",
  "Fintech",
  "E-commerce",
  "Marketing",
  "AI / ML",
  "Developer Tools",
  "HR / Recruiting",
  "Healthcare",
  "Real Estate",
  "Crypto / Web3",
  "Consumer Tech",
  "Cybersecurity",
] as const;

export const MAX_CREATOR_INDUSTRIES = 3;

export const COLLAB_STATUS_LABELS = {
  PENDING: "Pending",
  ACTIVE: "Active",
  DECLINED: "Declined",
  COMPLETED: "Completed",
} as const;

// Sample address for the legal pages. The reserved `.example` domain can't
// receive mail, so swap in the real support inbox before launch.
export const CONTACT_EMAIL = "hello@naano.example";
