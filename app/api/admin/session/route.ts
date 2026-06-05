import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  verifyAdminToken,
  createSessionValue,
  getSessionMaxAgeSeconds,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { token } = (await request.json()) as { token?: string };

  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getAdminCookieName(),
    value: createSessionValue(),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionMaxAgeSeconds(),
  });

  return response;
}
