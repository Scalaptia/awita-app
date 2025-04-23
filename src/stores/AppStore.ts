import { create } from 'zustand'

const useStore = create((set) => ({
    title: 'Panel de control',
    setTitle: (title: string) => set({ title })
}))

export const useAppStore = useStore
