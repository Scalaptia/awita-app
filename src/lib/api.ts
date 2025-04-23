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

export interface SensorReading {
    id: string
    reading: string
    timestamp: string
    sensor_id: string
}

export interface WaterLevelInfo {
    currentLevel: number
    percentage: number
}

export interface Sensor {
    id: string
    name: string
    location?: string
    capacity: number
    status: 'connected' | 'disconnected'
    measurement_interval?: number
    order: number
    sensor_readings?: SensorReading[]
    water_level?: WaterLevelInfo
}

export async function getSensors(): Promise<Sensor[]> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/sensors`)
    if (!response.ok) {
        throw new Error('Failed to fetch sensors')
    }
    return response.json()
}

export async function updateSensor(
    id: string,
    data: Partial<Sensor>
): Promise<Sensor> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/sensors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update sensor')
    return response.json()
}

export async function deleteSensor(id: string): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/sensors/${id}`, {
        method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete sensor')
}
