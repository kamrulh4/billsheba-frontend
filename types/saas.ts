export type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type Plan = {
  id: number
  uid: string
  name: string
  plan: string
  price: string
  max_customers: number
  max_users: number
  duration_days: number
  trial_days: number
  sms_feature: boolean
  features: string[]
}

export type Expense = {
  id: number
  uid: string
  name: string
  description: string | null
  category: string
  amount: string
  expense_date: string
}

export type Complaint = {
  id: number
  uid: string
  name: string
  description: string | null
  customer_name: string
  customer_phone: string
  ticket_status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  priority: "LOW" | "MEDIUM" | "HIGH"
  resolution_note: string
  resolved_at: string | null
  created_at: string
}

export type PaymentRequest = {
  id: number
  customer_name: string
  customer_phone: string
  amount: string
  payment_method: string
  sender_number: string
  transaction_id: string
  billing_month: string
  billing_year: number
  request_status: "PENDING" | "APPROVED" | "REJECTED"
  created_at: string
}

export type ReportSummary = {
  trend: {
    month: string
    revenue: string
    expense: string
    profit: string
    discount: string
  }[]
  this_month: {
    revenue: string
    expense: string
    profit: string
    discount: string
  } | null
  total_outstanding: string | number
  defaulters: {
    customer__uid: string
    customer__name: string
    customer__phone: string
    bills: number
    owed: string
  }[]
  by_area: { area: string; customers: number; active: number }[]
  by_package: { name: string; price: string; customers: number }[]
}

export type OrganizationSettings = {
  uid: string
  name: string
  slug: string
  phone: string
  email: string
  address: string
  website: string
  subscription_status: string
  subscription_end_date: string | null
  allowed_customer: number
  total_customer: number
  billing_cycle: string
  bkash_number: string
  nagad_number: string
  rocket_number: string
  due_day: number
  portal_otp_required: boolean
  sms_feature: boolean
  bill_sms_template: string
  payment_sms_template: string
  suspend_sms_template: string
  reminder_sms_template: string
  sms_limit: number
  sms_used: number
  router_ip: string
  router_username: string
  router_port: number
  router_ssl: boolean
  router_configured: boolean
  bkash_configured: boolean
  bkash_sandbox: boolean
}

export type PortalInfo = {
  name: string
  slug: string
  phone: string
  bkash_number: string
  nagad_number: string
  rocket_number: string
  due_day: number
  online_payment: boolean
  otp_required: boolean
  packages: { id: number; name: string; speed_mbps: number; price: string }[]
}

export type PortalLookup = {
  name: string
  is_active: boolean
  package: string | null
  total_due: string
  bills: { month: string; year: number; bill_amount: string; due: string }[]
  history: {
    month: string
    year: number
    amount: string
    method: string
    date: string | null
    trx: string
  }[]
}

export type SubscriptionPayment = {
  id: number
  organization_name: string
  organization_phone: string
  plan_name: string
  months: number
  amount: string
  payment_method: string
  sender_number: string
  transaction_id: string
  payment_status: "PENDING" | "APPROVED" | "REJECTED"
  review_note: string
  created_at: string
}

export type BillingInfo = {
  online_bkash: boolean
  current: {
    plan: string | null
    status: string
    active: boolean
    end_date: string | null
  }
  pay_to: Record<"BKASH" | "NAGAD" | "ROCKET", string>
  plans: Plan[]
  history: SubscriptionPayment[]
}

export type PlatformStats = {
  organizations: number
  by_status: Record<string, number>
  total_customers: number
  mrr: string | number
  pending_payments: number
  expiring_soon: {
    id: number
    name: string
    phone: string
    subscription_status: string
    subscription_end_date: string
  }[]
}

export type AuditEntry = {
  id: number
  action: string
  target: string
  detail: string
  user_name: string
  ip_address: string | null
  created_at: string
}

export type Receipt = {
  receipt_no: string
  organization: { name: string; phone: string; address: string; email: string }
  customer: {
    name: string
    phone: string
    username: string
    address: string | null
    area: string
    package: string | null
  }
  billing_month: string
  billing_year: number
  bill_amount: string
  discount: string
  amount: string
  due: string
  paid: boolean
  payment_method: string
  transaction_id: string
  payment_date: string | null
  received_by: string | null
}

export type Lead = {
  id: number
  name: string
  company: string
  phone: string
  email: string
  topic: string
  message: string
  customers_estimate: number | null
  source: string
  lead_status: "NEW" | "CONTACTED" | "DEMO" | "WON" | "LOST"
  notes: string
  created_at: string
}

export type RouterImportPreview = {
  total_secrets: number
  new_customers: number
  already_imported: number
  other_services: number
  disabled_in_new: number
  capacity_left: number
  exceeds_limit: boolean
  profiles: {
    name: string
    rate_limit: string
    speed_mbps: number
    new_customers: number
    disabled_customers: number
    package_exists: boolean
    builtin: boolean
  }[]
  sample: { username: string; profile: string; comment: string; disabled: boolean }[]
}

export type RouterImportResult = {
  customers_created: number
  packages_created: number
  already_imported: number
  other_services: number
  skipped_over_limit: number
}

export type RouterProfile = {
  name: string
  rate_limit: string
  speed_mbps: number
  builtin: boolean
  package: { uid: string; name: string } | null
}
