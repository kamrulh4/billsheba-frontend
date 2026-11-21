import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export function BrandLogo({ href = "/" }: { href?: string }) {
  return (
    <Link className="flex items-center gap-2" href={href}>
      {/** biome-ignore lint/performance/noImgElement: static inline-sized brand mark, no optimisation needed */}
      <img
        alt={`${siteConfig.name} logo`}
        className="h-8 w-8 rounded-lg"
        height={32}
        src="/logo.svg"
        width={32}
      />
      <span className="font-semibold text-foreground text-lg">{siteConfig.name}</span>
    </Link>
  )
}
