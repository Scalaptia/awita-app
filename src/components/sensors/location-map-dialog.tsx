import { useState, useEffect } from 'react'
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap
} from 'react-leaflet'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog'
import { Map } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png'
})

interface LocationMapDialogProps {
    latitude?: number | null
    longitude?: number | null
    onLocationSelect: (lat: number, lng: number) => void
    trigger?: React.ReactNode
    showSaveButton?: boolean
}

function LocationMarker({
    onLocationSelect,
    initialPosition
}: {
    onLocationSelect: (lat: number, lng: number) => void
    initialPosition?: [number, number] | null
}) {
    const [position, setPosition] = useState<L.LatLng | null>(
        initialPosition
            ? L.latLng(initialPosition[0], initialPosition[1])
            : null
    )

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng)
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        }
    })

    // Update position when initialPosition changes
    useEffect(() => {
        if (initialPosition) {
            const newPosition = L.latLng(initialPosition[0], initialPosition[1])
            setPosition(newPosition)
        } else {
            setPosition(null)
        }
    }, [initialPosition])

    return position === null ? null : <Marker position={position} />
}

// Componente para centrar el mapa en la ubicación del usuario
function SetViewOnOpen({ center }: { center: [number, number] }) {
    const map = useMap()

    useEffect(() => {
        map.setView(center, 15)
        // Forzar una actualización del mapa
        setTimeout(() => {
            map.invalidateSize()
        }, 100)
    }, [center, map])

    return null
}

// Componente para localizar al usuario
function LocateControl() {
    const map = useMap()

    useEffect(() => {
        // Intentar localizar al usuario cuando el componente se monta
        map.locate({
            setView: true,
            maxZoom: 15,
            enableHighAccuracy: true
        })

        const onLocationFound = (e: L.LocationEvent) => {
            console.log('Ubicación encontrada:', e.latlng)
            map.setView(e.latlng, 15)
        }

        const onLocationError = (e: L.ErrorEvent) => {
            console.error('Error al obtener ubicación:', e.message)
        }

        map.on('locationfound', onLocationFound)
        map.on('locationerror', onLocationError)

        return () => {
            map.off('locationfound', onLocationFound)
            map.off('locationerror', onLocationError)
        }
    }, [map])

    return null
}

export function LocationMapDialog({
    latitude,
    longitude,
    onLocationSelect,
    trigger,
    showSaveButton = false
}: LocationMapDialogProps) {
    const [open, setOpen] = useState(false)
    const [tempPosition, setTempPosition] = useState<[number, number] | null>(
        null
    )
    const [mapCenter, setMapCenter] = useState<[number, number]>([
        19.4326, -99.1332
    ])

    // Initialize or update tempPosition when props change
    useEffect(() => {
        if (latitude && longitude) {
            const pos: [number, number] = [latitude, longitude]
            setTempPosition(pos)
            setMapCenter(pos)
        }
    }, [latitude, longitude])

    // Obtener la ubicación del usuario cuando se abre el diálogo
    useEffect(() => {
        if (open && navigator.geolocation && !tempPosition) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation: [number, number] = [
                        position.coords.latitude,
                        position.coords.longitude
                    ]
                    setMapCenter(newLocation)
                },
                (error) => {
                    console.error('Error al obtener ubicación:', error)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            )
        }
    }, [open])

    const handleMapClick = (lat: number, lng: number) => {
        const newPosition: [number, number] = [lat, lng]
        setTempPosition(newPosition)
        setMapCenter(newPosition)

        // Si no hay botón de guardar, actualizar inmediatamente
        if (!showSaveButton) {
            onLocationSelect(lat, lng)
            setOpen(false)
        }
    }

    const handleSave = () => {
        if (tempPosition) {
            onLocationSelect(tempPosition[0], tempPosition[1])
            setOpen(false)
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Si se está cerrando, restaurar la posición original
            if (latitude && longitude) {
                setTempPosition([latitude, longitude])
                setMapCenter([latitude, longitude])
            }
        }
        setOpen(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="outline" className="w-full">
                        <Map className="mr-2 h-4 w-4" />
                        Seleccionar ubicación en mapa
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Seleccionar Ubicación</DialogTitle>
                    <DialogDescription>
                        Haz clic en el mapa para seleccionar la ubicación del
                        sensor
                    </DialogDescription>
                </DialogHeader>

                <div className="h-[400px] w-full rounded-md border">
                    <MapContainer
                        center={mapCenter}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                            onLocationSelect={handleMapClick}
                            initialPosition={tempPosition}
                        />
                        <SetViewOnOpen center={mapCenter} />
                        <LocateControl />
                    </MapContainer>
                </div>

                {showSaveButton && (
                    <DialogFooter>
                        <Button onClick={handleSave} disabled={!tempPosition}>
                            Guardar ubicación
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
