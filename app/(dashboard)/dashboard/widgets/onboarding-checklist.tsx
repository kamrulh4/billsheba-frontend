"use client"

import { useQuery } from "@tanstack/react-query"
import { Check, ChevronDown, Circle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  const [expanded, setExpanded] = useState(false)

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
      href: "/settings?tab=payments",
    },
    {
      done: hasNumbers && dashboard.data.total_customers > 0,
      title: t("dash.step.portal"),
      hint: t("dash.step.portalHint"),
      href: "/settings?tab=payments",
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

  const next = steps.find((s) => !s.done)

  return (
    <Card className="gap-3 border-primary/30 bg-primary/5 px-4 py-3 shadow-none">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span className="whitespace-nowrap font-semibold">
          👋 {t("dash.setup")} {num(completed)}/{num(steps.length)}
        </span>
        <Progress value={(completed / steps.length) * 100} className="h-1.5 w-24" />
        {next && !expanded && (
          <>
            <span className="min-w-0 flex-1 basis-48 truncate">
              <span className="text-muted-foreground">{t("dash.nextStep")}: </span>
              <span className="font-medium">{next.title}</span>
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href={next.href}>{t("dash.step.go")}</Link>
            </Button>
          </>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            {t("dash.allSteps")}
            <ChevronDown className={cn(expanded && "rotate-180")} />
          </Button>
          <Button variant="ghost" size="sm" onClick={dismiss}>
            {t("dash.dismiss")}
          </Button>
        </div>
      </div>
      {expanded && (
        <CardContent className="grid grid-cols-1 gap-2 px-0 sm:grid-cols-2">
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
      )}
    </Card>
  )
}
