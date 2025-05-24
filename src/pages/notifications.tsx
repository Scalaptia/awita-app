import { useAppStore } from '@/stores/AppStore'
import { useEffect } from 'react'
import {
    useNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    notificationKeys
} from '@/lib/notifications-api'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Notification, ThresholdType } from '@/types/notification'

export default function Notifications() {
    const setTitle = useAppStore((state: any) => state.setTitle)
    const { data: notifications, isLoading } = useNotificationsQuery()
    const { mutate: markAsRead } = useMarkAsReadMutation()
    const { mutate: markAllAsRead } = useMarkAllAsReadMutation()
    const queryClient = useQueryClient()

    useEffect(() => {
        setTitle('Notificaciones')
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!notifications?.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-lg text-muted-foreground">
                    No hay notificaciones
                </p>
            </div>
        )
    }

    const handleMarkAllAsRead = () => {
        // Optimistic update
        const previousNotifications = queryClient.getQueryData<Notification[]>(
            notificationKeys.all
        )
        queryClient.setQueryData(
            notificationKeys.all,
            (old: Notification[] | undefined) =>
                old?.map((n) => ({ ...n, read: true }))
        )
        queryClient.setQueryData(notificationKeys.unread.count, 0)
        queryClient.setQueryData(notificationKeys.unread.last, null)

        markAllAsRead(undefined, {
            onError: () => {
                // Revert on error
                queryClient.setQueryData(
                    notificationKeys.all,
                    previousNotifications
                )
                toast.error(
                    'No se pudieron marcar las notificaciones como leídas'
                )
            }
        })
    }

    const handleMarkAsRead = (notification: Notification) => {
        if (notification.read) return

        // Optimistic update
        const previousNotifications = queryClient.getQueryData<Notification[]>(
            notificationKeys.all
        )
        queryClient.setQueryData(
            notificationKeys.all,
            (old: Notification[] | undefined) =>
                old?.map((n) =>
                    n.id === notification.id ? { ...n, read: true } : n
                )
        )

        // Update unread count
        const currentCount =
            queryClient.getQueryData<number>(notificationKeys.unread.count) ?? 0
        if (currentCount > 0) {
            queryClient.setQueryData(
                notificationKeys.unread.count,
                currentCount - 1
            )
        }

        // Update last unread notification if this was it
        const lastUnread = queryClient.getQueryData<Notification>(
            notificationKeys.unread.last
        )
        if (lastUnread?.id === notification.id) {
            const nextUnread = notifications.find(
                (n) => !n.read && n.id !== notification.id
            )
            queryClient.setQueryData(
                notificationKeys.unread.last,
                nextUnread ?? null
            )
        }

        markAsRead(notification.id, {
            onError: () => {
                // Revert on error
                queryClient.setQueryData(
                    notificationKeys.all,
                    previousNotifications
                )
                toast.error('No se pudo marcar la notificación como leída')
            }
        })
    }

    return (
        <div className="container max-w-2xl px-4">
            <div className="flex justify-end mb-4">
                <Button
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                    disabled={!notifications.some((n) => !n.read)}
                >
                    Marcar todas como leídas
                </Button>
            </div>
            <div className="rounded-lg border bg-card">
                <div className="p-4">
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex items-start gap-4 rounded-lg p-3 hover:bg-accent cursor-pointer"
                                onClick={() => handleMarkAsRead(notification)}
                            >
                                <span
                                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                                        notification.read
                                            ? 'bg-muted'
                                            : 'bg-sky-500'
                                    }`}
                                />
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {notification.type ===
                                        ThresholdType.WATER_LEVEL
                                            ? `Nivel bajo en ${notification.sensors.name}`
                                            : `Desconexión en ${notification.sensors.name}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(notification.created_at),
                                            {
                                                addSuffix: true,
                                                locale: es
                                            }
                                        )}
                                    </p>
                                    <p className="text-sm mt-2">
                                        {notification.type === 'WATER_LEVEL'
                                            ? `El nivel del agua está al ${notification.current_value}% (umbral: ${notification.threshold_value}%)`
                                            : 'El sensor no ha reportado lecturas en los últimos minutos'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
