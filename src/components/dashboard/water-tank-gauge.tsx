import { cn } from '@/lib/utils'

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
    // Calculate water level display values
    const displayPercentage = Math.round(percentage)
    const waterHeight = `${percentage}%`

    // Get appropriate color based on water level percentage
    const getWaterColor = (percentage: number) => {
        if (percentage <= 20) return 'bg-sky-500'
        if (percentage <= 60) return 'bg-sky-400'
        return 'bg-sky-300'
    }

    return (
        <div
            className="flex flex-col items-center p-4 rounded-lg bg-card text-card-foreground cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <h3 className="text-center font-medium mb-4">{name}</h3>

            <div className="relative w-32 h-32 mb-4">
                {/* Outer circle */}
                <div className="absolute inset-0 rounded-full border-2 border-border/50 overflow-hidden">
                    {/* Water */}
                    <div
                        className={cn(
                            'absolute bottom-0 left-0 right-0 transition-all duration-500',
                            getWaterColor(percentage)
                        )}
                        style={{ height: waterHeight }}
                    />

                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                        {displayPercentage}%
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
