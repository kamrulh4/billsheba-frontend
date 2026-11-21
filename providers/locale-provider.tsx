"use client"

import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  LOCALE_COOKIE,
  type Locale,
  localizeDigits,
  type MessageKey,
  tr,
} from "@/lib/i18n"
import { setCurrentLocale } from "@/lib/i18n/current"
import { phrase } from "@/lib/i18n/phrase-book"

type Ctx = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  /** Formats a number as ৳ with locale digits and grouping. */
  money: (value: string | number) => string
  num: (value: string | number) => string
  /** Exact-phrase lookup for legacy screens; unknown text is returned as-is. */
  p: (text: string) => string
  /** Translates plain-string children (also inside arrays); elements are left alone. */
  pn: (node: React.ReactNode) => React.ReactNode
}

const LocaleContext = createContext<Ctx | null>(null)

export function LocaleProvider({
  initial,
  children,
}: {
  initial: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initial)

  // keep <html lang> in sync for screen readers / browser translation prompts
  useEffect(() => {
    document.documentElement.lang = locale
    setCurrentLocale(locale) // for toasts fired outside React
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax`
    document.documentElement.lang = next
  }, [])

  const value = useMemo<Ctx>(() => {
    const num = (v: string | number) =>
      localizeDigits(
        Number(v).toLocaleString("en-BD", { maximumFractionDigits: 0 }),
        locale,
      )
    return {
      locale,
      setLocale,
      t: (key, vars) => tr(locale, key, vars),
      num,
      money: (v) => `৳${num(v)}`,
      ...phraseHelpers(locale),
    }
  }, [locale, setLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

/** Outside a provider (e.g. an English-only page) this falls back to English. */
export function useT(): Ctx {
  const ctx = useContext(LocaleContext)
  if (ctx) return ctx
  const num = (v: string | number) =>
    Number(v).toLocaleString("en-BD", { maximumFractionDigits: 0 })
  return {
    locale: "en",
    setLocale: () => {},
    t: (key, vars) => tr("en", key, vars),
    num,
    money: (v) => `৳${num(v)}`,
    ...phraseHelpers("en"),
  }
}

function phraseHelpers(locale: Locale): Pick<Ctx, "p" | "pn"> {
  const p = (text: string) => (locale === "bn" ? phrase(text) : text)
  const pn = (node: React.ReactNode): React.ReactNode => {
    if (locale !== "bn") return node
    if (typeof node === "string") return p(node)
    if (Array.isArray(node)) {
      return Children.map(node, (child) =>
        typeof child === "string" ? p(child) : isValidElement(child) ? child : child,
      )
    }
    return node
  }
  return { p, pn }
}
