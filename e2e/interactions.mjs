// Click-through test: signup, package + customer forms, theme/language toggles, command palette, mobile
// layout and the customer portal. Needs the demo data (`python manage.py seed_demo`) and both servers up.
import { chromium } from "playwright"

const B = process.env.BASE || "http://localhost:3000"
const b = await chromium.launch()
const newCtx = async (opts) => {
  const c = await b.newContext(opts)
  c.setDefaultTimeout(10000)
  return c
}
const results = []
const ok = (name, cond, detail = "") => {
  results.push([!!cond, name, cond ? "" : detail])
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : "  -> " + detail}`)
}
const watch = (page, bucket) => {
  page.on("pageerror", (e) => bucket.push("pageerror: " + e.message.slice(0, 100)))
  page.on(
    "console",
    (m) =>
      m.type() === "error" &&
      !/Failed to load resource/.test(m.text()) &&
      bucket.push("console: " + m.text().slice(0, 100)),
  )
}

// ---------- 1. brand-new ISP signs up through the real form
const ctx = await newCtx({ viewport: { width: 1366, height: 800 } })
const page = await ctx.newPage()
const errs = []
watch(page, errs)
const phone = "0171" + String(Math.floor(Math.random() * 9e6) + 1e6)
await page.goto(B + "/", { waitUntil: "networkidle" })
await page.screenshot({ path: "e2e-shots/01-landing.png" })
ok(
  "landing shows the new headline",
  await page
    .locator("h1")
    .first()
    .textContent()
    .then((t) => /Stop chasing bills/.test(t)),
)
await page
  .getByRole("link", { name: /Start free/i })
  .first()
  .click()
await page.waitForURL(/register/)
await page.fill('input[placeholder*="Net Zone"]', "Browser Test Net")
const inputs = page.locator("form input")
await page.getByLabel(/First name/i).fill("Tester")
await page.getByLabel(/Mobile number/i).fill(phone)
await page.getByLabel(/^Email/i).fill(`t${phone}@example.com`)
const pw = page.locator('input[type="password"]')
await pw.nth(0).fill("Str0ng!Pass-2026")
await pw.nth(1).fill("Str0ng!Pass-2026")
await page.getByRole("button", { name: /Create account/i }).click()
await page.waitForURL(/dashboard/, { timeout: 30000 }).catch(() => {})
await page.waitForTimeout(2500)
ok("signup lands on the dashboard", /dashboard/.test(page.url()), page.url())
ok(
  "onboarding checklist is shown to a new ISP",
  await page
    .getByText(/Setup \d\/4/)
    .isVisible()
    .catch(() => false),
)
ok(
  "trial banner is shown",
  await page
    .getByText(/Free trial: \d+ day/i)
    .isVisible()
    .catch(() => false),
)
await page.screenshot({ path: "e2e-shots/02-new-isp-dashboard.png" })

// ---------- 2. create a package through the UI
await page.goto(B + "/packages", { waitUntil: "networkidle" })
await page.getByRole("button", { name: /Add Package/i }).click()
await page.getByPlaceholder(/Enter package name/i).fill("Home 10")
await page.locator('input[name="speed_mbps"]').fill("10")
await page.getByPlaceholder(/Enter price/i).fill("600")
await page.getByRole("button", { name: /Create Package/i }).click()
await page.waitForTimeout(1500)
ok(
  "package appears as a card",
  await page
    .getByText("Home 10", { exact: true })
    .first()
    .isVisible()
    .catch(() => false),
)
ok(
  "the card names the router profile",
  await page
    .getByText("Router profile")
    .first()
    .isVisible()
    .catch(() => false),
)
await page.screenshot({ path: "e2e-shots/03-packages.png" })

// ---------- 3. add a customer through the UI
await page.goto(B + "/customers", { waitUntil: "networkidle" })
await page.getByRole("button", { name: /Add Customer/i }).click()
await page.waitForTimeout(500)
await page.locator('input[name="name"]').fill("Browser Customer")
await page.locator('input[name="phone"]').fill("01811223344")
await page.locator('input[name="username"]').fill("browseruser")
await page.locator('input[name="password"]').fill("pw123456")
const dlg = page.getByRole("dialog")
await dlg.getByRole("combobox").nth(0).click()
await page.getByRole("option", { name: /Home 10/ }).click()
await dlg.getByRole("combobox").nth(1).click()
await page.getByRole("option", { name: /PPPoE/ }).click()
await page.screenshot({ path: "e2e-shots/04-customer-form.png" })
const submit = page
  .getByRole("dialog")
  .getByRole("button", { name: /Create|Save/i })
  .last()
await submit.scrollIntoViewIfNeeded()
await submit.click()
await page.waitForTimeout(2000)
await page.screenshot({ path: "e2e-shots/04b-after-customer-save.png" })
ok(
  "customer appears in the list",
  await page
    .getByRole("cell", { name: /Browser Customer/ })
    .first()
    .isVisible()
    .catch(() => false),
)

// ---------- 4. toggles, palette
await page.goto(B + "/dashboard", { waitUntil: "networkidle" })
const before = await page.evaluate(() =>
  document.documentElement.classList.contains("dark"),
)
await page.getByRole("button", { name: /Toggle theme/i }).click()
await page.waitForTimeout(400)
ok(
  "dark/light toggle flips the theme",
  (await page.evaluate(() => document.documentElement.classList.contains("dark"))) !==
    before,
)
await page.getByRole("button", { name: /Change language/i }).click()
await page.waitForTimeout(500)
ok(
  "Bangla toggle translates the sidebar instantly",
  await page
    .getByText("ড্যাশবোর্ড")
    .first()
    .isVisible()
    .catch(() => false),
)
ok(
  "<html lang> follows the language",
  (await page.evaluate(() => document.documentElement.lang)) === "bn",
)
await page.screenshot({ path: "e2e-shots/05-bangla-dark.png" })
await page.getByRole("button", { name: /Change language/i }).click()
await page.keyboard.press("Control+k")
await page.waitForTimeout(500)
ok(
  "Ctrl+K opens the command palette",
  await page
    .getByPlaceholder(/Search or jump/i)
    .last()
    .isVisible()
    .catch(() => false),
)
await page.keyboard.type("report")
await page.keyboard.press("Enter")
await page.waitForTimeout(1500)
ok("palette navigates to Reports", /reports/.test(page.url()), page.url())

// ---------- 5. mobile layout
const mob = await newCtx({
  viewport: { width: 390, height: 780 },
  isMobile: true,
  hasTouch: true,
})
const mp = await mob.newPage()
await mp.goto(B + "/", { waitUntil: "networkidle" })
await mp.screenshot({ path: "e2e-shots/06-mobile-landing.png" })
// the sticky bar is translated off-screen until the visitor scrolls past the hero
const viewportH = 780
const stickyTop = () =>
  mp
    .locator("div.fixed.bottom-0")
    .filter({ hasText: /Start 14-day free trial/i }) // text, not role: the hidden bar is aria-hidden
    .evaluate((el) => el.getBoundingClientRect().top)
ok(
  "mobile: sticky CTA is hidden at the top of the page",
  (await stickyTop()) >= viewportH - 1,
)
await mp.evaluate(() => window.scrollTo(0, 900))
await mp.waitForTimeout(500)
ok(
  "mobile: sticky CTA slides in after scrolling past the hero",
  (await stickyTop()) < viewportH - 20,
)
await mp.evaluate(() => window.scrollTo(0, 0))
const overflow = await mp.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 2,
)
ok("mobile: no horizontal scroll on the landing page", !overflow)
await mp.goto(B + "/portal/demo-broadband", { waitUntil: "networkidle" })
await mp.screenshot({ path: "e2e-shots/07-mobile-portal.png" })
await mob.close()

// ---------- 6. customer portal (anonymous, Bangla by default)
const pc = await newCtx({ viewport: { width: 420, height: 800 } })
const pp = await pc.newPage()
const perr = []
watch(pp, perr)
await pp.goto(B + "/portal/demo-broadband", { waitUntil: "networkidle" })
ok(
  "portal is in Bangla by default",
  await pp
    .getByText("আপনার বিল দেখুন")
    .isVisible()
    .catch(() => false),
)
await pp.getByPlaceholder("01XXXXXXXXX").fill("01710000000")
await pp.getByRole("button", { name: "দেখুন" }).first().click()
await pp.waitForTimeout(1500)
ok(
  "portal lookup shows the customer's bill card",
  await pp
    .getByText(/হ্যালো/)
    .isVisible()
    .catch(() => false),
)
await pp.screenshot({ path: "e2e-shots/08-portal-result.png" })
ok(
  "no runtime errors during the whole run",
  errs.length + perr.length === 0,
  JSON.stringify([...errs, ...perr]).slice(0, 300),
)
await b.close()
const failed = results.filter((r) => !r[0])
console.log(`\nINTERACTIONS: ${results.length - failed.length}/${results.length} passed`)
if (failed.length) process.exit(1)
