import { useAuthStore } from '@/stores/AuthStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, queryKeys } from '@/lib/api'

export async function getSensors(): Promise<Sensor[]> {
    return apiClient.get<Sensor[]>('/sensors')
}

// Sensors query hook
export function useSensorsQuery() {
    const { userId, isSignedIn, isLoaded } = useAuthStore()

    return useQuery({
        queryKey: queryKeys.sensors,
        queryFn: getSensors,
        // Only execute query when auth is loaded and user is signed in
        enabled: isLoaded && !!userId && isSignedIn,
        // Add retry logic with delay
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })
}

export async function updateSensor(
    id: string,
    data: Partial<Sensor>
): Promise<Sensor> {
    return apiClient.patch<Sensor>(`/sensors/${id}`, data)
}

// Update sensor mutation hook
export function useUpdateSensorMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Sensor> }) =>
            updateSensor(id, data),
        onSuccess: (updatedSensor) => {
            // Invalidate sensors list
            queryClient.invalidateQueries({ queryKey: queryKeys.sensors })
            // Update individual sensor in cache
            queryClient.setQueryData(
                queryKeys.sensor(updatedSensor.id),
                updatedSensor
            )
        }
    })
}

export async function deleteSensor(id: string): Promise<void> {
    return apiClient.delete(`/sensors/${id}`)
}

// Delete sensor mutation hook
export function useDeleteSensorMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteSensor,
        onSuccess: (_, deletedId) => {
            // Invalidate sensors list
            queryClient.invalidateQueries({ queryKey: queryKeys.sensors })
            // Remove individual sensor from cache
            queryClient.removeQueries({ queryKey: queryKeys.sensor(deletedId) })
        }
    })
}

// Add a new function to create sensors
export async function createSensor(data: Omit<Sensor, 'id'>): Promise<Sensor> {
    return apiClient.post<Sensor>('/sensors', data)
}

// Create sensor mutation hook
export function useCreateSensorMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createSensor,
        onSuccess: (newSensor) => {
            // Invalidate sensors list
            queryClient.invalidateQueries({ queryKey: queryKeys.sensors })
        }
    })
}

// Add a function to get a single sensor by ID
export async function getSensor(id: string): Promise<Sensor> {
    return apiClient.get<Sensor>(`/sensors/${id}`)
}

// Single sensor query hook
export function useSensorQuery(id: string) {
    const { userId, isSignedIn } = useAuthStore()

    return useQuery({
        queryKey: queryKeys.sensor(id),
        queryFn: () => getSensor(id),
        // Only execute query when user is actually signed in
        enabled: !!userId && isSignedIn && !!id,
        // Add retry logic with delay
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })
}
