import { WaterTankGauge } from './water-tank-gauge'
import { formatRelativeTime } from '@/lib/utils'

interface WaterLevelSummaryProps {
    sensors: Sensor[]
    onSensorClick?: (sensorId: string) => void
}

export function WaterLevelSummary({
    sensors,
    onSensorClick
}: WaterLevelSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor) => {
                const lastReading = sensor.sensor_readings?.[0]
                const lastUpdated = lastReading
                    ? formatRelativeTime(new Date(lastReading.created_at))
                    : 'No disponible'

                return (
                    <WaterTankGauge
                        key={sensor.id}
                        name={sensor.name}
                        percentage={sensor.water_level?.percentage ?? 0}
                        lastUpdated={lastUpdated}
                        approximateVolume={
                            sensor.water_level
                                ? `${sensor.water_level.currentLevel.toFixed(
                                      1
                                  )}L`
                                : undefined
                        }
                        isConnected={sensor.status}
                        onClick={() => onSensorClick?.(sensor.id)}
                    />
                )
            })}
        </div>
    )
}
