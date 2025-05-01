import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateSensorMutation, Sensor } from '@/lib/sensors-api'
import { PlusCircle } from 'lucide-react'

export function CreateSensorDialog() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [capacity, setCapacity] = useState('100')
    const [measurementInterval, setMeasurementInterval] = useState('60')

    const { mutate: createSensor, isPending } = useCreateSensorMutation()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newSensor: Omit<Sensor, 'id'> = {
            name,
            location,
            capacity: Number(capacity),
            status: 'disconnected',
            measurement_interval: Number(measurementInterval),
            order: 999 // Will be reordered by backend
        }

        createSensor(newSensor, {
            onSuccess: () => {
                setOpen(false)
                setName('')
                setLocation('')
                setCapacity('100')
                setMeasurementInterval('60')
            }
        })
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} className="mb-4">
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Sensor
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Sensor</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="location">Ubicación</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="capacity">Capacidad (L)</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={capacity}
                                    onChange={(e) =>
                                        setCapacity(e.target.value)
                                    }
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="interval">
                                    Intervalo de medida (min)
                                </Label>
                                <Input
                                    id="interval"
                                    type="number"
                                    value={measurementInterval}
                                    onChange={(e) =>
                                        setMeasurementInterval(e.target.value)
                                    }
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Creando...' : 'Crear Sensor'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
