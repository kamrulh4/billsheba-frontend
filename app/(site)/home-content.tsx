import { FeaturesSection } from "@/app/(site)/features-section"
import { Hero } from "@/app/(site)/home/hero"
import {
  BkashPromise,
  FinalCta,
  HomeFaq,
  HowItWorks,
  PainToGain,
  PricingTeaser,
} from "@/app/(site)/home/sections"
import { StickyCta } from "@/app/(site)/sticky-cta"
import { JsonLd } from "@/components/json-ld"
import type { Locale } from "@/lib/i18n"
import { pricingFaqs, pricingFaqsBn } from "@/lib/plans"
import { faqSchema, softwareApplicationSchema } from "@/lib/structured-data"

export function HomeContent({ locale }: { locale: Locale }) {
  const faqs = locale === "bn" ? pricingFaqsBn : pricingFaqs
  return (
    <>
      <JsonLd schema={[softwareApplicationSchema(), faqSchema([...faqs])]} />
      <Hero locale={locale} />
      <PainToGain locale={locale} />
      <FeaturesSection locale={locale} />
      <BkashPromise locale={locale} />
      <HowItWorks locale={locale} />
      <PricingTeaser locale={locale} />
      <HomeFaq locale={locale} />
      <FinalCta locale={locale} />
      <StickyCta />
    </>
  )
}
