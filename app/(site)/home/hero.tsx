import { ArrowRight, Check, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { type Locale, localizeDigits, tr } from "@/lib/i18n"
import { whatsappUrl } from "@/lib/site-config"
import { ProductPreview } from "./product-preview"

export function Hero({ locale }: { locale: Locale }) {
  const t = (k: Parameters<typeof tr>[1]) => tr(locale, k)
  const trust = ["home.trust1", "home.trust2", "home.trust3", "home.trust4"] as const
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto grid items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="space-y-7">
          <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 font-medium text-primary text-xs">
            {t("home.badge")}
          </span>
          <h1 className="font-bold text-3xl leading-tight tracking-tight sm:text-4xl xl:text-5xl">
            {t("home.title")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            {t("home.sub")}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href="/register">
                {t("site.startTrial")} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
              <a
                href={whatsappUrl("Hello Billsheba, I'd like to see a demo.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle /> {t("home.whatsapp")}
              </a>
            </Button>
          </div>

          <ul className="grid gap-2 text-muted-foreground text-sm sm:grid-cols-2">
            {trust.map((k) => (
              <li key={k} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-primary" />
                {t(k)}
              </li>
            ))}
          </ul>
        </div>

        <ProductPreview locale={locale} num={(n) => localizeDigits(n, locale)} />
      </div>
    </section>
  )
}
