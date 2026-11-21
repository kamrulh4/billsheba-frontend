import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session-cookies"

/**
 * "Does this browser have a session cookie?" — answered locally, without calling Django.
 * The cookie is HttpOnly so page scripts cannot check it themselves; this lets the public
 * header avoid a pointless (and noisy) 401 for every anonymous visitor.
 */
export async function GET() {
  const store = await cookies()
  const signedIn = Boolean(
    store.get(ACCESS_COOKIE)?.value || store.get(REFRESH_COOKIE)?.value,
  )
  return NextResponse.json({ signedIn }, { headers: { "Cache-Control": "no-store" } })
}
