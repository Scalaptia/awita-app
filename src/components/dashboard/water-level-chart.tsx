import { useState } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip
} from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Loader2 } from 'lucide-react'
import { useSensorHistoryQuery } from '@/lib/sensors-api'
import { InfoIcon } from 'lucide-react'
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'

type TimeRange = '24h' | '7d' | '30d'

interface WaterLevelChartProps {
    sensors: Sensor[]
    selectedSensor: string | null
    onSensorChange: (s: string) => void
    isLoading?: boolean
}

export function WaterLevelChart({
    sensors,
    selectedSensor,
    isLoading
}: WaterLevelChartProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('24h')

    // Get the selected sensor to access its data
    const selectedSensorData = sensors.find((s) => s.id === selectedSensor)
    const updateInterval = selectedSensorData?.time_between_readings ?? 60

    // Check if we have enough readings before querying
    const totalReadings = selectedSensorData?._count?.sensor_readings ?? 0
    const hasEnoughReadings = totalReadings >= 60

    const { data: historyData, isLoading: isHistoryLoading } =
        useSensorHistoryQuery(
            selectedSensor ?? '',
            timeRange,
            hasEnoughReadings
        )

    const isRefetching = isLoading ?? isHistoryLoading

    // Skip predictions if we don't have enough readings
    const skipPredictions = !hasEnoughReadings

    // Format data for display with proper date handling
    const formattedData = (historyData ?? []).map((reading) => {
        const date = new Date(reading.created_at)
        // Formato mejorado para el eje X según el rango
        let timeLabel
        switch (timeRange) {
            case '24h':
                timeLabel = date.toLocaleString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
                break
            case '7d':
                timeLabel = date.toLocaleString('es-MX', {
                    weekday: 'short',
                    day: '2-digit'
                })
                break
            case '30d':
                timeLabel = date.toLocaleString('es-MX', {
                    day: '2-digit',
                    month: 'short'
                })
                break
        }

        return {
            time: timeLabel,
            nivel: reading.water_level?.percentage ?? 0,
            tooltipTime: date.toLocaleString('es-MX', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'short'
            }),
            timestamp: date.getTime()
        }
    })

    // Ordenar por timestamp de manera ascendente
    const sortedData = formattedData.sort((a, b) => a.timestamp - b.timestamp)

    const chartConfig = {
        nivel: {
            label: 'Nivel de agua',
            color: 'var(--color-chart-1)'
        }
    } satisfies ChartConfig

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <h3 className="text-lg font-medium truncate">Historial</h3>
                    {skipPredictions && (
                        <TooltipProvider>
                            <UITooltip>
                                <TooltipTrigger asChild>
                                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Las predicciones estarán disponibles
                                        automáticamente cuando se tengan
                                        suficientes datos históricos.
                                    </p>
                                </TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={timeRange}
                        onValueChange={(v) => setTimeRange(v as TimeRange)}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">
                                Últimas 24 horas
                            </SelectItem>
                            <SelectItem value="7d">Últimos 7 días</SelectItem>
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    {isRefetching ? (
                        <div
                            className={`${
                                skipPredictions
                                    ? 'h-[500px]'
                                    : 'h-[300px] sm:h-[400px]'
                            } w-full flex items-center justify-center`}
                        >
                            <Loader2
                                className="animate-spin text-muted-foreground"
                                size={32}
                            />
                        </div>
                    ) : (
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%">
                                <AreaChart
                                    data={sortedData}
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
                                        tickFormatter={(value) => `${value}%`}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 11,
                                            fill: 'var(--muted-foreground)'
                                        }}
                                    />
                                    <Tooltip
                                        labelFormatter={(value, items) => {
                                            const item = items?.[0]?.payload
                                            return item?.tooltipTime ?? value
                                        }}
                                        formatter={(value) => [
                                            `${value}%`,
                                            'Nivel de agua'
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
                                    <Area
                                        type="monotone"
                                        dataKey="nivel"
                                        fill="var(--color-chart-1)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-chart-1)"
                                        strokeWidth={2}
                                        isAnimationActive={false}
                                        activeDot={{
                                            r: 6,
                                            strokeWidth: 2,
                                            fill: 'var(--background)',
                                            stroke: 'var(--color-chart-1)'
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    )}
                </div>
                {!isRefetching && (
                    <div className="text-xs text-muted-foreground text-center mt-4">
                        Actualizando cada {updateInterval} minutos
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
