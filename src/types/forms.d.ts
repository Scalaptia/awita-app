interface CreateSensorForm {
    name: string
    location: string
    capacity: number
    measurement_interval: number
}

interface RegisterSensorForm {
    sensor_id: string
}

interface EditSensorForm {
    name: string
    location: string
    measurement_interval: number
}
