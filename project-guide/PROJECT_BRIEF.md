# Naano Clone — Build Brief for Claude Code

## Context

This is a 24-hour take-home assignment for a Software Engineer role at 8x.
The brief: rebuild naano.com (a B2B LinkedIn creator marketplace), from a live
reference, using an AI coding agent (Claude Code) end-to-end. Judged on:
**speed, product judgement (what you built vs. cut), and UX/UI quality.**

**Real time available: ~3 hours of actual coding.** This doc reflects an
aggressively cut scope for that window, not a full 24-hour build. Do not
expand scope mid-build — if something isn't in "In Scope" below, skip it,
even if it seems easy.

Naano is a two-sided marketplace: **companies** book **creators** to publish
sponsored LinkedIn posts at a fixed price, and track attributed clicks/leads
back to each post.

---

## Tech Stack

- **Next.js 14 (App Router) + TypeScript** — single app, frontend + API routes
- **Tailwind CSS + shadcn/ui** — fast, clean UI
- **Prisma + PostgreSQL** (Neon or Vercel Postgres) — schema below
- **NextAuth (or Clerk)** — simple email or Google auth, role field on user
- **Vercel** — deployment
- Skip: real Stripe integration, real LinkedIn/Apify scraping, real AI/LLM
  calls (mock all of these — see "Explicitly Out of Scope")

---

## Core Loop (build this end-to-end, nothing else matters more)

1. User signs up → picks role: **Creator** or **Company**
2. **Creator** completes a short profile (name, LinkedIn URL — just store the
   string, don't scrape it — country, up to 3 industries, price/post)
3. **Company** completes a short profile (company name, website URL — just
   store it, don't scrape/analyze it)
4. **Company** browses a creator marketplace grid (search + filter by
   industry) and clicks **Book** on a creator
5. This creates a **Collaboration** with status `pending`
6. **Creator** sees it under Collaborations → "Needs action" → Accept/Decline
7. If accepted → status `active` → creator has a "mark as delivered" button
   (paste a fake LinkedIn URL) → status `completed`
8. Completed collaboration shows up in creator's **Earnings** as net revenue
   (mocked balance, no real payout)

If you only build this loop, faithfully, with clean UI — that is a strong
submission. Everything below "In Scope" is only if time remains after this
loop works end-to-end.

---

## In Scope

- Auth + role picker (creator / company) — mirrors real Naano's
  `/register?role=influencer|saas` pattern
- Creator profile: name, LinkedIn URL (string only), country, industries
  (multi-select, up to 3), price per post
- Company profile: company name, website URL (string only)
- Creator marketplace grid (company view): search bar, industry filter,
  creator cards (name, industries, price), **Book** button
- Creator profile modal/page (company view): shows price, a "typical reach"
  placeholder stat, **Collaborate** button → creates pending Collaboration
- Collaborations list (both roles): table with Brand/Creator, Status,
  Next action, Due date — filterable by status tabs (All / Active / Needs
  action / Completed at minimum)
- Accept/Decline on the creator side for pending requests
- Mark-as-delivered action (creator) that moves status to Completed
- Earnings page (creator): total earned (sum of completed collaboration
  prices), simple list of paid collaborations — no real payout method needed
- Basic dashboard/overview per role with a few summary stats (even if
  numbers are mostly 0 for a fresh account, that's authentic to the real
  product's empty states)

## Explicitly Out of Scope (cut these, defend the cut in your walkthrough)

- Agencies (brand agency / creator agency workspaces) — multi-tenant layer,
  not a new core mechanic
- Real LinkedIn scraping / Apify integration — mock with placeholder or
  manually-entered stats
- Real AI onboarding (website analysis → ICP generation) — mock with a
  canned/templated response or skip the "analyze" step entirely, just take
  the URL as a plain text field
- "Create with AI" campaign generator, "AI Matching" chatbot (Nao) — skip
  entirely; company just browses/filters the marketplace directly
- Real Stripe/payment processing, wallet top-up flows
- Affiliate/referral program, "Deal Link" revenue share
- Community, Messages (in-app chat)
- Public post analytics import, engagement charts
- Open "Opportunities" campaign board (companies posting public campaigns
  creators apply to) — only do direct company→creator booking, skip the
  reverse application flow
- 1,000-follower gating logic and any other business-rule gates

---

## Data Model (Prisma sketch)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  role          Role
  createdAt     DateTime @default(now())

  creatorProfile  CreatorProfile?
  companyProfile  CompanyProfile?
}

enum Role {
  CREATOR
  COMPANY
}

model CreatorProfile {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
  linkedinUrl  String?
  country      String?
  industries   String[] // simple string array, max 3 enforced in UI
  pricePerPost Int      // in cents or whole currency units, your call
  headline     String?

  collaborations Collaboration[]
}

model CompanyProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  companyName String
  website     String?

  collaborations Collaboration[]
}

model Collaboration {
  id          String   @id @default(cuid())
  companyId   String
  company     CompanyProfile @relation(fields: [companyId], references: [id])
  creatorId   String
  creator     CreatorProfile @relation(fields: [creatorId], references: [id])
  status      CollabStatus @default(PENDING)
  price       Int
  dueDate     DateTime?
  postUrl     String?  // filled in when creator "delivers"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum CollabStatus {
  PENDING     // company booked, awaiting creator response
  DECLINED
  ACTIVE      // creator accepted, post not yet delivered
  COMPLETED   // post delivered
}
```

This is intentionally minimal. Don't add Campaign, Wallet, or Payout tables
unless the core loop is fully working with time to spare.

---

## Routes (App Router)

```
/                       marketing/landing (can be minimal, low priority)
/register               role picker → signup
/onboarding             role-specific profile setup (creator or company)
/dashboard              role-aware overview (redirects based on session role)
/marketplace            company view: browse/filter/search creators
/marketplace/[id]       creator profile modal or page + Book action
/collaborations         both roles: table of collaborations, status tabs
/earnings               creator only: total earned + paid collaborations list
```

---

## Build Order (given ~3 hours)

1. Project scaffold, Prisma schema + migration, auth wired up (30 min)
2. Role picker + onboarding forms for both roles (30 min)
3. Marketplace grid + creator profile + Book action → creates Collaboration
   (45 min)
4. Collaborations table + Accept/Decline + mark-as-delivered (45 min)
5. Earnings page (15 min)
6. Polish pass: empty states, loading states, consistent styling (30 min)
7. Deploy to Vercel, seed a couple of demo accounts/collaborations so the
   live link isn't completely empty for a reviewer signing in fresh (15 min)

Cut step 6 or 7's scope first if you're running long — never cut step 3 or 4,
those are the core loop the whole assignment is judged on.

---

## Reminders (process, not code)

- `.agent-logs/` capture should already be verified and running before this
  brief is opened (via the separate 8x agent-capture-setup prompt and its
  `CAPTURE-TEST.md` check). Don't touch, edit, or clean up `.agent-logs/`
  contents during the build — keep committing it incrementally alongside
  code, in the same commits or interleaved with them, not saved for the end.
- The live link must open for a signed-out visitor — test in an incognito
  window before submitting.
- Repository must be public with `.agent-logs/` committed.
- Walkthrough: camera on, under 5 minutes, narrate what you built first,
  what you deliberately cut, and why (referencing this brief's "Out of
  Scope" section is a legitimate, honest answer to "product judgement").
