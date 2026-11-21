import type { Metadata } from "next"
import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import { LocaleBoundary } from "@/components/locale-boundary"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { SubscriptionBanner } from "@/components/subscription-banner"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Everything behind auth stays out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <LocaleBoundary>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <DashboardHeader />
            <SubscriptionBanner />
            <main className="p-4 pb-20 md:pb-4">{children}</main>
          </SidebarInset>
          <MobileBottomNav />
        </SidebarProvider>
      </LocaleBoundary>
    </Suspense>
  )
}
