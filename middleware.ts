import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED = ["/onboarding", "/dashboard", "/marketplace", "/collaborations", "/earnings", "/messages"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role gates: marketplace is company-only (browsing/booking), earnings is
  // creator-only (payout view). Wrong role -> bounce to their own dashboard
  // rather than a bare 403.
  if (pathname.startsWith("/marketplace") && token.role !== "COMPANY") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/earnings") && token.role !== "CREATOR") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding/:path*", "/dashboard/:path*", "/marketplace/:path*", "/collaborations/:path*", "/earnings/:path*", "/messages/:path*"],
};
