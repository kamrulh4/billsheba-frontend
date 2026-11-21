"use client"

import { Check, X } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePaymentRequests, useReviewPaymentRequest } from "@/hooks/rq/use-saas-query"
import { useT } from "@/providers/locale-provider"

export function PaymentRequestsClient() {
  const { t, money } = useT()
  const [status, setStatus] = useState("PENDING")
  const { data, isLoading } = usePaymentRequests(status || undefined)
  const review = useReviewPaymentRequest()

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("requests.title")}
        description={t("requests.sub")}
        actions={
          <NativeSelect
            className="w-40"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">{t("common.pending")}</option>
            <option value="APPROVED">{t("common.approved")}</option>
            <option value="REJECTED">{t("common.rejected")}</option>
            <option value="">{t("common.all")}</option>
          </NativeSelect>
        }
      />
      <Card>
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
                  <TableCell>
                    <Badge
                      variant={r.request_status === "PENDING" ? "outline" : "secondary"}
                    >
                      {r.request_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-1 whitespace-nowrap">
                    {r.request_status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          disabled={review.isPending}
                          onClick={() => review.mutate({ id: r.id, action: "approve" })}
                        >
                          <Check /> {t("common.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={review.isPending}
                          onClick={() => review.mutate({ id: r.id, action: "reject" })}
                        >
                          <X /> {t("common.reject")}
                        </Button>
                      </>
                    )}
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
