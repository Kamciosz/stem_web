import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — skip i18n, apply Supabase auth
  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  // API routes — skip everything
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Public routes — apply i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except static files and Next.js internals
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
    "/admin/:path*",
  ],
};
