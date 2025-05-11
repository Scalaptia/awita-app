import { useAppStore } from '@/stores/AppStore'
import { useSensorsQuery } from '@/lib/sensors-api'
import { useState, useEffect } from 'react'
import { WaterTankGauge } from '@/components/dashboard/water-tank-gauge'
import { WaterLevelChart } from '@/components/dashboard/water-level-chart'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { EditSensorDialog } from '@/components/sensors/edit-sensor-dialog'
import { Button } from '@/components/ui/button'
import { RegisterSensorDialog } from '@/components/sensors/register-sensor-dialog'
import { PlusCircle } from 'lucide-react'

export default function Dashboard() {
    const setTitle = useAppStore((state: any) => state.setTitle)
    const { data: sensors, isLoading, error } = useSensorsQuery()
    const [selectedSensor, setSelectedSensor] = useState<string | null>(null)
    // Select the first sensor by default when sensors are loaded
    useEffect(() => {
        if (sensors && sensors.length > 0 && !selectedSensor) {
            setSelectedSensor(sensors[0].id)
        }
    }, [sensors, selectedSensor])

    useEffect(() => {
        setTitle('Panel de control')
    }, [setTitle])

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, 'dd/MM/yyyy HH:mm', {
            locale: es
        })
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
                <RegisterSensorDialog>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Registrar Sensor
                    </Button>
                </RegisterSensorDialog>
            </div>
        )
    }

    return (
        <div className="px-6 pb-4 space-y-6">
            {/* Water tanks grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                          <EditSensorDialog
                              key={sensor.id}
                              sensor={sensor}
                              trigger={
                                  <div className="cursor-pointer">
                                      <WaterTankGauge
                                          name={sensor.name}
                                          percentage={
                                              sensor.water_level?.percentage ??
                                              0
                                          }
                                          lastUpdated={
                                              sensor.sensor_readings?.length
                                                  ? formatDate(
                                                        sensor
                                                            .sensor_readings[0]
                                                            .created_at
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
                                      />
                                  </div>
                              }
                          />
                      ))}
            </div>

            {/* Historical chart */}
            {sensors && sensors.length > 0 && selectedSensor ? (
                <WaterLevelChart
                    sensors={sensors}
                    selectedSensor={selectedSensor}
                    onSensorChange={setSelectedSensor}
                />
            ) : (
                // Skeleton loading state
                <div className="animate-pulse rounded-lg bg-card p-4 flex flex-col items-center">
                    <div className="h-64 w-full bg-muted rounded"></div>
                </div>
            )}
        </div>
    )
}
