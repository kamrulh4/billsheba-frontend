/**
 * How many SMS a message costs. Mirrors backend/common/sms_text.py: a text is one SMS only while it is
 * short — 160 characters in the plain GSM alphabet but just 70 once it contains any Bangla — and longer
 * texts are billed per part of 153 / 67 characters.
 */
const GSM_BASIC = new Set(
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà",
)
const GSM_EXTENDED = new Set("^{}\\[~]|€")

export const MAX_TEMPLATE_SEGMENTS = 1
export const MAX_BULK_SEGMENTS = 1

export function smsInfo(text: string) {
  const chars = Array.from(text)
  const gsm = chars.every((c) => GSM_BASIC.has(c) || GSM_EXTENDED.has(c))
  let length: number
  let single: number
  let multi: number
  if (gsm) {
    length = chars.reduce((n, c) => n + (GSM_EXTENDED.has(c) ? 2 : 1), 0)
    ;[single, multi] = [160, 153]
  } else {
    length = text.length // UTF-16 code units, which is what the SMS network counts
    ;[single, multi] = [70, 67]
  }
  const segments = length === 0 ? 0 : length <= single ? 1 : Math.ceil(length / multi)
  return { length, segments, perSegment: segments <= 1 ? single : multi }
}

/** The default texts used while an ISP has not written its own (kept in step with the backend). */
export const DEFAULT_TEMPLATES = {
  bill: "{month} মাসের বিল {amount}৳। {org}",
  payment: "{month} মাসের {amount}৳ পেয়েছি। ধন্যবাদ। {org}",
  suspend: "{month} মাসের বিল বকেয়া, সংযোগ বন্ধ। বিল দিন। {org}",
} as const

/** Fill the placeholders with typical values to estimate the real length. */
export function sampleMessage(template: string, org: string) {
  return template
    .replaceAll("{name}", "রহিম উদ্দিন")
    .replaceAll("{amount}", "1500")
    .replaceAll("{month}", "সেপ্টেম্বর")
    .replaceAll("{due_date}", "10")
    .replaceAll("{org}", org)
}
