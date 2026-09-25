import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma, describeDatasource } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Per-runtime-instance facts, so a caller can tell a cold instance from a warm
// one and see whether concurrent requests are sharing an instance (and so
// sharing its one Prisma client).
const instanceId = Math.random().toString(36).slice(2, 8);
const bornAt = Date.now();
let inflight = 0;

/**
 * Liveness + database reachability. Reports only non-secret connection facts
 * (pooled or not, effective pool params) and, on failure, the Prisma error
 * *code* - never the message, host, or credentials.
 */
export async function GET() {
  const started = Date.now();
  const concurrent = ++inflight;
  const headers = { "Cache-Control": "no-store" };
  const facts = () => ({
    latencyMs: Date.now() - started,
    instance: instanceId,
    ageSec: Math.round((Date.now() - bornAt) / 1000),
    concurrent,
    ...describeDatasource(),
  });
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, ...facts() }, { headers });
  } catch (e) {
    const code =
      e instanceof Prisma.PrismaClientKnownRequestError
        ? e.code
        : e instanceof Prisma.PrismaClientInitializationError
          ? (e.errorCode ?? "INIT")
          : "UNKNOWN";
    return NextResponse.json({ ok: false, code, ...facts() }, { status: 503, headers });
  } finally {
    inflight--;
  }
}
