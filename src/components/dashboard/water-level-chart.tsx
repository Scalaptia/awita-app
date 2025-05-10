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
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip
} from '@/components/ui/chart'

interface SensorHistoryReading {
    created_at: string
    water_level?: {
        currentLevel: number
        percentage: number
    }
}

interface Sensor {
    id: string
    name: string
    water_level?: {
        currentLevel: number
        percentage: number
    }
    sensor_readings?: {
        created_at: string
    }[]
}

type TimeRange = 'day' | 'month' | 'year'

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
    const [timeRange, setTimeRange] = useState<TimeRange>('day')

    const selectedSensorData = sensors.find((s) => s.id === selectedSensor)

    // Format data for display with proper date handling
    const formattedData = data.map((reading) => {
        const date = new Date(reading.created_at)
        let timeLabel
        switch (timeRange) {
            case 'day':
                timeLabel = date.toLocaleString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
                break
            case 'month':
                timeLabel = date.toLocaleString('es-MX', {
                    day: '2-digit',
                    month: 'short'
                })
                break
            case 'year':
                timeLabel = date.toLocaleString('es-MX', {
                    month: 'short',
                    year: '2-digit'
                })
                break
        }
        return {
            time: timeLabel,
            nivel: reading.water_level?.percentage ?? 0,
            timestamp: date.getTime() // para ordenamiento
        }
    })

    // Ordenar por timestamp de manera ascendente
    const sortedData = formattedData.sort((a, b) => a.timestamp - b.timestamp)

    const chartConfig = {
        nivel: {
            label: 'Nivel de agua',
            color: 'var(--chart-1)'
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
                    <SelectTrigger className="w-[280px]">
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
                    <SelectTrigger className="w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="day">Día</SelectItem>
                        <SelectItem value="month">Mes</SelectItem>
                        <SelectItem value="year">Año</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    {isLoading ? (
                        <div className="h-full w-full flex items-center justify-center">
                            <span>Cargando...</span>
                        </div>
                    ) : (
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={sortedData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 30
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
                                        axisLine={false}
                                        tickMargin={10}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                        tick={{
                                            fontSize: 12,
                                            fill: 'var(--foreground)'
                                        }}
                                    />
                                    <YAxis
                                        width={35}
                                        domain={[0, 100]}
                                        tickCount={5}
                                        tickFormatter={(value) => `${value}%`}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{
                                            fontSize: 12,
                                            fill: 'var(--foreground)'
                                        }}
                                    />
                                    <ChartTooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="nivel"
                                        fill="var(--color-nivel)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-nivel)"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
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
