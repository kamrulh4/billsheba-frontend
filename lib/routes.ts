/**
 * The signed-in app area. Everything else (marketing pages, /bn, login, the customer portal)
 * is public. Shared by the route guard (proxy.ts) and the API client's 401 handling, so a
 * logged-out visitor on a public page is never bounced to /login.
 */
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/customers",
  "/organizations",
  "/packages",
  "/payments",
  "/users",
  "/settings",
  "/sessions",
  "/profile",
  "/expenses",
  "/complaints",
  "/reports",
  "/payment-requests",
  "/sms",
  "/audit",
  "/receipt",
  "/billing",
  "/platform",
] as const

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
