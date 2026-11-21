import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { phrase } from "@/lib/i18n/phrase-book"

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory())
      return name === "node_modules" || name === ".next" ? [] : sources(path)
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

describe("toast messages", () => {
  const root = join(__dirname, "..")
  const literal = /toast\.(?:success|error|info|warning)\(\s*"([^"]+)"/g
  const found = new Map<string, string>()
  for (const dir of ["app", "hooks", "components"]) {
    for (const file of sources(join(root, dir))) {
      for (const m of readFileSync(file, "utf8").matchAll(literal)) found.set(m[1], file)
    }
  }

  it("finds the literal toast messages in the source", () => {
    expect(found.size).toBeGreaterThan(20)
  })

  it("every literal toast message has a Bangla translation", () => {
    const missing = [...found.keys()].filter((message) => phrase(message) === message)
    expect(missing).toEqual([])
  })

  it("only the translating wrapper imports sonner's toast", () => {
    const offenders = [
      ...sources(join(root, "app")),
      ...sources(join(root, "hooks")),
      ...sources(join(root, "components")),
    ].filter((f) => readFileSync(f, "utf8").includes('import { toast } from "sonner"'))
    expect(offenders).toEqual([])
  })
})
