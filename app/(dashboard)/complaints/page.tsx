import type { Metadata } from "next"
import { ComplaintsClient } from "./complaints-client"

export const metadata: Metadata = {
  title: "Complaints",
  description: "Customer support tickets",
}

export default function ComplaintsPage() {
  return <ComplaintsClient />
}
