"use client"

import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { MobileFab } from "@/components/data-table/mobile-ui"
import { PageHeader } from "@/components/page-header"
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
import { useExpenseMutations, useExpenses } from "@/hooks/rq/use-saas-query"
import { useT } from "@/providers/locale-provider"

const CATEGORIES = [
  ["BANDWIDTH", "Bandwidth / Upstream", "ব্যান্ডউইথ / আপস্ট্রিম"],
  ["SALARY", "Salary", "বেতন"],
  ["EQUIPMENT", "Equipment", "যন্ত্রপাতি"],
  ["OFFICE", "Office / Rent", "অফিস / ভাড়া"],
  ["UTILITY", "Electricity / Utility", "বিদ্যুৎ / ইউটিলিটি"],
  ["MAINTENANCE", "Maintenance", "মেরামত"],
  ["MARKETING", "Marketing", "মার্কেটিং"],
  ["OTHER", "Other", "অন্যান্য"],
] as const

const today = () => new Date().toLocaleDateString("en-CA") // local date, not UTC

export function ExpensesClient() {
  const { t, locale, money } = useT()
  const { data, isLoading } = useExpenses()
  const { remove } = useExpenseMutations()
  const [adding, setAdding] = useState(false)

  const rows = data?.results ?? []
  const sum = (list: typeof rows) => list.reduce((s, e) => s + Number(e.amount), 0)
  const thisMonth = rows.filter((e) => e.expense_date.startsWith(today().slice(0, 7)))
  const category = (value: string) =>
    CATEGORIES.find((c) => c[0] === value)?.[locale === "bn" ? 2 : 1] ?? value
  const empty = isLoading
    ? t("common.loading")
    : rows.length === 0
      ? t("expenses.empty")
      : null
  const deleteButton = (uid: string) => (
    <Button
      size="icon"
      variant="ghost"
      aria-label="Delete expense"
      onClick={() => confirm(t("common.areYouSure")) && remove.mutate(uid)}
    >
      <Trash2 className="size-4" />
    </Button>
  )

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <PageHeader
        title={t("expenses.title")}
        description={t("expenses.sub")}
        actions={
          <Button className="hidden md:inline-flex" onClick={() => setAdding(true)}>
            <Plus />
            {t("expenses.add")}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
        {[
          [t("expenses.thisMonth"), money(sum(thisMonth))],
          [t("expenses.totalListed"), money(sum(rows))],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-card px-4 py-3">
            <div className="text-muted-foreground text-xs sm:text-sm">{label}</div>
            <div className="font-bold text-xl tabular-nums sm:text-2xl">{value}</div>
          </div>
        ))}
      </div>

      {/* phones: cards */}
      <div className="space-y-2 md:hidden">
        {empty && <p className="py-8 text-center text-muted-foreground">{empty}</p>}
        {rows.map((e) => (
          <div
            key={e.uid}
            className="flex items-center gap-3 rounded-2xl border bg-card p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{e.name}</div>
              <div className="text-muted-foreground text-xs">
                {category(e.category)} · {e.expense_date}
              </div>
            </div>
            <div className="font-semibold tabular-nums">{money(e.amount)}</div>
            {deleteButton(e.uid)}
          </div>
        ))}
      </div>

      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead>{t("expenses.description")}</TableHead>
                <TableHead>{t("expenses.category")}</TableHead>
                <TableHead className="text-right">{t("common.amount")}</TableHead>
                <TableHead className="w-10" />
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
              {rows.map((e) => (
                <TableRow key={e.uid}>
                  <TableCell>{e.expense_date}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{category(e.category)}</TableCell>
                  <TableCell className="text-right">{money(e.amount)}</TableCell>
                  <TableCell>{deleteButton(e.uid)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MobileFab label={t("expenses.add")} onClick={() => setAdding(true)} />

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("expenses.add")}</DialogTitle>
            <DialogDescription>{t("expenses.sub")}</DialogDescription>
          </DialogHeader>
          <ExpenseForm onDone={() => setAdding(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** Mounted only while the dialog is open, so it always starts empty. */
function ExpenseForm({ onDone }: { onDone: () => void }) {
  const { t, locale } = useT()
  const { create } = useExpenseMutations()
  const [form, setForm] = useState({
    name: "",
    category: "OTHER",
    amount: "",
    expense_date: today(),
  })

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        create.mutate(form, { onSuccess: onDone })
      }}
    >
      <Input
        placeholder={t("expenses.what")}
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <NativeSelect
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        {CATEGORIES.map(([v, en, bn]) => (
          <option key={v} value={v}>
            {locale === "bn" ? bn : en}
          </option>
        ))}
      </NativeSelect>
      <Input
        type="number"
        min="1"
        step="0.01"
        placeholder={t("expenses.amount")}
        required
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />
      <Input
        type="date"
        value={form.expense_date}
        onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
      />
      <Button type="submit" loading={create.isPending}>
        {t("expenses.add")}
      </Button>
    </form>
  )
}
