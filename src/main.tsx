import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { esMX } from '@clerk/localizations'
import { QueryProvider } from './components/query-provider'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import Dashboard from './pages/dashboard.tsx'
import Sensors from './pages/sensors.tsx'
import { ProtectedRoute } from './components/protected-route.tsx'
import { Toaster } from 'sonner'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

// Clerk theme configuration
const clerkTheme = {
    baseTheme: dark,
    variables: {
        colorPrimary: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--background))',
        colorText: 'hsl(var(--foreground))',
        colorInputText: 'hsl(var(--foreground))',
        colorInputBackground: 'hsl(var(--input))',
        colorSuccess: 'hsl(var(--success))',
        colorWarning: 'hsl(var(--warning))',
        colorDanger: 'hsl(var(--destructive))',
        colorTextOnPrimaryBackground: 'hsl(var(--primary-foreground))',
        colorTextSecondary: 'hsl(var(--muted-foreground))',
        fontFamily: 'var(--font-sans)',
        fontFamilyButtons: 'var(--font-sans)',
        borderRadius: 'var(--radius)'
    },
    elements: {
        card: 'shadow-none bg-card border',
        navbar: 'hidden',
        headerTitle: 'text-foreground',
        headerSubtitle: 'text-muted-foreground',
        socialButtonsIconButton__github:
            'hover:bg-accent hover:text-accent-foreground',
        formFieldInput:
            'bg-background border focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring',
        formButtonPrimary:
            'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        formFieldInputShowPasswordButton: 'text-muted-foreground',
        footerActionText: 'text-muted-foreground',
        footerActionLink: 'text-primary hover:text-primary/90',
        identityPreviewEditButton: 'text-muted-foreground',
        formResendCodeLink: 'text-primary hover:text-primary/90'
    }
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ClerkProvider
                publishableKey={PUBLISHABLE_KEY}
                appearance={{
                    ...clerkTheme
                }}
                localization={esMX}
            >
                <QueryProvider>
                    <ThemeProvider
                        defaultTheme="system"
                        storageKey="vite-ui-theme"
                    >
                        <Routes>
                            {/* Protected routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route element={<App />}>
                                    <Route index element={<Dashboard />} />
                                    <Route
                                        path="sensors"
                                        element={<Sensors />}
                                    />
                                </Route>
                            </Route>
                        </Routes>
                        <Toaster />
                    </ThemeProvider>
                </QueryProvider>
            </ClerkProvider>
        </BrowserRouter>
    </StrictMode>
)
