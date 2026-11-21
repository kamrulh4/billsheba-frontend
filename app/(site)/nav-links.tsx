"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { sessionOptions } from "@/hooks/rq/use-auth-query"
import { useT } from "@/providers/locale-provider"

export const dynamic = "force-dynamic"

export function NavLinks() {
  const { data: flag } = useQuery({
    queryKey: ["signed-in"],
    queryFn: () =>
      fetch("/api/auth/session").then((r) => r.json() as Promise<{ signedIn: boolean }>),
    staleTime: 60_000,
  })
  const { data: session } = useQuery({ ...sessionOptions(), enabled: !!flag?.signedIn })
  const { t } = useT()

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {session ? (
        <Link
          className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/dashboard"
        >
          {session.email}
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/login"
          >
            {t("site.login")}
          </Link>

          <Link
            className="rounded-md bg-primary px-3.5 py-1.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
            href="/register"
          >
            {t("site.startFree")}
          </Link>
        </div>
      )}
    </nav>
  )
}
