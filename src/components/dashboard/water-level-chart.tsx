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

type TimeRange = '24h' | '7d' | '30d'

interface WaterLevelChartProps {
    sensors: Sensor[]
    selectedSensor: string | null
    onSensorChange: (id: string) => void
    data: SensorHistoryReading[]
    isLoading?: boolean
}

export function WaterLevelChart({
    sensors,
    selectedSensor,
    onSensorChange,
    data,
    isLoading
}: WaterLevelChartProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('24h')
    const { data: historyData, isLoading: isHistoryLoading } =
        useSensorHistoryQuery(selectedSensor, timeRange)

    // Format data for display with proper date handling
    const formattedData = (historyData || []).map((reading) => {
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
            })
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
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0 pb-2">
                <Select
                    value={selectedSensor ?? undefined}
                    onValueChange={onSensorChange}
                    disabled={isLoading}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sensor" />
                    </SelectTrigger>
                    <SelectContent>
                        {sensors.map((sensor) => (
                            <SelectItem key={sensor.id} value={sensor.id}>
                                {sensor.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={timeRange}
                    onValueChange={(v) => setTimeRange(v as TimeRange)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="24h">Últimas 24 horas</SelectItem>
                        <SelectItem value="7d">Últimos 7 días</SelectItem>
                        <SelectItem value="30d">Últimos 30 días</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    {isLoading || isHistoryLoading ? (
                        <div className="h-full w-full flex items-center justify-center">
                            <Loader2
                                className="animate-spin text-muted-foreground"
                                size={32}
                            />
                        </div>
                    ) : (
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={sortedData}
                                    margin={{
                                        top: 30,
                                        right: 20,
                                        left: 20,
                                        bottom: 0
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
                                        height={60}
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
                                            // Usar el valor directamente del punto de datos actual
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
            </CardContent>
        </Card>
    )
}
