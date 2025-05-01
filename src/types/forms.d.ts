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
    location: string
    measurement_interval: number
}
