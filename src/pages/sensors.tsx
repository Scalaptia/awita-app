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

    const handleDelete = async (id: string) => {
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
            <SensorsTable
                sensors={sensors || []}
                loading={isLoading}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </div>
    )
}
