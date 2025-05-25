import { useAuthStore } from '@/stores/AuthStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { predictionsApiClient } from './api'
import type {
    PredictionResponse,
    ModelInfo,
    PredictionRequest
} from '@/types/prediction'

// Query keys for caching and invalidation
export const predictionKeys = {
    all: ['predictions'] as const,
    byId: (sensorId: string) => ['predictions', sensorId] as const,
    modelInfo: ['predictions', 'model'] as const
}

// Convert UTC timestamps to local time
function convertToLocalTime(
    predictions: PredictionResponse
): PredictionResponse {
    return {
        ...predictions,
        predictions: predictions.predictions.map((prediction) => {
            const utcDate = new Date(prediction.timestamp)
            const localDate = new Date(
                utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
            )
            return {
                ...prediction,
                timestamp: localDate.toISOString()
            }
        })
    }
}

// Base API functions
export async function getPredictions(
    sensorId: string,
    params: PredictionRequest = {}
): Promise<PredictionResponse> {
    const response = await predictionsApiClient.post<PredictionResponse>(
        `/predict/${sensorId}`,
        params
    )
    return convertToLocalTime(response)
}

export async function getModelInfo(): Promise<ModelInfo> {
    return predictionsApiClient.get<ModelInfo>('/model-info')
}

export async function trainModel(): Promise<{ message: string }> {
    return predictionsApiClient.post<{ message: string }>('/train', {})
}

export async function clearPredictionsCache(sensorId?: string): Promise<void> {
    const endpoint = sensorId ? `/cache/${sensorId}` : '/cache'
    return predictionsApiClient.delete(endpoint)
}

// Query Hooks
export function usePredictionsQuery(
    sensorId: string,
    params: PredictionRequest = {},
    enabled = true
) {
    const { userId, isSignedIn, isLoaded } = useAuthStore()

    return useQuery({
        queryKey: [...predictionKeys.byId(sensorId), params],
        queryFn: () => getPredictions(sensorId, params),
        enabled: isLoaded && !!userId && isSignedIn && enabled,
        retry: 2,
        retryDelay: 500,
        // staleTime: 5 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000
    })
}

export function useModelInfoQuery() {
    const { userId, isSignedIn, isLoaded } = useAuthStore()

    return useQuery({
        queryKey: predictionKeys.modelInfo,
        queryFn: getModelInfo,
        enabled: isLoaded && !!userId && isSignedIn,
        retry: 3,
        retryDelay: 1000,
        staleTime: 5 * 60 * 1000
    })
}

// Mutation Hooks
export function useTrainModelMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: trainModel,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: predictionKeys.modelInfo
            })
            queryClient.invalidateQueries({ queryKey: predictionKeys.all })
        }
    })
}

export function useClearPredictionsCacheMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: clearPredictionsCache,
        onSuccess: (_, sensorId) => {
            if (sensorId) {
                queryClient.invalidateQueries({
                    queryKey: predictionKeys.byId(sensorId)
                })
            } else {
                queryClient.invalidateQueries({ queryKey: predictionKeys.all })
            }
        }
    })
}
