"use client"
import { FileText } from "lucide-react"
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
import { useBillGeneration } from "@/hooks/rq/use-bill-generation"
import { useT } from "@/providers/locale-provider"

export function BillGenerationButton() {
  const billGeneration = useBillGeneration()
  const { t } = useT()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="link">
          <FileText className="h-4 w-4" />
          {billGeneration.isPending ? t("dash.generating") : t("dash.generateBills")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{t("dash.generateBody")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => billGeneration.mutate()}
            disabled={billGeneration.isPending}
          >
            {t("common.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
