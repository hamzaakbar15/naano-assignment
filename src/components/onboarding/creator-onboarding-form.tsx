"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { INDUSTRIES, MAX_CREATOR_INDUSTRIES } from "@/lib/constants";

export function CreatorOnboardingForm() {
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [country, setCountry] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [pricePerPost, setPricePerPost] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleIndustry(industry: string) {
    setIndustries((prev) => {
      if (prev.includes(industry)) return prev.filter((i) => i !== industry);
      if (prev.length >= MAX_CREATOR_INDUSTRIES) return prev;
      return [...prev, industry];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkedinUrl, country, industries, pricePerPost }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/you"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          placeholder="United States"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>
          Industries{" "}
          <span className="font-normal text-muted-foreground">
            (up to {MAX_CREATOR_INDUSTRIES})
          </span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((industry) => {
            const selected = industries.includes(industry);
            return (
              <Badge
                key={industry}
                onClick={() => toggleIndustry(industry)}
                variant={selected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer select-none",
                  !selected && industries.length >= MAX_CREATOR_INDUSTRIES && "opacity-40"
                )}
              >
                {industry}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pricePerPost">Price per post (USD)</Label>
        <Input
          id="pricePerPost"
          type="number"
          min={1}
          required
          value={pricePerPost}
          onChange={(e) => setPricePerPost(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || industries.length === 0}>
        {loading ? "Saving..." : "Finish setup"}
      </Button>
    </form>
  );
}
