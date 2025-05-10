import { BellIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import { useNotificationsStore } from '@/stores/NotificationsStore'

export function NavNotifications() {
    const { notifications } = useNotificationsStore()
    const unreadCount = notifications.filter((n) => !n.read).length
    const lastUnreadNotification = notifications.find((n) => !n.read)

    return (
        <SidebarMenu className="flex-1 min-w-0 px-1">
            <SidebarMenuItem>
                <Link to="/notifications" className="w-full">
                    <SidebarMenuButton size="lg" className="w-full gap-4">
                        <div className="relative flex-none">
                            <BellIcon className="h-5 w-5 ml-1 -mr-1" />
                            {unreadCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        {lastUnreadNotification ? (
                            <div className="min-w-0 flex-1 text-left">
                                <div className="truncate text-sm">
                                    {lastUnreadNotification.title}
                                </div>
                                <div className="truncate text-xs text-muted-foreground">
                                    {new Date(
                                        lastUnreadNotification.timestamp
                                    ).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    }) +
                                        ' a las ' +
                                        new Date(
                                            lastUnreadNotification.timestamp
                                        ).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                </div>
                            </div>
                        ) : (
                            <div className="min-w-0 flex-1 text-left">
                                <div className="truncate text-sm">
                                    No hay notificaciones
                                </div>
                            </div>
                        )}
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
