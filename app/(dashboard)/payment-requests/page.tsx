import type { Metadata } from "next"
import { PaymentRequestsClient } from "./payment-requests-client"

export const metadata: Metadata = {
  title: "Payment requests",
  description: "Approve bKash / Nagad payments submitted by customers",
}

export default function PaymentRequestsPage() {
  return <PaymentRequestsClient />
}
