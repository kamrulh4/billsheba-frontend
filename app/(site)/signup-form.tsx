"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useSignup } from "@/hooks/rq/use-auth-query"
import { useT } from "@/providers/locale-provider"

const bdPhone = /^(?:\+?88)?01[3-9]\d{8}$/

const schema = z
  .object({
    organization_name: z.string().min(2, "ISP / company name is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().optional(),
    phone: z.string().regex(bdPhone, "Enter a valid mobile number, e.g. 01712345678"),
    email: z.string().email("Enter a valid email"),
    address: z.string().optional(),
    password: z.string().min(8, "At least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type Values = z.infer<typeof schema>

export function SignupForm() {
  const { t } = useT()
  const { mutate, isPending } = useSignup()
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      organization_name: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      address: "",
      password: "",
      confirm_password: "",
    },
  })

  const text = (name: keyof Values, label: string, placeholder = "", hint?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Card className="w-full max-w-lg border-0 bg-card/50 shadow-xl backdrop-blur">
      <CardHeader className="space-y-1 text-center">
        <h1 className="font-semibold text-2xl">{t("auth.signupTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("auth.signupSub")}</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4">
            {text("organization_name", t("auth.orgName"), "e.g. Net Zone Broadband")}
            <div className="grid gap-4 sm:grid-cols-2">
              {text("first_name", t("auth.firstName"))}
              {text("last_name", t("auth.lastName"))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {text("phone", t("auth.phone"), "01712345678", t("auth.phoneHint"))}
              {text("email", t("auth.email"), "you@example.com")}
            </div>
            {text("address", t("auth.address"))}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.password")}</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-11 w-full" loading={isPending}>
              {t("auth.createBtn")}
            </Button>
            <p className="text-center text-muted-foreground text-sm">
              {t("auth.haveAccount")}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t("common.signIn")}
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
