"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  async function handleBook() {
    setLoading(true);
    const res = await fetch("/api/collaborations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorId }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Couldn't book this creator.");
      return;
    }
    setBooked(true);
    toast.success("Request sent. It'll show up under Collaborations.");
    router.refresh();
  }

  return (
    <Button onClick={handleBook} disabled={loading || booked} className={className} size={size}>
      {booked ? "Requested" : loading ? "Booking..." : "Book"}
    </Button>
  );
}
