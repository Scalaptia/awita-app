import { useAuthStore } from '@/stores/AuthStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, queryKeys } from '@/lib/api'
import { SENSOR_ERROR_MESSAGES, ApiError } from './errors'

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

export async function createSensor(data: Omit<Sensor, 'id'>): Promise<Sensor> {
    return apiClient.post<Sensor>('/sensors', data)
}

// Create sensor mutation hook
export function useCreateSensorMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<Sensor, 'id'>) => createSensor(data),
        onSuccess: () => {
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

export async function registerSensor(sensor_id: string): Promise<Sensor> {
    try {
        return await apiClient.post<Sensor>('/sensors', { sensor_id })
    } catch (error) {
        if (error instanceof ApiError) {
            const message =
                SENSOR_ERROR_MESSAGES[error.status] ||
                'Error al registrar el sensor'

            throw new ApiError(message, error.status)
        }

        throw new ApiError('Error inesperado', 500)
    }
}

// Register sensor mutation hook
export function useRegisterSensorMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: registerSensor,
        onSuccess: () => {
            // Invalidate sensors list to trigger a refresh
            queryClient.invalidateQueries({ queryKey: queryKeys.sensors })
        }
    })
}

export async function getSensorHistory(
    sensorId: string,
    limit = 50
): Promise<SensorHistoryReading[]> {
    return apiClient.get<SensorHistoryReading[]>(
        `/sensors/${sensorId}/readings?limit=${limit}`
    )
}

export function useSensorHistoryQuery(sensorId: string | null, limit = 50) {
    const { userId, isSignedIn } = useAuthStore()

    return useQuery({
        queryKey: ['sensorHistory', sensorId, limit],
        queryFn: () => getSensorHistory(sensorId!, limit),
        enabled: !!userId && isSignedIn && !!sensorId,
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 // 1 minute
    })
}
