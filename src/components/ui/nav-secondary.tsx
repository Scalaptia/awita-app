import { AlertCircleIcon, CircleCheckIcon, Loader2Icon } from 'lucide-react'
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import { useHealth } from '@/hooks/use-health'
import { cn } from '@/lib/utils'

export function NavSecondary({ className, ...props }: any) {
    const status = useHealth()

    const statusConfig = {
        ok: {
            icon: CircleCheckIcon,
            text: 'Sistema funcional',
            color: 'text-green-500'
        },
        error: {
            icon: AlertCircleIcon,
            text: 'Error del sistema',
            color: 'text-red-500'
        },
        loading: {
            icon: Loader2Icon,
            text: 'Cargando...',
            color: 'text-muted-foreground'
        }
    }[status]

    return (
        <SidebarGroup className={className} {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-background/50 p-2 dark:border-border/25 dark:bg-background/10">
                            <statusConfig.icon
                                className={cn('size-4', statusConfig.color, {
                                    'animate-spin': status === 'loading'
                                })}
                            />
                            <span>{statusConfig.text}</span>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
