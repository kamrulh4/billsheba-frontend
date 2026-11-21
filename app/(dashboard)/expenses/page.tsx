import type { Metadata } from "next"
import { Suspense } from "react"
import { ExpensesClient } from "./expenses-client"

export const metadata: Metadata = { title: "Expenses", description: "Track ISP expenses" }

export default function ExpensesPage() {
  return (
    <Suspense>
      <ExpensesClient />
    </Suspense>
  )
}
