import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Sensor, updateSensor } from '@/lib/sensors-api'
import { Pencil } from 'lucide-react'
import { useState } from 'react'

interface EditSensorDialogProps {
    sensor: Sensor
    onUpdate: (updatedSensor: Sensor) => void
}

export function EditSensorDialog({ sensor, onUpdate }: EditSensorDialogProps) {
    const [open, setOpen] = useState(false)
    const [location, setLocation] = useState(sensor.location || '')
    const [interval, setInterval] = useState(sensor.measurement_interval || 5)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const updated = await updateSensor(sensor.id, {
                location,
                measurement_interval: interval
            })
            onUpdate(updated)
            setOpen(false)
        } catch (error) {
            console.error('Failed to update sensor:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Sensor: {sensor.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label>Ubicación</label>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Ubicación del sensor"
                        />
                    </div>
                    <div className="space-y-2">
                        <label>Intervalo de Medición (minutos)</label>
                        <Input
                            type="number"
                            min="1"
                            value={interval}
                            onChange={(e) =>
                                setInterval(Number(e.target.value))
                            }
                        />
                    </div>
                    <Button type="submit">Guardar</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
