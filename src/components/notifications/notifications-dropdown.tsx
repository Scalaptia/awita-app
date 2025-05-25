import { BellIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    useUnreadCountQuery,
    useLastUnreadNotificationQuery,
    useNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation
} from '@/lib/notifications-api'
import { Notification } from '@/types/notification'

export function NotificationsDropdown() {
    const { data: unreadCount = 0 } = useUnreadCountQuery()
    const { data: notifications } = useNotificationsQuery()
    const { data: lastUnreadNotification } = useLastUnreadNotificationQuery()
    const { mutate: markAsRead } = useMarkAsReadMutation()
    const { mutate: markAllAsRead } = useMarkAllAsReadMutation()

    const handleMarkAsRead = (notification: Notification) => {
        if (notification.read) return
        markAsRead(notification.id)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="lg"
                    className="w-full gap-4 justify-start py-6 px-3 hover:bg-accent"
                    aria-label="Notificaciones"
                >
                    <div className="relative flex-none">
                        <BellIcon className="h-4 w-4 ml-1" />
                        {unreadCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    {lastUnreadNotification ? (
                        <div className="min-w-0 flex-1 text-left">
                            <div className="truncate text-sm">
                                {lastUnreadNotification.type === 'WATER_LEVEL'
                                    ? `Nivel bajo en ${lastUnreadNotification.sensors.name}`
                                    : `Desconexión en ${lastUnreadNotification.sensors.name}`}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                    new Date(lastUnreadNotification.created_at),
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
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-sm ml-2">
                <div className="flex items-center justify-between pl-4 py-2">
                    <span className="text-sm font-medium">Notificaciones</span>
                    {notifications?.some((n) => !n.read) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-foreground h-auto py-1"
                            onClick={() => markAllAsRead()}
                        >
                            Marcar como leídas
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto">
                    {!notifications || notifications.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                            No hay notificaciones
                        </div>
                    ) : (
                        notifications.slice(0, 4).map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start gap-1 px-4 py-2 cursor-pointer"
                                onClick={() => handleMarkAsRead(notification)}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <span
                                        className={`h-2 w-2 shrink-0 rounded-full ${
                                            notification.read
                                                ? 'bg-muted'
                                                : 'bg-sky-500'
                                        }`}
                                    />
                                    <span className="font-medium flex-1 min-w-0 truncate">
                                        {notification.type === 'WATER_LEVEL'
                                            ? `Nivel bajo en ${notification.sensors.name}`
                                            : `Desconexión en ${notification.sensors.name}`}
                                    </span>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {new Date(notification.created_at)
                                            .toLocaleString('es-MX', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })
                                            .toLowerCase()}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate w-full">
                                    {notification.type === 'WATER_LEVEL'
                                        ? `El nivel del agua está al ${notification.current_value}% (umbral: ${notification.threshold_value}%)`
                                        : 'El sensor no ha reportado lecturas en los últimos minutos'}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
