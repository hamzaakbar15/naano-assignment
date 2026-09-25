import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma, describeDatasource } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Liveness + database reachability. Reports only non-secret connection facts
 * (pooled or not, effective pool params) and, on failure, the Prisma error
 * *code* - never the message, host, or credentials.
 */
export async function GET() {
  const started = Date.now();
  const headers = { "Cache-Control": "no-store" };
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { ok: true, latencyMs: Date.now() - started, ...describeDatasource() },
      { headers }
    );
  } catch (e) {
    const code =
      e instanceof Prisma.PrismaClientKnownRequestError
        ? e.code
        : e instanceof Prisma.PrismaClientInitializationError
          ? (e.errorCode ?? "INIT")
          : "UNKNOWN";
    return NextResponse.json(
      { ok: false, code, latencyMs: Date.now() - started, ...describeDatasource() },
      { status: 503, headers }
    );
  }
}
