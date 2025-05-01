export class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message)
        this.name = 'ApiError'
    }
}

export const SENSOR_ERROR_MESSAGES: Record<number, string> = {
    404: 'Sensor no encontrado',
    409: 'Este sensor ya está registrado'
} as const
