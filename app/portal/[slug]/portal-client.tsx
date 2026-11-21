"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { CheckCircle2, Wifi } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"
import { httpV1 } from "@/lib/xior"
import { useT } from "@/providers/locale-provider"
import type { PortalInfo, PortalLookup } from "@/types/saas"

export function PortalClient({ slug }: { slug: string }) {
  const { t, money: taka, locale, setLocale } = useT()
  const [phone, setPhone] = useState("")
  const [trx, setTrx] = useState("")
  const [method, setMethod] = useState("BKASH")
  const [amount, setAmount] = useState("")
  const [subject, setSubject] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [payNow, setPayNow] = useState("")
  const [token, setToken] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [otp, setOtp] = useState("")
  const returned = useSearchParams()
  const bkashResult = returned.get("bkash")
  const presetPhone = returned.get("phone") // arrives from /pay-bill, which already asked for the number
  const autoLookedUp = useRef(false)

  const info = useQuery({
    queryKey: ["portal", slug],
    queryFn: () => httpV1.get<PortalInfo>(`/portal/${slug}`).then((r) => r.data),
    retry: 0,
  })

  const lookup = useMutation({
    // `phone` can be passed in because state set a moment ago is not visible to this closure yet
    mutationFn: (arg?: { token?: string; phone?: string }) =>
      httpV1
        .post<PortalLookup>(`/portal/${slug}/lookup`, {
          phone: arg?.phone ?? phone,
          token: arg?.token ?? token,
        })
        .then((r) => r.data),
    onSuccess: (d) => setAmount(String(Number(d.total_due) || "")),
  })

  // coming from /pay-bill: fill the number in and show the bill straight away, unless the ISP asks for a code first
  useEffect(() => {
    if (!presetPhone || autoLookedUp.current || !info.data) return
    autoLookedUp.current = true
    setPhone(presetPhone)
    if (!info.data.otp_required) lookup.mutate({ phone: presetPhone })
  }, [presetPhone, info.data, lookup])

  const sendCode = useMutation({
    mutationFn: () => httpV1.post(`/portal/${slug}/otp`, { phone }),
    onSuccess: () => {
      setCodeSent(true)
      toast.success(t("portal.codeSent"))
    },
  })

  const verifyCode = useMutation({
    mutationFn: () =>
      httpV1
        .post<{ token: string }>(`/portal/${slug}/verify`, { phone, otp })
        .then((r) => r.data),
    onSuccess: (d) => {
      setToken(d.token)
      setCodeSent(false)
      setOtp("")
      lookup.mutate({ token: d.token }) // straight to the bill, no extra click
    },
  })

  const bkashCheckout = useMutation({
    mutationFn: () =>
      httpV1
        .post<{ bkash_url: string }>(`/portal/${slug}/bkash/create`, {
          phone,
          token,
          amount: payNow || undefined,
        })
        .then((r) => r.data),
    onSuccess: (d) => {
      window.location.href = d.bkash_url
    },
  })

  const pay = useMutation({
    mutationFn: () =>
      httpV1.post(`/portal/${slug}/pay`, {
        phone,
        token,
        amount,
        transaction_id: trx,
        payment_method: method,
      }),
    onSuccess: () => setSubmitted(true),
  })

  const complain = useMutation({
    mutationFn: () =>
      httpV1.post(`/portal/${slug}/complaints`, { phone, subject, token }),
    onSuccess: () => {
      toast.success(t("portal.complaintSent"))
      setSubject("")
    },
  })

  if (info.isError) {
    return (
      <p className="p-10 text-center text-muted-foreground">{t("portal.notFound")}</p>
    )
  }

  const org = info.data
  const numbers = org
    ? [
        ["BKASH", org.bkash_number],
        ["NAGAD", org.nagad_number],
        ["ROCKET", org.rocket_number],
      ].filter(([, n]) => n)
    : []

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 py-10">
      <div className="flex items-center gap-2">
        <Wifi className="size-6 text-primary" />
        <h1 className="font-semibold text-2xl">{org?.name ?? "…"}</h1>
        <button
          type="button"
          className="ml-auto text-muted-foreground text-sm underline"
          onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
        >
          {locale === "bn" ? "English" : "বাংলা"}
        </button>
      </div>

      {bkashResult && (
        <p
          role="status"
          className={`rounded-md p-3 text-sm ${
            bkashResult === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
          }`}
        >
          {bkashResult === "success"
            ? t("portal.bkashSuccess", { trx: returned.get("trx") ?? "" })
            : bkashResult === "cancelled"
              ? t("portal.bkashCancelled")
              : t("portal.bkashFailed")}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("portal.checkBill")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="phone">{t("portal.yourNumber")}</Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              inputMode="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {info.data?.otp_required && !token ? (
              <Button
                onClick={() => sendCode.mutate()}
                loading={sendCode.isPending}
                disabled={!phone}
              >
                {t("portal.sendCode")}
              </Button>
            ) : (
              <Button
                onClick={() => lookup.mutate(undefined)}
                loading={lookup.isPending}
                disabled={!phone}
              >
                {t("portal.check")}
              </Button>
            )}
          </div>
          {info.data?.otp_required && !token && codeSent && (
            <div className="flex gap-2 pt-2">
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder={t("portal.enterCode")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                onClick={() => verifyCode.mutate()}
                loading={verifyCode.isPending}
                disabled={otp.length < 6}
              >
                {t("portal.verify")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {lookup.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {t("portal.hello")}, {lookup.data.name}
              </span>
              <Badge variant={lookup.data.is_active ? "default" : "destructive"}>
                {lookup.data.is_active ? t("portal.connected") : t("portal.suspended")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lookup.data.package && (
              <p className="text-muted-foreground text-sm">
                {t("portal.package")}: {lookup.data.package}
              </p>
            )}
            {Number(lookup.data.total_due) === 0 ? (
              <p className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="size-5" /> {t("portal.noDue")}
              </p>
            ) : (
              <>
                <p className="font-bold text-3xl">{taka(lookup.data.total_due)}</p>
                <ul className="text-sm">
                  {lookup.data.bills.map((b) => (
                    <li
                      key={`${b.month}-${b.year}`}
                      className="flex justify-between border-b py-1"
                    >
                      <span>
                        {b.month} {b.year}
                      </span>
                      <span>{taka(b.due)}</span>
                    </li>
                  ))}
                </ul>

                {org?.online_payment && (
                  <div className="space-y-2 rounded-md border border-pink-200 bg-pink-50/50 p-3 dark:border-pink-900 dark:bg-pink-950/20">
                    <Label htmlFor="payNow" className="text-xs">
                      {t("portal.partial")}
                    </Label>
                    <Input
                      id="payNow"
                      type="number"
                      min="1"
                      max={Number(lookup.data.total_due)}
                      placeholder={String(Number(lookup.data.total_due))}
                      value={payNow}
                      onChange={(e) => setPayNow(e.target.value)}
                    />
                    <Button
                      className="w-full bg-[#e2136e] text-white hover:bg-[#c8105f]"
                      loading={bkashCheckout.isPending}
                      onClick={() => bkashCheckout.mutate()}
                    >
                      {t("portal.payBkash", {
                        amount: taka(payNow || lookup.data.total_due),
                      })}
                    </Button>
                    <p className="text-center text-muted-foreground text-xs">
                      {t("portal.orManual")}
                    </p>
                  </div>
                )}

                {submitted ? (
                  <p className="rounded-md bg-green-50 p-3 text-green-700 text-sm dark:bg-green-950 dark:text-green-300">
                    {t("portal.submitted")}
                  </p>
                ) : (
                  <div className="space-y-3 rounded-md border p-3">
                    <p className="font-medium text-sm">
                      {t("portal.step1")}{" "}
                      {numbers.length
                        ? numbers.map(([m, n]) => `${m} ${n}`).join(" · ")
                        : `${t("portal.callUs")} ${org?.phone}`}
                    </p>
                    <p className="font-medium text-sm">{t("portal.step2")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        className="h-9 rounded-md border bg-transparent px-2 text-sm"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                      >
                        <option value="BKASH">bKash</option>
                        <option value="NAGAD">Nagad</option>
                        <option value="ROCKET">Rocket</option>
                      </select>
                      <Input
                        className="col-span-2"
                        placeholder={t("portal.trxPlaceholder")}
                        value={trx}
                        onChange={(e) => setTrx(e.target.value)}
                      />
                    </div>
                    <Input
                      type="number"
                      placeholder={t("portal.amountSent")}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button
                      className="w-full"
                      onClick={() => pay.mutate()}
                      loading={pay.isPending}
                      disabled={!trx || !amount}
                    >
                      {t("portal.submit")}
                    </Button>
                  </div>
                )}
              </>
            )}

            {lookup.data.history.length > 0 && (
              <div className="space-y-1 border-t pt-4">
                <p className="font-medium text-sm">{t("portal.history")}</p>
                <ul className="text-sm">
                  {lookup.data.history.map((h) => (
                    <li
                      key={`${h.trx}-${h.month}-${h.year}-${h.amount}`}
                      className="flex justify-between py-1 text-muted-foreground"
                    >
                      <span>
                        {h.month} {h.year} · {h.method}
                      </span>
                      <span>{taka(h.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="subject">{t("portal.problem")}</Label>
              <Textarea
                id="subject"
                rows={2}
                placeholder={t("portal.problemPlaceholder")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => complain.mutate()}
                loading={complain.isPending}
                disabled={subject.trim().length < 3}
              >
                {t("portal.sendComplaint")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
