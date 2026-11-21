"use client"

import { Tx } from "@/components/tx"
import { smsInfo } from "@/lib/sms"
import { cn } from "@/lib/utils"

/** "58 characters · 1 SMS", turning red when the text costs more SMS than allowed. */
export function SmsCounter({ text, max }: { text: string; max: number }) {
  const { length, segments, perSegment } = smsInfo(text)
  const over = segments > max
  return (
    <p className={cn("text-xs", over ? "text-destructive" : "text-muted-foreground")}>
      {length} <Tx>characters</Tx> · {segments} SMS
      {segments > 1 && (
        <>
          {" "}
          ({perSegment} <Tx>per part</Tx>)
        </>
      )}
      {over && (
        <>
          {" — "}
          <Tx>too long, keep it within</Tx> {max} SMS
        </>
      )}
    </p>
  )
}
