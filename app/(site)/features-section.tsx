import { BarChart3, LifeBuoy, Receipt, Settings, Smartphone, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { type Locale, type MessageKey, tr } from "@/lib/i18n"

const features = [
  {
    id: 1,
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: 2,
    icon: Receipt,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    id: 3,
    icon: Smartphone,
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
  },
  {
    id: 4,
    icon: Settings,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    id: 5,
    icon: BarChart3,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    id: 6,
    icon: LifeBuoy,
    color: "text-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
  },
] as const

export function FeaturesSection({ locale = "en" }: { locale?: Locale }) {
  return (
    <section className="bg-muted/30 py-16 lg:py-24" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="font-bold text-3xl tracking-tight lg:text-4xl">
            {tr(locale, "features.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {tr(locale, "features.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              className="border-0 bg-card/50 shadow-lg backdrop-blur transition-shadow duration-300 hover:shadow-xl"
              key={feature.id}
            >
              <CardContent className="space-y-4 p-8 text-center">
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bgColor} mx-auto`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-foreground text-xl">
                  {tr(locale, `features.${feature.id}.title` as MessageKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {tr(locale, `features.${feature.id}.body` as MessageKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
