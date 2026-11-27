"use client"

import type { Table } from "@tanstack/react-table"
import { Download, Plus, X } from "lucide-react"
import * as React from "react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import { useCan } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment } from "@/types/payments"
import { collectorName } from "../data/collector"
import { months, paymentMethods } from "../data/data"
import { downloadPaymentsCsv } from "../data/export-csv"
import { PaymentsYearSelect } from "./payments-year-select"

/** Desktop header: title and actions on one line; search, status tabs and filters on the next. */
export function PaymentsTableToolbar({ table }: { table: Table<Payment> }) {
  const { manage } = useCan()
  const { p, num } = useT()
  const { setPaymentMutationType, setIsUpsertPaymentDialogOpen, paymentFilters } =
    usePaymentsStore()
  const isFiltered = table.getState().columnFilters.length > 0

  const coreRows = table.getCoreRowModel().rows
  const collectors = React.useMemo(() => {
    const seen = new Map<string, string>()
    for (const row of coreRows) {
      seen.set(String(row.getValue("entry_by")), collectorName(row.original))
    }
    return [...seen].map(([value, label]) => ({ value, label }))
  }, [coreRows])

  const currentMonth = months[new Date().getMonth()].value
  const currentMonthArray = React.useMemo(() => [currentMonth], [currentMonth])

  // tab counts follow every other filter (month, collector, search), not the status itself
  const status = table.getColumn("paid")
  const scoped = status?.getFacetedRowModel().rows ?? []
  const paidCount = scoped.filter((r) => r.original.paid).length
  const selected = (status?.getFilterValue() as string[] | undefined) ?? []
  const tab = selected.length === 1 ? selected[0] : "all"

  const monthFilter =
    (table.getColumn("billing_month")?.getFilterValue() as string[] | undefined) ?? []
  const period = [
    monthFilter.length === 1
      ? p(months.find((m) => m.value === monthFilter[0])?.label ?? "")
      : "",
    paymentFilters.year,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl">
            <Tx>Payments</Tx>
          </h1>
          <p className="text-muted-foreground text-sm">
            {period} · {num(scoped.length)} <Tx>bills</Tx>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {manage && (
            <Button
              variant="outline"
              onClick={() =>
                downloadPaymentsCsv(
                  table.getFilteredRowModel().rows.map((r) => r.original),
                )
              }
            >
              <Download />
              <Tx>Export CSV</Tx>
            </Button>
          )}
          <DataTableViewOptions table={table} label={p("Columns")} className="ml-0 h-9" />
          <Button
            onClick={() => {
              setIsUpsertPaymentDialogOpen(true)
              setPaymentMutationType("add")
            }}
          >
            <Plus />
            <Tx>Add Payment</Tx>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DataTableSearch
          table={table}
          searchField="customer"
          placeholder="Search name, phone"
          className="h-9 md:w-56"
        />
        <div className="flex h-9 items-center gap-0.5 rounded-lg bg-muted p-1">
          {[
            { value: "all", label: "All", count: scoped.length },
            { value: "true", label: "Paid", count: paidCount },
            { value: "false", label: "Unpaid", count: scoped.length - paidCount },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={tab === item.value}
              onClick={() =>
                status?.setFilterValue(item.value === "all" ? undefined : [item.value])
              }
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-md px-3 font-medium text-sm",
                tab === item.value
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p(item.label)}
              <span className="text-muted-foreground text-xs">{num(item.count)}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <DataTableFacetedFilter
            inline
            column={table.getColumn("entry_by")}
            title="Collector"
            options={collectors}
          />
          <DataTableFacetedFilter
            inline
            column={table.getColumn("payment_method")}
            title="Method"
            options={paymentMethods}
          />
          <DataTableFacetedFilter
            inline
            column={table.getColumn("billing_month")}
            title="Month"
            options={months}
            defaultValues={currentMonthArray}
          />
          <PaymentsYearSelect />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 text-muted-foreground"
            >
              <X />
              <Tx>Reset</Tx>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
