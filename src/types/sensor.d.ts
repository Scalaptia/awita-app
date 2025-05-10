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
    status?: string
    time_between_readings?: number
    sensor_readings?: SensorReading[]
    water_level?: WaterLevel | null
    water_distance?: number
    height?: number
    _count?: {
        sensor_readings: number
    }
}

// Updating this interface to match backend response
interface SensorHistoryReading {
    id: string
    sensor_id: string
    reading: string
    rssi: number
    created_at: string
    water_level: WaterLevel | null
}
