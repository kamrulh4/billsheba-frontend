import { type MessageKey, messages } from "./messages"

export type Locale = "en" | "bn"
export const LOCALES: Locale[] = ["en", "bn"]
export const LOCALE_COOKIE = "locale"

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "bn"
}

/** Translate a key, filling `{placeholders}` from `vars`. Safe on server and client. */
export function tr(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
) {
  let text: string = messages[locale][key] ?? messages.en[key]
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value))
    }
  }
  return text
}

/** Bangla digits for display (৳১,২০০). Leaves other characters untouched. */
export function localizeDigits(value: string | number, locale: Locale) {
  const s = String(value)
  if (locale !== "bn") return s
  return s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)])
}

export type { MessageKey }
