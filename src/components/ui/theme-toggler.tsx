import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-react'
import {
    DropdownMenuGroup,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setTheme('light')}>
                <SunIcon className="mr-2 h-4 w-4" />
                Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
                <MoonIcon className="mr-2 h-4 w-4" />
                Oscuro
            </DropdownMenuItem>
        </DropdownMenuGroup>
    )
}
