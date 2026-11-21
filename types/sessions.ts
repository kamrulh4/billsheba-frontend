export type SessionResponse = {
  sessions: Session[]
  /** false when the ISP has not connected a router yet */
  router_configured?: boolean
}

export type Session = {
  ".id": string
  address: string
  "caller-id": string
  encoding: string
  "limit-bytes-in": string
  "limit-bytes-out": string
  name: string
  radius: string
  service: string
  "session-id": string
  uptime: string
}
