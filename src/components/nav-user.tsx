import {
    LogInIcon,
    LogOutIcon,
    MoreVerticalIcon,
    UserCircleIcon
} from 'lucide-react'
import { useClerk, useUser } from '@clerk/clerk-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '@/components/ui/sidebar'
import { ModeToggle } from './ui/theme-toggler'

export function NavUser() {
    const { isMobile } = useSidebar()
    const { user, isLoaded: userLoaded } = useUser()
    const { signOut, openSignIn } = useClerk()

    // Show login button if user is not logged in
    if (!user && userLoaded) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" onClick={() => openSignIn()}>
                        <LogInIcon className="mr-2 h-4 w-4" />
                        <span className="font-medium">Log in</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    // Show loading state or return null while user data is loading
    if (!userLoaded || !user) return null

    const userInitials =
        user.firstName && user.lastName
            ? `${user.firstName[0]}${user.lastName[0]}`
            : (user.username?.[0] ?? 'U')

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                <AvatarImage
                                    src={user.imageUrl}
                                    alt={user.fullName ?? ''}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.fullName ?? user.username}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.primaryEmailAddress?.emailAddress}
                                </span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.imageUrl}
                                        alt={user.fullName ?? ''}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user.fullName ?? user.username}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.primaryEmailAddress?.emailAddress}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => (window.location.href = '/user')}
                            >
                                <UserCircleIcon className="mr-2 h-4 w-4" />
                                Cuenta
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <ModeToggle />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
