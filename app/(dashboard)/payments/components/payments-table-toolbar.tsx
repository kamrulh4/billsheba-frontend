"use client"

import { Table } from "@tanstack/react-table"
import { Download, Plus, X } from "lucide-react"
import * as React from "react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePaymentsStore } from "@/stores/payments-store"
import type { Payment } from "@/types/payments"
import { months, paymentMethods, paymentStatuses } from "../data/data"
import { downloadPaymentsCsv } from "../data/export-csv"
import { PaymentsYearSelect } from "./payments-year-select"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function PaymentsTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { setPaymentMutationType, setIsUpsertPaymentDialogOpen, paymentFilters } =
    usePaymentsStore()
  const [searchField, setSearchField] = React.useState("customer")

  const collectors = React.useMemo(() => {
    const seen = new Map<string, string>()
    for (const row of table.getCoreRowModel().rows) {
      const key = String(row.getValue("entry_by"))
      const by = (row.original as Payment).entry_by
      const name = by ? `${by.first_name || ""} ${by.last_name || ""}`.trim() : ""
      seen.set(key, name || "None")
    }
    return [...seen].map(([value, label]) => ({ value, label }))
  }, [table.getCoreRowModel().rows])

  const currentMonth = months[new Date().getMonth()].value
  const currentMonthArray = React.useMemo(() => [currentMonth], [currentMonth])

  return (
    <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-2">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger size="sm" className="w-full md:w-[132px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">
              <Tx>Customer</Tx>
            </SelectItem>
            <SelectItem value="entry_by">
              <Tx>Collected By</Tx>
            </SelectItem>
          </SelectContent>
        </Select>

        <DataTableSearch table={table} searchField={searchField} />

        {table.getColumn("paid") && (
          <DataTableFacetedFilter
            column={table.getColumn("paid")}
            title="Status"
            options={paymentStatuses}
          />
        )}
        {table.getColumn("payment_method") && (
          <DataTableFacetedFilter
            column={table.getColumn("payment_method")}
            title="Method"
            options={paymentMethods}
          />
        )}

        {table.getColumn("entry_by") && (
          <DataTableFacetedFilter
            column={table.getColumn("entry_by")}
            title="Collected By"
            options={collectors}
          />
        )}

        {table.getColumn("billing_month") && (
          <DataTableFacetedFilter
            column={table.getColumn("billing_month")}
            title="Month"
            options={months}
            defaultValues={currentMonthArray}
          />
        )}

        <PaymentsYearSelect />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <Tx>Reset</Tx>
            <X />
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          downloadPaymentsCsv(
            table.getFilteredRowModel().rows.map((r) => r.original as Payment),
          )
        }
      >
        <Download />
        <Tx>Export CSV</Tx>
      </Button>

      <Button
        onClick={() => {
          setIsUpsertPaymentDialogOpen(true)
          setPaymentMutationType("add")
        }}
        size="sm"
        className="md:mr-2"
      >
        <Plus />
        <Tx>Add Payment</Tx>
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  )
}
