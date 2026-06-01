import { NextResponse } from "next/server";
import { getAdminCookieName, getAdminTokenFromEnv } from "@/lib/auth";

export async function POST(request: Request) {
  const { token } = (await request.json()) as { token?: string };
  const expectedToken = getAdminTokenFromEnv();

  if (!token || !expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getAdminCookieName(),
    value: expectedToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
