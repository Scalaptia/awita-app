import { useHealthQuery } from '@/lib/api'

export function useHealth() {
    const { data, isLoading, isError } = useHealthQuery()

    if (isLoading) {
        return 'loading'
    }

    if (isError || !data) {
        return 'error'
    }

    return data.status
}
