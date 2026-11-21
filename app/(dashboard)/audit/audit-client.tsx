"use client"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuditLogs } from "@/hooks/rq/use-saas-query"
import { useT } from "@/providers/locale-provider"

export function AuditClient() {
  const { t } = useT()
  const { data, isLoading } = useAuditLogs()

  return (
    <div className="space-y-4">
      <PageHeader title={t("audit.title")} description={t("audit.sub")} />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("audit.when")}</TableHead>
                <TableHead>{t("audit.who")}</TableHead>
                <TableHead>{t("audit.action")}</TableHead>
                <TableHead>{t("audit.detail")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>{t("common.loading")}</TableCell>
                </TableRow>
              )}
              {data?.results.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(e.created_at).toLocaleString("en-GB")}
                  </TableCell>
                  <TableCell>
                    {e.user_name}
                    {e.ip_address && (
                      <div className="text-muted-foreground text-xs">{e.ip_address}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {e.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md whitespace-normal text-sm">
                    {e.detail}
                  </TableCell>
                </TableRow>
              ))}
              {data && data.results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    {t("audit.empty")}
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
