import { useState } from 'react'
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
    const [filter, setFilter] = useState('')
    const filteredSensors = sensors.filter(
        (sensor) =>
            sensor.name.toLowerCase().includes(filter.toLowerCase()) ||
            sensor.id.toLowerCase().includes(filter.toLowerCase())
    )

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between gap-4 pb-4">
                    <div className="flex-1 max-w-sm">
                        <Input
                            disabled
                            placeholder="Filtrar sensores..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
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
                                <TableHead className="w-[150px]">
                                    Última lectura
                                </TableHead>
                                <TableHead className="w-[150px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(3)
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

    if (!loading && (!sensors || sensors.length === 0)) {
        return (
            <div>
                <div className="flex items-center justify-between gap-4 pb-4">
                    <div className="flex-1 max-w-sm">
                        <Input
                            disabled
                            placeholder="Filtrar sensores..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <RegisterSensorDialog />
                </div>
                <div className="rounded-md border p-8 flex flex-col items-center justify-center gap-4">
                    <p className="text-muted-foreground text-sm text-center">
                        No tienes sensores registrados. Registra tu primer
                        sensor para comenzar.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-4 pb-4">
                <div className="flex-1 max-w-sm">
                    <Input
                        placeholder="Filtrar sensores..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
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
                            <TableHead className="w-[150px]">
                                Última lectura
                            </TableHead>
                            <TableHead className="w-[150px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSensors.map((sensor) => (
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
