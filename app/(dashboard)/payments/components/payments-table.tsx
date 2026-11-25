"use client"

import { Suspense } from "react"
import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { Tx } from "@/components/tx"
import { Badge } from "@/components/ui/badge"
import { useGetPaymentList } from "@/hooks/rq/use-payment-query"
import { cn, generateAvatarUrl } from "@/lib/utils"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment } from "@/types/payments"
import { columns } from "./columns"
import { PaymentsMobileToolbar } from "./payments-mobile-toolbar"
import { PaymentsTableRowActions } from "./payments-table-row-actions"
import { PaymentsTableToolbar } from "./payments-table-toolbar"
import { PaymentsUpsertDialog } from "./payments-upsert-dialog"
import { ViewPaymentsDialog } from "./view-payments-dialog"

export function PaymentsTable() {
  const { data: paymentsData, isLoading } = useGetPaymentList()
  const { setIsViewPaymentDialogOpen, setSelectedPayment } = usePaymentsStore()

  const { table, render } = useDataTable({
    columns,
    data: paymentsData?.results!,
    loading: isLoading,
    showFooter: true,
  })

  const shown = table.getFilteredRowModel().rows.map((r) => r.original)
  const paidRows = shown.filter((x) => x.paid)
  const sum = (list: Payment[]) => list.reduce((t, x) => t + (Number(x.amount) || 0), 0)
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
            loading={isLoading}
            table={table}
            mapRow={(row) => {
              const p = row.original

              const by = p.entry_by
              const collector = by
                ? `${by.first_name || ""} ${by.last_name || ""}`.trim()
                : ""
              return {
                title: p.customer.name || p.customer.username,
                description: [p.customer.username, collector && `by ${collector}`]
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

        {shown.length > 0 && (
          <div className="sticky bottom-20 z-10 flex items-center justify-between rounded-2xl border bg-card/90 px-4 py-2.5 shadow-lg backdrop-blur md:hidden">
            <div>
              <div className="text-muted-foreground text-[11px]">
                {paidRows.length} <Tx>paid</Tx>
              </div>
              <div className="font-bold text-emerald-600 text-lg dark:text-emerald-400">
                ৳{sum(paidRows).toLocaleString("en-US")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground text-[11px]">
                <Tx>Cash</Tx>
              </div>
              <div className="font-bold text-lg">
                ৳
                {sum(paidRows.filter((x) => x.payment_method === "CASH")).toLocaleString(
                  "en-US",
                )}
              </div>
            </div>
          </div>
        )}

        <div className="hidden md:block">{render}</div>

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
