"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

/** Catches unexpected errors inside a page so one bug never shows a blank screen. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-semibold text-2xl">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        We hit an unexpected problem. Please try again. If it keeps happening, contact
        support
        {error.digest ? ` and mention code ${error.digest}` : ""}. / কিছু একটা সমস্যা হয়েছে,
        আবার চেষ্টা করুন।
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
