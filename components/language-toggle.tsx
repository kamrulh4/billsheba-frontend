"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useT } from "@/providers/locale-provider"

/** Instant EN ⇄ বাংলা switch for app screens (no reload). */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useT()
  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      aria-label="Change language"
      onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
    >
      <Languages />
      {locale === "bn" ? "English" : "বাংলা"}
    </Button>
  )
}
