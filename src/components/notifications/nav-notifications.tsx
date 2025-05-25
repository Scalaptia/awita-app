import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { NotificationsDropdown } from '@/components/notifications/notifications-dropdown'

export function NavNotifications() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <NotificationsDropdown />
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
