import { WaterTankGauge } from './water-tank-gauge'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface WaterLevelSummaryProps {
    sensors: Sensor[]
}

export function WaterLevelSummary({ sensors }: WaterLevelSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor) => {
                const lastReading = sensor.sensor_readings?.[0]
                const lastUpdated = lastReading
                    ? `hace ${formatDistanceToNow(
                          new Date(lastReading.created_at),
                          {
                              locale: es,
                              addSuffix: false
                          }
                      )}`
                    : 'No disponible'

                return (
                    <WaterTankGauge
                        key={sensor.id}
                        name={sensor.name}
                        percentage={sensor.water_level?.percentage ?? 0}
                        lastUpdated={lastUpdated}
                        approximateVolume={
                            sensor.water_level
                                ? `${Math.round(
                                      sensor.water_level.currentLevel
                                  )}`
                                : undefined
                        }
                        isConnected={sensor.status}
                    />
                )
            })}
        </div>
    )
}
