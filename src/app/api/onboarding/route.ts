import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { INDUSTRIES, MAX_CREATOR_INDUSTRIES } from "@/lib/constants";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  if (user.role === "CREATOR") {
    const { linkedinUrl, country, industries, pricePerPost, headline } = body;

    if (!Array.isArray(industries) || industries.length === 0) {
      return NextResponse.json({ error: "Pick at least one industry." }, { status: 400 });
    }
    if (industries.length > MAX_CREATOR_INDUSTRIES) {
      return NextResponse.json(
        { error: `Pick up to ${MAX_CREATOR_INDUSTRIES} industries.` },
        { status: 400 }
      );
    }
    if (!industries.every((i: string) => (INDUSTRIES as readonly string[]).includes(i))) {
      return NextResponse.json({ error: "Unknown industry." }, { status: 400 });
    }
    const price = Number(pricePerPost);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Enter a valid price per post." }, { status: 400 });
    }

    const profile = await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        linkedinUrl: linkedinUrl || null,
        country: country || null,
        industries,
        pricePerPost: Math.round(price),
        headline: headline || null,
      },
      update: {
        linkedinUrl: linkedinUrl || null,
        country: country || null,
        industries,
        pricePerPost: Math.round(price),
        headline: headline || null,
      },
    });
    return NextResponse.json({ profile }, { status: 201 });
  }

  if (user.role === "COMPANY") {
    const { companyName, website } = body;
    if (typeof companyName !== "string" || !companyName.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const profile = await prisma.companyProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        companyName: companyName.trim(),
        website: website || null,
      },
      update: {
        companyName: companyName.trim(),
        website: website || null,
      },
    });
    return NextResponse.json({ profile }, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown role." }, { status: 400 });
}
