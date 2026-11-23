"use client"

import { Suspense } from "react"
import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { Badge } from "@/components/ui/badge"
import { useGetPaymentList } from "@/hooks/rq/use-payment-query"
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

  return (
    <div className="space-y-4">
      <Suspense>
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
