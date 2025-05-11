import { cn } from '@/lib/utils'
import Wave from 'react-wavify'

interface WaterTankGaugeProps {
    name: string
    percentage: number
    lastUpdated: string
    approximateVolume?: string
    isConnected?: boolean
    onClick?: () => void
}

export function WaterTankGauge({
    name,
    percentage,
    lastUpdated,
    approximateVolume,
    isConnected,
    onClick
}: WaterTankGaugeProps) {
    const displayPercentage = Math.round(percentage)

    return (
        <div
            className="flex flex-col items-center p-4 rounded-lg bg-card text-card-foreground cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <div className="w-full flex items-center justify-between mb-4">
                <h3 className="font-medium">{name}</h3>
                <span
                    className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                        isConnected
                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                            : 'bg-red-50 text-red-700 ring-red-600/20'
                    )}
                >
                    {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
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
