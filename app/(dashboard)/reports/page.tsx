import type { Metadata } from "next"
import { ReportsClient } from "./reports-client"

export const metadata: Metadata = {
  title: "Reports",
  description: "Revenue, expenses and profit",
}

export default function ReportsPage() {
  return <ReportsClient />
}
