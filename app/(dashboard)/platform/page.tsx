import type { Metadata } from "next"
import { PlatformClient } from "./platform-client"

export const metadata: Metadata = {
  title: "Platform",
  description: "Platform owner overview",
}

export default function PlatformPage() {
  return <PlatformClient />
}
