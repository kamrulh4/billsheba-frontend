"use client"

import { useT } from "@/providers/locale-provider"

/** Inline translatable text for plain elements: <p><Tx>Manage your customers</Tx></p>. */
export function Tx({ children }: { children: string }) {
  return <>{useT().p(children)}</>
}
