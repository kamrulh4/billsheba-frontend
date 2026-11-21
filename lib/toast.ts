import { toast as sonner } from "sonner"
import { getCurrentLocale } from "@/lib/i18n/current"
import { phrase } from "@/lib/i18n/phrase-book"

type Translatable = "success" | "error" | "info" | "warning" | "message"
const TRANSLATED: Translatable[] = ["success", "error", "info", "warning", "message"]

const t = (value: unknown) =>
  typeof value === "string" && getCurrentLocale() === "bn" ? phrase(value) : value

/**
 * Drop-in replacement for sonner's `toast`: plain-string messages (and a `description`) are looked
 * up in the Bangla phrase book when the app is in Bangla. Anything not listed stays as written.
 */
export const toast = new Proxy(sonner, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    if (typeof value === "function" && TRANSLATED.includes(prop as Translatable)) {
      return (
        message: unknown,
        options?: { description?: unknown } & Record<string, unknown>,
      ) =>
        (value as (m: unknown, o?: unknown) => unknown)(
          t(message),
          options ? { ...options, description: t(options.description) } : options,
        )
    }
    return value
  },
}) as typeof sonner
