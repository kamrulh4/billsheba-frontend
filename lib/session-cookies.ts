import "server-only"
import { cookies } from "next/headers"

export const ACCESS_COOKIE = "token"
export const REFRESH_COOKIE = "refresh"

type Tokens = {
  access_token: string
  access_token_exp: number
  refresh_token?: string
  refresh_token_exp?: number
}

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1",
}

const maxAge = (exp: number) => Math.max(exp - Math.floor(Date.now() / 1000), 60)

export async function setSessionCookies(t: Tokens) {
  const store = await cookies()
  store.set(ACCESS_COOKIE, t.access_token, {
    ...base,
    maxAge: maxAge(t.access_token_exp),
  })
  if (t.refresh_token && t.refresh_token_exp) {
    store.set(REFRESH_COOKIE, t.refresh_token, {
      ...base,
      maxAge: maxAge(t.refresh_token_exp),
    })
  }
}

export async function clearSessionCookies() {
  const store = await cookies()
  store.delete(ACCESS_COOKIE)
  store.delete(REFRESH_COOKIE)
}
