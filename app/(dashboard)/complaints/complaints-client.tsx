"use client"

import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"
import { MobileFab } from "@/components/data-table/mobile-ui"
import { PageHeader } from "@/components/page-header"
import { SegmentedTabs } from "@/components/segmented-tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { getCustomerListOptions } from "@/hooks/rq/use-customers-query"
import { useComplaintMutations, useComplaints } from "@/hooks/rq/use-saas-query"
import { useT } from "@/providers/locale-provider"
import type { Complaint } from "@/types/saas"

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const
const PRIORITIES = {
  LOW: ["Low", "কম"],
  MEDIUM: ["Medium", "মাঝারি"],
  HIGH: ["High", "জরুরি"],
} as const

export function ComplaintsClient() {
  const { t, locale } = useT()
  const [filter, setFilter] = useState<"" | (typeof STATUSES)[number]>("")
  const { data, isLoading } = useComplaints(
    filter ? { ticket_status: filter } : undefined,
  )
  const { update } = useComplaintMutations()
  const [adding, setAdding] = useState(false)

  const priority = (c: Complaint) => (
    <Badge variant={c.priority === "HIGH" ? "destructive" : "outline"}>
      {PRIORITIES[c.priority]?.[locale === "bn" ? 1 : 0] ?? c.priority}
    </Badge>
  )
  const opened = (c: Complaint) => new Date(c.created_at).toLocaleDateString("en-GB")
  const statusSelect = (c: Complaint) => (
    <NativeSelect
      className="w-36"
      aria-label={t("common.status")}
      value={c.ticket_status}
      onChange={(e) =>
        update.mutate({ uid: c.uid, data: { ticket_status: e.target.value } })
      }
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {t(`complaints.status.${s}`)}
        </option>
      ))}
    </NativeSelect>
  )
  const empty = isLoading
    ? t("common.loading")
    : data?.results.length === 0
      ? t("complaints.empty")
      : null

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <PageHeader
        title={t("complaints.title")}
        description={t("complaints.sub")}
        actions={
          <Button className="hidden md:inline-flex" onClick={() => setAdding(true)}>
            <Plus />
            {t("complaints.new")}
          </Button>
        }
      />

      <SegmentedTabs
        value={filter}
        onChange={setFilter}
        tabs={[
          { value: "", label: t("common.all") },
          ...STATUSES.map((s) => ({ value: s, label: t(`complaints.status.${s}`) })),
        ]}
      />

      {/* phones: cards */}
      <div className="space-y-2 md:hidden">
        {empty && <p className="py-8 text-center text-muted-foreground">{empty}</p>}
        {data?.results.map((c) => (
          <div key={c.uid} className="space-y-2 rounded-2xl border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold">{c.customer_name}</div>
                <a href={`tel:${c.customer_phone}`} className="text-primary text-xs">
                  {c.customer_phone}
                </a>
              </div>
              {priority(c)}
            </div>
            <p className="text-sm">{c.name}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-xs">{opened(c)}</span>
              {statusSelect(c)}
            </div>
          </div>
        ))}
      </div>

      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.customer")}</TableHead>
                <TableHead>{t("complaints.problem").split(" (")[0]}</TableHead>
                <TableHead>{t("complaints.priority")}</TableHead>
                <TableHead>{t("complaints.opened")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empty && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {empty}
                  </TableCell>
                </TableRow>
              )}
              {data?.results.map((c) => (
                <TableRow key={c.uid}>
                  <TableCell>
                    <div className="font-medium">{c.customer_name}</div>
                    <div className="text-muted-foreground text-xs">
                      {c.customer_phone}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal">{c.name}</TableCell>
                  <TableCell>{priority(c)}</TableCell>
                  <TableCell>{opened(c)}</TableCell>
                  <TableCell>{statusSelect(c)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MobileFab label={t("complaints.new")} onClick={() => setAdding(true)} />

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("complaints.new")}</DialogTitle>
            <DialogDescription>{t("complaints.sub")}</DialogDescription>
          </DialogHeader>
          <ComplaintForm onDone={() => setAdding(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** Mounted only while the dialog is open, so it always starts empty. */
function ComplaintForm({ onDone }: { onDone: () => void }) {
  const { t, locale } = useT()
  const { create } = useComplaintMutations()
  const customers = useQuery(getCustomerListOptions())
  const [form, setForm] = useState({ name: "", customer_id: "", priority: "MEDIUM" })

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        create.mutate(
          { ...form, customer_id: Number(form.customer_id) },
          { onSuccess: onDone },
        )
      }}
    >
      <NativeSelect
        required
        aria-label={t("common.customer")}
        value={form.customer_id}
        onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
      >
        <option value="">{t("complaints.selectCustomer")}</option>
        {customers.data?.results.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.phone})
          </option>
        ))}
      </NativeSelect>
      <Input
        placeholder={t("complaints.problem")}
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <NativeSelect
        aria-label={t("complaints.priority")}
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        {Object.entries(PRIORITIES).map(([value, names]) => (
          <option key={value} value={value}>
            {names[locale === "bn" ? 1 : 0]}
          </option>
        ))}
      </NativeSelect>
      <Button type="submit" loading={create.isPending}>
        {t("common.create")}
      </Button>
    </form>
  )
}
