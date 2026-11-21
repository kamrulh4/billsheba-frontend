"use client"

import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSession } from "@/hooks/rq/use-auth-query"
import { getCustomerListOptions } from "@/hooks/rq/use-customers-query"
import { getDashboardDataOptions } from "@/hooks/rq/use-dashboard-query"
import { getOrganizationListOptions } from "@/hooks/rq/use-organizations-query"
import { getPackageListOptions } from "@/hooks/rq/use-packages-query"
import { getPaymentListOptions } from "@/hooks/rq/use-payment-query"
import { getSessionsOptions } from "@/hooks/rq/use-sessions-query"
import { getUserListOptions } from "@/hooks/rq/use-users-query"
import { canSee, navItems } from "@/lib/nav"
import { useT } from "@/providers/locale-provider"
import { usePaymentsStore } from "@/stores/payments-store"
import { Skeleton } from "./ui/skeleton"

// Warm the cache on hover so the page opens instantly.
const prefetchByUrl: Record<string, (filters?: any) => unknown> = {
  "/dashboard": getDashboardDataOptions,
  "/customers": getCustomerListOptions,
  "/sessions": getSessionsOptions,
  "/payments": getPaymentListOptions,
  "/packages": getPackageListOptions,
  "/users": getUserListOptions,
  "/organizations": getOrganizationListOptions,
}

function NavListSkeleton() {
  return (
    <div>
      {Array.from({ length: 7 }).map((_list, i) => (
        <Skeleton key={i} className="m-1 h-8" />
      ))}
    </div>
  )
}

export function NavMain() {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { paymentFilters } = usePaymentsStore()
  const { data: session } = useSession()
  const { t } = useT()
  const { isMobile, setOpenMobile } = useSidebar()

  if (!session) return <NavListSkeleton />

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems
          .filter((item) => canSee(item, session.kind))
          .map((item) => (
            <SidebarMenuItem
              key={item.url}
              onMouseEnter={() => {
                const options = prefetchByUrl[item.url]
                if (options) queryClient.prefetchQuery(options(paymentFilters) as any)
              }}
            >
              <Link href={item.url} onClick={() => isMobile && setOpenMobile(false)}>
                <SidebarMenuButton
                  tooltip={t(item.key)}
                  isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                  className="cursor-pointer"
                >
                  <item.icon />
                  <span>{t(item.key)}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
