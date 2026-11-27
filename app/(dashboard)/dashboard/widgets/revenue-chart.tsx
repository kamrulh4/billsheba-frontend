"use client"

import Link from "next/link"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useReportSummary } from "@/hooks/rq/use-saas-query"
import { useHydrated } from "@/hooks/use-hydrated"
import { useCan } from "@/lib/permissions"
import { useT } from "@/providers/locale-provider"

const MONTHS_SHOWN = 6

/** Money received per month, from the same numbers as the Reports page (Admin / Manager only). */
export function RevenueChart() {
  const { manage } = useCan()
  // the report endpoint refuses staff, so it is not even requested for them
  return manage ? <Chart /> : null
}

function Chart() {
  const { t, money, num, locale } = useT()
  const { data, isLoading, isError } = useReportSummary()
  const hydrated = useHydrated()
  const loading = !hydrated || isLoading

  const monthName = (key: string, style: "short" | "long") =>
    new Date(`${key}-01T00:00:00`).toLocaleDateString(
      locale === "bn" ? "bn-BD" : "en-GB",
      style === "short" ? { month: "short" } : { month: "long", year: "numeric" },
    )
  const rows = (data?.trend ?? []).slice(-MONTHS_SHOWN).map((m) => ({
    month: m.month,
    revenue: Number(m.revenue) || 0,
  }))
  // 150000 -> "150k": the axis only needs the scale, the tooltip has the exact amount
  const compact = (v: number) =>
    v >= 1000 ? `${num(Math.round(v / 100) / 10)}k` : num(v)

  if (isError) return null

  return (
    <Card className="gap-3 rounded-xl px-4 py-4 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-0">
        <div>
          <CardTitle className="text-base">{t("dash.revenueChart")}</CardTitle>
          <p className="text-muted-foreground text-xs">{t("dash.revenueChartSub")}</p>
        </div>
        <Link href="/reports" className="whitespace-nowrap text-primary text-sm">
          {t("dash.fullReport")}
        </Link>
      </CardHeader>
      <CardContent className="px-0">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <>
            <ChartContainer
              config={{
                revenue: { label: t("dash.collected"), color: "var(--primary)" },
              }}
              className="aspect-auto h-64 w-full"
            >
              <BarChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v: string) => monthName(v, "short")}
                />
                <YAxis
                  width={44}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  tickFormatter={compact}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(_, items) =>
                        monthName(String(items?.[0]?.payload?.month), "long")
                      }
                      formatter={(value) => (
                        <span className="font-semibold tabular-nums">
                          {money(Number(value))}
                        </span>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ChartContainer>
            {/* the same numbers for screen readers */}
            <table className="sr-only">
              <caption>{t("dash.revenueChart")}</caption>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.month}>
                    <th scope="row">{monthName(r.month, "long")}</th>
                    <td>{money(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  )
}
