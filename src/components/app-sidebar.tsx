import * as React from 'react'
import { RadioIcon, LayoutDashboardIcon, Loader2Icon } from 'lucide-react'

import { NavMain } from '@/components/ui/nav-main'
import { NavUser } from '@/components/nav-user'
import { NavNotifications } from '@/components/nav-notifications'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar
} from '@/components/ui/sidebar'
import { Link, useLocation } from 'react-router-dom'

const data = {
    navMain: [
        {
            title: 'Panel de control',
            url: '/',
            icon: LayoutDashboardIcon
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
    const { isMobile, setOpenMobile } = useSidebar()
    const location = useLocation()

    React.useEffect(() => {
        if (isMobile) {
            setOpenMobile(false)
        }
    }, [location, isMobile, setOpenMobile])

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
            </SidebarContent>
            <SidebarFooter className="flex gap-1 p-1">
                <NavNotifications />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
