import { BellIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import {
    useUnreadCountQuery,
    useLastUnreadNotificationQuery
} from '@/lib/notifications-api'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function NavNotifications() {
    const { data: unreadCount = 0 } = useUnreadCountQuery()
    const { data: lastUnreadNotification } = useLastUnreadNotificationQuery()

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
                                    {lastUnreadNotification.type ===
                                    'WATER_LEVEL'
                                        ? `Nivel bajo en ${lastUnreadNotification.sensors.name}`
                                        : `Desconexión en ${lastUnreadNotification.sensors.name}`}
                                </div>
                                <div className="truncate text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                        new Date(
                                            lastUnreadNotification.created_at
                                        ),
                                        {
                                            addSuffix: true,
                                            locale: es
                                        }
                                    )}
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
