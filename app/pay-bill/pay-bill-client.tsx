"use client"

import { useMutation } from "@tanstack/react-query"
import { Wifi } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { httpV1 } from "@/lib/xior"
import { useT } from "@/providers/locale-provider"

type Isp = { name: string; slug: string }

/** One field: the customer's mobile number. We find their ISP and carry on in that ISP's portal. */
export function PayBillClient() {
  const router = useRouter()
  const { p } = useT()
  const [phone, setPhone] = useState("")

  const go = (slug: string) =>
    router.push(`/portal/${slug}?phone=${encodeURIComponent(phone.trim())}`)

  const find = useMutation({
    mutationFn: () =>
      httpV1
        .post<{ isps: Isp[] }>("/portal/find", { phone: phone.trim() })
        .then((r) => r.data.isps),
    onSuccess: (isps) => {
      if (isps.length === 1) go(isps[0].slug) // the usual case: straight to the bill
    },
  })

  const isps = find.data
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-4 py-10">
      <div className="flex items-center justify-center gap-2 font-semibold text-xl">
        <Wifi className="size-6 text-primary" /> Billsheba
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">
            <Tx>Pay your internet bill</Tx>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (phone.trim()) find.mutate()
            }}
          >
            <Input
              inputMode="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                find.reset()
              }}
            />
            <Button
              type="submit"
              className="w-full"
              loading={find.isPending}
              disabled={!phone.trim()}
            >
              <Tx>Find my bill</Tx>
            </Button>
          </form>

          {isps && isps.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">
              <Tx>
                No internet provider found for this number. Check the number or ask your
                provider.
              </Tx>
            </p>
          )}
          {isps && isps.length > 1 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                <Tx>This number is with more than one provider. Choose yours:</Tx>
              </p>
              {isps.map((isp) => (
                <Button
                  key={isp.slug}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => go(isp.slug)}
                  aria-label={`${p("Choose")} ${isp.name}`}
                >
                  {isp.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
