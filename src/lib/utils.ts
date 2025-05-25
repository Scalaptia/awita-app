import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface WaterLevelInfo {
    currentLevel: number // in liters
    percentage: number // 0-100
}

export function calculateWaterLevel(
    capacity: number,
    height: number,
    waterDistance: number,
    reading: number
): WaterLevelInfo {
    const actualWaterHeight = height - reading

    // Calculate percentage (water height / total possible water height) * 100
    const maxWaterHeight = height - waterDistance
    const percentage = Math.max(
        0,
        Math.min(100, (actualWaterHeight / maxWaterHeight) * 100)
    )

    // Calculate current water volume in liters
    const currentLevel = Math.max(0, (percentage / 100) * capacity)

    return {
        currentLevel: Math.round(currentLevel * 10) / 10,
        percentage: Math.round(percentage * 10) / 10
    }
}
