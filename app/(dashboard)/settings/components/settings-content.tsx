"use client"

import { Copy } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { SmsCounter } from "@/components/sms-counter"
import { SmsUsage } from "@/components/sms-usage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  useMyOrganization,
  useTestBkash,
  useTestRouter,
  useUpdateMyOrganization,
} from "@/hooks/rq/use-saas-query"
import { DEFAULT_TEMPLATES, MAX_TEMPLATE_SEGMENTS, sampleMessage } from "@/lib/sms"
import { toast } from "@/lib/toast"
import { useT } from "@/providers/locale-provider"
import type { OrganizationSettings } from "@/types/saas"

const TABS = ["profile", "payments", "sms", "router"]

type Draft = Partial<OrganizationSettings> & {
  router_password?: string
  router_secret?: string
  bkash_app_key?: string
  bkash_app_secret?: string
  bkash_username?: string
  bkash_password?: string
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  )
}

export function SettingsContent() {
  const { t } = useT()
  const { data: org, isLoading } = useMyOrganization()
  const save = useUpdateMyOrganization()
  const testRouter = useTestRouter()
  const testBkash = useTestBkash()
  const [draft, setDraft] = useState<Draft>({})
  const requested = useSearchParams().get("tab") ?? ""
  const tab = TABS.includes(requested) ? requested : "profile"
  // the open tab lives in the address, so a reload or a link lands on the same one
  const openTab = (next: string) => window.history.replaceState(null, "", `?tab=${next}`)

  useEffect(() => {
    if (org)
      setDraft({
        ...org,
        router_password: "",
        router_secret: "",
        bkash_app_key: "",
        bkash_app_secret: "",
        bkash_username: "",
        bkash_password: "",
      })
  }, [org])

  if (isLoading || !org) return <Skeleton className="h-96 w-full" />

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))
  const text = (key: keyof Draft, props: React.ComponentProps<typeof Input> = {}) => (
    <Input
      value={(draft[key] as string | number | undefined) ?? ""}
      onChange={(e) => set(key, e.target.value as never)}
      {...props}
    />
  )

  const portalUrl =
    typeof window !== "undefined" ? `${window.location.origin}/portal/${org.slug}` : ""

  const submit = (keys: (keyof Draft)[]) => () => {
    const body: Record<string, unknown> = {}
    for (const k of keys) {
      const v = draft[k]
      // blank secrets mean "leave unchanged"
      if (
        [
          "router_password",
          "router_secret",
          "bkash_app_key",
          "bkash_app_secret",
          "bkash_username",
          "bkash_password",
        ].includes(k) &&
        !v
      )
        continue
      body[k] = v
    }
    save.mutate(body)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title={t("settings.title")} description={t("settings.sub")} />

      <Tabs value={tab} onValueChange={openTab} className="gap-4">
        <TabsList className="grid h-10 w-full grid-cols-4 sm:w-fit sm:min-w-md">
          <TabsTrigger value="profile">{t("settings.tabProfile")}</TabsTrigger>
          <TabsTrigger value="payments">{t("settings.tabPayments")}</TabsTrigger>
          <TabsTrigger value="sms">{t("settings.tabSms")}</TabsTrigger>
          <TabsTrigger value="router">{t("settings.tabRouter")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {t("settings.subscription")}
                <Badge
                  variant={
                    org.subscription_status === "EXPIRED" ? "destructive" : "secondary"
                  }
                >
                  {org.subscription_status}
                </Badge>
              </CardTitle>
              <CardDescription>
                {org.subscription_end_date
                  ? `Valid until ${org.subscription_end_date}`
                  : "No end date"}{" "}
                · {org.total_customer} / {org.allowed_customer || "plan limit"} customers.{" "}
              </CardDescription>
              <div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/billing">{t("settings.renew")}</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("settings.profile")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label={t("settings.ispName")}>{text("name")}</Field>
              <Field label={t("settings.phone")}>{text("phone")}</Field>
              <Field label={t("auth.email")}>{text("email", { type: "email" })}</Field>
              <Field label={t("settings.website")}>{text("website")}</Field>
              <div className="sm:col-span-2">
                <Field label={t("auth.address").replace(/ \(.*\)/, "")}>
                  {text("address")}
                </Field>
              </div>
              <Field label={t("settings.billingCycle")}>
                <NativeSelect
                  value={draft.billing_cycle ?? "MONTHLY"}
                  onChange={(e) => set("billing_cycle", e.target.value)}
                >
                  <option value="MONTHLY">{t("settings.monthly")}</option>
                  <option value="DAYS_30">{t("settings.rolling")}</option>
                </NativeSelect>
              </Field>
              <Field label={t("settings.suspendAfter")} hint={t("settings.suspendHint")}>
                {text("due_day", { type: "number", min: 1, max: 28 })}
              </Field>
              <div className="sm:col-span-2">
                <Button
                  loading={save.isPending}
                  onClick={submit([
                    "name",
                    "phone",
                    "email",
                    "website",
                    "address",
                    "billing_cycle",
                    "due_day",
                  ])}
                >
                  {t("settings.saveProfile")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("settings.portal")}</CardTitle>
              <CardDescription>{t("settings.portalSub")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input readOnly value={portalUrl} />
                <Button
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(portalUrl)
                      .then(() => toast.success(t("settings.linkCopied")))
                  }
                >
                  <Copy /> {t("common.copy")}
                </Button>
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  disabled={!org.sms_feature}
                  checked={!!draft.portal_otp_required}
                  onChange={(e) => set("portal_otp_required", e.target.checked)}
                />
                <span>
                  {t("settings.otp")}
                  <span className="block text-muted-foreground text-xs">
                    {t("settings.otpHint")}
                  </span>
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="bKash number">{text("bkash_number")}</Field>
                <Field label="Nagad number">{text("nagad_number")}</Field>
                <Field label="Rocket number">{text("rocket_number")}</Field>
              </div>
              <Button
                loading={save.isPending}
                onClick={submit([
                  "bkash_number",
                  "nagad_number",
                  "rocket_number",
                  "portal_otp_required",
                ])}
              >
                {t("settings.savePayNumbers")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {t("settings.bkash")}
                <Badge variant={org.bkash_configured ? "secondary" : "outline"}>
                  {org.bkash_configured
                    ? t("settings.configured")
                    : t("settings.notConnected")}
                </Badge>
              </CardTitle>
              <CardDescription>{t("settings.bkashSub")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("settings.bkashKey")}
                hint={org.bkash_configured ? t("settings.bkashKeep") : undefined}
              >
                {text("bkash_app_key", { autoComplete: "off" })}
              </Field>
              <Field
                label={t("settings.bkashSecret")}
                hint={org.bkash_configured ? t("settings.bkashKeep") : undefined}
              >
                {text("bkash_app_secret", {
                  type: "password",
                  autoComplete: "new-password",
                })}
              </Field>
              <Field
                label={t("settings.bkashUser")}
                hint={org.bkash_configured ? t("settings.bkashKeep") : undefined}
              >
                {text("bkash_username", { autoComplete: "off" })}
              </Field>
              <Field
                label={t("settings.bkashPass")}
                hint={org.bkash_configured ? t("settings.bkashKeep") : undefined}
              >
                {text("bkash_password", {
                  type: "password",
                  autoComplete: "new-password",
                })}
              </Field>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={!!draft.bkash_sandbox}
                  onChange={(e) => set("bkash_sandbox", e.target.checked)}
                />
                {t("settings.bkashSandbox")}
              </label>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>{t("settings.bkashCallback")}</Label>
                <Input
                  readOnly
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/api/v1/portal/bkash/callback`
                      : ""
                  }
                />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button
                  loading={save.isPending}
                  onClick={submit([
                    "bkash_app_key",
                    "bkash_app_secret",
                    "bkash_username",
                    "bkash_password",
                    "bkash_sandbox",
                  ])}
                >
                  {t("settings.saveBkash")}
                </Button>
                <Button
                  variant="outline"
                  loading={testBkash.isPending}
                  disabled={!org.bkash_configured}
                  onClick={() =>
                    testBkash.mutate(undefined, {
                      onSuccess: () => toast.success(t("settings.bkashOk")),
                    })
                  }
                >
                  {t("settings.testBkash")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("settings.smsTemplates")}</CardTitle>
              <CardDescription>
                {org.sms_feature ? t("settings.smsHint") : t("settings.smsOff")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SmsUsage used={org.sms_used ?? 0} limit={org.sms_limit ?? 0} />
              {(
                [
                  ["bill_sms_template", t("settings.tplBill")],
                  ["payment_sms_template", t("settings.tplPayment")],
                  ["suspend_sms_template", t("settings.tplSuspend")],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  <Textarea
                    rows={2}
                    value={(draft[key] as string) ?? ""}
                    placeholder={
                      DEFAULT_TEMPLATES[
                        key.split("_")[0] as keyof typeof DEFAULT_TEMPLATES
                      ]
                    }
                    onChange={(e) => set(key, e.target.value)}
                  />
                  <SmsCounter
                    max={MAX_TEMPLATE_SEGMENTS}
                    text={sampleMessage(
                      ((draft[key] as string) ||
                        DEFAULT_TEMPLATES[
                          key.split("_")[0] as keyof typeof DEFAULT_TEMPLATES
                        ]) as string,
                      org.name ?? "",
                    )}
                  />
                </Field>
              ))}
              <Button
                loading={save.isPending}
                onClick={submit([
                  "bill_sms_template",
                  "payment_sms_template",
                  "suspend_sms_template",
                ])}
              >
                {t("settings.saveTemplates")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="router" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {t("settings.router")}
                <Badge variant={org.router_configured ? "secondary" : "outline"}>
                  {org.router_configured
                    ? t("settings.configured")
                    : t("settings.notConnected")}
                </Badge>
              </CardTitle>
              <CardDescription>{t("settings.routerSub")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label={t("settings.routerAddr")} hint={t("settings.routerHint")}>
                {text("router_ip")}
              </Field>
              <Field label={t("settings.username")}>{text("router_username")}</Field>
              <Field
                label={t("auth.password")}
                hint={org.router_configured ? t("settings.keepPassword") : undefined}
              >
                {text("router_password", {
                  type: "password",
                  autoComplete: "new-password",
                })}
              </Field>
              <Field label={t("settings.port")}>
                {text("router_port", { type: "number" })}
              </Field>
              <div className="flex gap-2 sm:col-span-2">
                <Button
                  loading={save.isPending}
                  onClick={submit([
                    "router_ip",
                    "router_username",
                    "router_password",
                    "router_port",
                  ])}
                >
                  {t("settings.saveRouter")}
                </Button>
                <Button
                  variant="outline"
                  loading={testRouter.isPending}
                  disabled={!org.router_configured}
                  onClick={() => testRouter.mutate()}
                >
                  {t("settings.test")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
