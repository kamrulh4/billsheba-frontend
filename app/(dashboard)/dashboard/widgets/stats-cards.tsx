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
import { useT } from "@/providers/locale-provider"
import type { DashboardResponse } from "@/types/dashboard"
import { SmsStatCard } from "./sms-stat-card"
import { StatCard } from "./stat-card"

export function StatsCards({ data }: { data: DashboardResponse | null }) {
  const { t, num, money } = useT()
  const n = (v: number | undefined) => (v === undefined ? "–" : num(v))

  const stats = [
    {
      title: t("dash.totalCustomers"),
      value: n(data?.total_customers),
      icon: Users,
      subtitle: `${n(data?.new_customers_this_month)} ${t("dash.newThisMonth")}`,
    },
    {
      title: t("dash.collectedMonth"),
      value: money(data?.current_month_collection ?? 0),
      icon: CreditCard,
      tone: "good" as const,
      subtitle: `${n(data?.current_month_payments)} ${t("dash.paymentsPaid")}`,
    },
    {
      title: t("dash.pendingMonth"),
      value: money(data?.current_month_pending_amount ?? 0),
      icon: Clock,
      tone: "bad" as const,
      subtitle: `${n(data?.pending_payments)} ${t("dash.unpaidTotal")}`,
    },
    {
      title: t("dash.totalRevenue"),
      value: money(data?.total_revenue ?? 0),
      icon: TrendingUp,
      subtitle: t("dash.fromPaid"),
    },
    {
      title: t("dash.activeCustomers"),
      value: n(data?.active_customers),
      icon: UserCheck,
      subtitle: `${n(data?.inactive_customers)} ${t("dash.inactive")}`,
    },
    {
      title: t("dash.packages"),
      value: n(data?.total_packages),
      icon: Package,
      subtitle: t("dash.servicePackages"),
    },
    {
      title: t("dash.totalPayments"),
      value: n(data?.total_payments),
      icon: DollarSign,
      subtitle: t("dash.allPayments"),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          tone={stat.tone}
        >
          {stat.subtitle}
        </StatCard>
      ))}
      <SmsStatCard />
    </div>
  )
}
