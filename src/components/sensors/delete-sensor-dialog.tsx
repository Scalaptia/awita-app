import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { UnlinkIcon } from 'lucide-react'
import React from 'react'

interface DeleteSensorDialogProps {
    sensorName: string
    onDelete: () => void
}

export function DeleteSensorDialog({
    sensorName,
    onDelete
}: DeleteSensorDialogProps) {
    const [open, setOpen] = React.useState(false)

    const handleDelete = () => {
        onDelete()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500"
                >
                    <UnlinkIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">
                        Desconectar sensor
                    </DialogTitle>
                    <DialogDescription>
                        ¿Está seguro que desea desconectar el sensor "
                        {sensorName}"? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Desconectar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
