import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { esMX } from '@clerk/localizations'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import Dashboard from './pages/dashboard.tsx'
import Alerts from './pages/alerts.tsx'
import Sensors from './pages/sensors.tsx'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl="/"
            appearance={{
                baseTheme: dark
            }}
            localization={esMX}
        >
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <BrowserRouter>
                    <Routes>
                        <Route element={<App />}>
                            <Route index element={<Dashboard />} />
                            <Route path="alerts" element={<Alerts />} />
                            <Route path="sensors" element={<Sensors />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </ClerkProvider>
    </StrictMode>
)
