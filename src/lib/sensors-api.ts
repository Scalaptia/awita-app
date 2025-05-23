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
        enabled: isLoaded && !!userId && isSignedIn,
        retry: 3,
        retryDelay: 1000,
        refetchInterval: 30 * 1000,
        staleTime: 15 * 1000
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

export async function getSensor(id: string): Promise<SensorWithAlerts> {
    return apiClient.get<SensorWithAlerts>(`/sensors/${id}`)
}

// Single sensor query hook
export function useSensorQuery(id: string) {
    const { userId, isSignedIn } = useAuthStore()

    return useQuery<SensorWithAlerts>({
        queryKey: queryKeys.sensor(id),
        queryFn: () => getSensor(id),
        enabled: !!userId && isSignedIn && !!id,
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })
}

export async function registerSensor(
    sensor_id: string
): Promise<SensorWithAlerts> {
    try {
        return await apiClient.post<SensorWithAlerts>('/sensors', { sensor_id })
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
    timeRange?: '24h' | '7d' | '30d',
    limit = 50
): Promise<SensorHistoryReading[]> {
    const params = new URLSearchParams()
    if (timeRange) params.append('timeRange', timeRange)
    if (limit) params.append('limit', limit.toString())

    return apiClient.get<SensorHistoryReading[]>(
        `/sensors/${sensorId}/readings?${params.toString()}`
    )
}

export function useSensorHistoryQuery(
    sensorId: string | null,
    timeRange?: '24h' | '7d' | '30d'
) {
    const { userId, isSignedIn } = useAuthStore()
    const { data: sensor } = useSensorQuery(sensorId ?? '')

    // Calculate refetch interval based on sensor settings
    const refetchInterval = sensor?.time_between_readings
        ? Math.max(sensor.time_between_readings * 1000, 60000)
        : 60000 // Default 1 minute

    return useQuery({
        queryKey: ['sensorHistory', sensorId, timeRange],
        queryFn: () => getSensorHistory(sensorId!, timeRange),
        enabled: !!userId && isSignedIn && !!sensorId,
        retry: 3,
        retryDelay: 1000,
        refetchInterval,
        staleTime: refetchInterval / 2
    })
}

// Toggle water level alert
export async function toggleWaterLevelAlert(
    sensorId: string
): Promise<SensorWithAlerts> {
    return apiClient.patch<SensorWithAlerts>(
        `/sensors/${sensorId}/water-level-alert`,
        {}
    )
}

export function useToggleWaterLevelAlertMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: toggleWaterLevelAlert,
        onSuccess: (updatedSensor) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.sensors
            })
            queryClient.setQueryData(
                queryKeys.sensor(updatedSensor.id),
                updatedSensor
            )
        }
    })
}

// Toggle disconnection alert
export async function toggleDisconnectionAlert(
    sensorId: string
): Promise<SensorWithAlerts> {
    return apiClient.patch<SensorWithAlerts>(
        `/sensors/${sensorId}/disconnection-alert`,
        {}
    )
}

export function useToggleDisconnectionAlertMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: toggleDisconnectionAlert,
        onSuccess: (updatedSensor) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.sensors
            })
            queryClient.setQueryData(
                queryKeys.sensor(updatedSensor.id),
                updatedSensor
            )
        }
    })
}

export async function updateWaterLevelThreshold(
    sensorId: string,
    threshold: number
): Promise<SensorWithAlerts> {
    return apiClient.patch<SensorWithAlerts>(
        `/sensors/${sensorId}/water-level-threshold`,
        { threshold }
    )
}

export function useUpdateWaterLevelThresholdMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            sensorId,
            threshold
        }: {
            sensorId: string
            threshold: number
        }) => updateWaterLevelThreshold(sensorId, threshold),
        onSuccess: (updatedSensor) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sensors })
            queryClient.setQueryData(
                queryKeys.sensor(updatedSensor.id),
                updatedSensor
            )
        }
    })
}
