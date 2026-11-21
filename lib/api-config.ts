/**
 * Backend address.
 *
 * Server code (route handlers, server components) talks to Django directly via
 * `API_URL` / `NEXT_PUBLIC_API_URL`. The browser only ever calls same-origin
 * `/api/v1/*`, which `app/api/v1/[...path]/route.ts` forwards to Django while
 * attaching the HttpOnly session cookie — so JS never sees the token.
 */
export const BACKEND_ORIGIN = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/$/, "")

export const API_BASE_URL =
  typeof window === "undefined" ? `${BACKEND_ORIGIN}/api/v1` : "/api/v1"
