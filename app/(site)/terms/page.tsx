import type { Metadata } from "next"
import { LegalPage } from "@/app/(site)/legal/legal-page"
import { contactInfo, legalConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms under which internet service providers use Billsheba.",
  alternates: { canonical: "/terms" },
}

const name = legalConfig.companyName

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={`These terms govern your use of ${name}, a web service that helps internet service providers (ISPs) manage subscribers, bills and payments. By creating an account you agree to them.`}
      sections={[
        {
          title: "The service",
          body: [
            `${name} provides billing and subscriber-management software, including optional integrations with MikroTik routers, bKash and SMS gateways. Features depend on the plan you choose.`,
          ],
        },
        {
          title: "Your account",
          body: [
            "Accounts are for businesses operating an internet service. You must give accurate information and keep your login details secret. You are responsible for everything done under your account, including by staff accounts you create.",
          ],
        },
        {
          title: "Free trial, plans and fees",
          body: [
            "New accounts start with a free trial. After the trial, continued use requires a paid plan. Fees are in Bangladeshi Taka (BDT), charged per month in advance, and paid by bKash, Nagad, Rocket or another method we offer.",
            "When a trial or paid period ends without renewal, your account becomes read-only: you can still sign in and view your data, but cannot add or change records until you renew. Plan limits (customers, staff accounts) apply as shown on the pricing page.",
          ],
        },
        {
          title: "Your data and your customers",
          body: [
            "You own the data you put into the service, including your subscribers' details. You confirm you have the right to store it and to contact those subscribers (for example by SMS), and you are responsible for complying with the laws that apply to your business.",
            "You can export your customer and payment data as CSV at any time.",
          ],
        },
        {
          title: "Customer payments",
          body: [
            `If you connect your own bKash merchant account, your subscribers' payments are made to that account under bKash's terms. ${name} does not receive or hold those funds; we only confirm the payment with bKash and record it. You are responsible for your merchant agreement, fees and settlements with bKash.`,
          ],
        },
        {
          title: "Acceptable use",
          body: [
            "Do not use the service for anything unlawful, to send unsolicited or deceptive messages, to attempt to access other organizations' data, or to disrupt or probe the service. We may suspend accounts that do.",
          ],
        },
        {
          title: "Availability and support",
          body: [
            "We work to keep the service available and to fix problems quickly, but we do not guarantee uninterrupted operation. Support is provided by phone and WhatsApp during the hours shown on the contact page.",
          ],
        },
        {
          title: "Cancellation and data",
          body: [
            `You may stop using the service at any time. After cancellation or non-renewal we keep your data for ${legalConfig.retentionDays} days so you can export it or return, then delete it, except where the law requires us to keep certain records.`,
          ],
        },
        {
          title: "Liability",
          body: [
            "The service is provided as-is. To the extent the law allows, our total liability for any claim is limited to the fees you paid in the three months before the claim, and we are not liable for indirect losses such as lost revenue or lost data caused by factors outside our control (for example router, network, bKash or SMS-gateway outages).",
          ],
        },
        {
          title: "Changes and governing law",
          body: [
            "We may update these terms; material changes will be announced in the app or by SMS/email before they apply. These terms are governed by the laws of Bangladesh.",
            `Questions: ${contactInfo.email} or ${contactInfo.phone}. Registered address: ${legalConfig.registeredAddress}.`,
          ],
        },
      ]}
    />
  )
}
