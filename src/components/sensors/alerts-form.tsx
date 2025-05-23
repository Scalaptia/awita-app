import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    useToggleWaterLevelAlertMutation,
    useToggleDisconnectionAlertMutation
} from '@/lib/sensors-api'
import { useSensorQuery } from '@/lib/sensors-api'
import { toast } from 'sonner'

interface AlertsFormProps {
    sensorId: string
}

export function AlertsForm({ sensorId }: AlertsFormProps) {
    const { data: sensor } = useSensorQuery(sensorId)
    const toggleWaterLevelMutation = useToggleWaterLevelAlertMutation()
    const toggleDisconnectionMutation = useToggleDisconnectionAlertMutation()

    const handleWaterLevelToggle = async () => {
        try {
            await toggleWaterLevelMutation.mutateAsync(sensorId)
            toast.success('Alerta actualizada correctamente')
        } catch (error) {
            toast.error('Error al actualizar la alerta')
        }
    }

    const handleDisconnectionToggle = async () => {
        try {
            await toggleDisconnectionMutation.mutateAsync(sensorId)
            toast.success('Alerta actualizada correctamente')
        } catch (error) {
            toast.error('Error al actualizar la alerta')
        }
    }

    if (!sensor) {
        return null
    }

    return (
        <div className="space-y-4">
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
                        checked={sensor.water_level_alert}
                        onCheckedChange={handleWaterLevelToggle}
                        disabled={toggleWaterLevelMutation.isPending}
                    />
                </div>
                {sensor.water_level_alert && (
                    <div className="space-y-2">
                        <Label>Umbral (%)</Label>
                        <Input
                            type="number"
                            defaultValue={sensor.water_level_threshold}
                            min={0}
                            max={100}
                            disabled
                        />
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
                        checked={sensor.disconnection_alert}
                        onCheckedChange={handleDisconnectionToggle}
                        disabled={toggleDisconnectionMutation.isPending}
                    />
                </div>
            </div>
        </div>
    )
}
