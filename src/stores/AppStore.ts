import { create } from 'zustand'

interface AppState {
    title: string
    selectedSensor: string | null
    setTitle: (title: string) => void
    setSelectedSensor: (sensorId: string | null) => void
}

const useStore = create<AppState>((set) => ({
    title: 'Panel de control',
    selectedSensor: null,
    setTitle: (title: string) => set({ title }),
    setSelectedSensor: (sensorId: string | null) =>
        set({ selectedSensor: sensorId })
}))

export const useAppStore = useStore
