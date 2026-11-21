"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, MessageCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { contactInfo, whatsappUrl } from "@/lib/site-config"
import { toast } from "@/lib/toast"
import { httpV1 } from "@/lib/xior"

const topics = [
  { value: "demo", label: "Request a demo" },
  { value: "pricing", label: "Pricing and plans" },
  { value: "support", label: "Technical support" },
  { value: "migration", label: "Moving from another system" },
  { value: "partnership", label: "Partnership or reseller" },
  { value: "other", label: "Something else" },
] as const

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  company: z.string().optional(),
  phone: z
    .string()
    .min(11, "Please enter a valid phone number")
    .regex(/^[0-9+\-\s]+$/, "Phone can only contain digits, +, - and spaces"),
  email: z.union([z.string().email("Enter a valid email"), z.literal("")]).optional(),
  topic: z.enum(["demo", "pricing", "support", "migration", "partnership", "other"]),
  message: z.string().min(10, "Please describe your requirement in a little more detail"),
})

type ContactValues = z.infer<typeof contactSchema>

function composeMessage(values: ContactValues) {
  const topicLabel =
    topics.find((topic) => topic.value === values.topic)?.label ?? values.topic

  return [
    `Hello Billsheba, I would like to talk about: ${topicLabel}`,
    "",
    `Name: ${values.name}`,
    values.company ? `ISP / Company: ${values.company}` : null,
    `Phone: ${values.phone}`,
    values.email ? `Email: ${values.email}` : null,
    "",
    `Message: ${values.message}`,
  ]
    .filter(Boolean)
    .join("\n")
}

export function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      topic: "demo",
      message: "",
    },
  })

  // Save the enquiry first so it is never lost, whatever happens with WhatsApp afterwards.
  function saveLead(values: ContactValues) {
    return httpV1
      .post("/leads", {
        name: values.name,
        company: values.company ?? "",
        phone: values.phone,
        email: values.email ?? "",
        topic: values.topic,
        message: values.message,
        source: typeof window !== "undefined" ? window.location.pathname : "",
      })
      .catch(() => undefined) // a failed save must not block contacting us
  }

  async function onSubmit(values: ContactValues) {
    await saveLead(values)
    const url = whatsappUrl(composeMessage(values))
    const opened = window.open(url, "_blank", "noopener,noreferrer")

    if (opened) {
      toast.success("Opening WhatsApp with your message ready to send.")
      return
    }

    // Pop-up blockers return null; fall back to navigating in place.
    toast.info("Redirecting you to WhatsApp…")
    window.location.href = url
  }

  function onEmailInstead() {
    form.handleSubmit(async (values) => {
      await saveLead(values)
      const subject = `Billsheba enquiry — ${values.name}`
      window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(composeMessage(values))}`
    })()
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Kamrul Hasan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  ISP / company{" "}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="organization"
                    placeholder="Sheba Broadband"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone / WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="01XXXXXXXXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-muted-foreground text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is this about?</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How many subscribers do you have, and what are you using for billing right now?"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Sending opens WhatsApp with this message already written for{" "}
                {contactInfo.phone}. Nothing is stored on this website.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="sm:flex-1" size="lg" type="submit">
            <MessageCircle className="h-4 w-4" />
            Send on WhatsApp
          </Button>
          <Button
            className="sm:flex-1"
            onClick={onEmailInstead}
            size="lg"
            type="button"
            variant="outline"
          >
            <Mail className="h-4 w-4" />
            Send as email
          </Button>
        </div>
      </form>
    </Form>
  )
}
