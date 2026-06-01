import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.redirect(new URL("/adminpanel/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));

  response.cookies.set({
    name: getAdminCookieName(),
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}
