import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSensorRow() {
    return (
        <TableRow className="group">
            {/* ID */}
            <TableCell className="font-mono text-xs text-muted-foreground">
                <Skeleton className="h-4 w-12" />
            </TableCell>
            {/* Nombre */}
            <TableCell className="font-medium">
                <Skeleton className="h-4 w-40" />
            </TableCell>
            {/* Ubicación */}
            <TableCell>
                <Skeleton className="h-4 w-36" />
            </TableCell>
            {/* Estado */}
            <TableCell>
                <Skeleton className="h-[22px] w-24 rounded-full" />
            </TableCell>
            {/* Intervalo */}
            <TableCell>
                <Skeleton className="h-4 w-28" />
            </TableCell>
            {/* Nivel de agua */}
            <TableCell>
                <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </TableCell>
            {/* Acciones */}
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </TableCell>
        </TableRow>
    )
}
