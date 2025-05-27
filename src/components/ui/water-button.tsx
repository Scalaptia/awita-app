import { cn } from '@/lib/utils'
import Wave from 'react-wavify'

interface WaterButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline'
    size?: 'default' | 'lg'
}

const WaterButton = ({
    ref,
    className,
    variant = 'default',
    size = 'default',
    children,
    ...props
}: WaterButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const isOutline = variant === 'outline'

    return (
        <button
            type="button"
            ref={ref}
            className={cn(
                'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-all duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
                {
                    'bg-blue-500 text-white focus-visible:ring-blue-600':
                        !isOutline,
                    'border-2 border-blue-600 bg-white text-blue-600 hover:text-white focus-visible:ring-blue-600':
                        isOutline,
                    'h-10 px-4 py-2 text-sm': size === 'default',
                    'h-14 px-8 py-4 text-lg': size === 'lg'
                },
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Water Animation Container */}
            <div className="absolute inset-0 z-0">
                {/* Base Fill Layer */}
                <div
                    className={cn(
                        'absolute inset-0 translate-y-full transform transition-transform duration-1000 ease-out group-hover:translate-y-0',
                        isOutline ? 'bg-blue-600' : 'bg-blue-600'
                    )}
                >
                    {/* First Wave Layer - Slower and Higher Amplitude */}
                    <Wave
                        className="absolute bottom-0 left-0 right-0 opacity-40"
                        fill="rgba(255,255,255,0.4)"
                        paused={true}
                        options={{
                            height: 25,
                            amplitude: 20,
                            speed: 0.15,
                            points: 3
                        }}
                    />

                    {/* Second Wave Layer - Faster and Lower Amplitude */}
                    <Wave
                        className="absolute bottom-0 left-0 right-0 opacity-30"
                        fill="rgba(255,255,255,0.3)"
                        paused={true}
                        options={{
                            height: 20,
                            amplitude: 15,
                            speed: 0.25,
                            points: 4
                        }}
                    />

                    {/* Water Fill Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/30 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                </div>
            </div>
        </button>
    )
}

WaterButton.displayName = 'WaterButton'

export { WaterButton }
