"use client"

import type { Table } from "@tanstack/react-table"
import { FileUp, Router } from "lucide-react"
import { useRef, useState } from "react"
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
import { useImportCustomers, useMyOrganization } from "@/hooks/rq/use-saas-query"
import { useCustomersStore } from "@/stores/customers-store"
import type { Customer } from "@/types/customers"
import { connectionType, customerStatus, presenceOptions } from "../data/data"
import { RouterImportDialog } from "./router-import-dialog"

const MANAGERS = ["ADMIN", "OWNER", "MANAGER"]

/** Phone layout: search + filter + more on one row, quick tabs, floating Add. */
export function CustomersMobileToolbar({ table }: { table: Table<Customer> }) {
  const { setCustomerMutationType, setIsUpsertCustomerDialogOpen } = useCustomersStore()
  const { data: organization } = useMyOrganization()
  const { data: session } = useSession()
  const importCustomers = useImportCustomers()
  const fileInput = useRef<HTMLInputElement>(null)
  const [sheet, setSheet] = useState(false)
  const [routerImport, setRouterImport] = useState(false)

  const canManage = MANAGERS.includes(session?.kind ?? "")
  const routerOn = !!organization?.router_configured

  const rows = table.getCoreRowModel().rows
  const count = (fn: (c: Customer) => boolean) =>
    rows.filter((r) => fn(r.original)).length
  const filters = table.getState().columnFilters
  const val = (id: string) => (filters.find((f) => f.id === id)?.value as string[]) ?? []
  const tab =
    val("presence")[0] === "online"
      ? "online"
      : val("presence")[0] === "offline"
        ? "offline"
        : val("is_active")[0] === "false"
          ? "inactive"
          : "all"

  const pick = (next: string) => {
    table.getColumn("presence")?.setFilterValue(undefined)
    table.getColumn("is_active")?.setFilterValue(undefined)
    if (next === "online" || next === "offline")
      table.getColumn("presence")?.setFilterValue([next])
    if (next === "inactive") table.getColumn("is_active")?.setFilterValue(["false"])
  }

  const tabs = [
    { label: "All", value: "all", count: rows.length },
    ...(routerOn
      ? [
          {
            label: "Online",
            value: "online",
            count: count((c) => c.presence === "online"),
          },
          {
            label: "Offline",
            value: "offline",
            count: count((c) => c.presence === "offline"),
          },
        ]
      : []),
    { label: "Inactive", value: "inactive", count: count((c) => !c.is_active) },
  ]

  return (
    <div className="space-y-2.5 md:hidden">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <DataTableSearch
            table={table}
            searchField="username"
            placeholder="Search name, user, phone"
            className="h-10 rounded-xl md:w-full"
          />
        </div>
        <FilterButton
          count={activeFilterCount(table, ["username"])}
          onClick={() => setSheet(true)}
        />
        {canManage && (
          <MoreMenu>
            {routerOn && (
              <DropdownMenuItem className="py-2.5" onSelect={() => setRouterImport(true)}>
                <Router />
                <Tx>Import from router</Tx>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="py-2.5"
              onSelect={() => fileInput.current?.click()}
            >
              <FileUp />
              <Tx>Import CSV</Tx>
            </DropdownMenuItem>
          </MoreMenu>
        )}
      </div>

      <QuickTabs tabs={tabs} value={tab} onChange={pick} />

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
      {routerImport && <RouterImportDialog onClose={() => setRouterImport(false)} />}

      <FilterSheet
        open={sheet}
        onOpenChange={setSheet}
        onReset={() => resetFilters(table, ["username"])}
        resultCount={table.getFilteredRowModel().rows.length}
      >
        <ChipFilter
          column={table.getColumn("is_active")}
          label="Status"
          options={customerStatus}
        />
        {routerOn && (
          <ChipFilter
            column={table.getColumn("presence")}
            label="Online"
            options={presenceOptions}
          />
        )}
        <ChipFilter
          column={table.getColumn("connection_type")}
          label="Connection"
          options={connectionType}
        />
      </FilterSheet>

      {canManage && (
        <MobileFab
          label="Add"
          onClick={() => {
            setCustomerMutationType("add")
            setIsUpsertCustomerDialogOpen(true)
          }}
        />
      )}
    </div>
  )
}
