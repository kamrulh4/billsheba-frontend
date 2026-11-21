"use client"

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

const today = () => new Date().toISOString().slice(0, 10)

export function ExpensesClient() {
  const { t, locale, money } = useT()
  const { data, isLoading } = useExpenses()
  const { create, remove } = useExpenseMutations()
  const [form, setForm] = useState({
    name: "",
    category: "OTHER",
    amount: "",
    expense_date: today(),
  })

  const total = (data?.results ?? []).reduce((s, e) => s + Number(e.amount), 0)

  return (
    <div className="space-y-4">
      <PageHeader title={t("expenses.title")} description={t("expenses.sub")} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("expenses.add")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3 sm:grid-cols-5"
            onSubmit={(e) => {
              e.preventDefault()
              create.mutate(form, {
                onSuccess: () => setForm({ ...form, name: "", amount: "" }),
              })
            }}
          >
            <Input
              className="sm:col-span-2"
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
            <Button
              className="sm:col-span-5 sm:w-fit"
              type="submit"
              loading={create.isPending}
            >
              {t("expenses.add")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("expenses.totalListed")}: {money(total)}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5}>{t("common.loading")}</TableCell>
                </TableRow>
              )}
              {data?.results.map((e) => (
                <TableRow key={e.uid}>
                  <TableCell>{e.expense_date}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>
                    {CATEGORIES.find((c) => c[0] === e.category)?.[
                      locale === "bn" ? 2 : 1
                    ] ?? e.category}
                  </TableCell>
                  <TableCell className="text-right">{money(e.amount)}</TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete expense"
                      onClick={() =>
                        confirm(t("common.areYouSure")) && remove.mutate(e.uid)
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data && data.results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("expenses.empty")}
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
