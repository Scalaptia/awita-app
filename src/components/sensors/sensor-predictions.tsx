import { useState } from 'react'
import { usePredictionsQuery } from '@/lib/predictions-api'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertCircle, TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface SensorPredictionsProps {
    sensorId: string
    name: string
}

const timeRangeOptions = [
    { value: '12', label: '12 horas' },
    { value: '24', label: '24 horas' },
    { value: '48', label: '2 días' },
    { value: '72', label: '3 días' },
    { value: '168', label: '1 semana' }
]

export function SensorPredictions({ sensorId, name }: SensorPredictionsProps) {
    const [selectedHours, setSelectedHours] = useState('24')

    const {
        data: predictions,
        isLoading,
        error
    } = usePredictionsQuery(sensorId, { hours: parseInt(selectedHours) })

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    No se pudieron cargar las predicciones
                </AlertDescription>
            </Alert>
        )
    }

    const chartData = predictions?.predictions.map((point) => ({
        time: new Date(point.timestamp),
        nivel: point.value
    }))

    const TrendIcon =
        predictions?.insights.risk_level === 'alto'
            ? TrendingUp
            : predictions?.insights.risk_level === 'bajo'
            ? TrendingDown
            : Minus

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Predicciones</CardTitle>
                        <CardDescription>
                            Predicciones para {name}
                        </CardDescription>
                    </div>
                    <Select
                        value={selectedHours}
                        onValueChange={setSelectedHours}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleccionar periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            {timeRangeOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full" />
                        <Skeleton className="h-[100px] w-full" />
                    </div>
                ) : predictions ? (
                    <div className="space-y-6">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="time"
                                        tickFormatter={(time) =>
                                            format(time, 'HH:mm', {
                                                locale: es
                                            })
                                        }
                                    />
                                    <YAxis
                                        unit="cm"
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip
                                        labelFormatter={(label) =>
                                            format(label, 'PPpp', {
                                                locale: es
                                            })
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="nivel"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2">
                                <TrendIcon className="h-5 w-5" />
                                <h4 className="font-medium">
                                    {predictions.insights.summary}
                                </h4>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                <p>{predictions.insights.trend}</p>
                                {predictions.insights.warning && (
                                    <p className="mt-1 text-yellow-600 dark:text-yellow-500">
                                        {predictions.insights.warning}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">
                                Confianza:{' '}
                                {(predictions.confidence_score * 100).toFixed(
                                    0
                                )}
                                %
                            </div>
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
