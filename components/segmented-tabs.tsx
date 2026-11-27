"use client"

import { cn } from "@/lib/utils"

/** One-tap choice between a few views of a list (statuses, periods). */
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="no-scrollbar flex w-full items-center gap-0.5 overflow-x-auto rounded-lg bg-muted p-1 sm:w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          aria-pressed={tab.value === value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "h-7 flex-1 whitespace-nowrap rounded-md px-3 font-medium text-sm sm:flex-none",
            tab.value === value
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
