import { Wallet, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { PersonAvatar } from "@/components/person-avatar";
import { EmptyState } from "@/components/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatUSD, formatDate } from "@/lib/format";

export default async function EarningsPage() {
  const user = await getCurrentUser();
  if (!user) return null; // (app) layout + middleware already guarantee session + role

  const profile = await prisma.creatorProfile.findUniqueOrThrow({ where: { userId: user.id } });
  const completed = await prisma.collaboration.findMany({
    where: { creatorId: profile.id, status: "COMPLETED" },
    include: { company: { select: { companyName: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const total = completed.reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Earnings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Earnings from delivered posts. No payout method connected yet.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total earned" value={formatUSD(total)} icon={Wallet} featured />
        <StatCard label="Paid collaborations" value={completed.length} icon={CheckCircle2} tone="completed" />
      </div>

      {completed.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No earnings yet"
          description="Completed collaborations show up here once a post is delivered."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table className="[&_td]:px-5 [&_td]:py-3.5 [&_th]:px-5 [&_thead_tr]:bg-muted/40">
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Post</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completed.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2.5 font-heading">
                      <PersonAvatar name={c.company.companyName} size="sm" />
                      {c.company.companyName}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">{formatUSD(c.price)}</TableCell>
                  <TableCell className="font-mono text-muted-foreground tabular-nums">{formatDate(c.updatedAt)}</TableCell>
                  <TableCell>
                    {c.postUrl ? (
                      <a
                        href={c.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-heading font-medium text-primary underline-offset-4 hover:underline"
                      >
                        View ↗
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
