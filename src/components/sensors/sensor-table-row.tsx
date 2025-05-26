import { TableRow, TableCell } from '@/components/ui/table'
import { EditSensorDialog } from '@/components/sensors/edit-sensor-dialog'
import { DeleteSensorDialog } from './delete-sensor-dialog'
import { EditAlertsDialog } from './edit-alerts-dialog'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Bell, Settings, Map, MapPin } from 'lucide-react'
import { LocationMapDialog } from './location-map-dialog'
import { useUpdateSensorMutation } from '@/lib/sensors-api'
import { toast } from 'sonner'

interface SensorTableRowProps {
    sensor: Sensor
    onDelete: (id: string) => void
    onUpdate: (updated: Sensor) => void
}

export function SensorTableRow({
    sensor,
    onDelete,
    onUpdate
}: SensorTableRowProps) {
    const { mutateAsync: updateSensor } = useUpdateSensorMutation()

    const handleLocationSelect = async (lat: number, lng: number) => {
        try {
            const updated = await updateSensor({
                id: sensor.id,
                data: {
                    name: sensor.name,
                    location: sensor.location,
                    capacity: sensor.capacity,
                    height: sensor.height ?? 0,
                    time_between_readings: sensor.time_between_readings ?? 5,
                    latitude: lat,
                    longitude: lng
                }
            })
            onUpdate(updated)
            toast.success('Ubicación actualizada correctamente')
        } catch (error) {
            toast.error('Error al actualizar la ubicación')
            console.error('Failed to update location:', error)
        }
    }

    const getLatestReading = (sensor: Sensor) => {
        if (!sensor.water_level || !sensor.sensor_readings?.[0]) {
            return <span className="text-muted-foreground">Sin lecturas</span>
        }

        const lastReading = sensor.sensor_readings[0]
        const lastReadingDate = new Date(lastReading.created_at)
        const timeAgo = formatDistanceToNow(lastReadingDate, {
            locale: es,
            addSuffix: false
        })

        return (
            <div className="flex flex-col space-y-1">
                <div className="flex items-baseline gap-2">
                    <span className="font-medium tabular-nums">
                        {Math.round(sensor.water_level.currentLevel)}L
                    </span>
                    <span className="text-muted-foreground text-xs">
                        {sensor.water_level.percentage.toFixed(0)}%
                    </span>
                </div>
                <div className="text-xs text-muted-foreground">
                    hace {timeAgo}
                </div>
            </div>
        )
    }

    const hasLocation = sensor.latitude && sensor.longitude

    return (
        <TableRow className="group">
            <TableCell className="font-mono text-xs text-muted-foreground truncate">
                {sensor.id}
            </TableCell>
            <TableCell className="font-medium truncate">
                {sensor.name}
            </TableCell>
            <TableCell className="truncate">
                <div className="flex items-center gap-2">
                    <div className="min-w-[200px] truncate">
                        {hasLocation ? (
                            <>
                                {sensor.location}
                                <LocationMapDialog
                                    latitude={sensor.latitude}
                                    longitude={sensor.longitude}
                                    onLocationSelect={handleLocationSelect}
                                    trigger={
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 ml-2 inline-flex"
                                        >
                                            <Map className="h-4 w-4" />
                                        </Button>
                                    }
                                />
                            </>
                        ) : (
                            <LocationMapDialog
                                latitude={null}
                                longitude={null}
                                onLocationSelect={handleLocationSelect}
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Agregar
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <span
                    className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                        sensor.status
                            ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20'
                            : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20'
                    )}
                >
                    {sensor.status ? 'Conectado' : 'Desconectado'}
                </span>
            </TableCell>
            <TableCell>
                {sensor.time_between_readings ? (
                    <span className="text-muted-foreground">
                        Cada {sensor.time_between_readings} min
                    </span>
                ) : (
                    '-'
                )}
            </TableCell>
            <TableCell>{getLatestReading(sensor)}</TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <EditAlertsDialog
                        sensorId={sensor.id}
                        sensorName={sensor.name}
                        trigger={
                            <Button variant="ghost" size="icon">
                                <Bell className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <EditSensorDialog
                        sensor={sensor}
                        onUpdate={onUpdate}
                        trigger={
                            <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <DeleteSensorDialog
                        sensorName={sensor.name}
                        onDelete={() => onDelete(sensor.id)}
                    />
                </div>
            </TableCell>
        </TableRow>
    )
}
