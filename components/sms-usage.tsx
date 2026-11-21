"use client"

import { Tx } from "@/components/tx"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

/** This month's SMS used against the limit, with a warning when it is nearly or fully used. */
export function SmsUsage({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0
  const exhausted = limit > 0 && used >= limit
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          <Tx>SMS this month</Tx>
        </span>
        <span className={cn(exhausted && "font-semibold text-destructive")}>
          {used} / {limit}
        </span>
      </div>
      <Progress value={pct} className={cn(pct >= 80 && "[&>div]:bg-destructive")} />
      {limit === 0 && (
        <p className="text-muted-foreground text-xs">
          <Tx>No SMS included. Upgrade your plan to send SMS.</Tx>
        </p>
      )}
      {exhausted && (
        <p className="text-destructive text-xs">
          <Tx>Monthly SMS limit used up. No more SMS will be sent until next month.</Tx>
        </p>
      )}
      {!exhausted && limit > 0 && pct >= 80 && (
        <p className="text-xs text-amber-600">
          <Tx>Nearly out of SMS for this month.</Tx>
        </p>
      )}
    </div>
  )
}
