/**
 * schema.org JSON-LD builders. Rendered by <JsonLd /> so search engines can show
 * rich results (sitelinks, org panel, phone number) for the marketing pages.
 */

import { plans } from "@/lib/plans"
import { absoluteUrl, contactInfo, siteConfig } from "@/lib/site-config"

const ORGANIZATION_ID = absoluteUrl("/#organization")
const WEBSITE_ID = absoluteUrl("/#website")

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.svg"),
    description: siteConfig.description,
    email: contactInfo.email,
    telephone: contactInfo.phoneIntl,
    address: {
      "@type": "PostalAddress",
      addressLocality: contactInfo.address.city,
      addressRegion: contactInfo.address.region,
      addressCountry: contactInfo.address.countryCode,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: contactInfo.phoneIntl,
        contactType: "customer support",
        areaServed: contactInfo.address.countryCode,
        availableLanguage: ["en", "bn"],
      },
      {
        "@type": "ContactPoint",
        telephone: contactInfo.phoneIntl,
        contactType: "sales",
        areaServed: contactInfo.address.countryCode,
        availableLanguage: ["en", "bn"],
      },
    ],
  }
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  }
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Billing Software",
    operatingSystem: "Web browser",
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": ORGANIZATION_ID },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BDT",
      lowPrice: 0,
      highPrice: 3000,
      offerCount: 4,
      url: absoluteUrl("/pricing"),
    },
    featureList: [
      "Subscriber and customer management with CSV import",
      "Internet package and plan management",
      "Automated monthly bill generation",
      "bKash, Nagad and Rocket payment portal for customers",
      "Bangla SMS bill reminders and receipts",
      "MikroTik PPPoE auto disable and enable",
      "Expense tracking and profit reports",
      "Complaint and support ticket management",
      "Multi-staff roles and permissions",
    ],
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteConfig.name}`,
    url: absoluteUrl("/contact"),
    description: `Talk to the ${siteConfig.name} team about billing software for your ISP. Call or WhatsApp ${contactInfo.phone}.`,
    mainEntity: { "@id": ORGANIZATION_ID },
  }
}

export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${siteConfig.name}`,
    url: absoluteUrl("/about"),
    description: `What ${siteConfig.name} is, who builds it, and why internet service providers use it.`,
    mainEntity: { "@id": ORGANIZATION_ID },
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}

/** Product with one Offer per plan so pricing can appear as rich results. */
export function pricingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${siteConfig.name} ISP Billing Software`,
    description: siteConfig.description,
    brand: { "@id": ORGANIZATION_ID },
    url: absoluteUrl("/pricing"),
    offers: plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price,
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/register"),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: plan.price,
        priceCurrency: "BDT",
        unitText: "MONTH",
      },
    })),
  }
}
