import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

type Action = "accept" | "decline" | "deliver";

/** Creator-side status transitions: accept/decline a pending request, or
 * mark an active collaboration delivered. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "CREATOR") {
    return NextResponse.json({ error: "Only creators can update this." }, { status: 403 });
  }

  const { action, postUrl } = (await req.json().catch(() => null)) ?? {};
  if (!["accept", "decline", "deliver"].includes(action)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const creator = await prisma.creatorProfile.findUnique({ where: { userId: user.id } });
  if (!creator) {
    return NextResponse.json({ error: "Finish your creator profile first." }, { status: 400 });
  }

  const collaboration = await prisma.collaboration.findUnique({ where: { id: params.id } });
  if (!collaboration || collaboration.creatorId !== creator.id) {
    return NextResponse.json({ error: "Collaboration not found." }, { status: 404 });
  }

  const act = action as Action;

  if ((act === "accept" || act === "decline") && collaboration.status !== "PENDING") {
    return NextResponse.json({ error: "Already responded to." }, { status: 409 });
  }
  if (act === "deliver" && collaboration.status !== "ACTIVE") {
    return NextResponse.json({ error: "Only active collaborations can be delivered." }, { status: 409 });
  }
  if (act === "deliver" && (typeof postUrl !== "string" || !postUrl.trim())) {
    return NextResponse.json({ error: "Paste the LinkedIn post URL." }, { status: 400 });
  }

  const updated = await prisma.collaboration.update({
    where: { id: collaboration.id },
    data:
      act === "accept"
        ? { status: "ACTIVE" }
        : act === "decline"
          ? { status: "DECLINED" }
          : { status: "COMPLETED", postUrl: postUrl.trim() },
  });

  return NextResponse.json({ collaboration: updated });
}
