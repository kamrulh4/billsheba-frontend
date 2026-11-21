import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(text: string, defaultValue: string = "N/A") {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return defaultValue
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)

  if (words.length === 0) {
    return defaultValue
  }

  const initials = words
    .map((word) => word[0]?.toUpperCase() || "")
    .filter((char) => /[A-Za-z]/.test(char))
    .join("")

  return initials || defaultValue
}

const AVATAR_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#059669",
  "#0891b2",
  "#4f46e5",
  "#be123c",
]

/**
 * Initials avatar drawn locally as an SVG data URI. (It used to call a third-party avatar service,
 * which sent every customer's username to that service and made one extra request per row.)
 */
export function generateAvatarUrl(name: string) {
  const label = (getInitials(name, "?") || "?").slice(0, 2)
  let hash = 0
  for (const ch of name || "") hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  const color = AVATAR_COLORS[hash % AVATAR_COLORS.length]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${color}"/>` +
    `<text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-size="26" font-weight="600">${label}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function formatUptime(uptime: string): string {
  if (!uptime || typeof uptime !== "string") {
    return "Unknown"
  }

  // Parse the uptime string (e.g., "2w6d2h55m40s")
  const parts = uptime.match(/(\d+)w|(\d+)d|(\d+)h|(\d+)m|(\d+)s/g)

  if (!parts) {
    return uptime // Return original if can't parse
  }

  const timeMap: Record<string, string> = {
    w: "w",
    d: "d",
    h: "h",
    m: "m",
    s: "s",
  }

  const formattedParts: string[] = []

  parts.forEach((part) => {
    const match = part.match(/(\d+)([wdhms])/)
    if (match) {
      const [, value, unit] = match
      const num = parseInt(value, 10)

      // Only show significant time units
      if (unit === "w" && num > 0) {
        formattedParts.push(`${num}w`)
      } else if (unit === "d" && num > 0) {
        formattedParts.push(`${num}d`)
      } else if (unit === "h" && num > 0) {
        formattedParts.push(`${num}h`)
      } else if (unit === "m" && num > 0 && formattedParts.length < 3) {
        formattedParts.push(`${num}m`)
      } else if (unit === "s" && num > 0 && formattedParts.length < 3) {
        formattedParts.push(`${num}s`)
      }
    }
  })

  // Limit to 3 most significant parts for better readability
  return formattedParts.slice(0, 3).join(" ") || "0s"
}
