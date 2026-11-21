import type { Metadata } from "next"
import { HomeContent } from "@/app/(site)/home-content"
import { ogImage, siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  // Home keeps the full brand title rather than the "%s | Billsheba" template.
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.shortDescription,
  alternates: { canonical: "/", languages: { en: "/", bn: "/bn", "x-default": "/" } },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.shortDescription,
    url: "/",
    type: "website",
    images: [ogImage],
  },
}

export default function HomePage() {
  return <HomeContent locale="en" />
}
