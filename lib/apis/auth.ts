import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { cookies } from "next/headers"
import xior from "xior"
import { API_BASE_URL } from "@/lib/api-config"
import { Session } from "@/types/auth"
import { DashboardResponse } from "@/types/dashboard"

const http = xior.create({
  baseURL: API_BASE_URL,
})

http.interceptors.request.use(async (config) => {
  const cookieStore = await cookies()

  const token = cookieStore.get("token")?.value

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export async function getSession() {
  try {
    const res = await http
      .request<Session>({ method: "GET", url: "/users/me" })
      .then((res) => res.data)

    return res
  } catch (error) {
    return null
  }
}

export async function getDashboardData() {
  "use cache: private"

  cacheLife("minutes")
  cacheTag("dashboard")

  try {
    const res = await http
      .request<DashboardResponse>({ method: "GET", url: "/dashboard" })
      .then((res) => res.data)
    return res
  } catch (error) {
    return null
  }
}
