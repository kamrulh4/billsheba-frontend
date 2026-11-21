import type { Metadata } from "next"
import { Suspense } from "react"
import { LocaleBoundary } from "@/components/locale-boundary"
import { ReceiptClient } from "./receipt-client"

export const metadata: Metadata = {
  title: "Receipt",
  robots: { index: false, follow: false },
}

async function Content({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  return (
    <LocaleBoundary>
      <ReceiptClient uid={uid} />
    </LocaleBoundary>
  )
}

export default function ReceiptPage({ params }: { params: Promise<{ uid: string }> }) {
  return (
    <Suspense>
      <Content params={params} />
    </Suspense>
  )
}
