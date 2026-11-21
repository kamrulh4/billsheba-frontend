import type { Metadata } from "next"
import { BillingClient } from "./billing-client"

export const metadata: Metadata = {
  title: "Billing & plan",
  description: "Renew or upgrade your Billsheba subscription",
}

export default function BillingPage() {
  return <BillingClient />
}
