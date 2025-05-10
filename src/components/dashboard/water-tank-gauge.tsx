import { cn } from '@/lib/utils'
import Wave from 'react-wavify'

interface WaterTankGaugeProps {
    name: string
    percentage: number
    lastUpdated: string
    approximateVolume?: string
    onClick?: () => void
}

export function WaterTankGauge({
    name,
    percentage,
    lastUpdated,
    approximateVolume,
    onClick
}: WaterTankGaugeProps) {
    const displayPercentage = Math.round(percentage)

    return (
        <div
            className="flex flex-col items-center p-4 rounded-lg bg-card text-card-foreground cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <h3 className="text-center font-medium mb-4">{name}</h3>

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
            {approximateVolume && (
                <div className="text-xs text-muted-foreground mb-1">
                    Aproximadamente {approximateVolume}
                </div>
            )}

            {/* Last updated info */}
            <div className="text-xs text-muted-foreground">
                Última Actualización: {lastUpdated}
            </div>
        </div>
    )
}
