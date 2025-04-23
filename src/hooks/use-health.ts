import { useState, useEffect } from 'react'

interface HealthResponse {
    status: 'ok' | 'error'
    info: {
        database: {
            status: 'up' | 'down'
        }
    }
}

export function useHealth() {
    const [status, setStatus] = useState<'ok' | 'error' | 'loading'>('loading')

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/health`
                )
                const data: HealthResponse = await response.json()
                setStatus(data.status)
            } catch (err) {
                setStatus('error')
            }
        }

        checkHealth()
        const interval = setInterval(checkHealth, 30000)
        return () => clearInterval(interval)
    }, [])

    return status
}
