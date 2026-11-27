"use client"

import { Check, X } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { SegmentedTabs } from "@/components/segmented-tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePaymentRequests, useReviewPaymentRequest } from "@/hooks/rq/use-saas-query"
import { useCan } from "@/lib/permissions"
import { useT } from "@/providers/locale-provider"
import type { PaymentRequest } from "@/types/saas"

const STATUS_LABEL = {
  PENDING: "common.pending",
  APPROVED: "common.approved",
  REJECTED: "common.rejected",
} as const

export function PaymentRequestsClient() {
  const { manage } = useCan()
  const { t, money } = useT()
  const [status, setStatus] = useState("PENDING")
  const { data, isLoading } = usePaymentRequests(status || undefined)
  const review = useReviewPaymentRequest()

  const statusBadge = (r: PaymentRequest) => (
    <Badge variant={r.request_status === "PENDING" ? "outline" : "secondary"}>
      {t(STATUS_LABEL[r.request_status])}
    </Badge>
  )
  const reviewButtons = (id: number) => (
    <>
      <Button
        size="sm"
        disabled={review.isPending}
        onClick={() => review.mutate({ id, action: "approve" })}
      >
        <Check /> {t("common.approve")}
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={review.isPending}
        onClick={() => review.mutate({ id, action: "reject" })}
      >
        <X /> {t("common.reject")}
      </Button>
    </>
  )

  return (
    <div className="space-y-4">
      <PageHeader title={t("requests.title")} description={t("requests.sub")} />

      <SegmentedTabs
        value={status}
        onChange={setStatus}
        tabs={[
          { value: "PENDING", label: t("common.pending") },
          { value: "APPROVED", label: t("common.approved") },
          { value: "REJECTED", label: t("common.rejected") },
          { value: "", label: t("common.all") },
        ]}
      />

      {/* phones: cards */}
      <div className="space-y-2 md:hidden">
        {isLoading && (
          <p className="py-8 text-center text-muted-foreground">{t("common.loading")}</p>
        )}
        {data && data.results.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">{t("common.nothing")}</p>
        )}
        {data?.results.map((r) => (
          <div key={r.id} className="space-y-2 rounded-2xl border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold">{r.customer_name}</div>
                <div className="text-muted-foreground text-xs">{r.customer_phone}</div>
              </div>
              <div className="text-right">
                <div className="font-bold tabular-nums">{money(r.amount)}</div>
                <div className="text-muted-foreground text-xs">
                  {r.billing_month} {r.billing_year}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate">
                {r.payment_method} · <span className="font-mono">{r.transaction_id}</span>
              </span>
              {statusBadge(r)}
            </div>
            {manage && r.request_status === "PENDING" && (
              <div className="grid grid-cols-2 gap-2">{reviewButtons(r.id)}</div>
            )}
          </div>
        ))}
      </div>

      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.customer")}</TableHead>
                <TableHead>{t("common.method")}</TableHead>
                <TableHead>TrxID</TableHead>
                <TableHead>{t("requests.period")}</TableHead>
                <TableHead className="text-right">{t("common.amount")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7}>{t("common.loading")}</TableCell>
                </TableRow>
              )}
              {data?.results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.customer_name}</div>
                    <div className="text-muted-foreground text-xs">
                      {r.customer_phone}
                    </div>
                  </TableCell>
                  <TableCell>{r.payment_method}</TableCell>
                  <TableCell className="font-mono">{r.transaction_id}</TableCell>
                  <TableCell>
                    {r.billing_month} {r.billing_year}
                  </TableCell>
                  <TableCell className="text-right">{money(r.amount)}</TableCell>
                  <TableCell>{statusBadge(r)}</TableCell>
                  <TableCell className="space-x-1 whitespace-nowrap">
                    {manage && r.request_status === "PENDING" && reviewButtons(r.id)}
                  </TableCell>
                </TableRow>
              ))}
              {data && data.results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t("common.nothing")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
