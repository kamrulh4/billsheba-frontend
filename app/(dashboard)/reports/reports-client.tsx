"use client"

import { Banknote, Percent, Receipt, TrendingUp, Wallet } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { StatCard } from "@/app/(dashboard)/dashboard/widgets/stat-card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useReportSummary } from "@/hooks/rq/use-saas-query"
import { httpV1 } from "@/lib/xior"
import { useT } from "@/providers/locale-provider"

export function ReportsClient() {
  const { t, p, money, num, locale } = useT()
  // "-৳9,500", not "৳-9,500"
  const taka = (v: string | number | null | undefined) =>
    Number(v ?? 0) < 0 ? `-${money(Math.abs(Number(v)))}` : money(v ?? 0)
  const { data, isLoading } = useReportSummary()

  if (isLoading || !data) return <Skeleton className="h-96 w-full" />

  const chart = data.trend.map((m) => ({
    month: m.month,
    revenue: Number(m.revenue),
    expense: Number(m.expense),
  }))
  const tm = data.this_month
  const profit = Number(tm?.profit ?? 0)

  const stats = [
    { label: t("reports.revenue"), value: tm?.revenue, icon: Banknote, tone: "good" },
    { label: t("reports.expense"), value: tm?.expense, icon: Receipt },
    {
      label: t("reports.profit"),
      value: tm?.profit,
      icon: TrendingUp,
      tone: profit < 0 ? "bad" : "good",
    },
    {
      label: t("reports.outstanding"),
      value: data.total_outstanding,
      icon: Wallet,
      tone: "bad",
    },
    { label: p("Discount given"), value: tm?.discount, icon: Percent },
  ] as const

  const monthName = (key: string, style: "short" | "long") =>
    new Date(`${key}-01T00:00:00`).toLocaleDateString(
      locale === "bn" ? "bn-BD" : "en-GB",
      style === "short" ? { month: "short" } : { month: "long", year: "numeric" },
    )
  const compact = (v: number) =>
    v >= 1000 ? `${num(Math.round(v / 100) / 10)}k` : num(v)
  const series = {
    revenue: { label: p("Revenue"), theme: { light: "#2b7fff", dark: "#3b82f6" } },
    expense: { label: p("Expense"), theme: { light: "#eb6834", dark: "#d95926" } },
  }

  const download = async (path: string, filename: string) => {
    const res = await httpV1.get<Blob>(path, { responseType: "blob" })
    const url = URL.createObjectURL(res.data)
    Object.assign(document.createElement("a"), { href: url, download: filename }).click()
    URL.revokeObjectURL(url)
  }
  const exportCustomers = () => download("/customers/export", "customers.csv")
  const exportPayments = () => download("/payments/export", "payments.csv")

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("reports.title")}
        description={t("reports.sub")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportPayments}>
              {t("reports.exportPayments")}
            </Button>
            <Button variant="outline" onClick={exportCustomers}>
              {t("reports.export")}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            title={stat.label}
            value={taka(stat.value)}
            icon={stat.icon}
            tone={"tone" in stat ? stat.tone : undefined}
          />
        ))}
      </div>

      <Card className="gap-3 rounded-xl px-4 py-4 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="text-base">{t("reports.chart")}</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <ChartContainer config={series} className="aspect-auto h-72 w-full">
            <BarChart data={chart} barGap={2} margin={{ top: 8, right: 4, left: 0 }}>
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
                tickFormatter={compact}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, items) =>
                      monthName(String(items?.[0]?.payload?.month), "long")
                    }
                    formatter={(value, name) => (
                      <span className="flex w-full justify-between gap-4">
                        <span className="text-muted-foreground">
                          {series[name as keyof typeof series].label}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {taka(Number(value))}
                        </span>
                      </span>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="expense"
                fill="var(--color-expense)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("reports.defaulters")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.customer")}</TableHead>
                  <TableHead>{t("reports.unpaid")}</TableHead>
                  <TableHead className="text-right">{t("reports.owes")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.defaulters.map((d) => (
                  <TableRow key={d.customer__uid}>
                    <TableCell>
                      {d.customer__name}
                      <div className="text-muted-foreground text-xs">
                        {d.customer__phone}
                      </div>
                    </TableCell>
                    <TableCell>{d.bills}</TableCell>
                    <TableCell className="text-right">{taka(d.owed)}</TableCell>
                  </TableRow>
                ))}
                {data.defaulters.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      {t("reports.noDue")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("reports.byArea")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("reports.area")}</TableHead>
                  <TableHead>{t("nav.customers")}</TableHead>
                  <TableHead>{t("reports.active")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.by_area.map((a) => (
                  <TableRow key={a.area || "none"}>
                    <TableCell>{a.area || "— not set —"}</TableCell>
                    <TableCell>{a.customers}</TableCell>
                    <TableCell>{a.active}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
