import {
    useSensorsQuery,
    useUpdateSensorMutation,
    useDeleteSensorMutation
} from '@/lib/sensors-api'
import { useAppStore } from '@/stores/AppStore'
import { useEffect } from 'react'
import { SensorsTable } from '@/components/sensors/sensors-table'

export default function Sensors() {
    const setTitle = useAppStore((state: any) => state.setTitle)
    const { data: sensors, isLoading, error } = useSensorsQuery()
    const { mutate: updateSensor } = useUpdateSensorMutation()
    const { mutate: deleteSensor } = useDeleteSensorMutation()

    useEffect(() => {
        setTitle('Sensores')
    }, [])

    const handleDragEnd = async (result: any) => {
        if (!result.destination || !sensors) return

        const items = Array.from(sensors)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        const updatedSensors = items.map((sensor, index) => ({
            ...sensor,
            order: index
        }))

        // Update the sensor order in the backend
        updateSensor({
            id: reorderedItem.id,
            data: { order: result.destination.index }
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Está seguro de eliminar este sensor?')) return
        deleteSensor(id)
    }

    const handleUpdate = (updated: Sensor) => {
        updateSensor({ id: updated.id, data: updated })
    }

    if (error) {
        return (
            <div className="rounded-md bg-destructive/15 p-4 text-destructive">
                {error instanceof Error
                    ? error.message
                    : 'Error al cargar los sensores'}
            </div>
        )
    }

    return (
        <div className="px-6 py-1">
            <div className="rounded-md border">
                <SensorsTable
                    sensors={sensors || []}
                    loading={isLoading}
                    onDragEnd={handleDragEnd}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </div>
        </div>
    )
}
