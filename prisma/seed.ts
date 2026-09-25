import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Every seeded account shares this password so a reviewer can sign in to
// any of them without hunting through this file.
const DEMO_PASSWORD = "demopass123";

async function upsertCreator(opts: {
  email: string;
  name: string;
  country: string;
  industries: string[];
  pricePerPost: number;
  headline: string;
  linkedinUrl: string;
}) {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: opts.email },
    create: { email: opts.email, password, name: opts.name, role: "CREATOR" },
    update: {},
  });
  const profile = await prisma.creatorProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      country: opts.country,
      industries: opts.industries,
      pricePerPost: opts.pricePerPost,
      headline: opts.headline,
      linkedinUrl: opts.linkedinUrl,
    },
    update: {},
  });
  return { user, profile };
}

async function upsertCompany(opts: { email: string; name: string; companyName: string; website: string }) {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: opts.email },
    create: { email: opts.email, password, name: opts.name, role: "COMPANY" },
    update: {},
  });
  const profile = await prisma.companyProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, companyName: opts.companyName, website: opts.website },
    update: {},
  });
  return { user, profile };
}

async function main() {
  const creators = await Promise.all([
    upsertCreator({
      email: "amina.creator@naano.demo",
      name: "Amina Yusuf",
      country: "United Kingdom",
      industries: ["SaaS", "AI / ML"],
      pricePerPost: 450,
      headline: "B2B SaaS founder content, 40K+ LinkedIn following",
      linkedinUrl: "https://linkedin.com/in/amina-demo",
    }),
    upsertCreator({
      email: "carlos.creator@naano.demo",
      name: "Carlos Mendez",
      country: "United States",
      industries: ["Fintech", "Crypto / Web3"],
      pricePerPost: 800,
      headline: "Fintech commentary and market takes",
      linkedinUrl: "https://linkedin.com/in/carlos-demo",
    }),
    upsertCreator({
      email: "priya.creator@naano.demo",
      name: "Priya Nair",
      country: "India",
      industries: ["HR / Recruiting", "Marketing"],
      pricePerPost: 300,
      headline: "Talent and workplace culture writer",
      linkedinUrl: "https://linkedin.com/in/priya-demo",
    }),
  ]);

  const companies = await Promise.all([
    upsertCompany({
      email: "hana.company@naano.demo",
      name: "Hana Kobayashi",
      companyName: "Fluxbase",
      website: "https://fluxbase.demo",
    }),
    upsertCompany({
      email: "diego.company@naano.demo",
      name: "Diego Ramirez",
      companyName: "Ledgerly",
      website: "https://ledgerly.demo",
    }),
  ]);

  const [amina, carlos, priya] = creators;
  const [fluxbase, ledgerly] = companies;

  // One of each status, spread across both companies, so every UI state
  // (needs action / active / completed / declined) has at least one row.
  //
  // These rows are RESET to their pristine state on every run (the `update`
  // side repeats the full field set), so re-running the seed restores the demo
  // after someone has clicked through accept / deliver on them. That's what
  // lets a reviewer signing in as the demo creator always find a pending
  // request to accept and an active one to deliver.
  const days = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

  const seedCollabs = [
    {
      id: "seed-collab-pending",
      companyId: fluxbase.profile.id,
      creatorId: amina.profile.id,
      status: "PENDING" as const,
      price: amina.profile.pricePerPost,
      postUrl: null,
      dueDate: days(10),
    },
    {
      id: "seed-collab-active",
      companyId: fluxbase.profile.id,
      creatorId: carlos.profile.id,
      status: "ACTIVE" as const,
      price: carlos.profile.pricePerPost,
      postUrl: null,
      dueDate: days(4),
    },
    {
      id: "seed-collab-completed",
      companyId: ledgerly.profile.id,
      creatorId: amina.profile.id,
      status: "COMPLETED" as const,
      price: amina.profile.pricePerPost,
      postUrl: "https://linkedin.com/posts/amina-demo-sponsored-post",
      dueDate: null,
    },
    {
      id: "seed-collab-declined",
      companyId: ledgerly.profile.id,
      creatorId: priya.profile.id,
      status: "DECLINED" as const,
      price: priya.profile.pricePerPost,
      postUrl: null,
      dueDate: null,
    },
  ];

  for (const collab of seedCollabs) {
    const { id, ...fields } = collab;
    await prisma.collaboration.upsert({
      where: { id },
      create: collab,
      update: fields,
    });
  }

  console.log("Seeded. Demo accounts (all share the password below):");
  console.log(`  password: ${DEMO_PASSWORD}`);
  for (const { user } of [...creators, ...companies]) {
    console.log(`  ${user.email}  (${user.role})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
