import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, UnlinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { EditSensorDialog } from './edit-sensor-dialog'

export const columns: ColumnDef<Sensor>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <div className="font-mono text-xs text-muted-foreground truncate">
                {row.getValue('id')}
            </div>
        )
    },
    {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
            <div className="font-medium truncate">{row.getValue('name')}</div>
        )
    },
    {
        accessorKey: 'location',
        header: 'Ubicación',
        cell: ({ row }) => (
            <div className="truncate">{row.getValue('location') || '-'}</div>
        )
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
            const status = row.getValue('status') as boolean
            return (
                <span
                    className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                        status
                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                            : 'bg-red-50 text-red-700 ring-red-600/20'
                    )}
                >
                    {status ? 'Conectado' : 'Desconectado'}
                </span>
            )
        }
    },
    {
        accessorKey: 'time_between_readings',
        header: 'Intervalo',
        cell: ({ row }) => {
            const interval = row.getValue('time_between_readings') as number
            return interval ? (
                <span className="text-muted-foreground">
                    Cada {interval} min
                </span>
            ) : (
                '-'
            )
        }
    },
    {
        accessorKey: 'water_level',
        header: 'Última Lectura',
        cell: ({ row }) => {
            const waterLevel = row.getValue('water_level') as {
                currentLevel: number
                percentage: number
            } | null
            if (!waterLevel) return 'Sin lecturas'
            return (
                <div className="space-y-1 truncate">
                    <div className="truncate">
                        {waterLevel.currentLevel.toFixed(1)}L
                    </div>
                    <div className="text-muted-foreground text-xs truncate">
                        {waterLevel.percentage.toFixed(1)}%
                    </div>
                </div>
            )
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const sensor = row.original

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="flex items-center"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                            >
                                <EditSensorDialog
                                    sensor={sensor}
                                    onUpdate={sensor.onUpdate}
                                    trigger={
                                        <div className="flex w-full items-center">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </div>
                                    }
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => sensor.onDelete(sensor.id)}
                                className="text-red-600"
                            >
                                <UnlinkIcon className="mr-2 h-4 w-4" />
                                Desconectar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }
]
