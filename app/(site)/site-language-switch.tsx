"use client"

import { Languages } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { alternateLocalePath } from "@/lib/site-links"
import { useT } from "@/providers/locale-provider"

/** Links to the translated twin of the current marketing page (good for SEO and sharing). */
export function SiteLanguageSwitch() {
  const pathname = usePathname()
  const { locale } = useT()
  const alt = alternateLocalePath(pathname)
  if (!alt) return null
  return (
    <Link
      href={alt}
      hrefLang={locale === "bn" ? "en" : "bn"}
      className="flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
    >
      <Languages className="size-4" />
      {locale === "bn" ? "English" : "বাংলা"}
    </Link>
  )
}
