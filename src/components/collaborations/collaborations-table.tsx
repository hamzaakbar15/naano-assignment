"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeliverDialog } from "@/components/collaborations/deliver-dialog";
import { StatusBadge } from "@/components/collaborations/status-badge";
import { PersonAvatar } from "@/components/person-avatar";
import { formatUSD, formatDate } from "@/lib/format";

export type CollabRow = {
  id: string;
  status: "PENDING" | "ACTIVE" | "DECLINED" | "COMPLETED";
  price: number;
  postUrl: string | null;
  dueDate: string | null;
  createdAt: string;
  counterpartyName: string;
};

const TABS = ["All", "Active", "Needs action", "Completed"] as const;

export function CollaborationsTable({
  rows,
  role,
}: {
  rows: CollabRow[];
  role: "CREATOR" | "COMPANY";
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    switch (tab) {
      case "Active":
        return rows.filter((r) => r.status === "ACTIVE");
      case "Needs action":
        return rows.filter((r) => r.status === "PENDING");
      case "Completed":
        return rows.filter((r) => r.status === "COMPLETED");
      default:
        return rows;
    }
  }, [rows, tab]);

  async function respond(id: string, action: "accept" | "decline") {
    setPendingId(id);
    const res = await fetch(`/api/collaborations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setPendingId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Something went wrong.");
      return;
    }
    toast.success(action === "accept" ? "Accepted." : "Declined.");
    router.refresh();
  }

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as (typeof TABS)[number])}>
      <TabsList>
        {TABS.map((t) => (
          <TabsTrigger key={t} value={t}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={tab} className="mt-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            Nothing here yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4">
            <TableHeader>
              <TableRow>
                <TableHead>{role === "CREATOR" ? "Brand" : "Creator"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Next action</TableHead>
                <TableHead>Due date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2.5">
                      <PersonAvatar name={row.counterpartyName} size="sm" />
                      {row.counterpartyName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>{formatUSD(row.price)}</TableCell>
                  <TableCell>
                    {role === "CREATOR" && row.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={pendingId === row.id}
                          onClick={() => respond(row.id, "accept")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={pendingId === row.id}
                          onClick={() => respond(row.id, "decline")}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                    {role === "CREATOR" && row.status === "ACTIVE" && (
                      <DeliverDialog collaborationId={row.id} />
                    )}
                    {role === "COMPANY" && row.status === "PENDING" && (
                      <span className="text-muted-foreground">Awaiting response</span>
                    )}
                    {role === "COMPANY" && row.status === "ACTIVE" && (
                      <span className="text-muted-foreground">In progress</span>
                    )}
                    {row.status === "COMPLETED" && row.postUrl && (
                      <a
                        href={row.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        View post ↗
                      </a>
                    )}
                    {row.status === "DECLINED" && <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.dueDate ? formatDate(row.dueDate) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
