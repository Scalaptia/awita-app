import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
    useCreateNotificationSettingMutation,
    useDeleteNotificationSettingMutation,
    useNotificationSettingsQuery,
    useUpdateNotificationSettingMutation
} from '@/lib/notifications-api'
import {
    NotificationType,
    ThresholdType,
    NotificationSetting
} from '@/types/notification'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface NotificationSettingsFormProps {
    sensorId: string
}

interface NotificationFormData {
    notification_type: NotificationType
    threshold_type: ThresholdType
    threshold_value: number
    is_active: boolean
}

export function NotificationSettingsForm({
    sensorId
}: NotificationSettingsFormProps) {
    const [isAddingNew, setIsAddingNew] = useState(false)
    const { data: notifications } = useNotificationSettingsQuery()
    const createMutation = useCreateNotificationSettingMutation()
    const updateMutation = useUpdateNotificationSettingMutation()
    const deleteMutation = useDeleteNotificationSettingMutation()

    // Filter notifications for this sensor
    const sensorNotifications =
        notifications?.filter(
            (notification) => notification.sensor_id === sensorId
        ) ?? []

    const { register, handleSubmit, reset, setValue, watch } =
        useForm<NotificationFormData>({
            defaultValues: {
                notification_type: NotificationType.EMAIL,
                threshold_type: ThresholdType.WATER_LEVEL,
                threshold_value: 50,
                is_active: true
            }
        })

    const onSubmit = async (data: NotificationFormData) => {
        try {
            await createMutation.mutateAsync({
                sensor_id: sensorId,
                ...data
            })
            toast.success('Notificación creada correctamente')
            setIsAddingNew(false)
            reset()
        } catch (error) {
            toast.error('Error al crear la notificación')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id)
            toast.success('Notificación eliminada correctamente')
        } catch (error) {
            toast.error('Error al eliminar la notificación')
        }
    }

    const handleToggle = async (notification: NotificationSetting) => {
        try {
            await updateMutation.mutateAsync({
                id: notification.id,
                data: {
                    is_active: !notification.is_active
                }
            })
            toast.success('Notificación actualizada correctamente')
        } catch (error) {
            toast.error('Error al actualizar la notificación')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Notificaciones</h3>
                {!isAddingNew && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingNew(true)}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar
                    </Button>
                )}
            </div>

            {/* Existing notifications */}
            <div className="space-y-4">
                {sensorNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                    >
                        <div className="space-y-1">
                            <p className="font-medium">
                                {notification.notification_type ===
                                NotificationType.EMAIL
                                    ? 'Correo electrónico'
                                    : 'SMS'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {notification.threshold_type ===
                                ThresholdType.WATER_LEVEL
                                    ? `Nivel de agua ${notification.threshold_value}%`
                                    : 'Desconexión'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Switch
                                checked={notification.is_active}
                                onCheckedChange={() =>
                                    handleToggle(notification)
                                }
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(notification.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add new notification form */}
            {isAddingNew && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 p-4 rounded-lg border"
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tipo de notificación</Label>
                            <Select
                                defaultValue={NotificationType.EMAIL}
                                onValueChange={(value) =>
                                    setValue(
                                        'notification_type',
                                        value as NotificationType
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={NotificationType.EMAIL}>
                                        Correo electrónico
                                    </SelectItem>
                                    <SelectItem value={NotificationType.SMS}>
                                        SMS
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo de alerta</Label>
                            <Select
                                defaultValue={ThresholdType.WATER_LEVEL}
                                onValueChange={(value) =>
                                    setValue(
                                        'threshold_type',
                                        value as ThresholdType
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value={ThresholdType.WATER_LEVEL}
                                    >
                                        Nivel de agua
                                    </SelectItem>
                                    <SelectItem
                                        value={ThresholdType.DISCONNECTION}
                                    >
                                        Desconexión
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {watch('threshold_type') ===
                            ThresholdType.WATER_LEVEL && (
                            <div className="space-y-2">
                                <Label>Nivel de agua (%)</Label>
                                <Input
                                    type="number"
                                    {...register('threshold_value', {
                                        valueAsNumber: true,
                                        required: true,
                                        min: 0,
                                        max: 100
                                    })}
                                />
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                {...register('is_active')}
                                defaultChecked
                            />
                            <Label htmlFor="is_active">Activa</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsAddingNew(false)
                                reset()
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            )}
        </div>
    )
}
