import type { Metadata } from "next"
import { HomeContent } from "@/app/(site)/home-content"
import { ogImage, siteConfig } from "@/lib/site-config"

const title = "বিলশেবা — আইএসপি বিলিং ও গ্রাহক ব্যবস্থাপনা সফটওয়্যার"
const description =
  "বাংলাদেশের আইএসপিদের জন্য বিলিং সফটওয়্যার: গ্রাহক, প্যাকেজ, মাসিক বিল, বিকাশ/নগদ পেমেন্ট, বাংলা এসএমএস ও মাইক্রোটিক নিয়ন্ত্রণ এক ড্যাশবোর্ডে। ১৪ দিন ফ্রি।"

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "আইএসপি বিলিং সফটওয়্যার",
    "ইন্টারনেট বিল ম্যানেজমেন্ট",
    "মাইক্রোটিক বিলিং",
    "বিকাশ নগদ বিল কালেকশন",
    siteConfig.name,
  ],
  alternates: {
    canonical: "/bn",
    languages: { en: "/", bn: "/bn", "x-default": "/" },
  },
  openGraph: {
    title,
    description,
    url: "/bn",
    type: "website",
    locale: "bn_BD",
    images: [ogImage],
  },
}

export default function BanglaHomePage() {
  return <HomeContent locale="bn" />
}
