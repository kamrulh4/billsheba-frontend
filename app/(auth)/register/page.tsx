import type { Metadata } from "next"
import { Suspense } from "react"
import { SignupForm } from "@/app/(site)/signup-form"
import { LanguageToggle } from "@/components/language-toggle"
import { LocaleBoundary } from "@/components/locale-boundary"
import { ogImage } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Start your free trial",
  description:
    "Sign up for Billsheba free. Run your ISP billing — customers, packages, monthly bills, bKash/Nagad payments and MikroTik control — from one dashboard.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "Create your Billsheba account",
    description:
      "Start managing your ISP subscribers, packages, invoices and payments in one dashboard.",
    url: "/register",
    images: [ogImage],
  },
}

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense>
        <LocaleBoundary>
          <LanguageToggle className="absolute top-4 right-4" />
          <SignupForm />
        </LocaleBoundary>
      </Suspense>
    </div>
  )
}
