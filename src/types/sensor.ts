export interface SensorReading {
    sensor_id: string
    reading: string
    rssi: number
    created_at: string
}

export interface WaterLevel {
    currentLevel: number
    percentage: number
}

export interface Sensor {
    id: string
    name: string
    capacity: number
    location?: string
    status?: 'connected' | 'disconnected'
    measurement_interval?: number
    sensor_readings?: SensorReading[]
    water_level?: WaterLevel | null
    order?: number
    water_distance?: number
    height?: number
}
