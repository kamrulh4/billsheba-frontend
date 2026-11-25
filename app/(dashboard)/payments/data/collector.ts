import type { Payment } from "@/types/payments"

const ONLINE = ["BKASH", "NAGAD", "ROCKET", "ONLINE_PAYMENT"]

/** Who took the money: the staff member, or "Online" when the customer paid through the gateway. */
export function collectorName(p: Payment) {
  const by = p.entry_by
  const name = by ? `${by.first_name || ""} ${by.last_name || ""}`.trim() : ""
  if (name) return name
  return ONLINE.includes(p.payment_method) ? "Online" : "None"
}
