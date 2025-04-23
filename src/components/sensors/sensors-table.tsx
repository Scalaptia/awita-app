import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody
} from '@/components/ui/table'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { Sensor } from '@/types/sensor'
import { SensorTableRow } from './sensor-table-row'
import { LoadingSensorRow } from './loading-sensor-row'

interface SensorsTableProps {
    sensors: Sensor[]
    loading: boolean
    onDragEnd: (result: any) => void
    onDelete: (id: string) => void
    onUpdate: (updated: Sensor) => void
}

export function SensorsTable({
    sensors,
    loading,
    onDragEnd,
    onDelete,
    onUpdate
}: SensorsTableProps) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead style={{ width: '40px' }}></TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Capacidad (L)</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Intervalo</TableHead>
                        <TableHead>Última Lectura</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <Droppable droppableId="sensors">
                    {(provided) => (
                        <TableBody
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {loading
                                ? Array(5)
                                      .fill(0)
                                      .map((_, i) => (
                                          <LoadingSensorRow key={i} />
                                      ))
                                : sensors.map((sensor, index) => (
                                      <SensorTableRow
                                          key={sensor.id}
                                          sensor={sensor}
                                          index={index}
                                          onDelete={onDelete}
                                          onUpdate={onUpdate}
                                      />
                                  ))}
                            {!loading && sensors.length === 0 && (
                                <TableRow>
                                    <td
                                        colSpan={8}
                                        className="text-center text-muted-foreground"
                                    >
                                        No hay sensores registrados
                                    </td>
                                </TableRow>
                            )}
                            {provided.placeholder}
                        </TableBody>
                    )}
                </Droppable>
            </Table>
        </DragDropContext>
    )
}
