"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
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
import { getCustomerListOptions } from "@/hooks/rq/use-customers-query"
import { useComplaintMutations, useComplaints } from "@/hooks/rq/use-saas-query"
import { useT } from "@/providers/locale-provider"

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const

export function ComplaintsClient() {
  const { t, locale } = useT()
  const [filter, setFilter] = useState("")
  const { data, isLoading } = useComplaints(
    filter ? { ticket_status: filter } : undefined,
  )
  const { create, update } = useComplaintMutations()
  const customers = useQuery(getCustomerListOptions())
  const [form, setForm] = useState({ name: "", customer_id: "", priority: "MEDIUM" })

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("complaints.title")}
        description={t("complaints.sub")}
        actions={
          <NativeSelect
            className="w-44"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">{t("complaints.allStatuses")}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </NativeSelect>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("complaints.new")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3 sm:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault()
              create.mutate(
                { ...form, customer_id: Number(form.customer_id) },
                { onSuccess: () => setForm({ ...form, name: "" }) },
              )
            }}
          >
            <NativeSelect
              required
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
              className="sm:col-span-2"
              placeholder={t("complaints.problem")}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <NativeSelect
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="LOW">{locale === "bn" ? "কম" : "Low"}</option>
              <option value="MEDIUM">{locale === "bn" ? "মাঝারি" : "Medium"}</option>
              <option value="HIGH">{locale === "bn" ? "জরুরি" : "High"}</option>
            </NativeSelect>
            <Button type="submit" loading={create.isPending} className="sm:w-fit">
              {t("common.create")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5}>{t("common.loading")}</TableCell>
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
                  <TableCell>
                    <Badge variant={c.priority === "HIGH" ? "destructive" : "outline"}>
                      {c.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(c.created_at).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    <NativeSelect
                      className="w-36"
                      value={c.ticket_status}
                      onChange={(e) =>
                        update.mutate({
                          uid: c.uid,
                          data: { ticket_status: e.target.value },
                        })
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </NativeSelect>
                  </TableCell>
                </TableRow>
              ))}
              {data && data.results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("complaints.empty")}
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
