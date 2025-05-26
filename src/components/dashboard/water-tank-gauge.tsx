import Wave from 'react-wavify'
import { Settings, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditSensorDialog } from '@/components/sensors/edit-sensor-dialog'
import { EditAlertsDialog } from '@/components/sensors/edit-alerts-dialog'

interface WaterTankGaugeProps {
    sensor: Sensor
    percentage: number
    lastUpdated: string
    approximateVolume?: string
    isConnected?: boolean
    onUpdate?: (updated: Sensor) => void
}

export function WaterTankGauge({
    sensor,
    percentage,
    lastUpdated,
    approximateVolume,
    onUpdate
}: WaterTankGaugeProps) {
    const displayPercentage = Math.round(percentage)

    return (
        <div className="flex flex-col items-center p-4 rounded-lg bg-card text-card-foreground border shadow-sm">
            <div className="w-full flex items-center justify-between mb-4">
                <h3 className="font-medium truncate max-w-[60%]">
                    {sensor.name}
                </h3>
                <div className="flex items-center gap-2">
                    <EditAlertsDialog
                        sensorId={sensor.id}
                        sensorName={sensor.name}
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Bell className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <EditSensorDialog
                        sensor={sensor}
                        onUpdate={onUpdate}
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-border overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            transform: `translateY(${
                                83 - Math.min(percentage, 100)
                            }%)`
                        }}
                    >
                        <svg
                            style={{
                                position: 'absolute',
                                width: 0,
                                height: 0
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="waterGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--color-chart-1)"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="var(--color-chart-2)"
                                    />
                                </linearGradient>
                            </defs>
                        </svg>
                        <Wave
                            fill="url(#waterGradient)"
                            paused={false}
                            style={{ display: 'flex' }}
                            options={{
                                amplitude: 1,
                                speed: 0.3,
                                points: 2
                            }}
                        />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl z-10">
                        <span className={'text-foreground'}>
                            {displayPercentage}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Approximate volume text */}
            <div className="text-sm text-foreground font-medium mb-1 min-h-[1.25rem]">
                {/* \u00A0 works as a non-breaking space */}
                {approximateVolume ? `${approximateVolume} litros` : '\u00A0'}
            </div>

            {/* Last updated info */}
            <div className="text-xs text-muted-foreground">
                {lastUpdated === 'Sin datos' || lastUpdated === 'No disponible'
                    ? 'Sin datos'
                    : `Actualizado ${lastUpdated}`}
            </div>
        </div>
    )
}
