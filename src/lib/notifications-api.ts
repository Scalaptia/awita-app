import { useAuthStore } from '@/stores/AuthStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { NotificationSetting } from '@/types/notification'

export const notificationQueryKeys = {
    all: ['notifications'],
    detail: (id: string) => ['notifications', id]
}

export async function getNotificationSettings(): Promise<
    NotificationSetting[]
> {
    return apiClient.get<NotificationSetting[]>('/notification-settings')
}

// Notification settings query hook
export function useNotificationSettingsQuery() {
    const { userId, isSignedIn, isLoaded } = useAuthStore()

    return useQuery({
        queryKey: notificationQueryKeys.all,
        queryFn: getNotificationSettings,
        enabled: isLoaded && !!userId && isSignedIn,
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })
}

export async function getNotificationSetting(
    id: string
): Promise<NotificationSetting> {
    return apiClient.get<NotificationSetting>(`/notification-settings/${id}`)
}

// Notification setting query hook
export function useNotificationSettingQuery(id: string) {
    const { userId, isSignedIn } = useAuthStore()

    return useQuery({
        queryKey: notificationQueryKeys.detail(id),
        queryFn: () => getNotificationSetting(id),
        enabled: !!userId && isSignedIn && !!id,
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })
}

export async function createNotificationSetting(
    data: Partial<NotificationSetting>
): Promise<NotificationSetting> {
    return apiClient.post<NotificationSetting>('/notification-settings', data)
}

// Create notification setting mutation hook
export function useCreateNotificationSettingMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createNotificationSetting,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: notificationQueryKeys.all
            })
        }
    })
}

export async function updateNotificationSetting(
    id: string,
    data: Partial<NotificationSetting>
): Promise<NotificationSetting> {
    return apiClient.patch<NotificationSetting>(
        `/notification-settings/${id}`,
        data
    )
}

// Update notification setting mutation hook
export function useUpdateNotificationSettingMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: Partial<NotificationSetting>
        }) => updateNotificationSetting(id, data),
        onSuccess: (updatedSetting) => {
            queryClient.invalidateQueries({
                queryKey: notificationQueryKeys.all
            })
            queryClient.setQueryData(
                notificationQueryKeys.detail(updatedSetting.id),
                updatedSetting
            )
        }
    })
}

export async function deleteNotificationSetting(id: string): Promise<void> {
    return apiClient.delete(`/notification-settings/${id}`)
}

// Delete notification setting mutation hook
export function useDeleteNotificationSettingMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteNotificationSetting,
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({
                queryKey: notificationQueryKeys.all
            })
            queryClient.removeQueries({
                queryKey: notificationQueryKeys.detail(deletedId)
            })
        }
    })
}

export async function toggleNotificationSetting(
    id: string
): Promise<NotificationSetting> {
    return apiClient.patch<NotificationSetting>(
        `/notification-settings/${id}/toggle`,
        {}
    )
}

// Toggle notification setting mutation hook
export function useToggleNotificationSettingMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: toggleNotificationSetting,
        onSuccess: (updatedSetting) => {
            queryClient.invalidateQueries({
                queryKey: notificationQueryKeys.all
            })
            queryClient.setQueryData(
                notificationQueryKeys.detail(updatedSetting.id),
                updatedSetting
            )
        }
    })
}
