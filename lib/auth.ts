import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export function getAdminTokenFromEnv(): string {
  return process.env.ADMIN_PANEL_TOKEN ?? "";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const adminCookie = (await cookies()).get(COOKIE_NAME)?.value;
  const expected = getAdminTokenFromEnv();

  if (!expected || !adminCookie) {
    return false;
  }

  return adminCookie === expected;
}

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}
