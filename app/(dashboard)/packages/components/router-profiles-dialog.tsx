"use client"

import { Router } from "lucide-react"
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
import {
  useCreatePackagesFromProfiles,
  useMyOrganization,
  useRouterProfiles,
} from "@/hooks/rq/use-saas-query"
import { toast } from "@/lib/toast"
import { useT } from "@/providers/locale-provider"

/** Turns the PPP profiles already on the ISP's router into packages (no customers involved). */
export function RouterProfilesButton() {
  const { t } = useT()
  const { data: organization } = useMyOrganization()
  const [open, setOpen] = useState(false)
  if (!organization?.router_configured) return null
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="md:mr-2"
        onClick={() => setOpen(true)}
      >
        <Router />
        {t("profiles.button")}
      </Button>
      {open && <ProfilesDialog onClose={() => setOpen(false)} />}
    </>
  )
}

function ProfilesDialog({ onClose }: { onClose: () => void }) {
  const { t, num } = useT()
  const profiles = useRouterProfiles(true)
  const create = useCreatePackagesFromProfiles()
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const [prices, setPrices] = useState<Record<string, string>>({})

  const rows = (profiles.data ?? []).filter((p) => !p.builtin || p.package)
  const chosen = rows.filter((p) => picked[p.name] && !p.package)

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("profiles.title")}</DialogTitle>
          <DialogDescription>{t("profiles.desc")}</DialogDescription>
        </DialogHeader>

        {profiles.isLoading && (
          <div className="space-y-2" aria-busy="true">
            <p className="text-muted-foreground text-sm">{t("profiles.loading")}</p>
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        {profiles.isError && (
          <p className="text-destructive text-sm">
            {
              (profiles.error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message
            }
          </p>
        )}
        {profiles.data && rows.length === 0 && (
          <p className="text-muted-foreground text-sm">{t("profiles.none")}</p>
        )}

        {rows.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>{t("routerImport.profile")}</TableHead>
                  <TableHead>{t("routerImport.speed")}</TableHead>
                  <TableHead className="w-32">{t("routerImport.price")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>
                      <input
                        type="checkbox"
                        aria-label={p.name}
                        disabled={!!p.package}
                        checked={!!picked[p.name]}
                        onChange={(e) =>
                          setPicked({ ...picked, [p.name]: e.target.checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{num(p.speed_mbps)}</TableCell>
                    <TableCell>
                      {p.package ? (
                        <Badge variant="secondary">
                          {t("profiles.linked", { name: p.package.name })}
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
            <Button
              loading={create.isPending}
              disabled={chosen.length === 0}
              onClick={() =>
                create.mutate(
                  chosen.map((p) => ({ name: p.name, price: prices[p.name] || "0" })),
                  {
                    onSuccess: (r) => {
                      toast.success(t("profiles.done", { n: num(r.packages_created) }))
                      onClose()
                    },
                  },
                )
              }
            >
              {t("profiles.go", { n: num(chosen.length) })}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
