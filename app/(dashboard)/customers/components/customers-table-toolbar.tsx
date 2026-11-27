"use client"

import { Table } from "@tanstack/react-table"
import { Plus, Upload, X } from "lucide-react"
import { useRef } from "react"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import { useImportCustomers, useMyOrganization } from "@/hooks/rq/use-saas-query"
import { useCan } from "@/lib/permissions"
import { useT } from "@/providers/locale-provider"
import { useCustomersStore } from "@/stores/customers-store"
import type { Customer } from "@/types/customers"
import { connectionType, customerStatus, presenceOptions } from "../data/data"
import { RouterImportButton } from "./router-import-dialog"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function CustomersTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { setCustomerMutationType, setIsUpsertCustomerDialogOpen } = useCustomersStore()
  const fileInput = useRef<HTMLInputElement>(null)
  const importCustomers = useImportCustomers()
  const { data: organization } = useMyOrganization()
  const { p, num } = useT()
  const { manage } = useCan()

  const rows = table.getCoreRowModel().rows
  const active = rows.filter((r) => (r.original as Customer).is_active).length

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl">
            <Tx>Customers</Tx>
          </h1>
          <p className="text-muted-foreground text-sm">
            {num(rows.length)} <Tx>customers</Tx> · {num(active)} <Tx>active</Tx>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInput}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) importCustomers.mutate(file)
              e.target.value = ""
            }}
          />
          {manage && organization?.router_configured && <RouterImportButton />}
          {manage && (
            <Button
              variant="outline"
              loading={importCustomers.isPending}
              onClick={() => fileInput.current?.click()}
              title="CSV columns: name, phone, username, password, package, area, address"
            >
              <Upload />
              <Tx>Import CSV</Tx>
            </Button>
          )}
          <DataTableViewOptions table={table} label={p("Columns")} className="ml-0 h-9" />
          <Button
            onClick={() => {
              setIsUpsertCustomerDialogOpen(true)
              setCustomerMutationType("add")
            }}
          >
            <Plus />
            <Tx>Add Customer</Tx>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DataTableSearch
          table={table}
          searchField="username"
          placeholder="Search name, username, phone"
          className="h-9 md:w-72"
        />
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          {table.getColumn("is_active") && (
            <DataTableFacetedFilter
              inline
              column={table.getColumn("is_active")}
              title="Status"
              options={customerStatus}
            />
          )}
          {organization?.router_configured && table.getColumn("presence") && (
            <DataTableFacetedFilter
              inline
              column={table.getColumn("presence")}
              title="Online"
              options={presenceOptions}
            />
          )}
          {table.getColumn("connection_type") && (
            <DataTableFacetedFilter
              inline
              column={table.getColumn("connection_type")}
              title="Connection"
              options={connectionType}
            />
          )}
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
