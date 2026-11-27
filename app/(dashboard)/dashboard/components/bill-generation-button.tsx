"use client"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBillGeneration } from "@/hooks/rq/use-bill-generation"
import { useT } from "@/providers/locale-provider"
import { ConfirmCodeDialog } from "./confirm-code-dialog"

export function BillGenerationButton() {
  const billGeneration = useBillGeneration()
  const { t } = useT()

  return (
    <ConfirmCodeDialog
      description={t("dash.generateBody")}
      pending={billGeneration.isPending}
      onConfirm={() => billGeneration.mutate()}
      trigger={
        <Button size="sm">
          <FileText className="h-4 w-4" />
          {billGeneration.isPending ? t("dash.generating") : t("dash.generateBills")}
        </Button>
      }
    />
  )
}
