import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Draggable } from '@hello-pangea/dnd'
import { GripVertical, Trash2 } from 'lucide-react'
import { EditSensorDialog } from '@/components/edit-sensor-dialog'
import { Sensor } from '@/types/sensor'

interface SensorTableRowProps {
    sensor: Sensor
    index: number
    onDelete: (id: string) => void
    onUpdate: (updated: Sensor) => void
}

export function SensorTableRow({
    sensor,
    index,
    onDelete,
    onUpdate
}: SensorTableRowProps) {
    const getLatestReading = (sensor: Sensor) => {
        if (!sensor.water_level) return 'Sin lecturas'
        return (
            <div className="space-y-1">
                <div>{sensor.water_level.currentLevel.toFixed(1)}L</div>
                <div className="text-muted-foreground text-sm">
                    {sensor.water_level.percentage.toFixed(1)}%
                </div>
            </div>
        )
    }

    return (
        <Draggable draggableId={sensor.id} index={index}>
            {(provided, snapshot) => (
                <TableRow
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={snapshot.isDragging ? 'opacity-70' : ''}
                >
                    <TableCell
                        {...provided.dragHandleProps}
                        className="cursor-grab w-[40px]"
                    >
                        <div className="flex items-center justify-center">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </TableCell>
                    <TableCell>{sensor.name}</TableCell>
                    <TableCell>{sensor.location || '-'}</TableCell>
                    <TableCell>{sensor.capacity}</TableCell>
                    <TableCell>
                        <span
                            className={`px-2 py-1 rounded text-sm ${
                                sensor.status === 'connected'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {sensor.status === 'connected'
                                ? 'Conectado'
                                : 'Desconectado'}
                        </span>
                    </TableCell>
                    <TableCell>
                        {sensor.measurement_interval
                            ? `${sensor.measurement_interval} min`
                            : '-'}
                    </TableCell>
                    <TableCell>{getLatestReading(sensor)}</TableCell>
                    <TableCell className="space-x-2">
                        <EditSensorDialog sensor={sensor} onUpdate={onUpdate} />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(sensor.id)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </TableCell>
                </TableRow>
            )}
        </Draggable>
    )
}
