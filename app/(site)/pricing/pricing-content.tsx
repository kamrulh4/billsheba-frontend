import { Check } from "lucide-react"
import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Locale, localizeDigits, tr } from "@/lib/i18n"
import { plans, pricingFaqs, pricingFaqsBn } from "@/lib/plans"
import { breadcrumbSchema, faqSchema, pricingSchema } from "@/lib/structured-data"

export function PricingContent({ locale }: { locale: Locale }) {
  const bn = locale === "bn"
  const faqs = bn ? [...pricingFaqsBn] : [...pricingFaqs]
  const taka = (n: number) =>
    n === 0
      ? tr(locale, "pricing.free")
      : `৳${localizeDigits(n.toLocaleString("en-BD"), locale)}`
  const base = bn ? "/bn" : ""

  return (
    <>
      <JsonLd
        schema={[
          pricingSchema(),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: tr(locale, "site.home"), path: base || "/" },
            { name: tr(locale, "site.pricing"), path: `${base}/pricing` },
          ]),
        ]}
      />
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-bold text-4xl tracking-tight">
            {tr(locale, "pricing.title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {tr(locale, "pricing.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlight ? "border-primary shadow-lg" : undefined}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlight && <Badge>{tr(locale, "pricing.popular")}</Badge>}
                </div>
                <p className="text-muted-foreground text-sm">
                  {bn ? plan.bn.blurb : plan.blurb}
                </p>
                <p className="pt-2">
                  <span className="font-bold text-4xl">{taka(plan.price)}</span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      {tr(locale, "pricing.perMonth")}
                    </span>
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{bn ? plan.bn.customers : plan.customers}</p>
                <ul className="space-y-2 text-sm">
                  {(bn ? plan.bn.features : plan.features).map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                >
                  <Link href="/register">
                    {plan.price === 0
                      ? tr(locale, "pricing.startTrial")
                      : tr(locale, "pricing.getStarted")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="mb-6 font-semibold text-2xl">{tr(locale, "pricing.faq")}</h2>
          <dl className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium">{faq.question}</dt>
                <dd className="mt-1 text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-center text-muted-foreground text-sm">
            {tr(locale, "pricing.custom")}{" "}
            <Link className="text-primary underline" href="/contact">
              {tr(locale, "pricing.talk")}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
