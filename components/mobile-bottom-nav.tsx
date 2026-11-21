"use client"

import {
  CreditCard,
  Inbox,
  LayoutDashboard,
  Settings2,
  Users as UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"

const navItems = [
  { href: "/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "nav.customers", icon: UsersIcon },
  { href: "/payments", label: "nav.payments", icon: CreditCard },
  { href: "/payment-requests", label: "nav.paymentRequests", icon: Inbox },
  { href: "/settings", label: "nav.settings", icon: Settings2 },
] as const

export function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useT()

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-50 block md:hidden"
      role="navigation"
    >
      <div className="mx-auto max-w-screen-lg px-safe w-full">
        <div className="backdrop-blur-sm bg-card/80 border-t border-border flex justify-between items-center px-4 py-2 rounded-t-lg">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground",
                  pathname === item.href && "text-primary outline-none",
                )}
                aria-label={t(item.label)}
                title={t(item.label)}
              >
                <Icon className="h-5 w-5" aria-hidden={true}>
                  <title>{t(item.label)}</title>
                </Icon>
                <span className="sr-only">{t(item.label)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
