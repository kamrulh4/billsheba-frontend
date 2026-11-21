"use client"
import { TrashIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeactivateDueCustomersTask } from "@/hooks/rq/use-deactivate-due-customers"
import { useT } from "@/providers/locale-provider"

export function DeactivateDueCustomersButton() {
  const deactivateDueCustomers = useDeactivateDueCustomersTask()
  const { t } = useT()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="link">
          <TrashIcon className="h-4 w-4" />
          {deactivateDueCustomers.isPending ? t("dash.suspending") : t("dash.suspendDue")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{t("dash.suspendBody")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deactivateDueCustomers.mutate()}
            disabled={deactivateDueCustomers.isPending}
          >
            {t("common.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
