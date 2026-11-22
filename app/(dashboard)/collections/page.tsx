import type { Metadata } from "next"
import { Suspense } from "react"
import { CollectionsClient } from "./collections-client"

export const metadata: Metadata = {
  title: "Collections",
  description: "Cash collected and handed over",
}

export default function CollectionsPage() {
  return (
    <Suspense>
      <CollectionsClient />
    </Suspense>
  )
}
