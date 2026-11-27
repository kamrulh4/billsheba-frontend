"use client"
import { TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDeactivateDueCustomersTask } from "@/hooks/rq/use-deactivate-due-customers"
import { useT } from "@/providers/locale-provider"
import { ConfirmCodeDialog } from "./confirm-code-dialog"

export function DeactivateDueCustomersButton() {
  const deactivateDueCustomers = useDeactivateDueCustomersTask()
  const { t } = useT()

  return (
    <ConfirmCodeDialog
      description={t("dash.suspendBody")}
      pending={deactivateDueCustomers.isPending}
      destructive
      onConfirm={() => deactivateDueCustomers.mutate()}
      trigger={
        <Button
          size="sm"
          variant="outline"
          className="border-destructive/40 text-destructive hover:text-destructive"
        >
          <TrashIcon className="h-4 w-4" />
          {deactivateDueCustomers.isPending ? t("dash.suspending") : t("dash.suspendDue")}
        </Button>
      }
    />
  )
}
