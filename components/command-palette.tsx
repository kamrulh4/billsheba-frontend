"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useSession } from "@/hooks/rq/use-auth-query"
import { canSee, navItems } from "@/lib/nav"
import { useT } from "@/providers/locale-provider"

/** Ctrl/⌘ + K — jump to any page without hunting through the sidebar. */
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useT()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden w-48 justify-start text-muted-foreground sm:flex"
        onClick={() => setOpen(true)}
      >
        <Search />
        <span className="flex-1 text-left">{t("common.search")}</span>
        <kbd className="rounded border px-1 text-[10px]">⌘K</kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        aria-label={t("common.search")}
        onClick={() => setOpen(true)}
      >
        <Search />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("common.search")} />
        <CommandList>
          <CommandEmpty>{t("common.noResults")}</CommandEmpty>
          <CommandGroup>
            {navItems
              .filter((item) => canSee(item, session?.kind))
              .map((item) => (
                <CommandItem
                  key={item.url}
                  value={`${t(item.key)} ${item.url}`}
                  onSelect={() => {
                    setOpen(false)
                    router.push(item.url)
                  }}
                >
                  <item.icon />
                  {t(item.key)}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
