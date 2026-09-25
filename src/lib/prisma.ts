import { PrismaClient } from "@prisma/client";

/**
 * Neon's pooled endpoint (the `-pooler` host) is PgBouncer in transaction
 * mode. For Prisma that means:
 *   - `pgbouncer=true`: no prepared statements held across pooled backends
 *     (otherwise "prepared statement already exists" style errors show up
 *     intermittently under concurrency).
 *   - `connect_timeout=15`: raised from Prisma's 5s default so a suspended
 *     Neon compute has time to wake for the first query after an idle period.
 *   - `connection_limit=10`: a bounded per-instance pool. NOT 1. The usual
 *     serverless advice of `connection_limit=1` assumes one request per
 *     instance, but Vercel runs concurrent requests inside a single instance
 *     that share this one client. Measured on the live deployment with 1:
 *     /api/health latency grew linearly with in-instance concurrency
 *     (~+70ms per extra concurrent request = one serialized round trip), so
 *     a burst of page loads (~4 queries each) queues seconds deep and can run
 *     into Prisma's 10s pool_timeout. The pooler multiplexes client
 *     connections (up to 10k), so a small pool per instance is cheap.
 *
 * Done here, in code, so it holds no matter which DATABASE_URL the host
 * stores. Params already present in the URL always win, and direct
 * (non-pooler) URLs - what `prisma migrate` should use - are left alone.
 */
function withPoolerParams(raw: string | undefined) {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    if (!url.hostname.includes("-pooler")) return raw;
    const defaults = { pgbouncer: "true", connection_limit: "10", connect_timeout: "15" };
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
