import { SiteShell } from "@/app/(site)/site-shell"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>
}
