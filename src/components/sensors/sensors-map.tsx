import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { cn } from '@/lib/utils'

// Add global styles to handle z-index
const mapStyles = `
.leaflet-pane {
    z-index: 1 !important;
}
.leaflet-control {
    z-index: 2 !important;
}
.leaflet-top,
.leaflet-bottom {
    z-index: 2 !important;
}
`

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png'
})

interface SensorsMapProps {
    sensors: Sensor[]
    className?: string
}

// Componente para centrar el mapa en la ubicación del usuario
function SetViewOnSensors({ sensors }: { sensors: Sensor[] }) {
    const map = useMap()

    useEffect(() => {
        if (sensors.length === 0) return

        // Calcular los límites para incluir todos los sensores
        const bounds = L.latLngBounds(
            sensors
                .filter((s) => s.latitude && s.longitude)
                .map((s) => [s.latitude!, s.longitude!])
        )

        // Si hay sensores con ubicación, ajustar el mapa para mostrarlos todos
        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15
            })
        }
    }, [sensors, map])

    return null
}

export function SensorsMap({ sensors, className }: SensorsMapProps) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        // Add styles when component mounts
        const styleEl = document.createElement('style')
        styleEl.innerHTML = mapStyles
        document.head.appendChild(styleEl)

        setIsClient(true)

        // Cleanup styles when component unmounts
        return () => {
            styleEl.remove()
        }
    }, [])

    // Filtrar sensores que tienen ubicación
    const sensorsWithLocation = sensors.filter(
        (sensor) => sensor.latitude && sensor.longitude
    )

    if (!isClient) {
        return (
            <div
                className={cn(
                    'h-[400px] rounded-lg border bg-muted/10 flex items-center justify-center',
                    className
                )}
            >
                <p className="text-sm text-muted-foreground">
                    Cargando mapa...
                </p>
            </div>
        )
    }

    if (sensorsWithLocation.length === 0) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center h-[400px] rounded-lg border bg-muted/10',
                    className
                )}
            >
                <p className="text-sm text-muted-foreground">
                    No hay sensores con ubicación registrada
                </p>
            </div>
        )
    }

    // Calcular el centro del mapa basado en los sensores
    const center = sensorsWithLocation
        .reduce(
            (acc, sensor) => {
                if (sensor.latitude && sensor.longitude) {
                    acc[0] += sensor.latitude
                    acc[1] += sensor.longitude
                }
                return acc
            },
            [0, 0]
        )
        .map((coord) => coord / sensorsWithLocation.length) as [number, number]

    return (
        <div
            className={cn('h-[400px] rounded-lg border relative', className)}
            style={{ zIndex: 0 }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0
                }}
            >
                <MapContainer
                    key={sensorsWithLocation
                        .map((s) => `${s.id}-${s.latitude}-${s.longitude}`)
                        .join(',')}
                    center={center}
                    zoom={12}
                    style={{
                        height: '100%',
                        width: '100%',
                        borderRadius: '0.5rem',
                        position: 'relative',
                        zIndex: 0
                    }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {sensorsWithLocation.map((sensor) => {
                        const waterLevel = sensor.water_level?.percentage ?? 0
                        const color = getWaterLevelColor(waterLevel)

                        return (
                            <Marker
                                key={`${sensor.id}-${sensor.latitude}-${sensor.longitude}`}
                                position={[sensor.latitude!, sensor.longitude!]}
                                icon={createCustomIcon(color)}
                            >
                                <Popup>
                                    <SensorPopup sensor={sensor} />
                                </Popup>
                            </Marker>
                        )
                    })}
                    <SetViewOnSensors sensors={sensorsWithLocation} />
                </MapContainer>
            </div>
        </div>
    )
}

function getWaterLevelColor(percentage: number): string {
    if (percentage <= 20) return '#ef4444' // red-500
    if (percentage <= 40) return '#f97316' // orange-500
    if (percentage <= 60) return '#eab308' // yellow-500
    if (percentage <= 80) return '#84cc16' // lime-500
    return '#22c55e' // green-500
}

function createCustomIcon(color: string) {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div style="
                width: 40px;
                height: 40px;
                position: relative;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    position: absolute;
                    border-radius: 50% 50% 50% 0;
                    background-color: ${color};
                    transform: rotate(-45deg);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div style="
                        width: 30px;
                        height: 30px;
                        background-color: white;
                        border-radius: 50%;
                        transform: rotate(45deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="
                            width: 24px;
                            height: 24px;
                            background-color: ${color};
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <div style="
                                width: 8px;
                                height: 8px;
                                background-color: white;
                                border-radius: 50%;
                            "></div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 10px;
                background: radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%);
            "></div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -45]
    })
}

// Componente para el contenido del Popup
function SensorPopup({ sensor }: { sensor: Sensor }) {
    const waterLevel = sensor.water_level?.percentage ?? 0
    const color = getWaterLevelColor(waterLevel)
    const currentLevel = sensor.water_level?.currentLevel ?? 0
    const capacity = sensor.capacity ?? 0

    return (
        <div className="p-2 min-w-[180px]">
            <h3 className="font-semibold text-base">{sensor.name}</h3>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                {sensor.location}
            </p>

            <div className="space-y-1.5">
                <div>
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs">Nivel de agua</span>
                        <span className="text-xs font-medium" style={{ color }}>
                            {waterLevel.toFixed(0)}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                width: `${waterLevel}%`,
                                backgroundColor: color
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t">
                    <div>
                        <p className="text-muted-foreground text-[11px]">
                            Actual
                        </p>
                        <p className="font-medium">
                            {Math.round(currentLevel)}L
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground text-[11px]">
                            Capacidad
                        </p>
                        <p className="font-medium">{Math.round(capacity)}L</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
