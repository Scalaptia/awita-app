export interface PredictionPoint {
    timestamp: string
    value: number
}

export interface PredictionInsights {
    summary: string
    risk_level: 'bajo' | 'normal' | 'alto'
    warning?: string
    trend: string
}

export interface PredictionResponse {
    sensor_id: string
    predictions: PredictionPoint[]
    insights: PredictionInsights
    confidence_score: number
    last_updated: string
}

export interface ModelInfo {
    status: 'not_trained' | 'active'
    last_training: string
    total_sensors: number
    features: string[]
}

export interface PredictionRequest {
    hours?: number
    granularity?: '15min' | '30min' | '1h' | '2h' | '4h' | '6h' | '12h'
}
