import { useUser } from '@clerk/clerk-react'
import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
    const { isSignedIn, isLoaded } = useUser()

    // If auth is still loading, show nothing or a loading spinner
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="animate-spin" />
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    // If user is not signed in, redirect to sign-in page
    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />
    }

    // If user is signed in, render the child routes
    return <Outlet />
}
