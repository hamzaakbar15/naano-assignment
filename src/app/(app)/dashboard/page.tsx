import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/format";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null; // (app) layout already guarantees a session + profile

  if (user.role === "CREATOR") {
    const profile = await prisma.creatorProfile.findUniqueOrThrow({
      where: { userId: user.id },
      include: { collaborations: true },
    });
    const collabs = profile.collaborations;
    const pending = collabs.filter((c) => c.status === "PENDING").length;
    const active = collabs.filter((c) => c.status === "ACTIVE").length;
    const completed = collabs.filter((c) => c.status === "COMPLETED");
    const totalEarned = completed.reduce((sum, c) => sum + c.price, 0);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back{user.name ? `, ${user.name}` : ""}</h1>
          <p className="text-sm text-muted-foreground">Here&apos;s how your collaborations are going.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Needs action" value={pending} hint="Pending requests" />
          <StatCard label="Active" value={active} hint="Not yet delivered" />
          <StatCard label="Completed" value={completed.length} />
          <StatCard label="Total earned" value={formatUSD(totalEarned)} />
        </div>
        <div className="flex gap-3">
          <Button render={<Link href="/collaborations" />}>View collaborations</Button>
          <Button variant="outline" render={<Link href="/earnings" />}>
            View earnings
          </Button>
        </div>
      </div>
    );
  }

  const profile = await prisma.companyProfile.findUniqueOrThrow({
    where: { userId: user.id },
    include: { collaborations: true },
  });
  const collabs = profile.collaborations;
  const pending = collabs.filter((c) => c.status === "PENDING").length;
  const active = collabs.filter((c) => c.status === "ACTIVE").length;
  const completed = collabs.filter((c) => c.status === "COMPLETED");
  const totalSpent = [...completed, ...collabs.filter((c) => c.status === "ACTIVE")].reduce(
    (sum, c) => sum + c.price,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back{user.name ? `, ${user.name}` : ""}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s your booking activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting response" value={pending} />
        <StatCard label="Active" value={active} hint="Not yet delivered" />
        <StatCard label="Completed" value={completed.length} />
        <StatCard label="Total spent" value={formatUSD(totalSpent)} hint="Active + completed" />
      </div>
      <div className="flex gap-3">
        <Button render={<Link href="/marketplace" />}>Browse marketplace</Button>
        <Button variant="outline" render={<Link href="/collaborations" />}>
          View collaborations
        </Button>
      </div>
    </div>
  );
}
