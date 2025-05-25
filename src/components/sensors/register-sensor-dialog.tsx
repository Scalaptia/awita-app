import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegisterSensorMutation } from '@/lib/sensors-api'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

interface RegisterSensorDialogProps {
    children?: ReactNode
    onRegister?: () => void
}

export function RegisterSensorDialog({
    children,
    onRegister
}: RegisterSensorDialogProps) {
    const [open, setOpen] = useState(false)
    const { mutate: registerSensor, isPending } = useRegisterSensorMutation()
    const { register, handleSubmit, reset } = useForm<RegisterSensorForm>({
        defaultValues: {
            sensor_id: ''
        }
    })

    const onSubmit = (data: RegisterSensorForm) => {
        registerSensor(data.sensor_id, {
            onSuccess: () => {
                setOpen(false)
                reset()
                toast.success('Sensor registrado correctamente')
                onRegister?.()
            },
            onError: (error: Error) => {
                toast.error(error.message)
            }
        })
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Sensor
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Nuevo Sensor</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sensor_id">ID del Sensor</Label>
                                <Input
                                    id="sensor_id"
                                    {...register('sensor_id', {
                                        required: true
                                    })}
                                    placeholder="Ingrese el ID del sensor"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? 'Registrando...'
                                    : 'Registrar Sensor'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {children}
        </>
    )
}
