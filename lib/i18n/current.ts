import { isLocale, LOCALE_COOKIE, type Locale, type MessageKey, tr } from "@/lib/i18n"

/**
 * The active language for code that runs outside React (toasts fired from query hooks).
 * LocaleProvider keeps it in sync; the cookie is only a fallback before the provider mounts.
 */
let current: Locale | null = null

export function setCurrentLocale(locale: Locale) {
  current = locale
}

export function getCurrentLocale(): Locale {
  if (current) return current
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))
    if (match && isLocale(match[1])) return match[1]
  }
  return "en"
}

/** Translate a typed key in the current language. */
export function trNow(key: MessageKey, vars?: Record<string, string | number>) {
  return tr(getCurrentLocale(), key, vars)
}
