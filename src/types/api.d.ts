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

interface ApiError {
    response?: {
        status: number
        data?: {
            message?: string
        }
    }
    message: string
}

interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
}

interface RegisterSensorResponse {
    sensorId: string
    userId: string
}
