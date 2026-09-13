import Link from "next/link";
import { Clock3, Loader2, CheckCircle2, Wallet } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { RecentList, type RecentItem } from "@/components/dashboard/recent-list";
import { formatUSD } from "@/lib/format";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null; // (app) layout already guarantees a session + profile

  if (user.role === "CREATOR") {
    const profile = await prisma.creatorProfile.findUniqueOrThrow({
      where: { userId: user.id },
      include: {
        collaborations: {
          include: { company: { select: { companyName: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    const collabs = profile.collaborations;
    const pending = collabs.filter((c) => c.status === "PENDING").length;
    const active = collabs.filter((c) => c.status === "ACTIVE").length;
    const completed = collabs.filter((c) => c.status === "COMPLETED");
    const totalEarned = completed.reduce((sum, c) => sum + c.price, 0);
    const recent: RecentItem[] = collabs
      .slice(0, 5)
      .map((c) => ({ id: c.id, name: c.company.companyName, status: c.status, price: c.price }));

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back{user.name ? `, ${user.name}` : ""}</h1>
          <p className="text-sm text-muted-foreground">Here&apos;s how your collaborations are going.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Needs action" value={pending} hint="Pending requests" icon={Clock3} tone="amber" />
          <StatCard label="Active" value={active} hint="Not yet delivered" icon={Loader2} tone="blue" />
          <StatCard label="Completed" value={completed.length} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Total earned" value={formatUSD(totalEarned)} icon={Wallet} tone="violet" />
        </div>
        <div className="flex gap-3">
          <Button render={<Link href="/collaborations" />}>View collaborations</Button>
          <Button variant="outline" render={<Link href="/earnings" />}>
            View earnings
          </Button>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Recent activity</h2>
          <RecentList items={recent} emptyLabel="Collaborations you're booked for will show up here." />
        </div>
      </div>
    );
  }

  const profile = await prisma.companyProfile.findUniqueOrThrow({
    where: { userId: user.id },
    include: {
      collaborations: {
        include: { creator: { select: { user: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  const collabs = profile.collaborations;
  const pending = collabs.filter((c) => c.status === "PENDING").length;
  const active = collabs.filter((c) => c.status === "ACTIVE").length;
  const completed = collabs.filter((c) => c.status === "COMPLETED");
  const totalSpent = [...completed, ...collabs.filter((c) => c.status === "ACTIVE")].reduce(
    (sum, c) => sum + c.price,
    0
  );
  const recent: RecentItem[] = collabs
    .slice(0, 5)
    .map((c) => ({ id: c.id, name: c.creator.user.name || "Unnamed creator", status: c.status, price: c.price }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back{user.name ? `, ${user.name}` : ""}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s your booking activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting response" value={pending} icon={Clock3} tone="amber" />
        <StatCard label="Active" value={active} hint="Not yet delivered" icon={Loader2} tone="blue" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Total spent" value={formatUSD(totalSpent)} hint="Active + completed" icon={Wallet} tone="violet" />
      </div>
      <div className="flex gap-3">
        <Button render={<Link href="/marketplace" />}>Browse marketplace</Button>
        <Button variant="outline" render={<Link href="/collaborations" />}>
          View collaborations
        </Button>
      </div>
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Recent activity</h2>
        <RecentList items={recent} emptyLabel="Nothing booked yet — browse the marketplace to get started." />
      </div>
    </div>
  );
}
