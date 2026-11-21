import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { BACKEND_ORIGIN } from "@/lib/api-config"
import { ACCESS_COOKIE, REFRESH_COOKIE, setSessionCookies } from "@/lib/session-cookies"

// Endpoints whose response carries tokens: store them in HttpOnly cookies and
// never hand them to the browser.
const TOKEN_ENDPOINTS = new Set(["users/login", "auth/signup"])
const FORWARDED_REQUEST_HEADERS = [
  "content-type",
  "accept",
  "accept-language",
  "x-request-id",
]
const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "content-disposition",
  "location",
  "x-request-id",
]

async function callBackend(
  req: NextRequest,
  path: string,
  body: ArrayBuffer | undefined,
  token?: string,
) {
  const headers = new Headers()
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers.get(name)
    if (value) headers.set(name, value)
  }
  if (token) headers.set("authorization", `Bearer ${token}`)

  return fetch(`${BACKEND_ORIGIN}/api/v1/${path}${req.nextUrl.search}`, {
    method: req.method,
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  })
}

/** Trades the refresh cookie for a new access token. Returns it, or null. */
async function refreshAccessToken(): Promise<string | null> {
  const refresh = (await cookies()).get(REFRESH_COOKIE)?.value
  if (!refresh) return null
  const res = await fetch(`${BACKEND_ORIGIN}/api/v1/users/login/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
    cache: "no-store",
  })
  if (!res.ok) return null
  const data = (await res.json()) as { access_token: string; access_token_exp: number }
  await setSessionCookies(data)
  return data.access_token
}

async function handle(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const path = (await ctx.params).path.join("/")
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer()
  const store = await cookies()

  let upstream: Response
  try {
    upstream = await callBackend(req, path, body, store.get(ACCESS_COOKIE)?.value)

    // Expired access token: refresh once and replay the request.
    if (upstream.status === 401 && !TOKEN_ENDPOINTS.has(path)) {
      const fresh = await refreshAccessToken()
      if (fresh) upstream = await callBackend(req, path, body, fresh)
    }
  } catch {
    return NextResponse.json(
      { message: "Server is unreachable. Please try again." },
      { status: 502 },
    )
  }

  if (TOKEN_ENDPOINTS.has(path) && upstream.ok) {
    const data = await upstream.json()
    await setSessionCookies(data)
    const { access_token, refresh_token, access_token_exp, refresh_token_exp, ...safe } =
      data
    return NextResponse.json(safe, { status: upstream.status })
  }

  const headers = new Headers()
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }
  return new NextResponse(upstream.status === 204 ? null : await upstream.arrayBuffer(), {
    status: upstream.status,
    headers,
  })
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE }
