import { queryOptions, useQuery } from "@tanstack/react-query"
import { httpV1 } from "@/lib/xior"
import { SessionResponse } from "@/types/sessions"

export function getSessionsOptions() {
  return queryOptions({
    queryKey: ["sessions", "active"],
    queryFn: () => {
      return httpV1
        .request<SessionResponse>({
          method: "GET",
          url: "/organizations/active/sessions",
        })
        .then((res) => res.data)
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep data fresh
  })
}

export function useGetActiveSessions() {
  return useQuery(getSessionsOptions())
}

export type Presence = "online" | "offline" | "unknown"

export type PresenceResponse = {
  configured: boolean
  /** {username: {address, uptime}} of everyone connected; null when the router could not be read yet */
  online: Record<string, { address: string; uptime: string }> | null
  count: number | null
  stale: boolean
  checked_at: string | null
}

/** Who is connected right now. One small request every 30 s, paused while the tab is hidden. */
export function usePresence(enabled = true) {
  return useQuery({
    queryKey: ["presence"],
    enabled,
    queryFn: () =>
      httpV1
        .request<PresenceResponse>({ method: "GET", url: "/organizations/me/presence" })
        .then((res) => res.data),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    staleTime: 15_000,
  })
}
