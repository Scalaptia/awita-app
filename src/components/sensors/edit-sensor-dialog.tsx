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
import { useUpdateSensorMutation } from '@/lib/sensors-api'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { NotificationSettingsForm } from './notification-settings-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EditSensorForm {
    name: string
    location: string
    capacity: number
    height: number
    time_between_readings: number
}

interface EditSensorDialogProps {
    sensor: Sensor
    onUpdate?: (updated: Sensor) => void
    trigger?: React.ReactNode
}

export function EditSensorDialog({
    sensor,
    onUpdate,
    trigger
}: EditSensorDialogProps) {
    const [open, setOpen] = useState(false)
    const { mutate: updateSensor } = useUpdateSensorMutation()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<EditSensorForm>({
        defaultValues: {
            name: sensor.name,
            location: sensor.location ?? '',
            capacity: sensor.capacity,
            height: sensor.height ?? 0,
            time_between_readings: sensor.time_between_readings ?? 5
        }
    })

    const onSubmit = async (data: EditSensorForm) => {
        try {
            updateSensor(
                {
                    id: sensor.id,
                    data
                },
                {
                    onSuccess: () => {
                        toast.success('Sensor actualizado correctamente')
                        if (onUpdate) {
                            onUpdate({ ...sensor, ...data })
                        }
                    },
                    onError: (error) => {
                        toast.error('Error al actualizar el sensor')
                        console.error('Failed to update sensor:', error)
                    }
                }
            )
        } catch (error) {
            toast.error('Error al actualizar el sensor')
            console.error('Failed to update sensor:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Sensor: {sensor.name}</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="details" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Detalles</TabsTrigger>
                        <TabsTrigger value="notifications">
                            Notificaciones
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-4">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Nombre del sensor"
                                    aria-invalid={!!errors.name}
                                    {...register('name', { required: true })}
                                />
                                {errors.name?.type === 'required' && (
                                    <p className="text-sm text-red-500">
                                        El nombre es requerido
                                    </p>
                                )}
                            </div>
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
                                <Label htmlFor="capacity">Capacidad (L)</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    aria-invalid={!!errors.capacity}
                                    {...register('capacity', {
                                        valueAsNumber: true,
                                        required: true,
                                        min: 1
                                    })}
                                />
                                {errors.capacity?.type === 'min' && (
                                    <p className="text-sm text-red-500">
                                        La capacidad mínima es 1
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height">Altura (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    aria-invalid={!!errors.height}
                                    {...register('height', {
                                        valueAsNumber: true,
                                        required: true,
                                        min: 0
                                    })}
                                />
                                {errors.height?.type === 'min' && (
                                    <p className="text-sm text-red-500">
                                        La altura no puede ser negativa
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time_between_readings">
                                    Intervalo de Medición (minutos)
                                </Label>
                                <Input
                                    id="time_between_readings"
                                    type="number"
                                    aria-invalid={
                                        !!errors.time_between_readings
                                    }
                                    {...register('time_between_readings', {
                                        valueAsNumber: true,
                                        required: true,
                                        min: 1,
                                        max: 1440 // 24 hours in minutes
                                    })}
                                />
                                {errors.time_between_readings?.type ===
                                    'min' && (
                                    <p className="text-sm text-red-500">
                                        El intervalo mínimo es 1 minuto
                                    </p>
                                )}
                                {errors.time_between_readings?.type ===
                                    'max' && (
                                    <p className="text-sm text-red-500">
                                        El intervalo máximo es 24 horas
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-4">
                        <NotificationSettingsForm sensorId={sensor.id} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
