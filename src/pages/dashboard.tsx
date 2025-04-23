import { SectionCards } from '@/components/section-cards'
import { useAppStore } from '@/stores/AppStore'
import { useEffect } from 'react'

export default function Dashboard() {
    const setTitle = useAppStore((state: any) => state.setTitle)

    useEffect(() => {
        setTitle('Panel de control')
    }, [])

    return (
        <>
            <SectionCards />
        </>
    )
}
