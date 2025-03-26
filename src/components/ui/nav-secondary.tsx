import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem
} from '@/components/ui/sidebar'
export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string
        bg?: string
        icon: LucideIcon
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <div
                                className={`flex items-center gap-2 p-2 rounded-md ${item.bg ?? 'bg-sidebar-secondary'}`}
                            >
                                <item.icon />
                                <span>{item.title}</span>
                            </div>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
