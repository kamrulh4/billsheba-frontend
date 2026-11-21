import { cacheLife, cacheTag } from "next/cache"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { getSession } from "@/lib/apis/auth"
import { generateAvatarUrl, getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export async function TeamSwitcher() {
  "use cache: private"

  cacheLife("minutes")
  cacheTag("team-session")

  const session = await getSession()
  // The platform owner (super admin) belongs to no ISP.
  const orgName = session?.organization?.name ?? (session ? "BillSheba Platform" : "")

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="rounded-md">
            <AvatarImage src={generateAvatarUrl(orgName)} />
            <AvatarFallback className="text-xs font-light rounded-md">
              {getInitials(orgName)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{orgName}</span>
            <span className="truncate text-xs">
              {session?.organization?.subscription_status ?? session?.kind}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
