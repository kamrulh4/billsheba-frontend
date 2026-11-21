import { legalConfig } from "@/lib/site-config"

export type LegalSection = { title: string; body: string[] }

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-bold text-3xl tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Last updated: {legalConfig.lastUpdated}
      </p>
      <p className="mt-6 text-muted-foreground leading-relaxed">{intro}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section, i) => (
          <section key={section.title}>
            <h2 className="font-semibold text-xl">
              {i + 1}. {section.title}
            </h2>
            <div className="mt-2 space-y-3 text-muted-foreground leading-relaxed">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
