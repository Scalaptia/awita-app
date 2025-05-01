import { create } from 'zustand'

interface AuthState {
    userId: string | null
    isSignedIn: boolean
    isLoaded: boolean
    setAuth: (
        userId: string | null | undefined,
        isSignedIn: boolean,
        isLoaded: boolean
    ) => void
    reset: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
    userId: null,
    isSignedIn: false,
    isLoaded: false,
    setAuth: (userId, isSignedIn, isLoaded) =>
        set({ userId: userId || null, isSignedIn, isLoaded }),
    reset: () => set({ userId: null, isSignedIn: false, isLoaded: false })
}))
