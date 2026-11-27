"use client"

import { useMemo } from "react"
import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { Badge } from "@/components/ui/badge"
import { useGetCustomerList } from "@/hooks/rq/use-customers-query"
import { useMyOrganization } from "@/hooks/rq/use-saas-query"
import { usePresence } from "@/hooks/rq/use-sessions-query"
import { useHydrated } from "@/hooks/use-hydrated"
import { generateAvatarUrl } from "@/lib/utils"
import { useCustomersStore } from "@/stores/customers-store"
import type { Customer } from "@/types/customers"
import { columns as allColumns } from "./columns"
import { CustomersMobileToolbar } from "./customers-mobile-toolbar"
import { CustomersTableRowActions } from "./customers-table-row-actions"
import { CustomersTableToolbar } from "./customers-table-toolbar"
import { UpsertCustomersDialog } from "./upsert-customers-dialog"
import { ViewCustomersDialog } from "./view-customers-dialog"

export function CustomersTable() {
  const { data: customersData, isLoading } = useGetCustomerList()
  const hydrated = useHydrated()
  const { setIsViewCustomerDialogOpen, setSelectedCustomer } = useCustomersStore()

  const { data: organization } = useMyOrganization()
  const { data: presence } = usePresence(!!organization?.router_configured)

  const routerOn = !!organization?.router_configured

  // Add the live online/offline state to each row. Only PPPoE customers can be judged from the router's
  // PPPoE sessions; the rest stay "unknown", as does everyone while the router cannot be read.
  const rows = useMemo<Customer[] | undefined>(() => {
    const list = customersData?.results
    if (!list) return list
    const online = presence?.online
    return list.map((c) => ({
      ...c,
      // no router, no dot at all
      presence: !routerOn
        ? undefined
        : !online || c.connection_type !== "PPPoE"
          ? "unknown"
          : c.username in online
            ? "online"
            : "offline",
    }))
  }, [customersData?.results, presence?.online, routerOn])

  // The expiry date only means something when each customer has their own paid period (30/60/90-day
  // cycles). With a calendar-month cycle the server ignores it, so the column would be a column of dashes.
  const dayBased =
    !!organization?.billing_cycle && organization.billing_cycle !== "MONTHLY"
  const columns = useMemo(
    () =>
      dayBased
        ? allColumns
        : allColumns.filter(
            (c) =>
              (c as { accessorKey?: string }).accessorKey !== "subscription_end_date",
          ),
    [dayBased],
  )

  const { table, render } = useDataTable({
    columns,
    data: hydrated ? rows! : undefined!,
    loading: isLoading || !hydrated,
    initialVisibility: { presence: false },
  })

  return (
    <div className="space-y-4">
      <div className="hidden md:block">
        <CustomersTableToolbar table={table} />
      </div>
      <CustomersMobileToolbar table={table} />

      {/* mobile: card view */}
      <div className="block md:hidden">
        <DataTableCardView
          loading={isLoading || !hydrated}
          table={table}
          mapRow={(row) => {
            const customer = row.original
            return {
              title: customer.name,
              description: [customer.username, customer.phone]
                .filter(Boolean)
                .join(" · "),
              meta: (
                <>
                  {customer.package?.name && (
                    <Badge variant="secondary" className="font-normal">
                      {customer.package.name}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={
                      customer.is_free
                        ? "border-sky-500/40 text-sky-600 dark:text-sky-400"
                        : customer.is_active
                          ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                          : "border-red-500/40 text-red-600 dark:text-red-400"
                    }
                  >
                    {customer.is_free
                      ? "Free"
                      : customer.is_active
                        ? "Active"
                        : "Inactive"}
                  </Badge>
                  {dayBased && customer.subscription_end_date && (
                    <span className="text-xs text-muted-foreground">
                      · {shortDate(customer.subscription_end_date)}
                    </span>
                  )}
                </>
              ),
              avatar: generateAvatarUrl(customer.username || customer.name),
              uid: customer.uid,
              dot: presenceDot(customer.presence, !!organization?.router_configured),
            }
          }}
          renderRowActions={(row) => <CustomersTableRowActions row={row} />}
          onItemClick={(item, row) => {
            if (row) {
              setIsViewCustomerDialogOpen(true)
              setSelectedCustomer(row.original)
            }
          }}
        />
      </div>

      {/* desktop: table */}
      <div className="hidden md:block">{render}</div>

      <UpsertCustomersDialog />
      <ViewCustomersDialog />
    </div>
  )
}

function presenceDot(state?: string, routerOn = false) {
  if (state === "online") return { className: "bg-emerald-500", label: "Online" }
  if (state === "offline") return { className: "bg-red-500", label: "Offline" }
  // router connected but this customer cannot be judged (not PPPoE / router unreadable): grey dot
  return routerOn ? { className: "bg-slate-400", label: "Unknown" } : undefined
}

function shortDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
}
