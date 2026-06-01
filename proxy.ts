import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/adminpanel")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/adminpanel/login")) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!hasSession) {
    const loginUrl = new URL("/adminpanel/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adminpanel/:path*"],
};
