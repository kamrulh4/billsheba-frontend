import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/** One compact number on the dashboard. */
export function StatCard({
  title,
  value,
  icon: Icon,
  tone,
  children,
}: {
  title: string
  value: React.ReactNode
  icon: LucideIcon
  tone?: "good" | "bad"
  children?: React.ReactNode
}) {
  return (
    <Card className="h-full gap-1 rounded-xl px-4 py-3 shadow-none transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-muted-foreground text-xs leading-tight sm:text-sm">
          {title}
        </span>
        <Icon className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
      </div>
      <div
        className={cn(
          "font-bold text-xl tabular-nums sm:text-2xl",
          tone === "good" && "text-emerald-600 dark:text-emerald-400",
          tone === "bad" && "text-red-600 dark:text-red-400",
        )}
      >
        {value}
      </div>
      <div className="text-muted-foreground text-xs">{children}</div>
    </Card>
  )
}
