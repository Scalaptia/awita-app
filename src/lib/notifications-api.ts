import { useAuthStore } from '@/stores/AuthStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { Notification } from '@/types/notification'

// Query keys for caching and invalidation
export const notificationKeys = {
    all: ['notifications'] as const,
    unread: {
        count: ['notifications', 'unread', 'count'] as const,
        last: ['notifications', 'unread', 'last'] as const
    }
}

// Base functions
export async function getNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/notifications')
}

export async function getUnreadCount(): Promise<number> {
    return apiClient.get<number>('/notifications/unread/count')
}

export async function getLastUnreadNotification(): Promise<Notification> {
    return apiClient.get<Notification>('/notifications/unread/last')
}

export async function markAsRead(notificationId: string): Promise<void> {
    return apiClient.post<void>(`/notifications/${notificationId}/read`, {})
}

export async function markAllAsRead(): Promise<void> {
    return apiClient.post<void>('/notifications/mark-all-read', {})
}

// Query Hooks
export function useNotificationsQuery() {
    const { userId, isSignedIn, isLoaded } = useAuthStore()

    return useQuery({
        queryKey: notificationKeys.all,
        queryFn: getNotifications,
        enabled: isLoaded && !!userId && isSignedIn,
        retry: 3,
        retryDelay: 1000,
        refetchInterval: 30 * 1000, // Refetch every 30 seconds
        staleTime: 15 * 1000 // Consider data stale after 15 seconds
    })
}

export function useUnreadCountQuery() {
    const { userId, isSignedIn, isLoaded } = useAuthStore()

    return useQuery({
        queryKey: notificationKeys.unread.count,
        queryFn: getUnreadCount,
        enabled: isLoaded && !!userId && isSignedIn,
        retry: 3,
        retryDelay: 1000,
        refetchInterval: 30 * 1000,
        staleTime: 15 * 1000
    })
}

export function useLastUnreadNotificationQuery() {
    const { userId, isSignedIn, isLoaded } = useAuthStore()

    return useQuery({
        queryKey: notificationKeys.unread.last,
        queryFn: getLastUnreadNotification,
        enabled: isLoaded && !!userId && isSignedIn,
        retry: false,
        refetchInterval: 30 * 1000,
        staleTime: 15 * 1000
    })
}

// Mutation Hooks
export function useMarkAsReadMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all })
            queryClient.invalidateQueries({
                queryKey: notificationKeys.unread.count
            })
            queryClient.invalidateQueries({
                queryKey: notificationKeys.unread.last
            })
        }
    })
}

export function useMarkAllAsReadMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all })
            queryClient.invalidateQueries({
                queryKey: notificationKeys.unread.count
            })
            queryClient.invalidateQueries({
                queryKey: notificationKeys.unread.last
            })
        }
    })
}
