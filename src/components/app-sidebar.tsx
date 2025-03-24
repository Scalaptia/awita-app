import * as React from "react"
import {
  BellIcon,
  CircleCheckIcon,
  DropletIcon,
  GaugeIcon,
  LayoutDashboardIcon,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
        title: "Panel de control",
        url: "/dashboard",
        icon: LayoutDashboardIcon
    },
    {
        title: "Alertas",
        url: "/alerts",
        icon: BellIcon
    },
    {
        title: "Sensores",
        url: "/sensors",
        icon: GaugeIcon
    }
  ],
  navSecondary: [
    {
      title: "Status",
      url: "#",
      icon: CircleCheckIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <DropletIcon className="h-5 w-5" />
                <span className="text-base font-semibold">AWITA</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}