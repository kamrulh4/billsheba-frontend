import xior from "xior"
import { API_BASE_URL } from "@/lib/api-config"
import { isProtectedPath } from "@/lib/routes"

/**
 * Same-origin API client. Auth lives in an HttpOnly cookie that the
 * `/api/v1/*` route handler attaches, so there is no token handling here.
 */
export const httpV1 = xior.create({
  baseURL: API_BASE_URL,
  cache: "no-store",
})

// The proxy already tried a silent refresh; a 401 *inside the app* means the session is over.
// On public pages (home, pricing, portal...) a 401 just means "not signed in" — e.g. the header's
// session check — and must never redirect the visitor.
httpV1.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status
    const url: string = error?.request?.url ?? ""
    if (
      typeof window !== "undefined" &&
      status === 401 &&
      !url.includes("/users/login") &&
      isProtectedPath(window.location.pathname)
    ) {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)
