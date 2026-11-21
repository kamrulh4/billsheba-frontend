"use client"

import { CheckCircle2, Router } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouterImport, useRouterImportPreview } from "@/hooks/rq/use-saas-query"
import { useT } from "@/providers/locale-provider"
import type { RouterImportResult } from "@/types/saas"

/** Pulls an ISP's existing MikroTik PPP profiles/users into BillSheba (preview first, then confirm). */
export function RouterImportButton() {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" size="sm" className="mr-2" onClick={() => setOpen(true)}>
        <Router />
        {t("routerImport.button")}
      </Button>
      {open && <RouterImportDialog onClose={() => setOpen(false)} />}
    </>
  )
}

function RouterImportDialog({ onClose }: { onClose: () => void }) {
  const { t, num } = useT()
  const preview = useRouterImportPreview(true)
  const run = useRouterImport()
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [includeDisabled, setIncludeDisabled] = useState(true)
  const [result, setResult] = useState<RouterImportResult | null>(null)

  const data = preview.data
  const willImport = data
    ? Math.min(
        data.new_customers - (includeDisabled ? 0 : data.disabled_in_new),
        data.capacity_left,
      )
    : 0

  const stats: [string, number][] = data
    ? [
        [t("routerImport.new"), data.new_customers],
        [t("routerImport.already"), data.already_imported],
        [t("routerImport.other"), data.other_services],
        [t("routerImport.disabled"), data.disabled_in_new],
      ]
    : []

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("routerImport.title")}</DialogTitle>
          <DialogDescription>{t("routerImport.desc")}</DialogDescription>
        </DialogHeader>

        {preview.isLoading && (
          <div className="space-y-2" aria-busy="true">
            <p className="text-muted-foreground text-sm">{t("routerImport.loading")}</p>
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {preview.isError && (
          <div className="space-y-3">
            <p className="text-destructive text-sm">
              {t("routerImport.error")}:{" "}
              {
                (preview.error as { response?: { data?: { message?: string } } })
                  ?.response?.data?.message
              }
            </p>
            <Button variant="outline" onClick={() => preview.refetch()}>
              {t("routerImport.retry")}
            </Button>
          </div>
        )}

        {result && (
          <div className="space-y-3 text-center">
            <CheckCircle2 className="mx-auto size-10 text-green-600" />
            <p className="font-medium">
              {t("routerImport.done", {
                c: num(result.customers_created),
                p: num(result.packages_created),
              })}
            </p>
            <p className="text-muted-foreground text-sm">{t("routerImport.nextStep")}</p>
            <Button onClick={onClose}>{t("routerImport.close")}</Button>
          </div>
        )}

        {data && !result && (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stats.map(([label, value]) => (
                <div key={label} className="rounded-lg border p-3">
                  <dd className="font-bold text-xl">{num(value)}</dd>
                  <dt className="text-muted-foreground text-xs">{label}</dt>
                </div>
              ))}
            </dl>

            {data.new_customers === 0 ? (
              <p className="rounded-md bg-muted p-3 text-sm">
                {t("routerImport.nothing")}
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{t("routerImport.packages")}</h3>
                  <p className="text-muted-foreground text-xs">
                    {t("routerImport.priceHint")}
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("routerImport.profile")}</TableHead>
                        <TableHead>{t("routerImport.speed")}</TableHead>
                        <TableHead>{t("routerImport.customers")}</TableHead>
                        <TableHead className="w-36">{t("routerImport.price")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.profiles
                        .filter((p) => p.new_customers > 0 || !p.package_exists)
                        .map((p) => (
                          <TableRow key={p.name}>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell>{num(p.speed_mbps)}</TableCell>
                            <TableCell>{num(p.new_customers)}</TableCell>
                            <TableCell>
                              {p.builtin ? (
                                <Badge variant="outline">
                                  {t("routerImport.builtin")}
                                </Badge>
                              ) : p.package_exists ? (
                                <Badge variant="secondary">
                                  {t("routerImport.exists")}
                                </Badge>
                              ) : (
                                <Input
                                  type="number"
                                  min="0"
                                  inputMode="numeric"
                                  placeholder="0"
                                  aria-label={`${t("routerImport.price")} ${p.name}`}
                                  value={prices[p.name] ?? ""}
                                  onChange={(e) =>
                                    setPrices({ ...prices, [p.name]: e.target.value })
                                  }
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                {data.disabled_in_new > 0 && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={includeDisabled}
                      onChange={(e) => setIncludeDisabled(e.target.checked)}
                    />
                    {t("routerImport.includeDisabled")}
                  </label>
                )}

                {data.exceeds_limit && (
                  <p className="rounded-md bg-amber-50 p-3 text-amber-900 text-sm dark:bg-amber-950 dark:text-amber-200">
                    {t("routerImport.overLimit", { n: num(data.capacity_left) })}
                  </p>
                )}

                <Button
                  className="w-full"
                  loading={run.isPending}
                  disabled={willImport <= 0}
                  onClick={() =>
                    run.mutate(
                      { prices, include_disabled: includeDisabled },
                      { onSuccess: setResult },
                    )
                  }
                >
                  {t("routerImport.go", { n: num(Math.max(willImport, 0)) })}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
