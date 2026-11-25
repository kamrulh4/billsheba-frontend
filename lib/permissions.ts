"use client"

import { useSession } from "@/hooks/rq/use-auth-query"

/** Mirrors the backend: ADMIN/OWNER/MANAGER manage the ISP, STAFF only collects and views. */
const MANAGER_KINDS = ["ADMIN", "OWNER", "MANAGER"]
const ADMIN_KINDS = ["ADMIN", "OWNER"]

/**
 * What the signed-in user may do. The server is the real gate (it answers 403); this only hides
 * buttons and pages the user could not use anyway. Safe during hydration: everything is false until
 * the session is known.
 */
export function useCan() {
  const { data } = useSession()
  const kind = data?.kind ?? ""
  return {
    kind,
    /** edit/delete/import/export, approve requests, packages: Admin, Owner, Manager */
    manage: MANAGER_KINDS.includes(kind),
    /** billing, user management: Admin, Owner */
    admin: ADMIN_KINDS.includes(kind),
  }
}
