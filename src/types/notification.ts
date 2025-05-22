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
    sensor_id: string
    notification_type: NotificationType
    threshold_type: ThresholdType
    threshold_value: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CreateNotificationSettingDto {
    sensor_id: string
    notification_type: NotificationType
    threshold_type: ThresholdType
    threshold_value: number
    is_active?: boolean
}

export interface UpdateNotificationSettingDto {
    notification_type?: NotificationType
    threshold_type?: ThresholdType
    threshold_value?: number
    is_active?: boolean
}
