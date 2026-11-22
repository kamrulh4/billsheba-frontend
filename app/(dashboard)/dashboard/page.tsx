import { redirect } from "next/navigation"
import { Suspense } from "react"
import { getSession } from "@/lib/apis/auth"
import { BillGenerationButton } from "./components/bill-generation-button"
import { DeactivateDueCustomersButton } from "./components/deactivate-due-users-button"
import { OnboardingChecklist } from "./widgets/onboarding-checklist"
import { SmsUsageCard } from "./widgets/sms-usage-card"
import { StatsGrid } from "./widgets/stats-grid"
import { StatsGridSkeleton } from "./widgets/stats-grid-skeleton"

/** The platform owner (super admin) belongs to no ISP, so the ISP dashboard is empty for them. */
async function OwnerRedirect() {
  const session = await getSession()
  if (session?.kind === "SUPER_ADMIN") redirect("/platform")
  return null
}

export default function Page() {
  return (
    <main className="container mx-auto space-y-4">
      <Suspense fallback={null}>
        <OwnerRedirect />
      </Suspense>
      <OnboardingChecklist />
      <SmsUsageCard />
      <div className="flex flex-wrap items-center justify-end">
        <BillGenerationButton />
        <DeactivateDueCustomersButton />
      </div>
      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGrid />
      </Suspense>
    </main>
  )
}
