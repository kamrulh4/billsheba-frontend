import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { trNow } from "@/lib/i18n/current"
import { toast } from "@/lib/toast"
import { httpV1 } from "@/lib/xior"
import type {
  AuditEntry,
  BillingInfo,
  Complaint,
  Expense,
  Lead,
  OrganizationSettings,
  Paginated,
  PaymentRequest,
  Plan,
  PlatformStats,
  Receipt,
  ReportSummary,
  RouterImportPreview,
  RouterImportResult,
  RouterProfile,
  SubscriptionPayment,
} from "@/types/saas"

const list = <T>(url: string, params?: Record<string, unknown>) =>
  httpV1
    .request<Paginated<T>>({
      method: "GET",
      url,
      params: { page: 1, page_size: 500, ...params },
    })
    .then((res) => res.data)

/** Create / update / delete helpers that refresh the matching list. */
function useCrud<T>(key: string, url: string, label: string) {
  const qc = useQueryClient()
  const done = (msg: string) => () => {
    toast.success(msg)
    qc.invalidateQueries({ queryKey: [key] })
  }
  return {
    create: useMutation({
      mutationFn: (data: Record<string, unknown>) =>
        httpV1.post<T>(url, data).then((r) => r.data),
      onSuccess: done(`${label} created`),
    }),
    update: useMutation({
      mutationFn: ({ uid, data }: { uid: string; data: Record<string, unknown> }) =>
        httpV1.patch<T>(`${url}/${uid}`, data).then((r) => r.data),
      onSuccess: done(`${label} updated`),
    }),
    remove: useMutation({
      mutationFn: (uid: string) => httpV1.delete(`${url}/${uid}`),
      onSuccess: done(`${label} deleted`),
    }),
  }
}

// ---- plans (public) ---------------------------------------------------------
export const plansOptions = () =>
  queryOptions({
    queryKey: ["plans"],
    queryFn: () => httpV1.get<Plan[]>("/subscriptions").then((r) => r.data),
    staleTime: 60 * 60 * 1000,
  })

// ---- expenses -----------------------------------------------------------------
export const useExpenses = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["expenses", params],
    queryFn: () => list<Expense>("/expenses", params),
  })
export const useExpenseMutations = () =>
  useCrud<Expense>("expenses", "/expenses", "Expense")

// ---- complaints ----------------------------------------------------------------
export const useComplaints = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["complaints", params],
    queryFn: () => list<Complaint>("/complaints", params),
  })
export const useComplaintMutations = () =>
  useCrud<Complaint>("complaints", "/complaints", "Complaint")

// ---- payment requests -----------------------------------------------------------
export const usePaymentRequests = (requestStatus?: string) =>
  useQuery({
    queryKey: ["payment-requests", requestStatus],
    queryFn: () =>
      list<PaymentRequest>("/payment-requests", { request_status: requestStatus }),
  })

export function useReviewPaymentRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: "approve" | "reject" }) =>
      httpV1.post(`/payment-requests/${id}/${action}`).then((r) => r.data),
    onSuccess: (_d, v) => {
      toast.success(v.action === "approve" ? "Payment recorded" : "Request rejected")
      qc.invalidateQueries({ queryKey: ["payment-requests"] })
      qc.invalidateQueries({ queryKey: ["payments"] })
      qc.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

// ---- reports ------------------------------------------------------------------------
export const useReportSummary = () =>
  useQuery({
    queryKey: ["reports", "summary"],
    queryFn: () => httpV1.get<ReportSummary>("/reports/summary").then((r) => r.data),
  })

// ---- sms ------------------------------------------------------------------------------
export type SmsEstimate = {
  recipients: number
  segments_each: number
  total_sms: number
  remaining: number
}
type BulkSmsInput = { message: string; area?: string; only_due?: boolean }

/** What a bulk SMS would cost, without sending anything. */
export function useEstimateBulkSms() {
  return useMutation({
    mutationFn: (data: BulkSmsInput) =>
      httpV1
        .post<SmsEstimate>("/sms/send", { ...data, dry_run: true })
        .then((r) => r.data),
  })
}

export function useSendBulkSms() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: BulkSmsInput) =>
      httpV1
        .post<{ sent: number; failed: number }>("/sms/send", data)
        .then((r) => r.data),
    onSuccess: (d) => {
      toast.success(trNow("toast.smsSent", { sent: d.sent, failed: d.failed }))
      qc.invalidateQueries({ queryKey: ["organization", "me"] }) // refresh the usage bar
    },
  })
}

export const useSmsLogs = () =>
  useQuery({
    queryKey: ["sms-logs"],
    queryFn: () =>
      list<{
        id: number
        to: string
        message: string
        sms_status: string
        created_at: string
      }>("/sms/logs", { page_size: 100 }),
  })

// ---- my organization (settings) ------------------------------------------------------
export const myOrganizationOptions = () =>
  queryOptions({
    queryKey: ["organization", "me"],
    queryFn: () =>
      httpV1.get<OrganizationSettings>("/organizations/me").then((r) => r.data),
  })

export const useMyOrganization = () => useQuery(myOrganizationOptions())

export function useUpdateMyOrganization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<OrganizationSettings> & Record<string, unknown>) =>
      httpV1.patch<OrganizationSettings>("/organizations/me", data).then((r) => r.data),
    onSuccess: (data) => {
      toast.success("Settings saved")
      qc.setQueryData(["organization", "me"], data)
    },
  })
}

export function useTestRouter() {
  return useMutation({
    mutationFn: () =>
      httpV1
        .post<{ ok: boolean; ppp_secrets: number }>("/organizations/me/test-router")
        .then((r) => r.data),
    onSuccess: (d) => toast.success(trNow("toast.routerOk", { n: d.ppp_secrets })),
  })
}

// ---- customers import/export ----------------------------------------------------------
export function useImportCustomers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData()
      form.append("file", file)
      return httpV1
        .post<{ imported: number; errors: { row: number; message: string }[] }>(
          "/customers/import",
          form,
        )
        .then((r) => r.data)
    },
    onSuccess: (d) => {
      toast.success(
        `Imported ${d.imported} customers${d.errors.length ? `, ${d.errors.length} skipped` : ""}`,
      )
      qc.invalidateQueries({ queryKey: ["customers"] })
    },
  })
}

// ---- subscription billing (ISP side) ----------------------------------------------------
export const useBillingInfo = () =>
  useQuery({
    queryKey: ["billing"],
    queryFn: () => httpV1.get<BillingInfo>("/billing").then((r) => r.data),
  })

export function useRenewSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      plan_id: number
      months: number
      payment_method: string
      transaction_id: string
      sender_number?: string
    }) => httpV1.post<{ message: string }>("/billing/renew", data).then((r) => r.data),
    onSuccess: (d) => {
      toast.success(d.message)
      qc.invalidateQueries({ queryKey: ["billing"] })
    },
  })
}

// ---- platform owner -------------------------------------------------------------------------
export const usePlatformStats = () =>
  useQuery({
    queryKey: ["platform", "stats"],
    queryFn: () =>
      httpV1.get<PlatformStats>("/billing/platform/stats").then((r) => r.data),
  })

export const usePlatformPayments = (paymentStatus?: string) =>
  useQuery({
    queryKey: ["platform", "payments", paymentStatus],
    queryFn: () =>
      list<SubscriptionPayment>("/billing/platform/payments", {
        payment_status: paymentStatus,
      }),
  })

export function useReviewSubscriptionPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      action,
      note,
    }: {
      id: number
      action: "approve" | "reject"
      note?: string
    }) =>
      httpV1
        .post(`/billing/platform/payments/${id}/${action}`, { note })
        .then((r) => r.data),
    onSuccess: (_d, v) => {
      toast.success(v.action === "approve" ? "Plan activated" : "Payment rejected")
      qc.invalidateQueries({ queryKey: ["platform"] })
    },
  })
}

export function useTestBkash() {
  return useMutation({
    mutationFn: () =>
      httpV1.post<{ ok: boolean }>("/organizations/me/test-bkash").then((r) => r.data),
  })
}

/** Starts a bKash checkout for an ISP subscription and returns the bKash page URL. */
export function useRenewWithBkash() {
  return useMutation({
    mutationFn: (data: { plan_id: number; months: number }) =>
      httpV1
        .post<{ bkash_url: string }>("/billing/renew/bkash", data)
        .then((r) => r.data),
    onSuccess: (d) => {
      window.location.href = d.bkash_url
    },
  })
}

export const useAuditLogs = (action?: string) =>
  useQuery({
    queryKey: ["audit", action],
    queryFn: () =>
      list<AuditEntry>("/organizations/audit-logs", { page_size: 100, action }),
  })

export const useReceipt = (uid: string) =>
  useQuery({
    queryKey: ["receipt", uid],
    queryFn: () => httpV1.get<Receipt>(`/payments/${uid}/receipt`).then((r) => r.data),
    retry: 0,
  })

export const usePlatformLeads = (leadStatus?: string) =>
  useQuery({
    queryKey: ["platform", "leads", leadStatus],
    queryFn: () => list<Lead>("/billing/platform/leads", { lead_status: leadStatus }),
  })

export function useUpdateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; lead_status?: string; notes?: string }) =>
      httpV1.patch<Lead>(`/billing/platform/leads/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "leads"] }),
  })
}

// ---- import existing PPP profiles/users from the ISP's router ---------------------------------
export const useRouterImportPreview = (enabled: boolean) =>
  useQuery({
    queryKey: ["router-import", "preview"],
    queryFn: () =>
      httpV1
        .get<RouterImportPreview>("/organizations/me/router-import")
        .then((r) => r.data),
    enabled,
    retry: 0,
    staleTime: 0,
    gcTime: 0,
  })

export function useRouterImport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { prices: Record<string, string>; include_disabled: boolean }) =>
      httpV1
        .post<RouterImportResult>("/organizations/me/router-import", data)
        .then((r) => r.data),
    onSuccess: () => {
      for (const key of ["customers", "packages", "dashboard", "organization"]) {
        qc.invalidateQueries({ queryKey: [key] })
      }
    },
  })
}

/** PPP profiles on the ISP's router (for the package form and "Fetch router profiles"). */
export const useRouterProfiles = (enabled: boolean) =>
  useQuery({
    queryKey: ["router-profiles"],
    queryFn: () =>
      httpV1
        .get<{ profiles: RouterProfile[] }>("/organizations/me/router-profiles")
        .then((r) => r.data.profiles),
    enabled,
    retry: 0,
    staleTime: 60_000,
  })

export function useCreatePackagesFromProfiles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (profiles: { name: string; price: string }[]) =>
      httpV1
        .post<{ packages_created: number }>("/organizations/me/router-profiles", {
          profiles,
        })
        .then((r) => r.data),
    onSuccess: () => {
      for (const key of ["packages", "router-profiles", "dashboard"]) {
        qc.invalidateQueries({ queryKey: [key] })
      }
    },
  })
}
