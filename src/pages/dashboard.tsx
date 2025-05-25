import { useAppStore } from '@/stores/AppStore'
import { useSensorsQuery } from '@/lib/sensors-api'
import { useEffect } from 'react'
import { WaterTankGauge } from '@/components/dashboard/water-tank-gauge'
import { WaterLevelChart } from '@/components/dashboard/water-level-chart'
import { PredictionsChart } from '@/components/dashboard/predictions-chart'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { RegisterSensorDialog } from '@/components/sensors/register-sensor-dialog'
import { usePredictionsQuery } from '@/lib/predictions-api'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select'

export default function Dashboard() {
    const setTitle = useAppStore((state) => state.setTitle)
    const selectedSensor = useAppStore((state) => state.selectedSensor)
    const setSelectedSensor = useAppStore((state) => state.setSelectedSensor)
    const { data: sensors, isLoading, error, refetch } = useSensorsQuery()

    // Query predictions to check if they are available
    const { error: predictionsError } = usePredictionsQuery(
        selectedSensor ?? '',
        { hours: 24 },
        !!selectedSensor // Only enable the query if we have a selected sensor
    )

    // Select the first sensor by default when sensors are loaded
    useEffect(() => {
        if (sensors && sensors.length > 0 && !selectedSensor) {
            setSelectedSensor(sensors[0].id)
        }
    }, [sensors, selectedSensor, setSelectedSensor])

    useEffect(() => {
        setTitle('Panel de control')
    }, [setTitle])

    // Format date for display in a relative way
    const formatDate = (dateString: string) => {
        return `hace ${formatDistanceToNow(new Date(dateString), {
            locale: es,
            addSuffix: false
        })}`
    }

    const handleSensorUpdate = () => {
        refetch()
    }

    if (error) {
        return (
            <div className="rounded-md bg-destructive/15 p-4 text-destructive">
                {error instanceof Error
                    ? error.message
                    : 'Error al cargar los sensores'}
            </div>
        )
    }

    if (!isLoading && (!sensors || sensors.length === 0)) {
        return (
            <div className="px-6 flex flex-col items-center justify-center py-24 gap-4">
                <h2 className="text-lg font-medium">
                    No tienes sensores registrados
                </h2>
                <p className="text-muted-foreground text-sm text-center mb-4">
                    Para comenzar a monitorear tus tanques de agua, registra tu
                    primer sensor.
                </p>
                <RegisterSensorDialog onRegister={handleSensorUpdate} />
            </div>
        )
    }

    return (
        <div className="px-6 pb-4 space-y-6">
            {/* Water tank gauges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                {isLoading
                    ? Array(3)
                          .fill(0)
                          .map((_, i) => (
                              <div
                                  key={i}
                                  className="animate-pulse rounded-lg bg-card p-4 flex flex-col items-center"
                              >
                                  <div className="h-4 w-2/3 bg-muted rounded mb-4"></div>
                                  <div className="h-32 w-32 rounded-full bg-muted mb-4"></div>
                                  <div className="h-3 w-1/2 bg-muted rounded mb-2"></div>
                                  <div className="h-3 w-3/4 bg-muted rounded"></div>
                              </div>
                          ))
                    : sensors?.map((sensor) => (
                          <WaterTankGauge
                              key={sensor.id}
                              sensor={sensor}
                              percentage={sensor.water_level?.percentage ?? 0}
                              lastUpdated={
                                  sensor.sensor_readings?.length
                                      ? formatDate(
                                            sensor.sensor_readings[0].created_at
                                        )
                                      : 'Sin datos'
                              }
                              approximateVolume={
                                  sensor.water_level
                                      ? `${sensor.water_level.currentLevel.toFixed(
                                            0
                                        )}L`
                                      : undefined
                              }
                              isConnected={sensor.status}
                              onUpdate={handleSensorUpdate}
                          />
                      ))}
            </div>

            {/* Charts section */}
            {sensors && sensors.length > 0 && (
                <>
                    {/* Sensor selector for charts */}
                    <div className="flex items-center gap-2 px-1">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Sensor seleccionado:
                        </h3>
                        <Select
                            value={selectedSensor ?? undefined}
                            onValueChange={setSelectedSensor}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue
                                    className="truncate"
                                    placeholder="Seleccionar sensor"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {sensors.map((sensor) => (
                                    <SelectItem
                                        key={sensor.id}
                                        value={sensor.id}
                                        className="truncate"
                                    >
                                        {sensor.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Charts grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Historical chart */}
                        <div className="w-full">
                            {sensors ? (
                                <WaterLevelChart
                                    sensors={sensors}
                                    selectedSensor={selectedSensor}
                                    onSensorChange={setSelectedSensor}
                                    isLoading={isLoading}
                                />
                            ) : (
                                // Skeleton loading state
                                <div className="animate-pulse rounded-lg bg-card p-4 flex flex-col items-center">
                                    <div className="h-64 w-full bg-muted rounded"></div>
                                </div>
                            )}
                        </div>

                        {/* Predictions chart - only show if predictions are available */}
                        {selectedSensor && sensors && (
                            <div className="w-full">
                                <PredictionsChart
                                    sensorId={selectedSensor}
                                    sensorName={
                                        sensors.find(
                                            (s) => s.id === selectedSensor
                                        )?.name ?? ''
                                    }
                                    sensor={
                                        sensors.find(
                                            (s) => s.id === selectedSensor
                                        ) ?? sensors[0]
                                    }
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
