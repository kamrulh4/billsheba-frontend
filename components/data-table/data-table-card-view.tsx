"use client"

import { type Row, type Table } from "@tanstack/react-table"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type CardItem = {
  uid: string
  title: string
  description?: string
  avatar?: string
  /** Small status dot on the avatar (e.g. online/offline). */
  dot?: { className: string; label: string }
  /** Extra line under the description (badges, chips). */
  meta?: React.ReactNode
  /** Right-aligned block before the actions (amount, status). */
  trailing?: React.ReactNode
  /** Rows with the same key sit under one header (e.g. a day); the header shows when the key changes. */
  group?: { key: string; label: string; aside?: React.ReactNode }
}

type ItemWithRow<TData> = {
  item: CardItem
  row?: Row<TData>
}

type Props<TData> = {
  items?: CardItem[]
  table?: Table<TData>
  mapRow?: (row: Row<TData>) => CardItem
  renderRowActions?: (row: Row<TData>) => React.ReactNode
  renderItemActions?: (item: CardItem) => React.ReactNode
  onItemClick?: (item: CardItem, row?: Row<TData>) => void
  loading?: boolean
}

export function DataTableCardView<TData>({
  items,
  table,
  mapRow,
  renderRowActions,
  renderItemActions,
  onItemClick,
  loading,
}: Props<TData>) {
  const list: ItemWithRow<TData>[] = React.useMemo(() => {
    if (table && mapRow) {
      return table.getFilteredRowModel().rows.map((row) => ({ item: mapRow(row), row }))
    }
    return (items || []).map((it) => ({ item: it }))
  }, [items, table, mapRow])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse space-y-3 rounded-md border bg-white p-4 shadow-sm"
          >
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 pb-28">
      {list.map(({ item, row }, index) => {
        const showGroup =
          item.group && item.group.key !== list[index - 1]?.item.group?.key
        return (
          <React.Fragment key={item.uid}>
            {showGroup && item.group && (
              <div className="flex items-baseline justify-between px-1 pt-3 text-muted-foreground text-xs">
                <span className="font-semibold text-foreground text-sm">
                  {item.group.label}
                </span>
                {item.group.aside}
              </div>
            )}
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border bg-card p-3",
                onItemClick && "cursor-pointer transition-colors active:bg-muted/60",
              )}
              onClick={() => onItemClick?.(item, row)}
            >
              {item.avatar ? (
                <div className="relative shrink-0">
                  <Avatar className="size-11 rounded-xl">
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {item.dot && (
                    <span
                      role="img"
                      aria-label={item.dot.label}
                      title={item.dot.label}
                      className={`absolute -right-1 -bottom-1 size-3 rounded-full ring-[2.5px] ring-card ${item.dot.className}`}
                    />
                  )}
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-[15px]">{item.title}</div>
                {item.description && (
                  <div className="truncate text-muted-foreground text-xs">
                    {item.description}
                  </div>
                )}
                {item.meta && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {item.meta}
                  </div>
                )}
              </div>
              {item.trailing && (
                <div className="shrink-0 text-right">{item.trailing}</div>
              )}
              <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                {row && renderRowActions
                  ? renderRowActions(row)
                  : renderItemActions
                    ? renderItemActions(item)
                    : null}
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
