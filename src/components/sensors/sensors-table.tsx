import { LoadingSensorRow } from './loading-sensor-row'
import { SensorTableRow } from './sensor-table-row'
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHead
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { RegisterSensorDialog } from './register-sensor-dialog'

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
    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex-1 max-w-sm">
                        <Input disabled placeholder="Filtrar sensores..." />
                    </div>
                    <RegisterSensorDialog />
                </div>
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-max">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[70px]">ID</TableHead>
                                <TableHead className="w-[160px]">
                                    Nombre
                                </TableHead>
                                <TableHead className="w-[160px]">
                                    Ubicación
                                </TableHead>
                                <TableHead className="w-[120px]">
                                    Estado
                                </TableHead>
                                <TableHead className="w-[160px]">
                                    Intervalo
                                </TableHead>
                                <TableHead className="w-[120px]">
                                    Última lectura
                                </TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(2)
                                .fill(0)
                                .map((_, i) => (
                                    <LoadingSensorRow key={i} />
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex-1 max-w-sm">
                    <Input placeholder="Filtrar sensores..." />
                </div>
                <RegisterSensorDialog />
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-max">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[70px]">ID</TableHead>
                            <TableHead className="w-[160px]">Nombre</TableHead>
                            <TableHead className="w-[160px]">
                                Ubicación
                            </TableHead>
                            <TableHead className="w-[120px]">Estado</TableHead>
                            <TableHead className="w-[160px]">
                                Intervalo
                            </TableHead>
                            <TableHead className="w-[120px]">
                                Última lectura
                            </TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sensors.map((sensor) => (
                            <SensorTableRow
                                key={sensor.id}
                                sensor={sensor}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
