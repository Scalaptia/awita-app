import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import {
    useToggleWaterLevelAlertMutation,
    useToggleDisconnectionAlertMutation,
    useUpdateWaterLevelThresholdMutation,
    useSensorQuery
} from '@/lib/sensors-api'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'

interface EditAlertsDialogProps {
    sensorId: string
    onClose?: () => void
}

interface AlertsFormData {
    waterLevelAlert: boolean
    disconnectionAlert: boolean
    waterLevelThreshold: number
}

export function EditAlertsDialog({ sensorId, onClose }: EditAlertsDialogProps) {
    const { data: sensor } = useSensorQuery(sensorId)
    const toggleWaterLevelMutation = useToggleWaterLevelAlertMutation()
    const toggleDisconnectionMutation = useToggleDisconnectionAlertMutation()
    const updateThresholdMutation = useUpdateWaterLevelThresholdMutation()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty, isSubmitting }
    } = useForm<AlertsFormData>({
        defaultValues: {
            waterLevelAlert: sensor?.water_level_alert ?? false,
            disconnectionAlert: sensor?.disconnection_alert ?? false,
            waterLevelThreshold: sensor?.water_level_threshold ?? 20
        }
    })

    const waterLevelAlert = watch('waterLevelAlert')

    const onSubmit = async (data: AlertsFormData) => {
        try {
            if (data.waterLevelThreshold !== sensor?.water_level_threshold) {
                await updateThresholdMutation.mutateAsync({
                    sensorId,
                    threshold: data.waterLevelThreshold
                })
            }

            if (data.waterLevelAlert !== sensor?.water_level_alert) {
                await toggleWaterLevelMutation.mutateAsync(sensorId)
            }

            if (data.disconnectionAlert !== sensor?.disconnection_alert) {
                await toggleDisconnectionMutation.mutateAsync(sensorId)
            }

            toast.success('Configuración guardada correctamente')
            if (onClose) {
                onClose()
            }
        } catch (err) {
            toast.error('Error al guardar la configuración')
            console.error('Error saving alerts configuration:', err)
        }
    }

    if (!sensor) {
        return null
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Water Level Alert */}
            <div className="space-y-4 p-4 rounded-lg bg-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">Alerta de nivel bajo</h4>
                        <p className="text-sm text-muted-foreground">
                            Recibe una notificación cuando el nivel del agua
                            esté por debajo del umbral
                        </p>
                    </div>
                    <Switch
                        checked={waterLevelAlert}
                        onCheckedChange={(checked) =>
                            setValue('waterLevelAlert', checked, {
                                shouldDirty: true
                            })
                        }
                        disabled={isSubmitting}
                    />
                </div>
                {waterLevelAlert && (
                    <div className="space-y-2">
                        <Label>Umbral</Label>
                        <TooltipProvider>
                            <Tooltip open={!!errors.waterLevelThreshold}>
                                <TooltipTrigger asChild>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            className={`pr-8 ${
                                                errors.waterLevelThreshold
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            {...register(
                                                'waterLevelThreshold',
                                                {
                                                    valueAsNumber: true,
                                                    required:
                                                        'El umbral es requerido',
                                                    min: {
                                                        value: 0,
                                                        message:
                                                            'El valor no puede ser negativo'
                                                    },
                                                    max: {
                                                        value: 100,
                                                        message:
                                                            'El valor no puede ser mayor a 100'
                                                    }
                                                }
                                            )}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            %
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                {errors.waterLevelThreshold && (
                                    <TooltipContent
                                        side="right"
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        <p>
                                            {errors.waterLevelThreshold.message}
                                        </p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>

            {/* Disconnection Alert */}
            <div className="space-y-4 p-4 rounded-lg bg-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">Alerta de desconexión</h4>
                        <p className="text-sm text-muted-foreground">
                            Recibe una notificación cuando el sensor pierda
                            conexión
                        </p>
                    </div>
                    <Switch
                        checked={watch('disconnectionAlert')}
                        onCheckedChange={(checked) =>
                            setValue('disconnectionAlert', checked, {
                                shouldDirty: true
                            })
                        }
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={!isDirty || isSubmitting}>
                    Guardar
                </Button>
            </div>
        </form>
    )
}
