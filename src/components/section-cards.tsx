import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function SectionCards() {
    return (
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        Tinaco Casa
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <p className="text-muted-foreground">
                        Última actualización: 1 minuto
                    </p>
                    <p className="text-muted-foreground">
                        Estado: <span className="text-green-500">Normal</span>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
