"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useReceipt } from "@/hooks/rq/use-saas-query"
import { phrase } from "@/lib/i18n/phrase-book"
import { useT } from "@/providers/locale-provider"

function Row({
  label,
  value,
  strong,
}: {
  label: string
  value: React.ReactNode
  strong?: boolean
}) {
  return (
    <div
      className={`flex justify-between gap-4 py-1.5 text-sm ${strong ? "font-semibold" : ""}`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  )
}

/** A4-friendly receipt; the toolbar disappears when printing. */
export function ReceiptClient({ uid }: { uid: string }) {
  const { t, p, money, locale } = useT()
  const { data: r, isLoading, isError } = useReceipt(uid)

  if (isLoading) return <Skeleton className="mx-auto mt-10 h-96 max-w-md" />
  if (isError || !r)
    return (
      <p className="p-10 text-center text-muted-foreground">{t("common.noResults")}</p>
    )

  const month =
    locale === "bn"
      ? phrase(r.billing_month[0] + r.billing_month.slice(1).toLowerCase())
      : r.billing_month
  const date = r.payment_date ? new Date(r.payment_date).toLocaleString("en-GB") : "—"

  return (
    <div className="mx-auto max-w-md p-4 print:p-0">
      <div className="mb-4 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer /> {t("receipt.print")}
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6 print:border-0 print:shadow-none">
        <div className="border-b pb-4 text-center">
          <h1 className="font-bold text-xl">{r.organization.name}</h1>
          {r.organization.address && (
            <p className="text-muted-foreground text-xs">{r.organization.address}</p>
          )}
          <p className="text-muted-foreground text-xs">{r.organization.phone}</p>
        </div>

        <div className="flex items-center justify-between py-3">
          <h2 className="font-semibold">{t("receipt.title")}</h2>
          <span
            className={`rounded px-2 py-0.5 font-bold text-xs ${
              r.paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
            }`}
          >
            {r.paid ? t("receipt.status.paid") : t("receipt.status.partial")}
          </span>
        </div>

        <Row label={t("receipt.no")} value={r.receipt_no} />
        <Row label={t("receipt.date")} value={date} />
        <div className="my-2 border-t" />
        <Row label={t("receipt.customer")} value={r.customer.name} />
        <Row label={t("auth.phone")} value={r.customer.phone} />
        <Row label={t("settings.username")} value={r.customer.username} />
        {r.customer.package && (
          <Row label={t("portal.package")} value={r.customer.package} />
        )}
        <div className="my-2 border-t" />
        <Row label={t("receipt.period")} value={`${month} ${r.billing_year}`} />
        <Row label={t("receipt.bill")} value={money(r.bill_amount)} />
        {Number(r.discount) > 0 && (
          <Row label={p("Discount")} value={`− ${money(r.discount)}`} />
        )}
        <Row label={t("receipt.paid")} value={money(r.amount)} strong />
        {Number(r.due) > 0 && (
          <Row label={t("receipt.due")} value={money(r.due)} strong />
        )}
        <div className="my-2 border-t" />
        <Row label={t("receipt.method")} value={r.payment_method} />
        {r.transaction_id && (
          <Row
            label={t("receipt.trx")}
            value={<span className="font-mono text-xs">{r.transaction_id}</span>}
          />
        )}
        {r.received_by && <Row label={t("receipt.receivedBy")} value={r.received_by} />}

        <p className="mt-6 text-center text-muted-foreground text-xs">
          {t("receipt.thanks")}
        </p>
      </div>
    </div>
  )
}
