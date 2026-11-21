import type { MessageKey } from "@/lib/i18n"

/** Main navigation. `bn` points to the Bangla page when one exists, else the English one. */
export const siteLinks: { key: MessageKey; en: string; bn: string }[] = [
  { key: "site.home", en: "/", bn: "/bn" },
  { key: "site.features", en: "/#features", bn: "/bn#features" },
  { key: "site.pricing", en: "/pricing", bn: "/bn/pricing" },
  { key: "site.about", en: "/about", bn: "/about" },
  { key: "site.contact", en: "/contact", bn: "/contact" },
]

/** English page ⇄ Bangla page. Pages without a translation return null. */
export function alternateLocalePath(pathname: string): string | null {
  if (pathname === "/") return "/bn"
  if (pathname === "/bn") return "/"
  if (pathname === "/pricing") return "/bn/pricing"
  if (pathname === "/bn/pricing") return "/pricing"
  return null
}
