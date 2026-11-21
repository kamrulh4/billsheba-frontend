"use client"

import Link from "next/link"
import { useSession } from "@/hooks/rq/use-auth-query"
import { contactInfo } from "@/lib/site-config"
import { useT } from "@/providers/locale-provider"

const DAY = 24 * 60 * 60 * 1000

/** Nudges ISPs near the end of their trial / paid period; warns once read-only. */
export function SubscriptionBanner() {
  const { data: session } = useSession()
  const { t } = useT()
  const org = session?.organization
  if (!org || session.kind === "SUPER_ADMIN" || !org.subscription_end_date) return null

  const daysLeft = Math.ceil(
    (new Date(org.subscription_end_date).getTime() - Date.now()) / DAY,
  )
  const expired = daysLeft < 0 || org.subscription_status === "EXPIRED"
  const trial = org.subscription_status === "TRIAL"
  if (!expired && !(trial || daysLeft <= 7)) return null

  const message = expired
    ? t("banner.expired")
    : trial
      ? t("banner.trial", { n: daysLeft })
      : t("banner.ends", { n: daysLeft })

  return (
    <div
      role="status"
      className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm ${
        expired
          ? "bg-destructive text-white"
          : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
      }`}
    >
      <span>{message}</span>
      <span className="flex gap-3 font-medium">
        <Link href="/billing" className="underline">
          {t("banner.renew")}
        </Link>
        <a href={`tel:${contactInfo.phoneIntl}`} className="underline">
          Call {contactInfo.phone}
        </a>
      </span>
    </div>
  )
}
