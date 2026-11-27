"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { BadgeCheckIcon, BadgeXIcon } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Tx } from "@/components/tx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn, generateAvatarUrl, getInitials } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"
import { Customer } from "@/types/customers"
import { CustomersTableRowActions } from "./customers-table-row-actions"

const PRESENCE = {
  online: ["bg-emerald-500", "Online"],
  offline: ["bg-red-500", "Offline"],
  unknown: ["bg-slate-400", "Unknown"],
} as const

/** Green / red / grey dot on the avatar; nothing when the ISP has no router connected. */
function PresenceDot({ state }: { state?: Customer["presence"] }) {
  const { p } = useT()
  if (!state) return null
  const [style, label] = PRESENCE[state]
  return (
    <span
      role="img"
      aria-label={p(label)}
      title={p(label)}
      className={cn(
        "absolute -right-1 -bottom-1 size-3 rounded-full ring-2 ring-background",
        style,
      )}
    />
  )
}

function PresenceText({ state }: { state?: Customer["presence"] }) {
  if (!state) return "-"
  const [style, label] = PRESENCE[state]
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={cn("size-2.5 rounded-full", style)} />
      <Tx>{label}</Tx>
    </div>
  )
}

export const columns: ColumnDef<Customer>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorKey: "username",
    meta: { label: "Name" },
    accessorFn: (row) => {
      return `${row.username} ${row.name} ${row.phone}`
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 items-center">
          <div className="relative shrink-0">
            <Avatar className="rounded-md">
              <AvatarImage
                src={generateAvatarUrl(row.original.username || row.original.name)}
              />
              <AvatarFallback className="text-xs font-light">
                {getInitials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <PresenceDot state={row.original.presence} />
          </div>

          <div>
            <div className="max-w-[500px] truncate font-medium">{row.original.name}</div>
            <div className="max-w-[500px] truncate text-xs text-slate-500">
              {row.original.username}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    meta: { label: "Address" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    cell: ({ row }) => {
      return (
        <div>
          <div className="max-w-[500px] truncate font-medium">
            {row.original.address || "-"}
          </div>
          <div className="max-w-[500px] truncate text-xs text-slate-500">
            {row.original.phone}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    meta: { label: "Package" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Package" />,
    cell: ({ row }) => {
      return (
        <div>
          {row.original.package ? (
            <>
              <div className="max-w-[500px] truncate font-medium">
                {row.original.package?.name}
              </div>
              <div className="max-w-[500px] truncate text-xs text-slate-500">
                {row.original.package?.price} BDT
              </div>
            </>
          ) : (
            <div className="text-red-500">
              <Tx>Not Assigned</Tx>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "subscription_end_date",
    meta: { label: "Expiry Date" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expiry Date" />,
    cell: ({ row }) => {
      const date = row.original.subscription_end_date
      const formatted = date ? format(new Date(date), "dd MMM yyyy") : "-"
      return formatted
    },
  },
  {
    accessorKey: "connection_type",
    meta: { label: "Connection" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Connection" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    // hidden to begin with (the avatar dot says the same); the View menu can switch it on
    accessorKey: "presence",
    meta: { label: "Online" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Online" />,
    cell: ({ row }) => <PresenceText state={row.original.presence} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "is_active",
    meta: { label: "Status" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <Badge
          variant="secondary"
          className={cn(
            row.original.is_active
              ? "bg-emerald-500 text-white dark:bg-emerald-600"
              : "bg-red-500 text-white dark:bg-red-600",
          )}
        >
          {row.original.is_active ? (
            <>
              <BadgeCheckIcon /> <Tx>Active</Tx>
            </>
          ) : (
            <>
              <BadgeXIcon /> <Tx>Inactive</Tx>
            </>
          )}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) ? "true" : "false"

      return value.includes(isActive)
    },
  },
  {
    id: "actions",
    cell: CustomersTableRowActions,
  },
]
