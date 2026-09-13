"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDUSTRIES } from "@/lib/constants";

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function updateParams(next: { q?: string; industry?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { q, industry: searchParams.get("industry") ?? "", ...next };
    if (merged.q) params.set("q", merged.q);
    else params.delete("q");
    if (merged.industry && merged.industry !== "all") params.set("industry", merged.industry);
    else params.delete("industry");
    startTransition(() => router.push(`/marketplace?${params.toString()}`));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="Search creators..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateParams({ q });
        }}
        onBlur={() => updateParams({ q })}
        className="sm:max-w-xs"
      />
      <Select
        value={searchParams.get("industry") ?? "all"}
        onValueChange={(value) => updateParams({ industry: value ? String(value) : "all" })}
      >
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="All industries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All industries</SelectItem>
          {INDUSTRIES.map((industry) => (
            <SelectItem key={industry} value={industry}>
              {industry}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
