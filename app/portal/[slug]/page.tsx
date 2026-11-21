import type { Metadata } from "next"
import { Suspense } from "react"
import { LocaleBoundary } from "@/components/locale-boundary"
import { PortalClient } from "./portal-client"

// Per-ISP customer pages: useful to customers, useless in search results.
export const metadata: Metadata = {
  title: "Pay your internet bill",
  description: "Check your due internet bill and submit your bKash or Nagad payment.",
  robots: { index: false, follow: false },
}

async function PortalContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <LocaleBoundary fallback="bn">
      <PortalClient slug={slug} />
    </LocaleBoundary>
  )
}

export default function PortalPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <PortalContent params={params} />
    </Suspense>
  )
}
