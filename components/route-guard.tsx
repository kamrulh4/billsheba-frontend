"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSession } from "@/hooks/rq/use-auth-query"
import { canOpen } from "@/lib/nav"

/** Sends a signed-in user away from a page their role may not open (typed URL, old bookmark). */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const blocked = !!session && !canOpen(pathname, session.kind)

  useEffect(() => {
    if (blocked) router.replace("/dashboard")
  }, [blocked, router])

  return blocked ? null : children
}
