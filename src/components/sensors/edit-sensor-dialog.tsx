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
import { Settings, X, Map, Info } from 'lucide-react'
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
    water_distance: number
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
            longitude: sensor.longitude ?? null,
            water_distance: sensor.water_distance ?? 0
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
            longitude: sensor.longitude ?? null,
            water_distance: sensor.water_distance ?? 0
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
            <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto sm:max-h-[85vh] p-4 sm:p-6">
                <DialogHeader className="space-y-1 sm:space-y-2">
                    <DialogTitle className="text-base sm:text-lg">
                        Editar Sensor: {sensor.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Modifica los detalles del sensor según sea necesario.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 sm:space-y-4 mt-2 sm:mt-4"
                >
                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm">
                                Nombre
                            </Label>
                            <TooltipProvider>
                                <Tooltip open={!!errors.name}>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="name"
                                            placeholder="Nombre del sensor"
                                            className={
                                                errors.name
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                            {...register('name', {
                                                required:
                                                    'El nombre es requerido',
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

                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-sm">
                                Ubicación
                            </Label>
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
                    </div>

                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="capacity" className="text-sm">
                                    Capacidad (L)
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Capacidad total del tanque en
                                                litros
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
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

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="height" className="text-sm">
                                    Altura (cm)
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Altura total del tanque en
                                                centímetros
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
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
                                                required:
                                                    'La altura es requerida',
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
                    </div>

                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Label
                                    htmlFor="water_distance"
                                    className="text-sm"
                                >
                                    Distancia al Agua (cm)
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Distancia desde el sensor hasta
                                                la superficie del agua en
                                                centímetros
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <TooltipProvider>
                                <Tooltip open={!!errors.water_distance}>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="water_distance"
                                            type="number"
                                            className={
                                                errors.water_distance
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                            {...register('water_distance', {
                                                valueAsNumber: true,
                                                required:
                                                    'La distancia al agua es requerida',
                                                min: {
                                                    value: 0,
                                                    message:
                                                        'La distancia no puede ser negativa'
                                                },
                                                max: {
                                                    value: 1000,
                                                    message:
                                                        'La distancia máxima es 1000 cm (10 metros)'
                                                }
                                            })}
                                        />
                                    </TooltipTrigger>
                                    {errors.water_distance && (
                                        <TooltipContent
                                            side="right"
                                            className="bg-destructive text-destructive-foreground"
                                        >
                                            <p>
                                                {errors.water_distance.message}
                                            </p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Label
                                    htmlFor="time_between_readings"
                                    className="text-sm"
                                >
                                    Intervalo (min)
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Tiempo entre cada medición del
                                                sensor en minutos
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
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
                                            {...register(
                                                'time_between_readings',
                                                {
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
                                                }
                                            )}
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
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm">Ubicación en Mapa</Label>
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
                                            className="flex-1 h-9"
                                        >
                                            <Map className="mr-2 h-3.5 w-3.5" />
                                            <span className="text-sm">
                                                Seleccionar ubicación
                                            </span>
                                        </Button>
                                        {currentLatitude &&
                                            currentLongitude && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive h-9 w-9"
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
                            <p className="text-xs text-muted-foreground">
                                Ubicación: {currentLatitude.toFixed(6)},{' '}
                                {currentLongitude.toFixed(6)}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-2 sm:pt-4">
                        <Button
                            type="submit"
                            disabled={!isDirty || isSubmitting}
                            className="h-9"
                        >
                            <span className="text-sm">Guardar</span>
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
