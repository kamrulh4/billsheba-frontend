"use client"

import type { Row } from "@tanstack/react-table"
import { Plus, SearchIcon } from "lucide-react"
import { useState } from "react"
import { MobileFab } from "@/components/data-table/mobile-ui"
import { PageHeader } from "@/components/page-header"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetPackageList } from "@/hooks/rq/use-packages-query"
import { useHydrated } from "@/hooks/use-hydrated"
import { useCan } from "@/lib/permissions"
import { useT } from "@/providers/locale-provider"
import { usePackagesStore } from "@/stores/packages-store"
import type { Package } from "@/types/packages"
import { PackagesTableRowActions } from "./packages-table-row-actions"
import { RouterProfilesButton } from "./router-profiles-dialog"
import { UpsertPackagesDialog } from "./upsert-packages-dialog"
import { ViewPackagesDialog } from "./view-packages-dialog"

/** The ISP's packages as price cards (a handful of them, so no table or paging is needed). */
export function PackagesTable() {
  const { data, isLoading } = useGetPackageList()
  const hydrated = useHydrated()
  const { manage } = useCan()
  const { p, money, num } = useT()
  const [search, setSearch] = useState("")
  const {
    setIsViewPackageDialogOpen,
    setSelectedPackage,
    setIsUpsertPackageDialogOpen,
    setPackageMutationType,
  } = usePackagesStore()

  const loading = !hydrated || isLoading
  const text = (pkg: Package) =>
    `${pkg.name} ${pkg.mikrotik_profile ?? ""} ${pkg.speed_mbps} ${pkg.price} ${pkg.description ?? ""}`
  const packages = (data?.results ?? []).filter((pkg) =>
    text(pkg).toLowerCase().includes(search.trim().toLowerCase()),
  )
  const add = () => {
    setPackageMutationType("add")
    setIsUpsertPackageDialogOpen(true)
  }

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <PageHeader
        title={p("Packages")}
        actions={
          manage && (
            <div className="flex flex-wrap items-center gap-2">
              <RouterProfilesButton />
              <Button className="hidden md:inline-flex" onClick={add}>
                <Plus />
                <Tx>Add Package</Tx>
              </Button>
            </div>
          )
        }
      />

      <InputGroup className="h-9 w-full sm:w-72">
        <InputGroupInput
          placeholder={p("Search...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">{p("No results.")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {packages.map((pkg) => (
            // biome-ignore lint/a11y/useSemanticElements: holds its own menu button
            <div
              key={pkg.uid}
              role="button"
              tabIndex={0}
              onClick={() => {
                setSelectedPackage(pkg)
                setIsViewPackageDialogOpen(true)
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" || e.target !== e.currentTarget) return
                setSelectedPackage(pkg)
                setIsViewPackageDialogOpen(true)
              }}
              className="flex cursor-pointer flex-col gap-1 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold">{pkg.name}</span>
                {/* clicks in the menu must not also open the card */}
                <span
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <PackagesTableRowActions row={{ original: pkg } as Row<Package>} />
                </span>
              </div>
              <div className="font-bold text-2xl tabular-nums">
                {money(Number(pkg.price))}
              </div>
              <div className="text-muted-foreground text-xs">
                {num(pkg.speed_mbps)} Mbps
              </div>
              <div className="truncate text-muted-foreground text-xs">
                <Tx>Router profile</Tx>:{" "}
                <span className="font-mono">{pkg.mikrotik_profile || pkg.name}</span>
              </div>
              {pkg.description && (
                <div className="line-clamp-2 text-muted-foreground text-xs">
                  {pkg.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {manage && <MobileFab label="Add Package" onClick={add} />}

      <UpsertPackagesDialog />
      <ViewPackagesDialog />
    </div>
  )
}
