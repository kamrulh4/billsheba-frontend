import { SiteShell } from "@/app/(site)/site-shell"

export default function BanglaLayout({ children }: { children: React.ReactNode }) {
  // lang="bn" for screen readers / search engines on the Bangla section
  return (
    <div lang="bn">
      <SiteShell locale="bn">{children}</SiteShell>
    </div>
  )
}
