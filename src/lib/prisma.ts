import { PrismaClient } from "@prisma/client";

/**
 * Neon's pooled endpoint (the `-pooler` host) is PgBouncer in transaction
 * mode. Two things follow for Prisma on serverless:
 *   - `pgbouncer=true`: no prepared statements held across pooled backends
 *     (otherwise "prepared statement already exists" style errors show up
 *     intermittently under concurrency).
 *   - `connection_limit=1`: every function instance holds a single
 *     connection instead of Prisma's default pool of num_cpus * 2 + 1, so a
 *     burst of cold instances can't multiply into connection exhaustion.
 * `connect_timeout` is raised from Prisma's 5s default so a suspended Neon
 * compute has time to wake up for the first query after an idle period.
 *
 * This is done here, in code, so it holds no matter which DATABASE_URL the
 * host environment stores. Params already present in the URL always win, and
 * direct (non-pooler) URLs - what `prisma migrate` should use - are left alone.
 */
function withPoolerParams(raw: string | undefined) {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    if (!url.hostname.includes("-pooler")) return raw;
    const defaults = { pgbouncer: "true", connection_limit: "1", connect_timeout: "15" };
    for (const [key, value] of Object.entries(defaults)) {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return raw;
  }
}

/** Non-secret facts about the effective connection (never the host or credentials). */
export function describeDatasource() {
  try {
    const url = new URL(withPoolerParams(process.env.DATABASE_URL) ?? "");
    return {
      pooled: url.hostname.includes("-pooler"),
      pgbouncer: url.searchParams.get("pgbouncer") === "true",
      connectionLimit: Number(url.searchParams.get("connection_limit")) || null,
      connectTimeout: Number(url.searchParams.get("connect_timeout")) || null,
    };
  } catch {
    return { pooled: false, pgbouncer: false, connectionLimit: null, connectTimeout: null };
  }
}

// One client per runtime instance, reused across requests/invocations. Cached
// on globalThis in every environment: in dev it survives hot reloads (which
// would otherwise open a new pool per edit), in production it guards against
// the module being evaluated more than once inside the same instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: withPoolerParams(process.env.DATABASE_URL),
    log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
  });

globalForPrisma.prisma = prisma;
