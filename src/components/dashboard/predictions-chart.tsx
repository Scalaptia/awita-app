import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    ReferenceLine
} from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Loader2, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { usePredictionsQuery } from '@/lib/predictions-api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { calculateWaterLevel } from '@/lib/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { useState } from 'react'

type TimeRange = '12h' | '24h' | '48h'

interface PredictionsChartProps {
    sensorId: string | null
    sensorName: string
    sensor: Sensor
}

export function PredictionsChart({
    sensorId,
    sensorName,
    sensor
}: PredictionsChartProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('24h')
    const hours = parseInt(timeRange)

    const {
        data: predictions,
        isLoading,
        error
    } = usePredictionsQuery(sensorId ?? '', { hours })

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    No se pudieron cargar las predicciones
                </AlertDescription>
            </Alert>
        )
    }

    const chartData = predictions?.predictions
        .filter((point) => new Date(point.timestamp) > new Date()) // Filter future predictions only
        .map((point) => {
            const date = new Date(point.timestamp)

            // Formatear la hora local
            const localTime = date
                .toLocaleString('es-MX', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
                .toLowerCase()

            const waterLevel = calculateWaterLevel(
                sensor.capacity,
                sensor.height ?? 0,
                sensor.water_distance ?? 0,
                point.value
            )

            return {
                time: date
                    .toLocaleString('es-MX', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    })
                    .toLowerCase(),
                nivel: waterLevel.percentage,
                tooltipTime: localTime,
                timestamp: date.getTime()
            }
        })

    // Sort data by timestamp to ensure correct order
    const sortedChartData = chartData?.sort((a, b) => a.timestamp - b.timestamp)

    const chartConfig = {
        nivel: {
            label: 'Predicción',
            color: 'var(--color-chart-2)'
        }
    } satisfies ChartConfig

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                        Predicciones de nivel
                    </h3>
                    <Select
                        value={timeRange}
                        onValueChange={(v) => setTimeRange(v as TimeRange)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="12h">
                                Próximas 12 horas
                            </SelectItem>
                            <SelectItem value="24h">
                                Próximas 24 horas
                            </SelectItem>
                            <SelectItem value="48h">
                                Próximas 48 horas
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    {isLoading ? (
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <Loader2
                                className="animate-spin text-muted-foreground"
                                size={32}
                            />
                        </div>
                    ) : (
                        <>
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%">
                                    <LineChart
                                        data={sortedChartData}
                                        margin={{
                                            top: 20,
                                            right: 20,
                                            left: 20,
                                            bottom: 10
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            opacity={0.2}
                                        />
                                        <XAxis
                                            dataKey="time"
                                            tickLine={false}
                                            tickMargin={10}
                                            textAnchor="end"
                                            height={40}
                                            tick={{
                                                fontSize: 11,
                                                fill: 'var(--muted-foreground)'
                                            }}
                                        />
                                        <YAxis
                                            width={35}
                                            domain={[0, 100]}
                                            tickCount={5}
                                            tickFormatter={(value) =>
                                                `${value}%`
                                            }
                                            tickLine={false}
                                            tick={{
                                                fontSize: 11,
                                                fill: 'var(--muted-foreground)'
                                            }}
                                        />
                                        <Tooltip
                                            labelFormatter={(value, items) => {
                                                const item = items?.[0]?.payload
                                                return (
                                                    item?.tooltipTime ?? value
                                                )
                                            }}
                                            formatter={(value) => [
                                                `${value}%`,
                                                'Predicción'
                                            ]}
                                            contentStyle={{
                                                backgroundColor:
                                                    'var(--background)',
                                                borderColor: 'var(--border)',
                                                borderRadius: '6px'
                                            }}
                                            labelStyle={{
                                                color: 'var(--foreground)'
                                            }}
                                        />
                                        <ReferenceLine
                                            x={sortedChartData?.[0]?.time}
                                            stroke="var(--muted-foreground)"
                                            strokeDasharray="3 3"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="nivel"
                                            stroke="var(--color-chart-2)"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{
                                                r: 6,
                                                strokeWidth: 2,
                                                fill: 'var(--background)',
                                                stroke: 'var(--color-chart-2)'
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                            {predictions?.insights && (
                                <div className="mt-2 text-sm text-center">
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {predictions.insights.trend}
                                    </p>
                                    {predictions.insights.warning && (
                                        <p
                                            className={`mt-1 ${
                                                predictions.insights
                                                    .risk_level === 'alto'
                                                    ? 'text-destructive'
                                                    : 'text-warning'
                                            }`}
                                        >
                                            {predictions.insights.warning}
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
