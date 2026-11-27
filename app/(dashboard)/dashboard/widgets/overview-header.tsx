"use client"

import { useCan } from "@/lib/permissions"
import { useT } from "@/providers/locale-provider"
import { BillGenerationButton } from "../components/bill-generation-button"
import { DeactivateDueCustomersButton } from "../components/deactivate-due-users-button"

/** "Overview · month" with the two month-end actions (Admin / Manager only). */
export function OverviewHeader() {
  const { t, locale } = useT()
  const { manage } = useCan()
  const month = new Date().toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
    month: "long",
    year: "numeric",
  })
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-bold text-xl">
        {t("dash.overview")}{" "}
        <span
          className="font-normal text-muted-foreground text-sm"
          suppressHydrationWarning
        >
          · {month}
        </span>
      </h2>
      {manage && (
        <div className="flex flex-wrap gap-2">
          <BillGenerationButton />
          <DeactivateDueCustomersButton />
        </div>
      )}
    </div>
  )
}
