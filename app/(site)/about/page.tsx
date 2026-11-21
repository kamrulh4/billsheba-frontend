import {
  Building2,
  CreditCard,
  FileText,
  Gauge,
  Package,
  ShieldCheck,
  Users,
  Wifi,
} from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { contactInfo, ogImage, siteConfig } from "@/lib/site-config"
import { aboutPageSchema, breadcrumbSchema } from "@/lib/structured-data"

const title = "About"
const description =
  "Billsheba is billing and subscriber management software built for internet service providers in Bangladesh — one dashboard for customers, packages, invoices, payments and PPPoE sessions."

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "about billsheba",
    "ISP billing software company",
    "broadband management software Bangladesh",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/about",
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

const capabilities = [
  {
    id: "customers",
    icon: Users,
    title: "Subscriber management",
    description:
      "Keep every subscriber's profile, connection details, assigned package and billing status in one searchable place.",
  },
  {
    id: "packages",
    icon: Package,
    title: "Packages and plans",
    description:
      "Define speed tiers and monthly rates once, then assign them to subscribers and change them without recalculating by hand.",
  },
  {
    id: "billing",
    icon: FileText,
    title: "Automated bill generation",
    description:
      "Generate the month's invoices for every active subscriber in one run instead of building a spreadsheet each cycle.",
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments and dues",
    description:
      "Record collections against invoices, see who has paid, and act on overdue accounts before the month closes.",
  },
  {
    id: "sessions",
    icon: Wifi,
    title: "Session monitoring",
    description:
      "Follow PPPoE session activity so support can tell an outage apart from an expired account in seconds.",
  },
  {
    id: "organizations",
    icon: Building2,
    title: "Multi-organization support",
    description:
      "Run several branches, zones or resellers side by side, each with its own subscribers, staff and books.",
  },
  {
    id: "reporting",
    icon: Gauge,
    title: "Revenue reporting",
    description:
      "See collected revenue, pending revenue and subscriber growth on the dashboard as soon as you sign in.",
  },
  {
    id: "access",
    icon: ShieldCheck,
    title: "Role-based access",
    description:
      "Give collection staff, support agents and owners exactly the access their job needs, and nothing more.",
  },
]

const principles = [
  {
    id: "operators",
    title: "Built around how ISPs actually work",
    body: "Monthly cycles, cash collections, line-level support calls and repeated reconnections — Billsheba is shaped by those realities rather than by generic accounting software.",
  },
  {
    id: "simple",
    title: "Simple enough for daily use",
    body: "The people entering payments are not accountants. Every screen aims for the smallest number of steps that still keeps the books correct.",
  },
  {
    id: "local",
    title: "Local support, local context",
    body: "Bangladeshi ISPs, Bangladeshi billing habits, and a support line you can actually call. Bangla language support is on the way.",
  },
]

export default function AboutPage() {
  return (
    <>
      <JsonLd
        schema={[
          aboutPageSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <section className="bg-gradient-to-br from-background to-muted/30 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="font-medium text-primary text-sm uppercase tracking-wide">
              About us
            </p>
            <h1 className="font-bold text-4xl tracking-tight lg:text-5xl">
              Billing software built for{" "}
              <span className="text-primary">internet service providers</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {siteConfig.name} replaces the spreadsheets, notebooks and scattered
              messages that most small and mid-sized ISPs use to run billing. Subscribers,
              packages, invoices, payments and sessions live in one dashboard, so the
              month-end is a report you read rather than a night you spend rebuilding.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Talk to us</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Create an account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="font-bold text-3xl tracking-tight">Why we built it</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most internet service providers in Bangladesh start small — a few hundred
                connections, a register book, and a collector who knows every customer by
                name. That works until it doesn't. Once the subscriber count grows, dues
                get missed, packages get charged at the wrong rate, and nobody can say
                with confidence how much the month actually earned.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {siteConfig.name} exists to close that gap without asking an ISP to become
                a software company first. The system handles the repetitive parts —
                generating bills, tracking who has paid, flagging overdue lines — so the
                team can spend its time on the network and the customers.
              </p>
            </div>

            <div className="space-y-6">
              {principles.map((principle) => (
                <div className="space-y-2" key={principle.id}>
                  <h3 className="font-semibold text-foreground text-lg">
                    {principle.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {principle.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl space-y-4">
            <h2 className="font-bold text-3xl tracking-tight">What Billsheba covers</h2>
            <p className="text-lg text-muted-foreground">
              Everything an ISP needs to bill subscribers accurately and collect on time.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <Card className="border-0 bg-card/60 shadow-sm" key={capability.id}>
                <CardContent className="space-y-3 p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <capability.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base text-foreground">
                    {capability.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {capability.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 text-center lg:p-12">
            <h2 className="font-bold text-2xl tracking-tight lg:text-3xl">
              Want to see it on your own subscriber list?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Call or WhatsApp us at {contactInfo.phone} and we will walk you through{" "}
              {siteConfig.name} with your packages and billing cycle, not a demo dataset.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Contact us</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:${contactInfo.phoneIntl}`}>Call {contactInfo.phone}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
