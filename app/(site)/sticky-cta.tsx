"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useT } from "@/providers/locale-provider"

/**
 * Always-reachable call to action on phones, where most ISP owners first see the site.
 * It appears only after the hero's own button has scrolled out of view, so the page never
 * shows two identical buttons at once.
 */
export function StickyCta() {
  const { t } = useT()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur transition-transform duration-200 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <Button asChild className="h-11 w-full text-base" tabIndex={visible ? 0 : -1}>
        <Link href="/register">{t("site.startTrial")}</Link>
      </Button>
    </div>
  )
}
