import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

/** Company books a creator -> new Collaboration in PENDING. */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "COMPANY") {
    return NextResponse.json({ error: "Only companies can book creators." }, { status: 403 });
  }

  const { creatorId, dueDate } = (await req.json().catch(() => null)) ?? {};
  if (typeof creatorId !== "string" || !creatorId) {
    return NextResponse.json({ error: "creatorId is required." }, { status: 400 });
  }

  let parsedDueDate: Date | null = null;
  if (dueDate) {
    const d = new Date(dueDate);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "Invalid due date." }, { status: 400 });
    }
    parsedDueDate = d;
  }

  const [company, creator] = await Promise.all([
    prisma.companyProfile.findUnique({ where: { userId: user.id } }),
    prisma.creatorProfile.findUnique({ where: { id: creatorId } }),
  ]);
  if (!company) {
    return NextResponse.json({ error: "Finish your company profile first." }, { status: 400 });
  }
  if (!creator) {
    return NextResponse.json({ error: "Creator not found." }, { status: 404 });
  }

  const collaboration = await prisma.collaboration.create({
    data: {
      companyId: company.id,
      creatorId: creator.id,
      // Snapshot the price at booking time so a later rate change doesn't
      // retroactively alter collaborations already in flight.
      price: creator.pricePerPost,
      dueDate: parsedDueDate,
    },
  });

  return NextResponse.json({ collaboration }, { status: 201 });
}
