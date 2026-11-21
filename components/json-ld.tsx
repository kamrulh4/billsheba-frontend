/**
 * Renders schema.org JSON-LD. Content is generated server-side from our own
 * config (never from user input), so injecting it as a script body is safe.
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const payload = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {payload.map((item) => (
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script body
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          key={JSON.stringify(item)}
          type="application/ld+json"
        />
      ))}
    </>
  )
}
