import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateSensor } from '@/lib/sensors-api'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditSensorForm {
    location: string
    measurement_interval: number
}

interface EditSensorDialogProps {
    sensor: Sensor
    onUpdate: (updatedSensor: Sensor) => void
}

export function EditSensorDialog({ sensor, onUpdate }: EditSensorDialogProps) {
    const [open, setOpen] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<EditSensorForm>({
        defaultValues: {
            location: sensor.location || '',
            measurement_interval: sensor.measurement_interval || 5
        }
    })

    const onSubmit = async (data: EditSensorForm) => {
        try {
            const updated = await updateSensor(sensor.id, data)
            onUpdate(updated)
            setOpen(false)
            toast.success('Sensor actualizado correctamente')
        } catch (error) {
            toast.error('Error al actualizar el sensor')
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <Input
                            id="location"
                            placeholder="Ubicación del sensor"
                            aria-invalid={!!errors.location}
                            {...register('location')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="measurement_interval">
                            Intervalo de Medición (minutos)
                        </Label>
                        <Input
                            id="measurement_interval"
                            type="number"
                            aria-invalid={!!errors.measurement_interval}
                            {...register('measurement_interval', {
                                valueAsNumber: true,
                                required: true,
                                min: 1,
                                max: 1440 // 24 hours in minutes
                            })}
                        />
                        {errors.measurement_interval?.type === 'min' && (
                            <p className="text-sm text-red-500">
                                El intervalo mínimo es 1 minuto
                            </p>
                        )}
                        {errors.measurement_interval?.type === 'max' && (
                            <p className="text-sm text-red-500">
                                El intervalo máximo es 24 horas
                            </p>
                        )}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
