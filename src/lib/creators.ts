import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * The marketplace creator listing - shared by /marketplace and the landing
 * page's creator showcase so both always show the same creators in the same
 * order (cheapest first).
 */
export function listCreators({ q, industry, take }: { q?: string; industry?: string; take?: number } = {}) {
  const where: Prisma.CreatorProfileWhereInput = {
    ...(industry ? { industries: { has: industry } } : {}),
    ...(q
      ? {
          OR: [
            { user: { name: { contains: q, mode: "insensitive" } } },
            { headline: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  return prisma.creatorProfile.findMany({
    where,
    include: { user: { select: { name: true } } },
    orderBy: { pricePerPost: "asc" },
    take,
  });
}
