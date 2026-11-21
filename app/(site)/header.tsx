import { Suspense } from "react"
import { BrandLogo } from "@/app/(site)/brand-logo"
import { MainNav } from "@/app/(site)/main-nav"
import { MobileNav } from "@/app/(site)/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton"
import { NavLinks } from "./nav-links"
import { SiteLanguageSwitch } from "./site-language-switch"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <BrandLogo />

          <div className="flex items-center gap-6">
            <MainNav />

            <SiteLanguageSwitch />
            <ThemeToggle />

            <Suspense fallback={<Skeleton className="h-4 w-[100px]" />}>
              <NavLinks />
            </Suspense>

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
