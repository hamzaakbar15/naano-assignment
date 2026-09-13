import { PrismaClient } from "@prisma/client";

// Standard Next.js dev-mode singleton: hot reload would otherwise spin up a
// fresh PrismaClient (and connection pool) on every edit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
