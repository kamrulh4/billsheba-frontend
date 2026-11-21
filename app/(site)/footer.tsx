import { Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/app/(site)/brand-logo"
import type { Locale } from "@/lib/i18n"
import { contactInfo, footerNav, siteConfig, whatsappUrl } from "@/lib/site-config"

const bnFooter = {
  description:
    "বাংলাদেশের আইএসপিদের জন্য বিলিং ও গ্রাহক ব্যবস্থাপনা সফটওয়্যার — গ্রাহক, প্যাকেজ, বিল, পেমেন্ট ও সেশন এক ড্যাশবোর্ডে।",
  sections: { product: "প্রোডাক্ট", company: "কোম্পানি", resources: "সহায়তা" } as Record<
    string,
    string
  >,
  links: {
    Features: "ফিচার",
    Pricing: "মূল্য তালিকা",
    "Free trial": "ফ্রি ট্রায়াল",
    Login: "লগইন",
    About: "আমাদের সম্পর্কে",
    Contact: "যোগাযোগ",
    Support: "সাপোর্ট",
    "Frequently asked questions": "সাধারণ জিজ্ঞাসা",
    "Call us": "ফোন করুন",
    WhatsApp: "হোয়াটসঅ্যাপ",
  } as Record<string, string>,
  rights: "সর্বস্বত্ব সংরক্ষিত।",
}

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const bn = locale === "bn"
  return (
    <footer className="border-border border-t bg-card pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <BrandLogo />
            <p className="text-muted-foreground text-sm leading-relaxed">
              {bn ? bnFooter.description : siteConfig.shortDescription}
            </p>
          </div>

          {footerNav.map((section) => (
            <div className="space-y-4" key={section.id}>
              <h2 className="font-semibold text-foreground text-sm">
                {bn ? (bnFooter.sections[section.id] ?? section.title) : section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("/") ? (
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href={bn && link.href === "/pricing" ? "/bn/pricing" : link.href}
                      >
                        {bn ? (bnFooter.links[link.name] ?? link.name) : link.name}
                      </Link>
                    ) : (
                      <a
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href={link.href}
                        rel="noopener noreferrer"
                      >
                        {bn ? (bnFooter.links[link.name] ?? link.name) : link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 border-border border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <a
            className="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
            href={`tel:${contactInfo.phoneIntl}`}
          >
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            {contactInfo.phone}
          </a>
          <a
            className="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
            href={whatsappUrl(`Hello ${siteConfig.name}, I would like to know more.`)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
            WhatsApp {contactInfo.phone}
          </a>
          <a
            className="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
            href={`mailto:${contactInfo.email}`}
          >
            <Mail className="h-4 w-4 shrink-0 text-primary" />
            {contactInfo.email}
          </a>
          <p className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            {contactInfo.address.city}, {contactInfo.address.country}
          </p>
        </div>

        <div className="mt-8 border-border border-t pt-8">
          <p className="text-center text-muted-foreground text-sm">
            © {siteConfig.copyrightYear} {siteConfig.name}.{" "}
            {bn ? bnFooter.rights : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
