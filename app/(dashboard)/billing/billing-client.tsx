"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useBillingInfo,
  useRenewSubscription,
  useRenewWithBkash,
} from "@/hooks/rq/use-saas-query"
import { useT } from "@/providers/locale-provider"

export function BillingClient() {
  const { t, money: taka, num } = useT()
  const { data, isLoading } = useBillingInfo()
  const renew = useRenewSubscription()
  const bkashRenew = useRenewWithBkash()
  const returned = useSearchParams().get("bkash")
  const [planId, setPlanId] = useState("")
  const [months, setMonths] = useState("1")
  const [method, setMethod] = useState("BKASH")
  const [trx, setTrx] = useState("")
  const [sender, setSender] = useState("")

  if (isLoading || !data) return <Skeleton className="h-96 w-full" />

  const plan = data.plans.find((p) => String(p.id) === planId)
  const total = plan ? Number(plan.price) * Number(months) : 0
  const payTo = data.pay_to[method as keyof typeof data.pay_to]
  const pending = data.history.some((h) => h.payment_status === "PENDING")

  return (
    <div className="max-w-4xl space-y-4">
      <PageHeader title={t("billing.title")} description={t("billing.sub")} />

      {returned && (
        <p
          role="status"
          className={`rounded-md p-3 text-sm ${
            returned === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
          }`}
        >
          {returned === "success"
            ? t("billing.bkashSuccess")
            : returned === "cancelled"
              ? t("billing.bkashCancelled")
              : t("billing.bkashFailed")}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {t("billing.current")}: {data.current.plan ?? "—"}
            <Badge variant={data.current.active ? "secondary" : "destructive"}>
              {data.current.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            {data.current.end_date
              ? `${t("billing.validUntil")}: ${data.current.end_date}`
              : "—"}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("billing.pay")}</CardTitle>
          <CardDescription>{t("billing.paySub")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>{t("billing.plan")}</Label>
              <NativeSelect value={planId} onChange={(e) => setPlanId(e.target.value)}>
                <option value="">{t("billing.selectPlan")}</option>
                {data.plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {taka(p.price)}/mo · {p.max_customers} customers
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label>{t("billing.months")}</Label>
              <NativeSelect value={months} onChange={(e) => setMonths(e.target.value)}>
                {[1, 3, 6, 12].map((m) => (
                  <option key={m} value={m}>
                    {num(m)} {t("billing.months")}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label>{t("billing.payVia")}</Label>
              <NativeSelect value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="ROCKET">Rocket</option>
              </NativeSelect>
            </div>
          </div>

          {plan && data.online_bkash && (
            <div className="space-y-2">
              <Button
                className="w-full bg-[#e2136e] text-white hover:bg-[#c8105f] sm:w-auto"
                loading={bkashRenew.isPending}
                onClick={() =>
                  bkashRenew.mutate({ plan_id: Number(planId), months: Number(months) })
                }
              >
                {t("billing.payBkash", { amount: taka(total) })}
              </Button>
              <p className="text-muted-foreground text-xs">{t("billing.orManual")}</p>
            </div>
          )}

          {plan && (
            <p className="rounded-md bg-muted p-3 text-sm">
              {t("billing.send")} <strong>{taka(total)}</strong> {t("billing.to")}{" "}
              <strong>{payTo || "—"}</strong> ({method})
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t("billing.trx")}</Label>
              <Input value={trx} onChange={(e) => setTrx(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("billing.yourNumber")}</Label>
              <Input value={sender} onChange={(e) => setSender(e.target.value)} />
            </div>
          </div>
          <Button
            loading={renew.isPending}
            disabled={!plan || !trx.trim() || pending}
            onClick={() =>
              renew.mutate(
                {
                  plan_id: Number(planId),
                  months: Number(months),
                  payment_method: method,
                  transaction_id: trx,
                  sender_number: sender,
                },
                { onSuccess: () => setTrx("") },
              )
            }
          >
            {t("billing.submit")}
          </Button>
          {pending && (
            <p className="text-muted-foreground text-sm">{t("billing.waiting")}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("billing.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead>{t("billing.plan")}</TableHead>
                <TableHead>{t("billing.trx")}</TableHead>
                <TableHead className="text-right">{t("common.amount")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    {new Date(h.created_at).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    {h.plan_name} × {h.months}
                  </TableCell>
                  <TableCell className="font-mono">{h.transaction_id}</TableCell>
                  <TableCell className="text-right">{taka(h.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        h.payment_status === "REJECTED" ? "destructive" : "secondary"
                      }
                    >
                      {h.payment_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {data.history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("billing.none")}
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
