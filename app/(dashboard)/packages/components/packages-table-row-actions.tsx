"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React, { useState } from "react"
import { DeleteAlertDialog } from "@/components/core/delete-alert-dialog"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeletePackage } from "@/hooks/rq/use-packages-query"
import { useCan } from "@/lib/permissions"
import { usePackagesStore } from "@/stores/packages-store"
import { Package } from "@/types/packages"

interface PackagesTableRowActionsProps {
  row: Row<Package>
}

export function PackagesTableRowActions({ row }: PackagesTableRowActionsProps) {
  const {
    setPackageMutationType,
    setIsUpsertPackageDialogOpen,
    setIsViewPackageDialogOpen,
    setSelectedPackage,
  } = usePackagesStore()

  const [open, setOpen] = useState(false)
  const { manage } = useCan()

  const { mutate: triggerDeletePackage, isPending } = useDeletePackage()

  function onDeleteHandler() {
    triggerDeletePackage(row.original.uid)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">
              <Tx>Open menu</Tx>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setIsViewPackageDialogOpen(true)
              setSelectedPackage(row.original)
            }}
          >
            <Tx>View</Tx>
          </DropdownMenuItem>
          {manage && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setIsUpsertPackageDialogOpen(true)
                  setPackageMutationType("edit")
                  setSelectedPackage(row.original)
                }}
              >
                <Tx>Edit</Tx>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setOpen(true)
                }}
              >
                <Tx>Delete</Tx>
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAlertDialog
        open={open}
        setOpen={setOpen}
        resource="package"
        onDelete={onDeleteHandler}
        loading={isPending}
      />
    </>
  )
}
