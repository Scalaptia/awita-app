import { useAppStore } from '@/stores/AppStore'
import { useNotificationsStore } from '@/stores/NotificationsStore'
import { useEffect } from 'react'

export default function Notifications() {
    const setTitle = useAppStore((state: any) => state.setTitle)
    const { notifications, markAsRead } = useNotificationsStore()

    useEffect(() => {
        setTitle('Notificaciones')
    }, [])

    return (
        <div className="container max-w-2xl px-4">
            <div className="rounded-lg border bg-card">
                <div className="p-4">
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex items-start gap-4 rounded-lg p-3 hover:bg-accent"
                                onClick={() => markAsRead(notification.id)}
                            >
                                <span
                                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                                        notification.read
                                            ? 'bg-muted'
                                            : 'bg-sky-500'
                                    }`}
                                />
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            notification.timestamp
                                        ).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit'
                                        })}{' '}
                                        a las{' '}
                                        {new Date(
                                            notification.timestamp
                                        ).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
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
