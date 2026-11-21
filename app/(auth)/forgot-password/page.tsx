import type { Metadata } from "next"
import { Suspense } from "react"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset the password for your Billsheba account.",
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  )
}
