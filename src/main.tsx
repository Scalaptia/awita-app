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
import Notifications from './pages/notifications.tsx'
import Sensors from './pages/sensors.tsx'
import SignIn from './pages/sign-in.tsx'
import SignUp from './pages/sign-up.tsx'
import { ProtectedRoute } from './components/protected-route.tsx'
import { Toaster } from 'sonner'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

// Custom Clerk theme matching the app's color scheme
const clerkTheme = {
    baseTheme: dark,
    variables: {
        colorPrimary: '#1e293b',
        colorBackground: '#0f172a',
        colorText: '#f8fafc',
        colorInputText: '#FAFBFF',
        colorInputBackground: 'rgba(255, 255, 255, 0.15)',
        colorButtonText: '#21273A',
        colorButtonBackground: '#e2e8f0',
        colorDanger: '#ff6467',
        borderRadius: '0.625rem',
        colorTextSecondary: '#94a3b8',
        colorTextLink: '#818cf8'
    },
    elements: {
        formButtonPrimary: {
            backgroundColor: '#334155',
            color: '#FAFBFF',
            '&:focus': {
                backgroundColor: '#475569',
                boxShadow: '0 0 0 2px #334155, 0 0 0 4px #475569'
            },
            '&:hover': {
                backgroundColor: '#475569'
            }
        },
        card: {
            backgroundColor: '#1e293b',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
        },
        footer: {
            color: '#cbd5e1',
            '& a': {
                color: '#94a3b8',
                '&:hover': {
                    color: '#e2e8f0'
                }
            }
        },
        footerActionLink: {
            color: '#818cf8',
            '&:hover': {
                color: '#a5b4fc'
            }
        },
        headerTitle: {
            color: '#f8fafc'
        },
        headerSubtitle: {
            color: '#cbd5e1'
        },
        formFieldLabel: {
            color: '#f1f5f9'
        },
        formFieldHintText: {
            color: '#cbd5e1'
        },
        formFieldAction: {
            color: '#818cf8',
            fontWeight: '500',
            '&:hover': {
                color: '#a5b4fc'
            }
        },
        formResendCodeLink: {
            color: '#60a5fa',
            '&:hover': {
                color: '#93c5fd'
            }
        },
        identityPreviewEditButton: {
            color: '#818cf8',
            fontWeight: '500',
            '&:hover': {
                color: '#a5b4fc'
            }
        },
        navbarButton: {
            color: '#60a5fa',
            '&:hover': {
                color: '#93c5fd'
            }
        },
        alternativeMethodsBlockButton: {
            color: '#818cf8',
            fontWeight: '500',
            '&:hover': {
                color: '#a5b4fc'
            }
        },
        formButtonReset: {
            color: '#818cf8',
            fontWeight: '500',
            '&:hover': {
                color: '#a5b4fc'
            }
        },
        profileSectionPrimaryButton: {
            color: '#818cf8',
            fontWeight: '600',
            backgroundColor: 'rgba(129, 140, 248, 0.1)',
            '&:hover': {
                color: '#a5b4fc',
                backgroundColor: 'rgba(129, 140, 248, 0.2)'
            }
        },
        userButtonPopoverActionButton: {
            color: '#818cf8',
            fontWeight: '600',
            backgroundColor: 'rgba(129, 140, 248, 0.1)',
            '&:hover': {
                color: '#a5b4fc',
                backgroundColor: 'rgba(129, 140, 248, 0.2)'
            }
        },
        userButtonPopoverFooter: {
            '& button': {
                color: '#818cf8',
                fontWeight: '600',
                '&:hover': {
                    color: '#a5b4fc'
                }
            }
        },
        userProfile: {
            '& button': {
                color: '#818cf8',
                '&:hover': {
                    color: '#a5b4fc'
                }
            }
        },
        userProfilePage: {
            '& button': {
                color: '#818cf8',
                '&:hover': {
                    color: '#a5b4fc'
                }
            }
        },
        userProfileSectionTitle: {
            '& button': {
                color: '#818cf8',
                fontWeight: '600',
                '&:hover': {
                    color: '#a5b4fc'
                }
            }
        },
        userButtonPopoverCard: {
            '& a, & button': {
                color: '#818cf8',
                fontWeight: '600',
                '&:hover': {
                    color: '#a5b4fc'
                }
            }
        },
        badge: {
            backgroundColor: 'rgba(129, 140, 248, 0.2)',
            color: '#818cf8'
        },
        userPreviewMainIdentifier: {
            color: '#f8fafc'
        },
        userPreviewSecondaryIdentifier: {
            color: '#cbd5e1'
        }
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
                            {/* Public routes */}
                            <Route path="/sign-in" element={<SignIn />} />
                            <Route path="/sign-up" element={<SignUp />} />

                            {/* Protected routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route element={<App />}>
                                    <Route index element={<Dashboard />} />
                                    <Route
                                        path="notifications"
                                        element={<Notifications />}
                                    />
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
