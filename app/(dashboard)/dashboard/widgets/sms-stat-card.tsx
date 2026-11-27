"use client"

import { useQuery } from "@tanstack/react-query"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { myOrganizationOptions } from "@/hooks/rq/use-saas-query"
import { useCan } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"
import { StatCard } from "./stat-card"

/** This month's SMS used against the limit, so an ISP sees it before it runs out. */
export function SmsStatCard() {
  const { t, num } = useT()
  const org = useQuery(myOrganizationOptions())
  const { manage } = useCan()
  if (!manage || !org.data?.sms_feature) return null
  const used = org.data.sms_used ?? 0
  const limit = org.data.sms_limit ?? 0
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0
  const low = limit === 0 || pct >= 80
  return (
    <Link href="/sms" className="block">
      <StatCard
        title={t("dash.smsMonth")}
        icon={MessageSquare}
        value={
          <>
            <span className={cn(low && "text-destructive")}>{num(used)}</span>
            <span className="font-medium text-muted-foreground text-sm">
              {" "}
              / {num(limit)}
            </span>
          </>
        }
      >
        <Progress
          value={pct}
          className={cn("mt-1.5 h-1.5", low && "[&>div]:bg-destructive")}
        />
      </StatCard>
    </Link>
  )
}
