import { describe, expect, it } from "vitest"
import { DEFAULT_TEMPLATES, sampleMessage, smsInfo } from "@/lib/sms"

describe("smsInfo (must match backend/common/sms_text.py)", () => {
  it("English is 160 then 153 per part", () => {
    expect(smsInfo("a".repeat(160)).segments).toBe(1)
    expect(smsInfo("a".repeat(161)).segments).toBe(2)
  })
  it("Bangla is 70 then 67 per part", () => {
    expect(smsInfo("ক".repeat(70)).segments).toBe(1)
    expect(smsInfo("ক".repeat(71)).segments).toBe(2)
    expect(smsInfo("ক".repeat(140)).segments).toBe(3)
    expect(smsInfo("a".repeat(100) + "ক").segments).toBe(2)
  })
  it("empty costs nothing; GSM extended chars count double", () => {
    expect(smsInfo("").segments).toBe(0)
    expect(smsInfo("{".repeat(80)).length).toBe(160)
  })
  it("default templates fit one SMS", () => {
    for (const t of Object.values(DEFAULT_TEMPLATES)) {
      expect(smsInfo(sampleMessage(t, "Gulbahar Net")).segments).toBe(1)
    }
  })
})
