import { useAppStore } from '@/stores/AppStore'
import { useEffect } from 'react'

export default function Alerts() {
    const setTitle = useAppStore((state: any) => state.setTitle)

    useEffect(() => {
        setTitle('Alertas')
    }, [])

    return (
        <>
            <h1>Alertas</h1>
        </>
    )
}
