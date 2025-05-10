import { create } from 'zustand'

interface Notification {
    id: string
    title: string
    timestamp: Date
    read: boolean
}

interface NotificationsStore {
    notifications: Notification[]
    markAsRead: (id: string) => void
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
    notifications: [
        {
            id: '1',
            title: 'Nivel bajo en Tinaco Casa',
            timestamp: new Date(),
            read: false
        },
        {
            id: '2',
            title: 'Batería baja en Tanque Jardín',
            timestamp: new Date(),
            read: false
        }
    ],
    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            )
        }))
}))
