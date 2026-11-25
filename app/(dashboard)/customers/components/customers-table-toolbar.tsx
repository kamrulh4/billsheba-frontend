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
import { useCustomersStore } from "@/stores/customers-store"
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
  const { manage } = useCan()

  return (
    <div className="flex gap-2 md:items-center md:justify-between flex-col md:flex-row">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <DataTableSearch
          table={table}
          searchField="username"
          placeholder="Search (name, username, phone)"
        />

        {table.getColumn("is_active") && (
          <DataTableFacetedFilter
            column={table.getColumn("is_active")}
            title="Status"
            options={customerStatus}
          />
        )}
        {organization?.router_configured && table.getColumn("presence") && (
          <DataTableFacetedFilter
            column={table.getColumn("presence")}
            title="Online"
            options={presenceOptions}
          />
        )}
        {table.getColumn("connection_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("connection_type")}
            title="Connection"
            options={connectionType}
          />
        )}
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
          size="sm"
          className="mr-2"
          loading={importCustomers.isPending}
          onClick={() => fileInput.current?.click()}
          title="CSV columns: name, phone, username, password, package, area, address"
        >
          <Upload />
          <Tx>Import CSV</Tx>
        </Button>
      )}
      <Button
        onClick={() => {
          setIsUpsertCustomerDialogOpen(true)
          setCustomerMutationType("add")
        }}
        size="sm"
        className="mr-2"
      >
        <Plus />
        <Tx>Add Customer</Tx>
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  )
}
