import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/app-sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const hasProfile =
    user.role === "CREATOR"
      ? await prisma.creatorProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      : await prisma.companyProfile.findUnique({ where: { userId: user.id }, select: { id: true } });

  if (!hasProfile) redirect("/onboarding");

  return (
    <div className="min-h-[calc(100dvh-3px)] bg-background">
      <AppSidebar user={{ role: user.role, name: user.name ?? null, email: user.email ?? null }} />
      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
