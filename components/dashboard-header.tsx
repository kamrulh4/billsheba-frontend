"use client"

import { usePathname } from "next/navigation"
import { CommandPalette } from "@/components/command-palette"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { navItems } from "@/lib/nav"
import { useT } from "@/providers/locale-provider"

export default function DashboardHeader() {
  const pathname = usePathname() ?? "/dashboard"
  const { t } = useT()
  const current = navItems.find(
    (i) => pathname === i.url || pathname.startsWith(`${i.url}/`),
  )

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="truncate font-medium text-sm">
        {current ? t(current.key) : t("nav.dashboard")}
      </h1>

      <div className="ml-auto flex items-center gap-1">
        <CommandPalette />
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
