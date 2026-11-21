import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/app/(site)/login-form"
import { LanguageToggle } from "@/components/language-toggle"
import { LocaleBoundary } from "@/components/locale-boundary"

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your Billsheba account to manage subscribers, packages, invoices and payments.",
  alternates: { canonical: "/login" },
  // Auth screens carry no crawlable content and would dilute the index.
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense>
        <LocaleBoundary>
          <LanguageToggle className="absolute top-4 right-4" />
          <LoginForm />
        </LocaleBoundary>
      </Suspense>
    </div>
  )
}
