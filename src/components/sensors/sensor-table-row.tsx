import { TableRow, TableCell } from '@/components/ui/table'
import { EditSensorDialog } from '@/components/sensors/edit-sensor-dialog'
import { DeleteSensorDialog } from './delete-sensor-dialog'
import { cn } from '@/lib/utils'

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
        if (!sensor.water_level) return 'Sin lecturas'
        return (
            <div className="space-y-1 truncate">
                <div className="truncate">
                    {sensor.water_level.currentLevel.toFixed(1)}L
                </div>
                <div className="text-muted-foreground text-xs truncate">
                    {sensor.water_level.percentage.toFixed(1)}%
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
            <TableCell className="truncate">{sensor.location ?? '-'}</TableCell>
            <TableCell>
                <span
                    className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                        sensor.status
                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                            : 'bg-red-50 text-red-700 ring-red-600/20'
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
