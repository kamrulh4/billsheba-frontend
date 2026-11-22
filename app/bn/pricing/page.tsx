import type { Metadata } from "next"
import { PricingContent } from "@/app/(site)/pricing/pricing-content"
import { ogImage, siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: { absolute: "মূল্য তালিকা — আইএসপি বিলিং সফটওয়্যার | বিলশেবা" },
  description:
    "বাংলাদেশের আইএসপির জন্য সহজ মাসিক মূল্য। ১৪ দিন ফ্রি ট্রায়াল। মাসে ১,০০০ টাকা থেকে — মাইক্রোটিক কন্ট্রোল, বাংলা এসএমএস ও বিকাশ/নগদ পেমেন্ট পোর্টালসহ।",
  alternates: {
    canonical: "/bn/pricing",
    languages: { en: "/pricing", bn: "/bn/pricing", "x-default": "/pricing" },
  },
  openGraph: {
    title: `মূল্য তালিকা | ${siteConfig.name}`,
    description: "প্রতিটি আকারের নেটওয়ার্কের জন্য আইএসপি বিলিং প্ল্যান — ১৪ দিন ফ্রি ট্রায়াল।",
    url: "/bn/pricing",
    locale: "bn_BD",
    images: [ogImage],
  },
}

export default function BanglaPricingPage() {
  return <PricingContent locale="bn" />
}
