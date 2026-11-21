import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import type { Metadata } from "next"
import { ContactForm } from "@/app/(site)/contact/contact-form"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { contactInfo, ogImage, siteConfig, whatsappUrl } from "@/lib/site-config"
import { breadcrumbSchema, contactPageSchema, faqSchema } from "@/lib/structured-data"

const title = "Contact"
const description = `Talk to the ${siteConfig.name} team about ISP billing software. Call or WhatsApp ${contactInfo.phone}, or send us a message and we will get back to you the same working day.`

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "contact billsheba",
    "ISP billing software support",
    "billsheba phone number",
    `billsheba ${contactInfo.phone}`,
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/contact",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
    title: `${title} | ${siteConfig.name}`,
    description,
  },
}

const faqs = [
  {
    question: "How do I contact Billsheba?",
    answer: `Call or WhatsApp ${contactInfo.phone}, email ${contactInfo.email}, or fill in the contact form on this page. We are available ${contactInfo.hours}.`,
  },
  {
    question: "Can I see Billsheba before I buy it?",
    answer:
      "Yes. We run a walkthrough on a call using your own packages and billing cycle, so you can see how your subscriber list and monthly invoices would look.",
  },
  {
    question: "Can you move my existing subscriber data into Billsheba?",
    answer:
      "In most cases yes. If your current records are in Excel, another billing system, or even a register book, talk to us about it and we will tell you what the migration involves.",
  },
  {
    question: "How fast do you respond to support requests?",
    answer: `${contactInfo.responseTime} For urgent billing-day issues, calling ${contactInfo.phone} is the fastest route.`,
  },
]

export default function ContactPage() {
  return (
    <>
      <JsonLd
        schema={[
          contactPageSchema(),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <section className="bg-gradient-to-br from-background to-muted/30 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="font-medium text-primary text-sm uppercase tracking-wide">
              Contact
            </p>
            <h1 className="font-bold text-4xl tracking-tight lg:text-5xl">
              Let&apos;s talk about your{" "}
              <span className="text-primary">billing setup</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you run a few hundred connections or a few thousand, we are happy to
              look at how you bill today and show you what {siteConfig.name} would change.
              Call us, message us on WhatsApp, or use the form below.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <a href={`tel:${contactInfo.phoneIntl}`}>
                  <Phone className="h-4 w-4" />
                  Call {contactInfo.phone}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href={whatsappUrl(
                    `Hello ${siteConfig.name}, I would like to know more about your ISP billing software.`,
                  )}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20" id="support">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-2">
                <h2 className="font-bold text-2xl tracking-tight">Reach us directly</h2>
                <p className="text-muted-foreground">{contactInfo.responseTime}</p>
              </div>

              <Card className="border-border">
                <CardContent className="space-y-5 p-6">
                  <a
                    className="flex items-start gap-4 transition-colors hover:text-primary"
                    href={`tel:${contactInfo.phoneIntl}`}
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </span>
                    <span>
                      <span className="block font-medium text-foreground text-sm">
                        Phone
                      </span>
                      <span className="block text-muted-foreground text-sm">
                        {contactInfo.phone}
                      </span>
                    </span>
                  </a>

                  <a
                    className="flex items-start gap-4 transition-colors hover:text-primary"
                    href={whatsappUrl(`Hello ${siteConfig.name}, I have a question.`)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </span>
                    <span>
                      <span className="block font-medium text-foreground text-sm">
                        WhatsApp
                      </span>
                      <span className="block text-muted-foreground text-sm">
                        {contactInfo.phone}
                      </span>
                    </span>
                  </a>

                  <a
                    className="flex items-start gap-4 transition-colors hover:text-primary"
                    href={`mailto:${contactInfo.email}`}
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </span>
                    <span>
                      <span className="block font-medium text-foreground text-sm">
                        Email
                      </span>
                      <span className="block text-muted-foreground text-sm">
                        {contactInfo.email}
                      </span>
                    </span>
                  </a>

                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </span>
                    <span>
                      <span className="block font-medium text-foreground text-sm">
                        Working hours
                      </span>
                      <span className="block text-muted-foreground text-sm">
                        {contactInfo.hours}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </span>
                    <span>
                      <span className="block font-medium text-foreground text-sm">
                        Location
                      </span>
                      <span className="block text-muted-foreground text-sm">
                        {contactInfo.address.city}, {contactInfo.address.country}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="border-border">
                <CardContent className="space-y-6 p-6 lg:p-8">
                  <div className="space-y-2">
                    <h2 className="font-bold text-2xl tracking-tight">Send a message</h2>
                    <p className="text-muted-foreground text-sm">
                      Fill this in and we will continue the conversation on WhatsApp.
                    </p>
                  </div>

                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 lg:py-20" id="faq">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-bold text-3xl tracking-tight">
              Frequently asked questions
            </h2>

            <dl className="mt-8 space-y-6">
              {faqs.map((faq) => (
                <div
                  className="rounded-xl border border-border bg-card p-6"
                  key={faq.question}
                >
                  <dt className="font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
