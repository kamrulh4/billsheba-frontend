"use client"

import * as React from "react"
import { useT } from "@/providers/locale-provider"

/**
 * Wraps a UI primitive so plain-string children (and chosen text attributes such as
 * `placeholder`) are looked up in the Bangla phrase book. Strings with no entry,
 * or any non-string children, pass through untouched — so user data is never altered.
 */
export function withPhrases<P extends object>(
  Component: React.ComponentType<P>,
  attrs: (keyof P & string)[] = [],
) {
  function Phrased(props: P) {
    const { p, pn } = useT()
    const next = { ...props } as Record<string, unknown>
    if ("children" in next) next.children = pn(next.children as React.ReactNode)
    for (const attr of attrs) {
      if (typeof next[attr] === "string") next[attr] = p(next[attr] as string)
    }
    return <Component {...(next as P)} />
  }
  Phrased.displayName = `Phrased(${Component.displayName || Component.name || "Component"})`
  return Phrased as React.ComponentType<P>
}
