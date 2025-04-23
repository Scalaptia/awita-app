import { getSensors, deleteSensor, updateSensor } from '@/lib/api'
import { useAppStore } from '@/stores/AppStore'
import { useEffect, useState } from 'react'
import { SensorsTable } from '@/components/sensors/sensors-table'
import { Sensor } from '@/types/sensor'

export default function Sensors() {
    const setTitle = useAppStore((state: any) => state.setTitle)
    const [sensors, setSensors] = useState<Sensor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setTitle('Sensores')
        fetchSensors()
    }, [])

    const fetchSensors = async () => {
        try {
            const data = await getSensors()
            setSensors(data)
        } catch (err) {
            setError('Error al cargar los sensores')
        } finally {
            setLoading(false)
        }
    }

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return

        const items = Array.from(sensors)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        const updatedSensors = items.map((sensor, index) => ({
            ...sensor,
            order: index
        }))

        setSensors(updatedSensors)

        try {
            await updateSensor(reorderedItem.id, {
                order: result.destination.index
            })
        } catch (error) {
            console.error('Failed to update sensor order:', error)
            fetchSensors()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Está seguro de eliminar este sensor?')) return

        try {
            await deleteSensor(id)
            setSensors(sensors.filter((s) => s.id !== id))
        } catch (error) {
            console.error('Failed to delete sensor:', error)
        }
    }

    const handleUpdate = (updated: Sensor) => {
        setSensors(sensors.map((s) => (s.id === updated.id ? updated : s)))
    }

    if (error) {
        return (
            <div className="rounded-md bg-destructive/15 p-4 text-destructive">
                {error}
            </div>
        )
    }

    return (
        <div className="px-6 py-1">
            <div className="rounded-md border">
                <SensorsTable
                    sensors={sensors}
                    loading={loading}
                    onDragEnd={handleDragEnd}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </div>
        </div>
    )
}
