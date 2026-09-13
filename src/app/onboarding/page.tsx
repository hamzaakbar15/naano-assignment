import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatorOnboardingForm } from "@/components/onboarding/creator-onboarding-form";
import { CompanyOnboardingForm } from "@/components/onboarding/company-onboarding-form";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const existing =
    user.role === "CREATOR"
      ? await prisma.creatorProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      : await prisma.companyProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (existing) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">
            {user.role === "CREATOR" ? "Set up your creator profile" : "Set up your company profile"}
          </CardTitle>
          <CardDescription>
            {user.role === "CREATOR"
              ? "Companies use this to find and book you."
              : "Just the basics — you can start browsing right after."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.role === "CREATOR" ? <CreatorOnboardingForm /> : <CompanyOnboardingForm />}
        </CardContent>
      </Card>
    </main>
  );
}
