import type { Metadata } from "next"
import { LegalPage } from "@/app/(site)/legal/legal-page"
import { contactInfo, legalConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "How Billsheba handles subscription fees, cancellations and refunds.",
  alternates: { canonical: "/refund-policy" },
}

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      intro={`This policy explains how fees, cancellations and refunds work for ${legalConfig.companyName} subscriptions.`}
      sections={[
        {
          title: "Free trial",
          body: [
            "Every new account has a free trial. You are not charged during the trial and no payment details are needed.",
          ],
        },
        {
          title: "Subscription fees",
          body: [
            "Plans are billed monthly in advance. Your plan becomes active when your payment is confirmed (instantly for online bKash payments, after verification for manual transaction IDs).",
          ],
        },
        {
          title: "Cancellation",
          body: [
            "You can stop at any time by not renewing. Your plan stays active until the end of the period you paid for. Fees for a period already started are not refunded.",
          ],
        },
        {
          title: "When we will refund or credit you",
          body: [
            "If you were charged twice, charged the wrong amount, or paid but your plan was not activated and we cannot fix it, we will refund the difference or extend your plan by the matching period, as you prefer.",
            "Please contact us within 14 days of the payment with your bKash transaction ID.",
          ],
        },
        {
          title: "Your subscribers' payments",
          body: [
            "Payments your subscribers make to your own bKash merchant account are between you, your subscribers and bKash. Refunds of those payments are handled by you through your merchant account; we cannot refund them.",
          ],
        },
        {
          title: "How to ask",
          body: [
            `Call or WhatsApp ${contactInfo.phone} or email ${contactInfo.email}. We aim to answer within one working day.`,
          ],
        },
      ]}
    />
  )
}
