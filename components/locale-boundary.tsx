import { cookies } from "next/headers"
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n"
import { LocaleProvider } from "@/providers/locale-provider"

/**
 * Reads the saved language on the server so the first paint is already in the
 * right language (no English flash). Must sit under a <Suspense>.
 */
export async function LocaleBoundary({
  children,
  fallback = "en",
}: {
  children: React.ReactNode
  fallback?: Locale
}) {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value
  return (
    <LocaleProvider initial={isLocale(saved) ? saved : fallback}>
      {children}
    </LocaleProvider>
  )
}
