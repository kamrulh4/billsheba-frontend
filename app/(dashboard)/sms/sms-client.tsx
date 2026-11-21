"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { SmsCounter } from "@/components/sms-counter"
import { SmsUsage } from "@/components/sms-usage"
import { Tx } from "@/components/tx"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  type SmsEstimate,
  useEstimateBulkSms,
  useMyOrganization,
  useSendBulkSms,
  useSmsLogs,
} from "@/hooks/rq/use-saas-query"
import { MAX_BULK_SEGMENTS, smsInfo } from "@/lib/sms"
import { useT } from "@/providers/locale-provider"

export function SmsClient() {
  const { t } = useT()
  const qc = useQueryClient()
  const logs = useSmsLogs()
  const send = useSendBulkSms()
  const estimate = useEstimateBulkSms()
  const { data: org } = useMyOrganization()
  const [quote, setQuote] = useState<SmsEstimate | null>(null)
  const [message, setMessage] = useState("")
  const [area, setArea] = useState("")
  const [onlyDue, setOnlyDue] = useState(false)

  return (
    <div className="space-y-4">
      <PageHeader title={t("sms.title")} description={t("sms.sub")} />

      {org && (
        <Card>
          <CardContent className="pt-6">
            <SmsUsage used={org.sms_used ?? 0} limit={org.sms_limit ?? 0} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("sms.sendTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={3}
            placeholder="e.g. আগামীকাল রাত ১২টা থেকে ২টা পর্যন্ত মেইনটেনেন্স চলবে।"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setQuote(null) // the cost changes with the text
            }}
          />
          <SmsCounter text={message} max={MAX_BULK_SEGMENTS} />
          <div className="flex flex-wrap items-center gap-3">
            <Input
              className="w-48"
              placeholder={t("sms.onlyArea")}
              value={area}
              onChange={(e) => {
                setArea(e.target.value)
                setQuote(null)
              }}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={onlyDue}
                onChange={(e) => {
                  setOnlyDue(e.target.checked)
                  setQuote(null)
                }}
              />
              {t("sms.onlyDue")}
            </label>
            <Button
              variant={quote ? "outline" : "default"}
              loading={estimate.isPending}
              disabled={!message.trim() || smsInfo(message).segments > MAX_BULK_SEGMENTS}
              onClick={() =>
                estimate.mutate(
                  { message, area: area || undefined, only_due: onlyDue },
                  { onSuccess: setQuote },
                )
              }
            >
              <Tx>Check cost</Tx>
            </Button>
          </div>
          {quote && (
            <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-sm">
              <p>
                {quote.recipients} <Tx>customers</Tx> × {quote.segments_each} SMS ={" "}
                <b>{quote.total_sms} SMS</b> · <Tx>left this month</Tx>: {quote.remaining}
              </p>
              {quote.total_sms > quote.remaining ? (
                <p className="text-destructive">
                  <Tx>
                    Not enough SMS left this month. Shorten the message or narrow the
                    audience.
                  </Tx>
                </p>
              ) : (
                <Button
                  loading={send.isPending}
                  disabled={quote.recipients === 0}
                  onClick={() =>
                    send.mutate(
                      { message, area: area || undefined, only_due: onlyDue },
                      {
                        onSuccess: () => {
                          setQuote(null)
                          qc.invalidateQueries({ queryKey: ["sms-logs"] })
                        },
                      },
                    )
                  }
                >
                  {t("common.send")} {quote.total_sms} SMS
                </Button>
              )}
            </div>
          )}
          <p className="text-muted-foreground text-xs">{t("sms.note")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("sms.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("sms.when")}</TableHead>
                <TableHead>{t("sms.to")}</TableHead>
                <TableHead>{t("sms.message")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.data?.results.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString("en-GB")}
                  </TableCell>
                  <TableCell>{l.to}</TableCell>
                  <TableCell className="max-w-md whitespace-normal">
                    {l.message}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        l.sms_status === "FAILED" || l.sms_status === "BLOCKED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {l.sms_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {logs.data && logs.data.results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    {t("sms.empty")}
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
