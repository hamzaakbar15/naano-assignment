import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CollaborationsTable, type CollabRow } from "@/components/collaborations/collaborations-table";

export default async function CollaborationsPage() {
  const user = await getCurrentUser();
  if (!user) return null; // (app) layout already guarantees a session + profile

  let rows: CollabRow[] = [];

  if (user.role === "CREATOR") {
    const profile = await prisma.creatorProfile.findUniqueOrThrow({ where: { userId: user.id } });
    const collaborations = await prisma.collaboration.findMany({
      where: { creatorId: profile.id },
      include: { company: { select: { companyName: true } } },
      orderBy: { createdAt: "desc" },
    });
    rows = collaborations.map((c) => ({
      id: c.id,
      status: c.status,
      price: c.price,
      postUrl: c.postUrl,
      dueDate: c.dueDate?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
      counterpartyName: c.company.companyName,
    }));
  } else {
    const profile = await prisma.companyProfile.findUniqueOrThrow({ where: { userId: user.id } });
    const collaborations = await prisma.collaboration.findMany({
      where: { companyId: profile.id },
      include: { creator: { select: { user: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    rows = collaborations.map((c) => ({
      id: c.id,
      status: c.status,
      price: c.price,
      postUrl: c.postUrl,
      dueDate: c.dueDate?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
      counterpartyName: c.creator.user.name || "Unnamed creator",
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Collaborations</h1>
        <p className="text-sm text-muted-foreground">
          {user.role === "CREATOR"
            ? "Requests from companies, and posts in progress."
            : "Everything you've booked, and its status."}
        </p>
      </div>
      <CollaborationsTable rows={rows} role={user.role} />
    </div>
  );
}
