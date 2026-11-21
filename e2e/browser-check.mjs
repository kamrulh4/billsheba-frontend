// Real-browser smoke test: opens every page (public, ISP admin, platform owner) and fails on any console
// error, hydration mismatch or third-party request. Needs the demo data: `python manage.py seed_demo` and a
// platform owner (01999000000 / Plat@12345). Run with both servers up: `pnpm e2e`.
import { chromium } from "playwright"

const BASE = process.env.BASE || "http://localhost:3000"
const browser = await chromium.launch()
const issues = []

async function visit(ctx, path, label = path) {
  const page = await ctx.newPage()
  const found = []
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type()))
      found.push(`[${m.type()}] ${m.text().split("\n")[0].slice(0, 160)}`)
  })
  page.on("pageerror", (e) =>
    found.push(`[pageerror] ${String(e.message).split("\n")[0].slice(0, 160)}`),
  )
  page.on("request", (r) => {
    if (!r.url().startsWith("http://localhost") && !r.url().startsWith("data:"))
      found.push(`[thirdParty] ${r.url().slice(0, 90)}`)
  })
  page.on("requestfailed", (r) => found.push(`[requestfailed] ${r.url().slice(0, 100)}`))
  const res = await page
    .goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 })
    .catch((e) => ({ status: () => `ERR ${e.message.slice(0, 60)}` }))
  await page.waitForTimeout(800)
  const hydration = found.filter((f) => /hydrat/i.test(f))
  console.log(
    `${label.padEnd(34)} ${String(res.status()).padEnd(4)} ${found.length ? `${found.length} console issue(s)${hydration.length ? " [HYDRATION]" : ""}` : "clean"}`,
  )
  for (const f of found) console.log("      ", f)
  if (found.length) issues.push([label, found])
  await page.close()
}

// ---- anonymous pages
const anon = await browser.newContext()
for (const p of [
  "/",
  "/bn",
  "/pricing",
  "/bn/pricing",
  "/about",
  "/contact",
  "/login",
  "/register",
  "/forgot-password",
  "/terms",
  "/privacy",
  "/refund-policy",
  "/portal/demo-broadband",
  "/no-such-page",
])
  await visit(anon, p)

// ---- ISP admin
const isp = await browser.newContext()
const lp = await isp.newPage()
await lp.goto(BASE + "/login", { waitUntil: "networkidle" })
await lp.fill('input[placeholder*="mobile" i], input[type="text"]', "01700000000")
await lp.fill('input[type="password"]', "Demo@12345")
await Promise.all([
  lp.waitForURL(/dashboard|\/$/, { timeout: 30000 }).catch(() => {}),
  lp.click('button[type="submit"]'),
])
await lp.waitForTimeout(1500)
console.log("-- logged in as ISP admin, now at:", lp.url().replace(BASE, ""))
await lp.close()
for (const p of [
  "/dashboard",
  "/customers",
  "/payments",
  "/packages",
  "/payment-requests",
  "/complaints",
  "/expenses",
  "/reports",
  "/sms",
  "/audit",
  "/users",
  "/sessions",
  "/settings",
  "/billing",
  "/profile",
])
  await visit(isp, p)

// ---- platform owner
const owner = await browser.newContext()
const op = await owner.newPage()
await op.goto(BASE + "/login", { waitUntil: "networkidle" })
await op.fill('input[type="text"]', "01999000000")
await op.fill('input[type="password"]', "Plat@12345")
await Promise.all([
  op.waitForURL(/dashboard|\/$/, { timeout: 30000 }).catch(() => {}),
  op.click('button[type="submit"]'),
])
await op.waitForTimeout(1500)
await op.close()
for (const p of ["/platform", "/organizations", "/dashboard"])
  await visit(owner, p, `owner ${p}`)

await browser.close()
// Expected noise: the 404 page logs its own 404, and the platform owner's /dashboard redirects to /platform
// (aborting the dashboard's in-flight requests). Anything else is a regression.
const EXPECTED = new Set(["/no-such-page", "owner /dashboard"])
const unexpected = issues.filter(([label]) => !EXPECTED.has(label))
console.log(
  `\nPAGES WITH CONSOLE ISSUES: ${issues.length} (unexpected: ${unexpected.length})`,
)
if (unexpected.length) {
  for (const [label] of unexpected) console.log(`  UNEXPECTED: ${label}`)
  process.exit(1)
}
