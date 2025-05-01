interface SensorReading {
    sensor_id: string
    reading: string
    rssi: number
    created_at: string
}

interface WaterLevel {
    currentLevel: number
    percentage: number
}

interface Sensor {
    id: string
    name: string
    location?: string
    capacity: number
    status?: 'connected' | 'disconnected'
    measurement_interval?: number
    sensor_readings?: SensorReading[]
    water_level?: WaterLevel | null
    water_distance?: number
    height?: number
}
