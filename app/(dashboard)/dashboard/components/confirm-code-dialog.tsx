"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useT } from "@/providers/locale-provider"

const newCode = () => String(Math.floor(10000 + Math.random() * 90000))

/** Bangla digits typed on a Bangla keyboard count the same as 0-9. */
const toAscii = (text: string) =>
  text.replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - 0x09e6)).trim()

/**
 * Confirmation for actions that touch every customer: the user has to retype a fresh 5-digit
 * number, so a stray click (or a habitual "Continue") cannot start them.
 */
export function ConfirmCodeDialog({
  trigger,
  description,
  pending,
  destructive,
  onConfirm,
}: {
  trigger: React.ReactNode
  description: string
  pending: boolean
  destructive?: boolean
  onConfirm: () => void
}) {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const [typed, setTyped] = useState("")
  const matches = toAscii(typed) === code

  const onOpenChange = (next: boolean) => {
    if (next) {
      setCode(newCode())
      setTyped("")
    }
    setOpen(next)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault()
            if (!matches || pending) return
            onConfirm()
            setOpen(false)
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="confirm-code">{t("dash.typeCode")}</Label>
            <div className="select-none rounded-lg border border-dashed bg-muted py-2 text-center font-bold font-mono text-2xl tracking-[0.4em]">
              {code}
            </div>
            <Input
              id="confirm-code"
              inputMode="numeric"
              autoComplete="off"
              maxLength={5}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="text-center font-mono text-lg tracking-[0.4em]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={!matches || pending}
              className={
                destructive ? "bg-destructive text-white hover:bg-destructive/90" : ""
              }
              onClick={(e) => {
                // the form's submit handler does the work and closes the dialog
                if (!matches) e.preventDefault()
              }}
            >
              {t("common.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
