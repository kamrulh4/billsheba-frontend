"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const { t, p, money } = useT()
  const taka = (v: string | number | null | undefined) => money(v ?? 0)
  const { data, isLoading } = useReportSummary()

  if (isLoading || !data) return <Skeleton className="h-96 w-full" />

  const chart = data.trend.map((m) => ({
    month: m.month,
    Revenue: Number(m.revenue),
    Expense: Number(m.expense),
  }))
  const tm = data.this_month

  const stats = [
    [t("reports.revenue"), taka(tm?.revenue)],
    [t("reports.expense"), taka(tm?.expense)],
    [t("reports.profit"), taka(tm?.profit)],
    [t("reports.outstanding"), taka(data.total_outstanding)],
    [p("Discount given"), taka(tm?.discount)],
  ]

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-bold text-2xl">{value}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("reports.chart")}</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => taka(v)} />
              <Legend />
              <Bar
                dataKey="Revenue"
                fill="var(--color-chart-1, #2563eb)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Expense"
                fill="var(--color-chart-2, #f97316)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
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
