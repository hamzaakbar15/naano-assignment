"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function BookButton({
  creatorId,
  className,
  size,
}: {
  creatorId: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/collaborations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorId, dueDate: dueDate || null }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Couldn't book this creator.");
      return;
    }
    setBooked(true);
    setOpen(false);
    toast.success("Request sent. It'll show up under Collaborations.");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button disabled={booked} className={className} size={size} />}>
        {booked ? "Requested" : "Book"}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Book this creator</DialogTitle>
            <DialogDescription>
              Optional: set a due date for when you need the post published by. You can leave
              this blank and sort it out with the creator after they accept.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Input
              id="dueDate"
              type="date"
              min={todayISO()}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Confirm booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
