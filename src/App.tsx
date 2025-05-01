import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useAuthStore } from '@/stores/AuthStore'
import { useEffect } from 'react'

export default function App() {
    const { userId, isSignedIn, isLoaded } = useAuth()
    const setAuth = useAuthStore((state) => state.setAuth)

    useEffect(() => {
        setAuth(userId, isSignedIn || false, isLoaded || false)
    }, [userId, isSignedIn, isLoaded, setAuth])

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />

                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
