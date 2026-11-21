"use client"

import { useQuery } from "@tanstack/react-query"
import { Check, Circle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getDashboardDataOptions } from "@/hooks/rq/use-dashboard-query"
import { myOrganizationOptions } from "@/hooks/rq/use-saas-query"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"

const DISMISS_KEY = "onboarding-dismissed"

/** Guides a brand-new ISP through the four steps that get billing started. */
export function OnboardingChecklist() {
  const { t, num } = useT()
  const dashboard = useQuery(getDashboardDataOptions())
  const org = useQuery(myOrganizationOptions())
  const [dismissed, setDismissed] = useState(true) // hidden until we know

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1")
    } catch {
      setDismissed(false)
    }
  }, [])

  if (!dashboard.data || !org.data || dismissed) return null

  const hasNumbers = !!(
    org.data.bkash_number ||
    org.data.nagad_number ||
    org.data.rocket_number
  )
  const steps = [
    {
      done: dashboard.data.total_packages > 0,
      title: t("dash.step.package"),
      hint: t("dash.step.packageHint"),
      href: "/packages",
    },
    {
      done: dashboard.data.total_customers > 0,
      title: t("dash.step.customer"),
      hint: t("dash.step.customerHint"),
      href: "/customers",
    },
    {
      done: hasNumbers,
      title: t("dash.step.payment"),
      hint: t("dash.step.paymentHint"),
      href: "/settings",
    },
    {
      done: hasNumbers && dashboard.data.total_customers > 0,
      title: t("dash.step.portal"),
      hint: t("dash.step.portalHint"),
      href: "/settings",
    },
  ]
  const completed = steps.filter((s) => s.done).length
  if (completed === steps.length) return null

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {}
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{t("dash.welcome")}</CardTitle>
            <CardDescription>{t("dash.checklistSub")}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={dismiss}>
            {t("dash.dismiss")}
          </Button>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Progress value={(completed / steps.length) * 100} className="h-2" />
          <span className="whitespace-nowrap text-muted-foreground text-xs">
            {num(completed)}/{num(steps.length)} {t("dash.progress")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.title}
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-background p-3",
              step.done && "opacity-60",
            )}
          >
            {step.done ? (
              <Check className="size-5 shrink-0 text-green-600" />
            ) : (
              <Circle className="size-5 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <p className={cn("font-medium text-sm", step.done && "line-through")}>
                {step.title}
              </p>
              <p className="truncate text-muted-foreground text-xs">{step.hint}</p>
            </div>
            {!step.done && (
              <Button asChild size="sm" variant="outline">
                <Link href={step.href}>{t("dash.step.go")}</Link>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
