import type { Metadata } from "next"
import { LegalPage } from "@/app/(site)/legal/legal-page"
import { contactInfo, legalConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What data Billsheba collects, why, and how it is protected.",
  alternates: { canonical: "/privacy" },
}

const name = legalConfig.companyName

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This policy explains what personal data ${name} handles, why, and the choices you have. It covers ISPs who use the service and the subscribers whose details those ISPs store in it.`}
      sections={[
        {
          title: "Who is responsible for what",
          body: [
            `For the account holder's own details (name, phone, email, business name), ${name} is responsible for the data. For your subscribers' data that you enter into the service, you (the ISP) decide why and how it is used and ${name} processes it on your behalf.`,
          ],
        },
        {
          title: "Data we handle",
          body: [
            "Account data: name, phone number, email, business name and address, subscription and payment history for the Billsheba fee.",
            "Subscriber data you enter: names, phone numbers, addresses, optional national ID numbers, packages, connection usernames and passwords, bills and payments, complaints.",
            "Operational data: activity logs (who did what, with IP address), SMS delivery logs, and technical logs needed to run and secure the service.",
          ],
        },
        {
          title: "How we use it",
          body: [
            "To provide the service (billing, payments, router control, SMS), to secure it and prevent abuse, to support you, and to meet legal obligations. We do not sell personal data and do not use subscribers' data for advertising.",
          ],
        },
        {
          title: "Who else receives it",
          body: [
            "Only the providers needed to deliver the features you use: bKash (to take payments into your merchant account), an SMS gateway (to send messages you enable), and our hosting provider. Your router is contacted only with credentials you provide.",
          ],
        },
        {
          title: "Security",
          body: [
            "Router and bKash credentials are encrypted at rest and never shown again after saving. Access to each ISP's data is restricted to that ISP's own users, sessions use HttpOnly cookies, and important actions are recorded in an activity log. No system is perfectly secure, so please use strong passwords and tell us at once if you suspect misuse.",
          ],
        },
        {
          title: "Cookies",
          body: [
            "We use only essential cookies: a secure session cookie to keep you signed in and a language preference. We do not use advertising or cross-site tracking cookies.",
          ],
        },
        {
          title: "Retention",
          body: [
            `While your account is active we keep your data. After cancellation we keep it for ${legalConfig.retentionDays} days so you can export it, then delete it, apart from records we must keep by law. Subscribers' data can be removed by the ISP at any time; removing a customer keeps payment history for accounting.`,
          ],
        },
        {
          title: "Your rights",
          body: [
            "You can ask us to access, correct, export or delete your data. Subscribers should contact their ISP first, as the ISP controls their records; we will help the ISP respond.",
            `Contact: ${contactInfo.email} or ${contactInfo.phone}. Address: ${legalConfig.registeredAddress}.`,
          ],
        },
        {
          title: "Changes",
          body: [
            "If we change this policy in a material way we will tell account holders before it takes effect.",
          ],
        },
      ]}
    />
  )
}
