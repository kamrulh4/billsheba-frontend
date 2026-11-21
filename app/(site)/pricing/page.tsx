import type { Metadata } from "next"
import { PricingContent } from "@/app/(site)/pricing/pricing-content"
import { ogImage, siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Pricing — ISP billing software from ৳0",
  description:
    "Simple monthly pricing for ISP billing software in Bangladesh. Start free for 14 days. Plans from ৳500/month with MikroTik control, Bangla SMS and bKash/Nagad payment portal.",
  alternates: {
    canonical: "/pricing",
    languages: { en: "/pricing", bn: "/bn/pricing", "x-default": "/pricing" },
  },
  openGraph: {
    title: `Pricing | ${siteConfig.name}`,
    description:
      "ISP billing software plans for every size of network — start with a 14-day free trial.",
    url: "/pricing",
    images: [ogImage],
  },
}

export default function PricingPage() {
  return <PricingContent locale="en" />
}
