"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { SmsUsage } from "@/components/sms-usage"
import { Card, CardContent } from "@/components/ui/card"
import { myOrganizationOptions } from "@/hooks/rq/use-saas-query"
import { useCan } from "@/lib/permissions"

/** Remaining SMS for the month, on the dashboard so an ISP sees it before the limit runs out. */
export function SmsUsageCard() {
  const org = useQuery(myOrganizationOptions())
  const { manage } = useCan()
  if (!manage || !org.data?.sms_feature) return null
  return (
    <Link href="/sms" className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="pt-6">
          <SmsUsage used={org.data.sms_used ?? 0} limit={org.data.sms_limit ?? 0} />
        </CardContent>
      </Card>
    </Link>
  )
}
