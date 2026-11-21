import type { NextConfig } from "next"

// Baseline browser hardening for every response. (A strict CSP needs per-request nonces with
// Next's inline scripts; add it with the nonce setup rather than a loose policy that breaks pages.)
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}

export default nextConfig
