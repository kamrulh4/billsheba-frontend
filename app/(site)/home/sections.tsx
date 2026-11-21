import { ArrowRight, Check, MessageCircle, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { type Locale, type MessageKey, tr } from "@/lib/i18n"
import { pricingFaqs, pricingFaqsBn } from "@/lib/plans"
import { whatsappUrl } from "@/lib/site-config"

const tt = (locale: Locale) => (k: MessageKey) => tr(locale, k)

export function PainToGain({ locale }: { locale: Locale }) {
  const t = tt(locale)
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-bold text-3xl tracking-tight">{t("home.pain.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("home.pain.sub")}</p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {([1, 2, 3, 4] as const).map((n) => (
            <div key={n} className="rounded-xl border bg-card p-5">
              <p className="flex items-start gap-2 text-muted-foreground text-sm line-through decoration-muted-foreground/40">
                <X className="mt-0.5 size-4 shrink-0 text-red-500 no-underline" />
                {t(`home.pain.${n}.before` as MessageKey)}
              </p>
              <p className="mt-3 flex items-start gap-2 font-medium">
                <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                {t(`home.pain.${n}.after` as MessageKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BkashPromise({ locale }: { locale: Locale }) {
  const t = tt(locale)
  return (
    <section className="border-y bg-[#e2136e]/5 py-16 lg:py-20">
      <div className="container mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-4">
          <h2 className="font-bold text-3xl tracking-tight">{t("home.bkash.title")}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("home.bkash.body")}
          </p>
        </div>
        <ul className="space-y-3">
          {(
            ["home.bkash.1", "home.bkash.2", "home.bkash.3", "home.bkash.4"] as const
          ).map((k) => (
            <li
              key={k}
              className="flex items-start gap-3 rounded-lg border bg-background p-4"
            >
              <Check className="mt-0.5 size-5 shrink-0 text-[#e2136e]" />
              <span>{t(k)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = tt(locale)
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center font-bold text-3xl tracking-tight">
          {t("home.how.title")}
        </h2>
        <ol className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {([1, 2, 3] as const).map((n) => (
            <li key={n} className="relative rounded-xl border bg-card p-6">
              <span className="mb-4 flex size-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {locale === "bn" ? "০১২৩"[n] : n}
              </span>
              <h3 className="font-semibold">{t(`home.how.${n}.title` as MessageKey)}</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                {t(`home.how.${n}.body` as MessageKey)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function PricingTeaser({ locale }: { locale: Locale }) {
  const t = tt(locale)
  return (
    <section className="border-y bg-muted/30 py-14">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-bold text-3xl tracking-tight">{t("home.price.title")}</h2>
        <p className="max-w-xl text-muted-foreground">{t("home.price.body")}</p>
        <Button asChild variant="outline" size="lg">
          <Link href={locale === "bn" ? "/bn/pricing" : "/pricing"}>
            {t("site.seePricing")} <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}

export function HomeFaq({ locale }: { locale: Locale }) {
  const faqs = locale === "bn" ? pricingFaqsBn : pricingFaqs
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-bold text-3xl tracking-tight">
          {tr(locale, "home.faq.title")}
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.question} className="group rounded-lg border bg-card p-4">
              <summary className="cursor-pointer list-none font-medium marker:hidden">
                {f.question}
              </summary>
              <p className="mt-2 text-muted-foreground text-sm">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FinalCta({ locale }: { locale: Locale }) {
  const t = tt(locale)
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container mx-auto flex flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-bold text-3xl tracking-tight">{t("home.cta.title")}</h2>
        <p className="max-w-xl opacity-90">{t("home.cta.body")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-base">
            <Link href="/register">{t("site.startTrial")}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-primary-foreground/40 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <a
              href={whatsappUrl("Hello Billsheba, I'd like to know more.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle /> {t("home.whatsapp")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
