import type { Metadata } from "next"
import { Suspense } from "react"
import { LocaleBoundary } from "@/components/locale-boundary"
import { PayBillClient } from "./pay-bill-client"

// A utility page for customers, not something to rank in search results.
export const metadata: Metadata = {
  title: "Pay your internet bill",
  description:
    "Enter your mobile number to find your internet provider and pay your bill with bKash.",
  robots: { index: false, follow: false },
}

export default function PayBillPage() {
  return (
    <Suspense>
      <LocaleBoundary fallback="bn">
        <PayBillClient />
      </LocaleBoundary>
    </Suspense>
  )
}
