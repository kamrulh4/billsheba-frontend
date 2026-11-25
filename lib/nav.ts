import {
  BarChart3,
  Building2,
  CreditCard,
  Crown,
  HandCoins,
  History,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  MessageSquareWarning,
  Package2,
  Receipt,
  Settings2,
  User,
  Users,
  Wallet,
  Wifi,
} from "lucide-react"
import type { MessageKey } from "@/lib/i18n"

// ISP-side roles only: the platform owner (SUPER_ADMIN) belongs to no ISP, so ISP pages are hidden from them.
const ISP_STAFF = ["ADMIN", "OWNER", "MANAGER", "STAFF"]
const MANAGERS = ["ADMIN", "OWNER", "MANAGER"]

export type NavItem = {
  key: MessageKey
  url: string
  icon: LucideIcon
  /** Roles that may see it; omitted = everyone. */
  roles?: string[]
}

export const navItems: NavItem[] = [
  { key: "nav.dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ISP_STAFF },
  { key: "nav.customers", url: "/customers", icon: Users, roles: ISP_STAFF },
  { key: "nav.payments", url: "/payments", icon: CreditCard, roles: ISP_STAFF },
  { key: "nav.paymentRequests", url: "/payment-requests", icon: Inbox, roles: ISP_STAFF },
  { key: "nav.packages", url: "/packages", icon: Package2, roles: ISP_STAFF },
  {
    key: "nav.complaints",
    url: "/complaints",
    icon: MessageSquareWarning,
    roles: ISP_STAFF,
  },
  { key: "nav.collections", url: "/collections", icon: HandCoins, roles: ISP_STAFF },
  { key: "nav.sessions", url: "/sessions", icon: Wifi, roles: MANAGERS },
  { key: "nav.expenses", url: "/expenses", icon: Receipt, roles: MANAGERS },
  { key: "nav.reports", url: "/reports", icon: BarChart3, roles: MANAGERS },
  { key: "nav.audit", url: "/audit", icon: History, roles: MANAGERS },
  { key: "nav.users", url: "/users", icon: User, roles: MANAGERS },
  {
    key: "nav.organizations",
    url: "/organizations",
    icon: Building2,
    roles: ["SUPER_ADMIN"],
  },
  { key: "nav.platform", url: "/platform", icon: Crown, roles: ["SUPER_ADMIN"] },
  { key: "nav.billing", url: "/billing", icon: Wallet, roles: ["ADMIN", "OWNER"] },
  { key: "nav.settings", url: "/settings", icon: Settings2, roles: MANAGERS },
]

export const canSee = (item: NavItem, kind?: string) =>
  !item.roles || (!!kind && item.roles.includes(kind))

/** Pages without a menu entry that are still limited to some roles. */
const EXTRA_ROLES: Record<string, string[]> = { "/sms": MANAGERS }

/** May this role open the page at `path`? Unlisted pages (profile, ...) are open to everyone signed in. */
export function canOpen(path: string, kind?: string) {
  const roles =
    EXTRA_ROLES[path] ??
    navItems.find((i) => path === i.url || path.startsWith(`${i.url}/`))?.roles
  return !roles || (!!kind && roles.includes(kind))
}
