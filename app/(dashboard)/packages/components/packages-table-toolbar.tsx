"use client"

import { Table } from "@tanstack/react-table"
import { Plus, X } from "lucide-react"
import { DataTableSearch } from "@/components/data-table/data-table-search"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import { usePackagesStore } from "@/stores/packages-store"
import { RouterProfilesButton } from "./router-profiles-dialog"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function PackagesTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { setPackageMutationType, setIsUpsertPackageDialogOpen } = usePackagesStore()

  return (
    <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-2">
      <div className="flex flex-1 items-center flex-wrap gap-2">
        {/* <Select defaultValue="name" onValueChange={setSearchField}>
          <SelectTrigger size="sm" className="w-full md:w-[120px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name"><Tx>Name</Tx></SelectItem>
            <SelectItem value="speed_mbps"><Tx>Speed</Tx></SelectItem>
            <SelectItem value="price"><Tx>Price</Tx></SelectItem>
            <SelectItem value="description"><Tx>Description</Tx></SelectItem>
          </SelectContent>
        </Select> */}

        <DataTableSearch table={table} searchField="name" />

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

      <RouterProfilesButton />
      <Button
        onClick={() => {
          setIsUpsertPackageDialogOpen(true)
          setPackageMutationType("add")
        }}
        size="sm"
        className="md:mr-2"
      >
        <Plus />
        <Tx>Add Package</Tx>
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  )
}
