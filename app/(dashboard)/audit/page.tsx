import type { Metadata } from "next"
import { AuditClient } from "./audit-client"

export const metadata: Metadata = {
  title: "Activity log",
  description: "Who changed what",
}

export default function AuditPage() {
  return <AuditClient />
}
