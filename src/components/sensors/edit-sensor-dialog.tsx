import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { useUpdateSensorMutation } from '@/lib/sensors-api'
import { Settings, X, Map } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LocationMapDialog } from './location-map-dialog'

interface EditSensorForm {
    name: string
    location: string
    capacity: number
    height: number
    time_between_readings: number
    latitude?: number | null
    longitude?: number | null
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
    const { mutateAsync: updateSensor } = useUpdateSensorMutation()
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<EditSensorForm>({
        defaultValues: {
            name: sensor.name,
            location: sensor.location ?? '',
            capacity: sensor.capacity,
            height: sensor.height ?? 0,
            time_between_readings: sensor.time_between_readings ?? 5,
            latitude: sensor.latitude ?? null,
            longitude: sensor.longitude ?? null
        }
    })

    // Reset form when sensor changes or modal opens/closes
    useEffect(() => {
        reset({
            name: sensor.name,
            location: sensor.location ?? '',
            capacity: sensor.capacity,
            height: sensor.height ?? 0,
            time_between_readings: sensor.time_between_readings ?? 5,
            latitude: sensor.latitude ?? null,
            longitude: sensor.longitude ?? null
        })
    }, [sensor, open, reset])

    const onSubmit = async (data: EditSensorForm) => {
        try {
            const updated = await updateSensor({
                id: sensor.id,
                data
            })

            toast.success('Sensor actualizado correctamente')
            if (onUpdate) {
                onUpdate(updated)
            }
            setOpen(false)
        } catch (error) {
            toast.error('Error al actualizar el sensor')
            console.error('Failed to update sensor:', error)
        }
    }

    const handleLocationSelect = (lat: number, lng: number) => {
        // Solo actualizar el formulario con las nuevas coordenadas
        setValue('latitude', lat, { shouldDirty: true })
        setValue('longitude', lng, { shouldDirty: true })
    }

    const currentLatitude = watch('latitude')
    const currentLongitude = watch('longitude')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Sensor: {sensor.name}</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del sensor según sea necesario.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <TooltipProvider>
                            <Tooltip open={!!errors.name}>
                                <TooltipTrigger asChild>
                                    <Input
                                        id="name"
                                        placeholder="Nombre del sensor"
                                        className={
                                            errors.name ? 'border-red-500' : ''
                                        }
                                        {...register('name', {
                                            required: 'El nombre es requerido',
                                            maxLength: {
                                                value: 25,
                                                message:
                                                    'El nombre no puede tener más de 25 caracteres'
                                            }
                                        })}
                                    />
                                </TooltipTrigger>
                                {errors.name && (
                                    <TooltipContent
                                        side="right"
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        <p>{errors.name.message}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <TooltipProvider>
                            <Tooltip open={!!errors.location}>
                                <TooltipTrigger asChild>
                                    <Input
                                        id="location"
                                        placeholder="Ubicación del sensor"
                                        className={
                                            errors.location
                                                ? 'border-red-500'
                                                : ''
                                        }
                                        {...register('location', {
                                            maxLength: {
                                                value: 25,
                                                message:
                                                    'La ubicación no puede tener más de 25 caracteres'
                                            }
                                        })}
                                    />
                                </TooltipTrigger>
                                {errors.location && (
                                    <TooltipContent
                                        side="right"
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        <p>{errors.location.message}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="space-y-2">
                        <Label>Ubicación en Mapa</Label>
                        <div className="flex-1">
                            <LocationMapDialog
                                latitude={currentLatitude}
                                longitude={currentLongitude}
                                onLocationSelect={handleLocationSelect}
                                showSaveButton={true}
                                trigger={
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <Map className="mr-2 h-4 w-4" />
                                            Seleccionar ubicación en mapa
                                        </Button>
                                        {currentLatitude &&
                                            currentLongitude && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setValue(
                                                            'latitude',
                                                            null,
                                                            {
                                                                shouldDirty:
                                                                    true
                                                            }
                                                        )
                                                        setValue(
                                                            'longitude',
                                                            null,
                                                            {
                                                                shouldDirty:
                                                                    true
                                                            }
                                                        )
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                    </div>
                                }
                            />
                        </div>
                        {currentLatitude && currentLongitude && (
                            <p className="text-sm text-muted-foreground">
                                Ubicación seleccionada:{' '}
                                {currentLatitude.toFixed(6)},{' '}
                                {currentLongitude.toFixed(6)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacidad (L)</Label>
                        <TooltipProvider>
                            <Tooltip open={!!errors.capacity}>
                                <TooltipTrigger asChild>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        className={
                                            errors.capacity
                                                ? 'border-red-500'
                                                : ''
                                        }
                                        {...register('capacity', {
                                            valueAsNumber: true,
                                            required:
                                                'La capacidad es requerida',
                                            min: {
                                                value: 1,
                                                message:
                                                    'La capacidad mínima es 1'
                                            },
                                            max: {
                                                value: 100000,
                                                message:
                                                    'La capacidad máxima es 100,000 litros'
                                            }
                                        })}
                                    />
                                </TooltipTrigger>
                                {errors.capacity && (
                                    <TooltipContent
                                        side="right"
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        <p>{errors.capacity.message}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="height">Altura (cm)</Label>
                        <TooltipProvider>
                            <Tooltip open={!!errors.height}>
                                <TooltipTrigger asChild>
                                    <Input
                                        id="height"
                                        type="number"
                                        className={
                                            errors.height
                                                ? 'border-red-500'
                                                : ''
                                        }
                                        {...register('height', {
                                            valueAsNumber: true,
                                            required: 'La altura es requerida',
                                            min: {
                                                value: 0,
                                                message:
                                                    'La altura no puede ser negativa'
                                            },
                                            max: {
                                                value: 1000,
                                                message:
                                                    'La altura máxima es 1000 cm (10 metros)'
                                            }
                                        })}
                                    />
                                </TooltipTrigger>
                                {errors.height && (
                                    <TooltipContent
                                        side="right"
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        <p>{errors.height.message}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time_between_readings">
                            Intervalo de Medición (minutos)
                        </Label>
                        <TooltipProvider>
                            <Tooltip open={!!errors.time_between_readings}>
                                <TooltipTrigger asChild>
                                    <Input
                                        id="time_between_readings"
                                        type="number"
                                        className={
                                            errors.time_between_readings
                                                ? 'border-red-500'
                                                : ''
                                        }
                                        {...register('time_between_readings', {
                                            valueAsNumber: true,
                                            required:
                                                'El intervalo es requerido',
                                            min: {
                                                value: 1,
                                                message:
                                                    'El intervalo mínimo es 1 minuto'
                                            },
                                            max: {
                                                value: 1440,
                                                message:
                                                    'El intervalo máximo es 24 horas'
                                            }
                                        })}
                                    />
                                </TooltipTrigger>
                                {errors.time_between_readings && (
                                    <TooltipContent
                                        side="right"
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        <p>
                                            {
                                                errors.time_between_readings
                                                    .message
                                            }
                                        </p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={!isDirty || isSubmitting}
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
