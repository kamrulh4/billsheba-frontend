"use client"

import { useQuery } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useSession } from "@/hooks/rq/use-auth-query"
import {
  useCollectionSummary,
  useDepositMutations,
  useDeposits,
} from "@/hooks/rq/use-saas-query"
import { getUserListOptions } from "@/hooks/rq/use-users-query"
import { useT } from "@/providers/locale-provider"

const today = () => new Date().toISOString().slice(0, 10)
const monthStart = () => `${today().slice(0, 8)}01`

export function CollectionsClient() {
  const { t, money } = useT()
  const { data: session } = useSession()
  const canRecord = ["ADMIN", "OWNER", "MANAGER"].includes(session?.kind ?? "")
  const [range, setRange] = useState({ start_date: monthStart(), end_date: today() })
  const summary = useCollectionSummary(range)
  const deposits = useDeposits(range)
  const { create, remove } = useDepositMutations()
  const users = useQuery({ ...getUserListOptions(), enabled: canRecord })
  const [form, setForm] = useState({
    collector_id: "",
    amount: "",
    deposit_date: today(),
    note: "",
  })

  const data = summary.data
  const stats: [string, string][] = [
    [t("collections.collected"), money(data?.total_collected ?? 0)],
    [t("collections.deposited"), money(data?.total_deposited ?? 0)],
    [t("collections.pending"), money(data?.total_pending ?? 0)],
  ]

  return (
    <div className="space-y-4">
      <PageHeader title={t("collections.title")} description={t("collections.sub")} />

      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">{t("collections.from")}</span>
          <Input
            type="date"
            value={range.start_date}
            onChange={(e) => setRange({ ...range, start_date: e.target.value })}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">{t("collections.to")}</span>
          <Input
            type="date"
            value={range.end_date}
            onChange={(e) => setRange({ ...range, end_date: e.target.value })}
          />
        </label>
      </div>
      <p className="text-muted-foreground text-xs">{t("collections.cashOnly")}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-bold text-2xl">{value}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("collections.collector")}</TableHead>
                <TableHead className="text-right">{t("collections.payments")}</TableHead>
                <TableHead className="text-right">{t("collections.collected")}</TableHead>
                <TableHead className="text-right">{t("collections.deposited")}</TableHead>
                <TableHead className="text-right">{t("collections.pending")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.isLoading && (
                <TableRow>
                  <TableCell colSpan={5}>{t("common.loading")}</TableCell>
                </TableRow>
              )}
              {data?.rows.map((r) => (
                <TableRow key={r.collector_id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-right">{r.payments}</TableCell>
                  <TableCell className="text-right">{money(r.collected)}</TableCell>
                  <TableCell className="text-right">{money(r.deposited)}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${Number(r.pending) > 0 ? "text-amber-600" : ""}`}
                  >
                    {money(r.pending)}
                  </TableCell>
                </TableRow>
              ))}
              {data && data.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("collections.none")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {canRecord && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("collections.record")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3 sm:grid-cols-5"
              onSubmit={(e) => {
                e.preventDefault()
                create.mutate(
                  { ...form, collector_id: Number(form.collector_id) },
                  { onSuccess: () => setForm({ ...form, amount: "", note: "" }) },
                )
              }}
            >
              <NativeSelect
                required
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
              <Input
                type="number"
                min="1"
                step="0.01"
                required
                placeholder={t("common.amount")}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <Input
                type="date"
                value={form.deposit_date}
                onChange={(e) => setForm({ ...form, deposit_date: e.target.value })}
              />
              <Input
                className="sm:col-span-2"
                placeholder={t("collections.note")}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
              <Button
                className="sm:col-span-5 sm:w-fit"
                type="submit"
                loading={create.isPending}
              >
                {t("collections.save")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("collections.history")}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
