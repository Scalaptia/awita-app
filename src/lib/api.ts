interface HealthCheckResponse {
    status: 'ok' | 'error'
    info: {
        database: {
            status: 'up' | 'down'
        }
    }
    error: Record<string, unknown>
    details: {
        database: {
            status: 'up' | 'down'
        }
    }
}

export async function checkHealth(): Promise<HealthCheckResponse> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/health`)
    if (!response.ok) {
        throw new Error('Health check failed')
    }
    return response.json()
}
