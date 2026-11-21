import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private app surfaces: no crawl value, and they would leak thin
        // duplicate pages into the index.
        disallow: [
          "/dashboard",
          "/customers",
          "/organizations",
          "/packages",
          "/payments",
          "/sessions",
          "/settings",
          "/users",
          "/profile",
          "/expenses",
          "/complaints",
          "/reports",
          "/payment-requests",
          "/sms",
          "/audit",
          "/receipt",
          "/billing",
          "/platform",
          "/portal",
          "/dash",
          "/api/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  }
}
