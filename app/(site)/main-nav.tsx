"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteLinks } from "@/lib/site-links"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"

export function MainNav() {
  const pathname = usePathname()
  const { t, locale } = useT()

  return (
    <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
      {siteLinks.map((item) => {
        const href = locale === "bn" ? item.bn : item.en
        return (
          <Link
            aria-current={pathname === href ? "page" : undefined}
            className={cn(
              "font-medium text-sm transition-colors hover:text-foreground",
              pathname === href ? "text-foreground" : "text-muted-foreground",
            )}
            href={href}
            key={item.key}
          >
            {t(item.key)}
          </Link>
        )
      })}
    </nav>
  )
}
