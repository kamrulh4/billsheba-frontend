"use client"

import { Menu, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { contactInfo, siteConfig, whatsappUrl } from "@/lib/site-config"
import { siteLinks } from "@/lib/site-links"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { t, locale } = useT()

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open navigation menu"
          className="md:hidden"
          size="icon"
          variant="ghost"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-72" side="right">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {siteLinks.map((item) => {
            const href = locale === "bn" ? item.bn : item.en
            return (
              <Link
                className={cn(
                  "rounded-md px-2 py-2 font-medium text-sm transition-colors hover:bg-accent",
                  pathname === href ? "text-foreground" : "text-muted-foreground",
                )}
                href={href}
                key={item.key}
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            )
          })}
        </nav>

        <div className="mt-4 flex flex-col gap-2 border-border border-t px-4 pt-4">
          <Button asChild size="sm" variant="outline">
            <a href={`tel:${contactInfo.phoneIntl}`}>
              <Phone className="h-4 w-4" />
              {contactInfo.phone}
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={whatsappUrl()} rel="noopener noreferrer" target="_blank">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/login" onClick={() => setOpen(false)}>
              {t("site.login")}
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/register" onClick={() => setOpen(false)}>
              {t("auth.createAccount")}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
