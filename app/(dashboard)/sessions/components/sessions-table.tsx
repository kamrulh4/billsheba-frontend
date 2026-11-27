"use client"

import Link from "next/link"
import { DataTableCardView } from "@/components/data-table/data-table-card-view"
import { useDataTable } from "@/components/data-table/use-data-table"
import { Button } from "@/components/ui/button"
import { useGetActiveSessions } from "@/hooks/rq/use-sessions-query"
import { useT } from "@/providers/locale-provider"
import { useSessionsStore } from "@/stores/sessions-store"
import { columns } from "./columns"
import { SessionsTableToolbar } from "./sessions-table-toolbar"
import { ViewSessionsDialog } from "./view-sessions-dialog"

export function SessionsTable() {
  const { t } = useT()
  const { data: sessionsData, isLoading } = useGetActiveSessions()
  const { setIsViewSessionDialogOpen, setSelectedSession } = useSessionsStore()

  const { table, render } = useDataTable({
    columns,
    data: sessionsData?.sessions!,
    loading: isLoading,
  })

  if (sessionsData && sessionsData.router_configured === false) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-10 text-center">
        <p className="max-w-md text-muted-foreground">{t("sessions.noRouter")}</p>
        <Button asChild>
          <Link href="/settings?tab=router">{t("sessions.noRouterCta")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SessionsTableToolbar table={table} />

      {/* mobile: card view */}
      <div className="block md:hidden">
        <DataTableCardView
          loading={isLoading}
          table={table}
          mapRow={(row) => {
            const session = row.original
            const sessionId = session[".id"] || session["session-id"] || "unknown"
            return {
              title: session.name,
              description: session.address,
              uid: sessionId,
            }
          }}
          renderRowActions={() => null}
          onItemClick={(item, row) => {
            if (row) {
              setIsViewSessionDialogOpen(true)
              setSelectedSession(row.original)
            }
          }}
        />
      </div>

      {/* desktop: table */}
      <div className="hidden md:block">{render}</div>

      <ViewSessionsDialog />
    </div>
  )
}
