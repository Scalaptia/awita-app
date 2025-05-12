import { TableRow, TableCell } from '@/components/ui/table'
import { EditSensorDialog } from '@/components/sensors/edit-sensor-dialog'
import { DeleteSensorDialog } from './delete-sensor-dialog'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

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

    return (
        <TableRow className="group">
            <TableCell className="font-mono text-xs text-muted-foreground truncate">
                {sensor.id}
            </TableCell>
            <TableCell className="font-medium truncate">
                {sensor.name}
            </TableCell>
            <TableCell className="truncate">{sensor.location || '-'}</TableCell>
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
                <div className="flex items-center justify-end gap-2 opacity-60 hover:opacity-100">
                    <EditSensorDialog sensor={sensor} onUpdate={onUpdate} />
                    <DeleteSensorDialog
                        sensorName={sensor.name}
                        onDelete={() => onDelete(sensor.id)}
                    />
                </div>
            </TableCell>
        </TableRow>
    )
}
