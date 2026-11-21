import { Footer } from "@/app/(site)/footer"
import { Header } from "@/app/(site)/header"
import type { Locale } from "@/lib/i18n"
import { LocaleProvider } from "@/providers/locale-provider"

/** Marketing chrome in a fixed language (static, so it stays prerendered and indexable). */
export function SiteShell({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <LocaleProvider initial={locale}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </div>
    </LocaleProvider>
  )
}
