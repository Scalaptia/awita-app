import * as React from 'react'
import {
    BellIcon,
    RadioIcon,
    LayoutDashboardIcon,
    Loader2Icon
} from 'lucide-react'

import { NavMain } from '@/components/ui/nav-main'
import { NavSecondary } from '@/components/ui/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import { Link } from 'react-router-dom'

const data = {
    navMain: [
        {
            title: 'Panel de control',
            url: '/',
            icon: LayoutDashboardIcon
        },
        {
            title: 'Alertas',
            url: '/alerts',
            icon: BellIcon
        },
        {
            title: 'Sensores',
            url: '/sensors',
            icon: RadioIcon
        }
    ],
    navSecondary: [
        {
            icon: Loader2Icon,
            text: 'Cargando...',
            color: 'text-muted-foreground'
        }
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link to="/" className="flex items-center gap-2 p-2">
                            <img src="/logo.svg" alt="Logo" />
                        </Link>
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
