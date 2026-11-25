"use client"

import type { Column, Table } from "@tanstack/react-table"
import { EllipsisVertical, ListFilter, Plus } from "lucide-react"
import * as React from "react"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"

/** Number of active column filters, ignoring the search box's own column. */
export function activeFilterCount<TData>(table: Table<TData>, ignore: string[] = []) {
  return table
    .getState()
    .columnFilters.filter(
      (f) =>
        !ignore.includes(f.id) &&
        (Array.isArray(f.value) ? f.value.length > 0 : Boolean(f.value)),
    ).length
}

/** Clear every filter except the search box. */
export function resetFilters<TData>(table: Table<TData>, keep: string[] = []) {
  for (const f of table.getState().columnFilters) {
    if (!keep.includes(f.id)) table.getColumn(f.id)?.setFilterValue(undefined)
  }
}

type Tab = { label: string; value: string; count?: number }

/** Pill tabs under the search row: one tap applies a common filter. */
export function QuickTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
}) {
  const { p, num } = useT()
  return (
    <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
      {tabs.map((tab) => {
        const on = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              on
                ? "border-primary bg-primary font-semibold text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {p(tab.label)}
            {tab.count !== undefined && (
              <span className="ml-1.5 opacity-80">{num(tab.count)}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Filter button with the number of active filters. */
export function FilterButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="relative size-10 shrink-0 rounded-xl"
      onClick={onClick}
      aria-label="Filters"
    >
      <ListFilter />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 font-bold text-[10px] text-primary-foreground">
          {count}
        </span>
      )}
    </Button>
  )
}

/** The "⋯" button; children are DropdownMenuItems. */
export function MoreMenu({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 shrink-0 rounded-xl"
          aria-label="More"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Bottom sheet that holds all filters. */
export function FilterSheet({
  open,
  onOpenChange,
  onReset,
  resultCount,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReset: () => void
  resultCount: number
  children: React.ReactNode
}) {
  const { num } = useT()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] gap-0 overflow-y-auto rounded-t-3xl"
      >
        <SheetHeader className="flex-row items-center justify-between pr-12">
          <div>
            <SheetTitle>
              <Tx>Filters</Tx>
            </SheetTitle>
            <SheetDescription className="sr-only">
              <Tx>Filters</Tx>
            </SheetDescription>
          </div>
          <button type="button" onClick={onReset} className="text-primary text-sm">
            <Tx>Reset</Tx>
          </button>
        </SheetHeader>
        <div className="space-y-5 px-4 pb-2">{children}</div>
        <div className="p-4">
          <Button className="h-11 w-full rounded-xl" onClick={() => onOpenChange(false)}>
            <Tx>Show results</Tx> ({num(resultCount)})
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/** A labelled group of tappable chips bound to one table column (multi-select). */
export function ChipFilter<TData>({
  column,
  label,
  options,
}: {
  column?: Column<TData, unknown>
  label: string
  options: { label: string; value: string }[]
}) {
  const { p } = useT()
  if (!column || options.length === 0) return null
  const value = (column.getFilterValue() as string[] | undefined) ?? []
  const toggle = (v: string) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v]
    column.setFilterValue(next.length ? next : undefined)
  }
  return (
    <div>
      <div className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {p(label)}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              value.includes(o.value)
                ? "border-primary bg-primary/15 text-primary"
                : "text-foreground",
            )}
          >
            {p(o.label)}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Floating add button above the bottom navigation (phones only). */
export function MobileFab({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "fixed right-4 bottom-20 z-30 h-12 rounded-full px-5 shadow-lg shadow-primary/30 md:hidden",
        className,
      )}
    >
      <Plus />
      <Tx>{label}</Tx>
    </Button>
  )
}
