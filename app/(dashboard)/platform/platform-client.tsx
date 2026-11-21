"use client"

import { Check, X } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/native-select"
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
  usePlatformLeads,
  usePlatformPayments,
  usePlatformStats,
  useReviewSubscriptionPayment,
  useUpdateLead,
} from "@/hooks/rq/use-saas-query"

const taka = (v: string | number) => `৳${Number(v).toLocaleString("en-BD")}`

export function PlatformClient() {
  const stats = usePlatformStats()
  const [filter, setFilter] = useState("PENDING")
  const payments = usePlatformPayments(filter || undefined)
  const review = useReviewSubscriptionPayment()
  const leads = usePlatformLeads()
  const updateLead = useUpdateLead()

  if (!stats.data) return <Skeleton className="h-96 w-full" />
  const s = stats.data

  const cards = [
    ["ISPs", s.organizations],
    ["Active (paying)", s.by_status.ACTIVE ?? 0],
    ["On trial", s.by_status.TRIAL ?? 0],
    ["Expired", s.by_status.EXPIRED ?? 0],
    ["Monthly recurring", taka(s.mrr)],
    ["Customers managed", s.total_customers],
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Platform" description="All ISPs on Billsheba" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-1">
              <CardTitle className="font-medium text-muted-foreground text-xs">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-bold text-xl">{value}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">
            Subscription payments
            {s.pending_payments ? ` (${s.pending_payments} pending)` : ""}
          </CardTitle>
          <NativeSelect
            className="w-40"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="">All</option>
          </NativeSelect>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ISP</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Method / TrxID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.data?.results.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.organization_name}
                    <div className="text-muted-foreground text-xs">
                      {p.organization_phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.plan_name} × {p.months}
                  </TableCell>
                  <TableCell>
                    {p.payment_method}
                    <div className="font-mono text-xs">{p.transaction_id}</div>
                  </TableCell>
                  <TableCell className="text-right">{taka(p.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.payment_status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-1 whitespace-nowrap">
                    {p.payment_status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          disabled={review.isPending}
                          onClick={() => review.mutate({ id: p.id, action: "approve" })}
                        >
                          <Check /> Activate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={review.isPending}
                          onClick={() => review.mutate({ id: p.id, action: "reject" })}
                        >
                          <X /> Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payments.data && payments.data.results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nothing here
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Website leads{leads.data ? ` (${leads.data.count})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Who</TableHead>
                <TableHead>Wants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.data?.results.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="font-medium">{l.name}</div>
                    <a className="text-primary text-xs underline" href={`tel:${l.phone}`}>
                      {l.phone}
                    </a>
                    {l.company && (
                      <div className="text-muted-foreground text-xs">{l.company}</div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal text-sm">
                    <Badge variant="outline">{l.topic || "—"}</Badge>
                    <div className="mt-1 text-muted-foreground text-xs">{l.message}</div>
                  </TableCell>
                  <TableCell>
                    <NativeSelect
                      className="w-32"
                      value={l.lead_status}
                      onChange={(e) =>
                        updateLead.mutate({ id: l.id, lead_status: e.target.value })
                      }
                    >
                      {["NEW", "CONTACTED", "DEMO", "WON", "LOST"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </NativeSelect>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs">
                    {new Date(l.created_at).toLocaleDateString("en-GB")}
                  </TableCell>
                </TableRow>
              ))}
              {leads.data && leads.data.results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No leads yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ending within 7 days</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {s.expiring_soon.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.name}</TableCell>
                  <TableCell>{o.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{o.subscription_status}</Badge>
                  </TableCell>
                  <TableCell>{o.subscription_end_date}</TableCell>
                </TableRow>
              ))}
              {s.expiring_soon.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-muted-foreground">
                    None
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
