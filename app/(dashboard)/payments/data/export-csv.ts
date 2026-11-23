import { Payment } from "@/types/payments"

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`

/** Download the given payments (whatever the table currently shows) as an Excel-friendly CSV. */
export function downloadPaymentsCsv(rows: Payment[]) {
  const head = [
    "Date",
    "Customer",
    "Phone",
    "Username",
    "Month",
    "Bill",
    "Discount",
    "Paid",
    "Method",
    "TrxID",
    "Collected by",
    "Status",
  ]
  const lines = rows.map((p) => {
    const by = p.entry_by
    const collector = by ? `${by.first_name || ""} ${by.last_name || ""}`.trim() : ""
    return [
      p.payment_date ? new Date(p.payment_date).toISOString().slice(0, 10) : "",
      p.customer.name,
      p.customer.phone,
      p.customer.username,
      p.billing_month,
      p.bill_amount,
      p.discount,
      p.amount,
      p.payment_method,
      p.transaction_id,
      collector,
      p.paid ? "Paid" : "Unpaid",
    ]
      .map(cell)
      .join(",")
  })
  const total = rows.reduce((t, p) => t + (Number(p.amount) || 0), 0)
  const csv =
    "\ufeff" +
    [
      head.map(cell).join(","),
      ...lines,
      ["", "", "", "", "", "", "Total", total].map(cell).join(","),
    ].join("\r\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const a = document.createElement("a")
  a.href = url
  a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
