import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody
} from '@/components/ui/table'
import { SensorTableRow } from './sensor-table-row'
import { LoadingSensorRow } from './loading-sensor-row'

interface SensorsTableProps {
    sensors: Sensor[]
    loading: boolean
    onDelete: (id: string) => void
    onUpdate: (updated: Sensor) => void
}

export function SensorsTable({
    sensors,
    loading,
    onDelete,
    onUpdate
}: SensorsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Capacidad (L)</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Intervalo</TableHead>
                    <TableHead>Última Lectura</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading
                    ? Array(5)
                          .fill(0)
                          .map((_, i) => <LoadingSensorRow key={i} />)
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
                            colSpan={7}
                            className="text-center text-muted-foreground"
                        >
                            No hay sensores registrados
                        </td>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
