import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
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
        <h1 className="text-2xl font-semibold tracking-tight">Earnings</h1>
        <p className="text-sm text-muted-foreground">Mocked balance — no real payout method yet.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total earned" value={formatUSD(total)} />
        <StatCard label="Paid collaborations" value={completed.length} />
      </div>

      {completed.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Completed collaborations will show up here.
        </div>
      ) : (
        <Table>
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
                <TableCell className="font-medium">{c.company.companyName}</TableCell>
                <TableCell>{formatUSD(c.price)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(c.updatedAt)}</TableCell>
                <TableCell>
                  {c.postUrl ? (
                    <a
                      href={c.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-4"
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
      )}
    </div>
  );
}
