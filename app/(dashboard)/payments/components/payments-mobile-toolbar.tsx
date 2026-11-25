"use client"

import type { Table } from "@tanstack/react-table"
import { Download } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import {
  activeFilterCount,
  ChipFilter,
  FilterButton,
  FilterSheet,
  MobileFab,
  MoreMenu,
  QuickTabs,
  resetFilters,
} from "@/components/data-table/mobile-ui"
import { Tx } from "@/components/tx"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useSession } from "@/hooks/rq/use-auth-query"
import { useT } from "@/providers/locale-provider"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment } from "@/types/payments"
import { collectorName } from "../data/collector"
import { months, paymentMethods } from "../data/data"
import { downloadPaymentsCsv } from "../data/export-csv"
import { PaymentsYearSelect } from "./payments-year-select"

const MANAGERS = ["ADMIN", "OWNER", "MANAGER"]

/** Phone layout: search + filter + more, Paid/Unpaid tabs, floating Add. */
export function PaymentsMobileToolbar({ table }: { table: Table<Payment> }) {
  const { setPaymentMutationType, setIsUpsertPaymentDialogOpen } = usePaymentsStore()
  const { data: session } = useSession()
  const { p } = useT()
  const [sheet, setSheet] = useState(false)
  const canManage = MANAGERS.includes(session?.kind ?? "")

  // On a phone the list opens on what was actually paid; the "Unpaid" tab is one tap away.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      table.getColumn("paid")?.setFilterValue(["true"])
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: once, on mount
  }, [])

  const rows = table.getCoreRowModel().rows
  const paidFilter =
    (table.getColumn("paid")?.getFilterValue() as string[] | undefined) ?? []
  const tab = paidFilter.length === 1 ? paidFilter[0] : "all"
  const countPaid = rows.filter((r) => r.original.paid).length

  const collectors = useMemo(() => {
    const seen = new Map<string, string>()
    for (const row of rows) {
      seen.set(String(row.getValue("entry_by")), p(collectorName(row.original)))
    }
    return [...seen].map(([value, label]) => ({ value, label }))
  }, [rows, p])

  return (
    <div className="space-y-2.5 md:hidden">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <DataTableSearch
            table={table}
            searchField="customer"
            placeholder="Search customer"
            className="h-10 rounded-xl md:w-full"
          />
        </div>
        <FilterButton
          count={activeFilterCount(table, ["customer", "paid"])}
          onClick={() => setSheet(true)}
        />
        {canManage && (
          <MoreMenu>
            <DropdownMenuItem
              className="py-2.5"
              onSelect={() =>
                downloadPaymentsCsv(
                  table.getFilteredRowModel().rows.map((r) => r.original),
                )
              }
            >
              <Download />
              <Tx>Export CSV</Tx>
            </DropdownMenuItem>
          </MoreMenu>
        )}
      </div>

      <QuickTabs
        value={tab}
        onChange={(v) =>
          table.getColumn("paid")?.setFilterValue(v === "all" ? undefined : [v])
        }
        tabs={[
          { label: "Paid", value: "true", count: countPaid },
          { label: "Unpaid", value: "false", count: rows.length - countPaid },
          { label: "All", value: "all", count: rows.length },
        ]}
      />

      <FilterSheet
        open={sheet}
        onOpenChange={setSheet}
        onReset={() => resetFilters(table, ["customer", "paid"])}
        resultCount={table.getFilteredRowModel().rows.length}
      >
        <ChipFilter
          column={table.getColumn("entry_by")}
          label="Collected By"
          options={collectors}
        />
        <ChipFilter
          column={table.getColumn("payment_method")}
          label="Method"
          options={paymentMethods}
        />
        <ChipFilter
          column={table.getColumn("billing_month")}
          label="Month"
          options={months}
        />
        <div>
          <div className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
            <Tx>Year</Tx>
          </div>
          <PaymentsYearSelect />
        </div>
      </FilterSheet>

      <MobileFab
        label="Add"
        className="bottom-36"
        onClick={() => {
          setPaymentMutationType("add")
          setIsUpsertPaymentDialogOpen(true)
        }}
      />
    </div>
  )
}
