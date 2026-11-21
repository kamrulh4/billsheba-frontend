import type { Locale } from "@/lib/i18n"
import { tr } from "@/lib/i18n"

const rows = [
  { name: { en: "Rahim Uddin", bn: "রাহিম উদ্দিন" }, via: "bKash", amount: "800" },
  { name: { en: "Fatema Begum", bn: "ফাতেমা বেগম" }, via: "Nagad", amount: "1,200" },
  { name: { en: "Jahid Hasan", bn: "জাহিদ হাসান" }, via: "bKash", amount: "500" },
]

/** A static, honest picture of the product. Numbers are labelled as sample data. */
export function ProductPreview({
  locale,
  num,
}: {
  locale: Locale
  num: (n: string) => string
}) {
  const t = (k: Parameters<typeof tr>[1]) => tr(locale, k)
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-green-400" />
          <span className="ml-auto rounded bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
            {t("home.sample")}
          </span>
        </div>
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">
                {t("home.preview.collected")}
              </p>
              <p className="mt-1 font-bold text-xl text-green-600">৳{num("1,84,500")}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">{t("home.preview.due")}</p>
              <p className="mt-1 font-bold text-xl text-amber-600">৳{num("46,200")}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">{t("home.preview.recent")}</p>
            <ul className="divide-y rounded-lg border">
              {rows.map((r) => (
                <li
                  key={r.name.en}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                >
                  <span className="truncate">{r.name[locale]}</span>
                  <span className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-medium text-[10px] text-white ${
                        r.via === "bKash" ? "bg-[#e2136e]" : "bg-[#f6921e]"
                      }`}
                    >
                      {r.via}
                    </span>
                    <span className="font-medium tabular-nums">৳{num(r.amount)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[80%] rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
