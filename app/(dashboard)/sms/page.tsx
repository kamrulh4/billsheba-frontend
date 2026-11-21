import type { Metadata } from "next"
import { SmsClient } from "./sms-client"

export const metadata: Metadata = {
  title: "SMS",
  description: "Send SMS and view history",
}

export default function SmsPage() {
  return <SmsClient />
}
