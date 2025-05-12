import * as React from 'react'
import { TooltipProps } from 'recharts'
import { cn } from '@/lib/utils'

export type ChartConfig = Record<
    string,
    {
        label: string
        color: string
    }
>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    config: ChartConfig
}

export function ChartContainer({
    config,
    children,
    className,
    ...props
}: ChartContainerProps) {
    const styles = Object.entries(config).map(
        ([key, value]) => `--color-${key}: ${value.color}`
    )

    return (
        <div
            style={styles.reduce(
                (acc, style) => ({
                    ...acc,
                    [style.split(':')[0]]: style.split(':')[1].trim()
                }),
                {}
            )}
            className={cn('h-[350px] w-full', className)}
            {...props}
        >
            {children}
        </div>
    )
}

interface ChartTooltipContentProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        keyof TooltipProps<any, any>
    > {
    active?: boolean
    payload?: any[]
    label?: string
    config?: ChartConfig
    formatter?: (value: number) => string
    indicator?: 'bar' | 'line'
}

export function ChartTooltipContent({
    active,
    payload,
    label,
    config,
    formatter,
    indicator = 'bar',
    ...props
}: ChartTooltipContentProps) {
    if (!active || !payload) return null

    return (
        <div
            className="rounded-lg border bg-background p-2 shadow-sm"
            {...props}
        >
            <div className="text-sm font-medium text-muted-foreground">
                {label}
            </div>
            <div className="mt-1 grid gap-0.5">
                {payload.map(({ value, name }) => {
                    const { label, color } = config?.[name] ?? { label: name }
                    return (
                        <div key={name} className="flex items-center gap-2">
                            {indicator === 'line' ? (
                                <div
                                    className="size-1 rounded-full"
                                    style={{ background: color }}
                                />
                            ) : (
                                <div
                                    className="size-2 rounded-sm"
                                    style={{ background: color }}
                                />
                            )}
                            <span className="font-medium">{label}</span>
                            <span className="font-mono text-muted-foreground">
                                {formatter ? formatter(value) : value}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function ChartTooltip(props: TooltipProps<any, any>) {
    return (
        <ChartTooltipContent
            {...props}
            formatter={(value) => `${value}%`}
            indicator="line"
        />
    )
}
