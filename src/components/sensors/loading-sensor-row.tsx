import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSensorRow() {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-6 w-6" />
            </TableCell>
            {Array(7)
                .fill(0)
                .map((_, j) => (
                    <TableCell key={j}>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                ))}
        </TableRow>
    )
}
