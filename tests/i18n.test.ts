import { describe, expect, it } from "vitest"
import { localizeDigits, tr } from "@/lib/i18n"
import { messages } from "@/lib/i18n/messages"
import { phrase } from "@/lib/i18n/phrase-book"
import { plans, pricingFaqs, pricingFaqsBn } from "@/lib/plans"
import { alternateLocalePath, siteLinks } from "@/lib/site-links"

describe("messages", () => {
  const en = Object.keys(messages.en)
  const bn = Object.keys(messages.bn)

  it("every English key has a Bangla translation and vice versa", () => {
    expect(bn.sort()).toEqual(en.sort())
  })

  it("no translation is empty and Bangla differs from English for prose", () => {
    for (const key of en) {
      const k = key as keyof typeof messages.en
      expect(messages.bn[k].trim(), key).not.toBe("")
      expect(messages.en[k].trim(), key).not.toBe("")
    }
    expect(messages.bn["home.title"]).not.toBe(messages.en["home.title"])
  })

  it("placeholders survive translation", () => {
    for (const key of en) {
      const k = key as keyof typeof messages.en
      const tokens = (s: string) => (s.match(/\{[a-z_]+\}/g) ?? []).sort()
      expect(tokens(messages.bn[k]), key).toEqual(tokens(messages.en[k]))
    }
  })
})

describe("tr / digits / phrase book", () => {
  it("fills placeholders", () => {
    expect(tr("en", "banner.trial", { n: 3 })).toBe("Free trial: 3 day(s) left.")
    expect(tr("bn", "banner.trial", { n: 3 })).toContain("3")
  })
  it("renders Bangla digits only for bn", () => {
    expect(localizeDigits("1,200", "bn")).toBe("১,২০০")
    expect(localizeDigits("1,200", "en")).toBe("1,200")
  })
  it("phrase lookup falls back to the original text", () => {
    expect(phrase("Add Customer")).toBe("গ্রাহক যোগ করুন")
    expect(phrase("Some user-typed name")).toBe("Some user-typed name")
  })
})

describe("marketing content", () => {
  it("Bangla plan text mirrors English structure", () => {
    for (const plan of plans) {
      expect(plan.bn.features.length, plan.name).toBe(plan.features.length)
    }
    expect(pricingFaqsBn.length).toBe(pricingFaqs.length)
  })
  it("language switch paths are symmetric", () => {
    for (const path of ["/", "/pricing"]) {
      const alt = alternateLocalePath(path)
      expect(alt).not.toBeNull()
      expect(alternateLocalePath(alt as string)).toBe(path)
    }
    expect(alternateLocalePath("/about")).toBeNull()
  })
  it("every nav link has a Bangla target", () => {
    for (const link of siteLinks) expect(link.bn.startsWith("/")).toBe(true)
  })
})
