import { useAuthStore } from '@/stores/AuthStore'
import { useQuery } from '@tanstack/react-query'

class ApiClient {
    private baseUrl: string

    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL
    }

    private async fetchWithAuth(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {
        if (!window.Clerk) {
            throw new Error('Authentication not initialized')
        }

        const { userId, isSignedIn } = useAuthStore.getState()

        if (!isSignedIn || !userId) {
            throw new Error('User is not authenticated')
        }

        const token = await window.Clerk.session?.getToken()

        if (!token) {
            throw new Error('No authentication token available')
        }

        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'clerk-user-id': userId
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers
        })

        if (response.status === 401) {
            throw new Error('Unauthorized: Please sign in again')
        }

        if (!response.ok) {
            throw new Error(
                `API error (${response.status}): ${response.statusText}`
            )
        }

        return response
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await this.fetchWithAuth(endpoint)

        if (!response.ok) {
            throw new Error(
                `API error (${response.status}): ${response.statusText}`
            )
        }

        return response.json()
    }

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(
                `API error (${response.status}): ${response.statusText}`
            )
        }

        return response.json()
    }

    async patch<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(
                `API error (${response.status}): ${response.statusText}`
            )
        }

        return response.json()
    }

    async delete(endpoint: string): Promise<void> {
        const response = await this.fetchWithAuth(endpoint, {
            method: 'DELETE'
        })

        if (!response.ok) {
            throw new Error(
                `API error (${response.status}): ${response.statusText}`
            )
        }
    }
}

// Singleton instance
const apiClient = new ApiClient()
export { apiClient }

// Query keys for caching and invalidation
export const queryKeys = {
    health: ['health'],
    sensors: ['sensors'],
    sensor: (id: string) => ['sensors', id]
}

export async function checkHealth(): Promise<HealthCheckResponse> {
    return apiClient.get<HealthCheckResponse>('/health')
}

// Health check query hook
export function useHealthQuery() {
    const { userId, isSignedIn } = useAuthStore()

    return useQuery({
        queryKey: queryKeys.health,
        queryFn: checkHealth,
        // Only execute when user is actually signed in
        enabled: !!userId && isSignedIn,
        // Add retry logic
        retry: 3,
        retryDelay: 1000,
        staleTime: 1000 * 60 * 1 // 1 minute
    })
}
