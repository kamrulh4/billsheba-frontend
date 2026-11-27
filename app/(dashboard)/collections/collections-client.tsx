"use client"

import { useQuery } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { MobileFab } from "@/components/data-table/mobile-ui"
import { PageHeader } from "@/components/page-header"
import { SegmentedTabs } from "@/components/segmented-tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useCollectionSummary,
  useDepositMutations,
  useDeposits,
} from "@/hooks/rq/use-saas-query"
import { getUserListOptions } from "@/hooks/rq/use-users-query"
import { useCan } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/locale-provider"
import type { CollectionRow } from "@/types/saas"

const today = () => new Date().toLocaleDateString("en-CA") // local date, not UTC
const monthStart = () => `${today().slice(0, 8)}01`

type Period = "today" | "month" | "custom"
/** The collector a deposit dialog was opened for; ``null`` = let the user pick one. */
type Target = { row: CollectionRow | null }

export function CollectionsClient() {
  const { t, money, num } = useT()
  const { manage: canRecord } = useCan()
  const [period, setPeriod] = useState<Period>("month")
  const [custom, setCustom] = useState({ start_date: monthStart(), end_date: today() })
  const range =
    period === "custom"
      ? custom
      : { start_date: period === "today" ? today() : monthStart(), end_date: today() }
  const summary = useCollectionSummary(range)
  const deposits = useDeposits(range)
  const { remove } = useDepositMutations()
  const [target, setTarget] = useState<Target | null>(null)

  const data = summary.data
  const stats = [
    { label: t("collections.collected"), value: money(data?.total_collected ?? 0) },
    { label: t("collections.deposited"), value: money(data?.total_deposited ?? 0) },
    {
      label: t("collections.pending"),
      value: money(data?.total_pending ?? 0),
      tone: "text-amber-600",
    },
  ]
  const rows = data?.rows ?? []
  const noRows = summary.isLoading
    ? t("common.loading")
    : data && rows.length === 0
      ? t("collections.none")
      : null
  const pendingTone = (v: string) => (Number(v) > 0 ? "text-amber-600" : "")
  const deleteButton = (uid: string) => (
    <Button
      size="icon"
      variant="ghost"
      aria-label="Delete deposit"
      onClick={() => confirm(t("common.areYouSure")) && remove.mutate(uid)}
    >
      <Trash2 className="size-4" />
    </Button>
  )

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <PageHeader
        title={t("collections.title")}
        description={t("collections.sub")}
        actions={
          canRecord && (
            <Button
              className="hidden md:inline-flex"
              onClick={() => setTarget({ row: null })}
            >
              <Plus />
              {t("collections.record")}
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <SegmentedTabs
          value={period}
          onChange={setPeriod}
          tabs={[
            { value: "today", label: t("collections.today") },
            { value: "month", label: t("collections.month") },
            { value: "custom", label: t("collections.custom") },
          ]}
        />
        {period === "custom" && (
          <div className="flex gap-2">
            <Input
              type="date"
              aria-label={t("collections.from")}
              value={custom.start_date}
              onChange={(e) => setCustom({ ...custom, start_date: e.target.value })}
            />
            <Input
              type="date"
              aria-label={t("collections.to")}
              value={custom.end_date}
              onChange={(e) => setCustom({ ...custom, end_date: e.target.value })}
            />
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-xs">{t("collections.cashOnly")}</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card px-3 py-3 sm:px-4">
            <div className="text-muted-foreground text-xs sm:text-sm">{stat.label}</div>
            <div
              className={cn("font-bold text-base tabular-nums sm:text-2xl", stat.tone)}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* phones: one card per collector */}
      <div className="space-y-2 md:hidden">
        {noRows && <p className="py-6 text-center text-muted-foreground">{noRows}</p>}
        {rows.map((r) => (
          <div key={r.collector_id} className="space-y-3 rounded-2xl border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold">{r.name}</div>
                <div className="text-muted-foreground text-xs">
                  {t("collections.collected")} {money(r.collected)} ·{" "}
                  {t("collections.deposited")} {money(r.deposited)}
                </div>
              </div>
              <div className="text-right">
                <div className={cn("font-bold tabular-nums", pendingTone(r.pending))}>
                  {money(r.pending)}
                </div>
                <div className="text-muted-foreground text-xs">
                  {t("collections.pending")}
                </div>
              </div>
            </div>
            {canRecord && (
              <Button className="w-full" onClick={() => setTarget({ row: r })}>
                {t("collections.take")}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("collections.collector")}</TableHead>
                <TableHead className="text-right">{t("collections.payments")}</TableHead>
                <TableHead className="text-right">{t("collections.collected")}</TableHead>
                <TableHead className="text-right">{t("collections.deposited")}</TableHead>
                <TableHead className="text-right">{t("collections.pending")}</TableHead>
                {canRecord && <TableHead className="w-32" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {noRows && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {noRows}
                  </TableCell>
                </TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.collector_id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-right">{num(r.payments)}</TableCell>
                  <TableCell className="text-right">{money(r.collected)}</TableCell>
                  <TableCell className="text-right">{money(r.deposited)}</TableCell>
                  <TableCell
                    className={cn("text-right font-semibold", pendingTone(r.pending))}
                  >
                    {money(r.pending)}
                  </TableCell>
                  {canRecord && (
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => setTarget({ row: r })}>
                        {t("collections.take")}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("collections.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y md:hidden">
            {deposits.data?.results.map((d) => (
              <div key={d.uid} className="flex items-center gap-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{d.collector_name}</div>
                  <div className="text-muted-foreground text-xs">
                    {[d.deposit_date, d.received_by_name, d.note]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
                <div className="font-semibold tabular-nums">{money(d.amount)}</div>
                {canRecord && deleteButton(d.uid)}
              </div>
            ))}
            {deposits.data && deposits.data.results.length === 0 && (
              <p className="py-4 text-center text-muted-foreground text-sm">
                {t("collections.noDeposits")}
              </p>
            )}
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.date")}</TableHead>
                  <TableHead>{t("collections.collector")}</TableHead>
                  <TableHead className="text-right">{t("common.amount")}</TableHead>
                  <TableHead>{t("collections.receivedBy")}</TableHead>
                  <TableHead>{t("collections.note")}</TableHead>
                  {canRecord && <TableHead className="w-10" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.data?.results.map((d) => (
                  <TableRow key={d.uid}>
                    <TableCell>{d.deposit_date}</TableCell>
                    <TableCell>{d.collector_name}</TableCell>
                    <TableCell className="text-right">{money(d.amount)}</TableCell>
                    <TableCell>{d.received_by_name}</TableCell>
                    <TableCell>{d.note}</TableCell>
                    {canRecord && (
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Delete deposit"
                          onClick={() =>
                            confirm(t("common.areYouSure")) && remove.mutate(d.uid)
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {deposits.data && deposits.data.results.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {t("collections.noDeposits")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {canRecord && (
        <MobileFab
          label={t("collections.record")}
          onClick={() => setTarget({ row: null })}
        />
      )}

      <Dialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {target?.row ? target.row.name : t("collections.record")}
            </DialogTitle>
            <DialogDescription>{t("collections.sub")}</DialogDescription>
          </DialogHeader>
          {target && <DepositForm row={target.row} onDone={() => setTarget(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** Mounted only while the dialog is open, so it always starts empty. */
function DepositForm({ row, onDone }: { row: CollectionRow | null; onDone: () => void }) {
  const { t, money } = useT()
  const { create } = useDepositMutations()
  const users = useQuery({ ...getUserListOptions(), enabled: !row })
  const [form, setForm] = useState({
    collector_id: row ? String(row.collector_id) : "",
    amount: "",
    deposit_date: today(),
    note: "",
  })
  const inHand = Number(row?.pending ?? 0)

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        create.mutate(
          { ...form, collector_id: Number(form.collector_id) },
          { onSuccess: onDone },
        )
      }}
    >
      {row ? (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2">
          <span className="text-muted-foreground text-sm">{t("collections.inHand")}</span>
          <span className="font-bold tabular-nums">{money(row.pending)}</span>
        </div>
      ) : (
        <NativeSelect
          required
          aria-label={t("collections.collector")}
          value={form.collector_id}
          onChange={(e) => setForm({ ...form, collector_id: e.target.value })}
        >
          <option value="">{t("collections.pick")}</option>
          {users.data?.results.map((u) => (
            <option key={u.id} value={u.id}>
              {`${u.first_name} ${u.last_name}`.trim() || u.phone}
            </option>
          ))}
        </NativeSelect>
      )}
      <div className="flex gap-2">
        <Input
          type="number"
          min="1"
          step="0.01"
          required
          inputMode="decimal"
          aria-label={t("common.amount")}
          placeholder={t("collections.howMuch")}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        {inHand > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setForm({ ...form, amount: String(inHand) })}
          >
            {t("collections.full")}
          </Button>
        )}
      </div>
      <Input
        type="date"
        aria-label={t("common.date")}
        value={form.deposit_date}
        onChange={(e) => setForm({ ...form, deposit_date: e.target.value })}
      />
      <Input
        placeholder={t("collections.note")}
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />
      <Button type="submit" loading={create.isPending}>
        {t("collections.save")}
      </Button>
    </form>
  )
}
