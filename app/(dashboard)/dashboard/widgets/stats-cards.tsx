"use client"

import {
  Clock,
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useT } from "@/providers/locale-provider"
import type { DashboardResponse } from "@/types/dashboard"

export function StatsCards({ data }: { data: DashboardResponse | null }) {
  const { t, num, money } = useT()
  const n = (v: number | undefined) => (v === undefined ? "–" : num(v))

  const stats = [
    {
      title: t("dash.totalCustomers"),
      value: n(data?.total_customers),
      icon: Users,
      subtitle: t("dash.registered"),
    },
    {
      title: t("dash.activeCustomers"),
      value: n(data?.active_customers),
      icon: UserCheck,
      subtitle: t("dash.currentlyActive"),
    },
    {
      title: t("dash.packages"),
      value: n(data?.total_packages),
      icon: Package,
      subtitle: t("dash.servicePackages"),
    },
    {
      title: t("dash.totalRevenue"),
      value: money(data?.total_revenue ?? 0),
      icon: TrendingUp,
      subtitle: t("dash.fromPaid"),
    },
    {
      title: t("dash.totalPayments"),
      value: n(data?.total_payments),
      icon: DollarSign,
      subtitle: t("dash.allPayments"),
    },
    {
      title: t("dash.pendingPayments"),
      value: n(data?.pending_payments),
      icon: Clock,
      subtitle: t("dash.pendingThisMonth"),
    },
    {
      title: t("dash.pendingRevenue"),
      value: money(data?.current_month_pending_amount ?? 0),
      icon: Clock,
      subtitle: t("dash.awaiting"),
    },
    {
      title: t("dash.monthPayments"),
      value: n(data?.current_month_payments),
      icon: CreditCard,
      subtitle: `${t("dash.paidThisMonth")} ${money(data?.current_month_paid_amount ?? 0)}`,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="flex min-h-[132px] flex-col justify-between rounded-xl border px-6 py-4 shadow-none transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardContent className="px-0 pt-2 pb-0">
            <div className="mb-1 font-bold text-3xl tabular-nums">{stat.value}</div>
            <div className="text-muted-foreground text-sm">{stat.subtitle}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
