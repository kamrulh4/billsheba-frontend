"use client"

import { Suspense } from "react"
import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { useGetPaymentList } from "@/hooks/rq/use-payment-query"
import { Badge } from "@/components/ui/badge"
import { Tx } from "@/components/tx"
import { cn, generateAvatarUrl } from "@/lib/utils"
import { usePaymentsStore } from "@/stores/payments-store"
import { columns } from "./columns"
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

  // numbers for the cards follow whatever filters are applied
  const shown = table.getFilteredRowModel().rows.map((r) => r.original)
  const collected = shown.reduce((t, p) => t + (Number(p.amount) || 0), 0)
  const discount = shown.reduce((t, p) => t + (Number(p.discount) || 0), 0)
  const cash = shown
    .filter((p) => p.payment_method === "CASH")
    .reduce((t, p) => t + (Number(p.amount) || 0), 0)

  return (
    <div className="space-y-4">
      <Suspense>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard label="Total collected" value={`৳${collected.toLocaleString("en-US")}`} tone="emerald" />
          <SummaryCard label="Payments" value={String(shown.length)} />
          <SummaryCard label="Cash in hand" value={`৳${cash.toLocaleString("en-US")}`} tone="amber" />
          <SummaryCard label="Discount given" value={`৳${discount.toLocaleString("en-US")}`} />
        </div>

        <PaymentsTableToolbar table={table} />

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
              const date = p.payment_date
                ? new Date(p.payment_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })
                : ""
              return {
                title: p.customer.name || p.customer.username,
                description: [p.customer.username, collector && `by ${collector}`]
                  .filter(Boolean)
                  .join(" · "),
                avatar: generateAvatarUrl(p.customer.username || p.customer.name),
                uid: p.uid,
                meta: (
                  <>
                    <Badge variant="secondary" className="font-normal">
                      {p.payment_method}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {[p.billing_month, date].filter(Boolean).join(" · ")}
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

        <div className="hidden md:block">{render}</div>

        <PaymentsUpsertDialog />
        <ViewPaymentsDialog />
      </Suspense>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: "emerald" | "amber"
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="text-xs text-muted-foreground">
        <Tx>{label}</Tx>
      </div>
      <div
        className={cn(
          "mt-1 text-xl font-semibold tabular-nums md:text-2xl",
          tone === "emerald" && "text-emerald-600 dark:text-emerald-400",
          tone === "amber" && "text-amber-600 dark:text-amber-400",
        )}
      >
        {value}
      </div>
    </div>
  )
}
