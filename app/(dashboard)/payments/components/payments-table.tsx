"use client"

import { Suspense } from "react"
import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { Tx } from "@/components/tx"
import { Badge } from "@/components/ui/badge"
import { useGetPaymentList } from "@/hooks/rq/use-payment-query"
import { useHydrated } from "@/hooks/use-hydrated"
import { cn, generateAvatarUrl } from "@/lib/utils"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment } from "@/types/payments"
import { collectorName } from "../data/collector"
import { columns } from "./columns"
import { PaymentsMobileToolbar } from "./payments-mobile-toolbar"
import { PaymentsTableRowActions } from "./payments-table-row-actions"
import { PaymentsTableToolbar } from "./payments-table-toolbar"
import { PaymentsUpsertDialog } from "./payments-upsert-dialog"
import { ViewPaymentsDialog } from "./view-payments-dialog"

export function PaymentsTable() {
  const { data: paymentsData, isLoading } = useGetPaymentList()
  const hydrated = useHydrated()
  const { setIsViewPaymentDialogOpen, setSelectedPayment } = usePaymentsStore()

  const { table, render } = useDataTable({
    columns,
    // the server has no payments, so neither may the first client render
    data: hydrated ? paymentsData?.results! : undefined!,
    loading: isLoading || !hydrated,
  })

  const shown = table.getFilteredRowModel().rows.map((r) => r.original)
  const paidRows = shown.filter((x) => x.paid)
  const sum = (list: Payment[]) => list.reduce((t, x) => t + (Number(x.amount) || 0), 0)
  // still owed: bill less what was waived and paid. Counted over every status, so it does not
  // turn into zero on the "Paid" tab.
  const scoped = (table.getColumn("paid")?.getFacetedRowModel().rows ?? []).map(
    (r) => r.original,
  )
  const discount = scoped.reduce((t, x) => t + (Number(x.discount) || 0), 0)
  const due = scoped
    .filter((x) => !x.paid)
    .reduce((t, x) => {
      const left = Number(x.bill_amount) - Number(x.discount || 0) - Number(x.amount || 0)
      return t + Math.max(0, left)
    }, 0)
  const perDay = new Map<string, number>()
  for (const x of paidRows)
    perDay.set(dayKey(x), (perDay.get(dayKey(x)) ?? 0) + (Number(x.amount) || 0))

  return (
    <div className="space-y-4">
      <Suspense>
        <div className="hidden md:block">
          <PaymentsTableToolbar table={table} />
        </div>
        <PaymentsMobileToolbar table={table} />

        <div className="block md:hidden">
          <DataTableCardView
            loading={isLoading || !hydrated}
            table={table}
            mapRow={(row) => {
              const p = row.original

              const collector = collectorName(p)
              return {
                title: p.customer.name || p.customer.username,
                description: [
                  p.customer.username,
                  collector !== "None" &&
                    (collector === "Online" ? "Online" : `by ${collector}`),
                ]
                  .filter(Boolean)
                  .join(" · "),
                avatar: generateAvatarUrl(p.customer.username || p.customer.name),
                uid: p.uid,
                group: {
                  key: dayKey(p),
                  label: dayLabel(p),
                  aside: perDay.has(dayKey(p)) ? (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ৳{(perDay.get(dayKey(p)) ?? 0).toLocaleString("en-US")}
                    </span>
                  ) : undefined,
                },
                meta: (
                  <>
                    <Badge variant="secondary" className="font-normal">
                      {p.payment_method}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {monthName(p.billing_month)}
                    </span>
                  </>
                ),
                trailing: (
                  <>
                    <div className="font-semibold tabular-nums">
                      ৳{Number(p.amount).toLocaleString("en-US")}
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        p.paid
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400",
                      )}
                    >
                      {p.paid ? "Paid" : "Unpaid"}
                    </div>
                    {Number(p.discount) > 0 && (
                      <div className="text-amber-600 text-xs">
                        −{Number(p.discount).toLocaleString("en-US")} <Tx>discount</Tx>
                      </div>
                    )}
                  </>
                ),
              }
            }}
            renderRowActions={(row) => <PaymentsTableRowActions row={row} />}
            onItemClick={(_item, row) => {
              if (row) {
                setIsViewPaymentDialogOpen(true)
                setSelectedPayment(row.original)
              }
            }}
          />
        </div>

        <div className="hidden md:block">{render}</div>

        {(shown.length > 0 || due > 0 || discount > 0) && (
          <div className="sticky bottom-20 z-10 mx-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-2xl border bg-card/90 px-4 py-2.5 shadow-lg backdrop-blur md:bottom-4">
            <Stat
              label={`${paidRows.length} paid`}
              value={sum(paidRows)}
              tone="emerald"
            />
            <Stat label="Discount" value={discount} tone="amber" />
            <Stat label="Due" value={due} tone="red" align="right" />
          </div>
        )}

        <PaymentsUpsertDialog />
        <ViewPaymentsDialog />
      </Suspense>
    </div>
  )
}

function dayKey(p: Payment) {
  return p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-CA") : "none"
}

function dayLabel(p: Payment) {
  if (!p.payment_date) return "No date"
  const d = new Date(p.payment_date)
  const days = Math.round(
    (new Date().setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 86_400_000,
  )
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
  return days === 0 ? `Today · ${date}` : days === 1 ? `Yesterday · ${date}` : date
}

function monthName(m: string) {
  return m ? m.charAt(0) + m.slice(1).toLowerCase() : ""
}

function Stat({
  label,
  value,
  tone,
  align,
}: {
  label: string
  value: number
  tone?: "emerald" | "amber" | "red"
  align?: "right"
}) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <div className="text-muted-foreground text-[11px]">
        <Tx>{label}</Tx>
      </div>
      <div
        className={cn(
          "font-bold text-lg tabular-nums",
          tone === "emerald" && "text-emerald-600 dark:text-emerald-400",
          tone === "amber" && "text-amber-600 dark:text-amber-400",
          tone === "red" && "text-red-600 dark:text-red-400",
        )}
      >
        ৳{value.toLocaleString("en-US")}
      </div>
    </div>
  )
}
