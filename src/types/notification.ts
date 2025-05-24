export enum NotificationType {
    EMAIL = 'EMAIL',
    SMS = 'SMS'
}

export enum ThresholdType {
    WATER_LEVEL = 'WATER_LEVEL',
    DISCONNECTION = 'DISCONNECTION'
}

export interface NotificationSetting {
    id: string
    user_id: string
    sensor_id: string
    water_level_alert: boolean
    disconnection_alert: boolean
    water_level_threshold: number | null
    last_water_notification: Date | null
    last_disconnection_notification: Date | null
    notification_method: 'EMAIL' | 'SMS'
    cooldown_minutes: number
    disconnected_notified: boolean
}

export interface Notification {
    id: string
    type: ThresholdType
    threshold_value: number
    current_value: number
    created_at: string
    read: boolean
    sensors: {
        name: string
        location: string | null
    }
}
