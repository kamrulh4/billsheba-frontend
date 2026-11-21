import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site-config"

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #0b1220 0%, #14284d 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: "#2b7fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            fontWeight: 700,
          }}
        >
          B
        </div>
        <div style={{ fontSize: "40px", fontWeight: 600 }}>{siteConfig.name}</div>
      </div>

      <div
        style={{
          marginTop: "48px",
          fontSize: "68px",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
        }}
      >
        Billing & subscriber management for ISPs
      </div>

      <div
        style={{
          marginTop: "28px",
          fontSize: "30px",
          color: "#a9bad6",
          maxWidth: "900px",
          lineHeight: 1.4,
        }}
      >
        Customers, packages, invoices, payments and PPPoE sessions — in one dashboard.
      </div>

      <div style={{ marginTop: "56px", fontSize: "26px", color: "#7f93b5" }}>
        billsheba.com
      </div>
    </div>,
    size,
  )
}
