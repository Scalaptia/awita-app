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
    status?: boolean
    time_between_readings?: number
    sensor_readings?: SensorReading[]
    water_level?: WaterLevel | null
    water_distance?: number
    height?: number
    _count?: {
        sensor_readings: number
    }
}

interface SensorWithAlerts extends Sensor {
    custom_name?: string
    water_level_alert: boolean
    disconnection_alert: boolean
    water_level_threshold: number
    last_water_notification: Date | null
    last_disconnection_notification: Date | null
    notification_method: 'EMAIL' | 'SMS'
    cooldown_minutes: number
    disconnected_notified: boolean
}

interface SensorHistoryReading {
    id: string
    sensor_id: string
    reading: string
    rssi: number
    created_at: string
    water_level: WaterLevel | null
}
