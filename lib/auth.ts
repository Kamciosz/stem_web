import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8h

export function getAdminTokenFromEnv(): string {
  return process.env.ADMIN_PANEL_TOKEN ?? "";
}

/**
 * Sekret do podpisywania sesji. Osobny od tokena logowania jeśli ustawiony,
 * inaczej pochodna tokena (lepsze to niż brak podpisu).
 */
function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? `sess:${getAdminTokenFromEnv()}`;
}

/**
 * Porównanie stałoczasowe — chroni przed timing attack przy weryfikacji
 * tokena logowania. Zwraca false zamiast rzucać przy różnych długościach.
 */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Sprawdza token logowania porównaniem stałoczasowym. */
export function verifyAdminToken(token: string | undefined | null): boolean {
  const expected = getAdminTokenFromEnv();
  if (!expected || !token) return false;
  return safeEqual(token, expected);
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

/**
 * Tworzy wartość cookie sesji: `<expiryMs>.<hmac>`.
 * NIE zawiera surowego tokena admina — tylko podpisany znacznik wygaśnięcia.
 */
export function createSessionValue(now: number = Date.now()): string {
  const expiry = String(now + SESSION_TTL_MS);
  return `${expiry}.${sign(expiry)}`;
}

/** Weryfikuje podpis sesji i czas wygaśnięcia. */
export function verifySessionValue(value: string | undefined | null): boolean {
  if (!value) return false;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return false;
  const expiry = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!safeEqual(sig, sign(expiry))) return false;
  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) return false;
  return true;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionValue(cookie);
}

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}

export function getSessionMaxAgeSeconds(): number {
  return Math.floor(SESSION_TTL_MS / 1000);
}
