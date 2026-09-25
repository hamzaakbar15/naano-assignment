import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const hasProfile =
    user.role === "CREATOR"
      ? await prisma.creatorProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      : await prisma.companyProfile.findUnique({ where: { userId: user.id }, select: { id: true } });

  if (!hasProfile) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-background">
      <Nav role={user.role} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
