import { SectionCards } from '@/components/section-cards'
import { useAppStore } from '@/stores/AppStore'
import { useEffect } from 'react'

export default function Sensors() {
    const setTitle = useAppStore((state: any) => state.setTitle)

    useEffect(() => {
        setTitle('Sensores')
    }, [])

    return (
        <>
            <h1>Sensores</h1>
        </>
    )
}
