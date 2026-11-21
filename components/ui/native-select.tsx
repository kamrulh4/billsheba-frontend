import * as React from "react"
import { cn } from "@/lib/utils"

/** Lightweight <select> styled like <Input/> for simple filter/form fields. */
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { NativeSelect }
