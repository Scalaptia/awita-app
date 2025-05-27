import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { WaterButton } from '@/components/ui/water-button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    const navigate = useNavigate()
    const [ripples, setRipples] = useState<
        { id: number; x: number; y: number }[]
    >([])

    // Crear ondas aleatorias en el fondo
    useEffect(() => {
        const interval = setInterval(() => {
            const newRipple = {
                id: Date.now(),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            }
            setRipples((prev) => [...prev.slice(-5), newRipple])
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 relative overflow-hidden flex items-center justify-center">
            {/* Animated background ripples */}
            {ripples.map((ripple) => (
                <motion.div
                    key={ripple.id}
                    className="absolute pointer-events-none"
                    style={{ left: ripple.x, top: ripple.y }}
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 3, ease: 'easeOut' }}
                    onAnimationComplete={() => {
                        setRipples((prev) =>
                            prev.filter((r) => r.id !== ripple.id)
                        )
                    }}
                >
                    <div className="w-20 h-20 rounded-full border-2 border-blue-400/30 dark:border-blue-500/30" />
                </motion.div>
            ))}

            {/* Main content */}
            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* Animated 404 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative mb-8"
                >
                    <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 bg-clip-text drop-shadow-2xl">
                        404
                    </h1>
                </motion.div>

                {/* Message with typing effect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-4 mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                        ¡Oops! Página no encontrada
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
                        Parece que te has sumergido demasiado profundo. Esta
                        página se secó y ya no existe.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                        <span className="text-sm font-medium">
                            Nivel de página: 0%
                        </span>
                    </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <WaterButton
                        size="lg"
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-3 min-w-[200px] shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-500"
                    >
                        <Home size={20} />
                        <span>Volver al inicio</span>
                    </WaterButton>

                    <WaterButton
                        variant="outline"
                        size="lg"
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 min-w-[200px] shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-500"
                    >
                        <ArrowLeft size={20} />
                        <span>Página anterior</span>
                    </WaterButton>
                </motion.div>

                {/* Helpful links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        ¿Perdido? Prueba estos enlaces útiles:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <button
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors cursor-pointer hover:underline"
                        >
                            Panel de control
                        </button>
                        <button
                            onClick={() => navigate('/sensors')}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors cursor-pointer hover:underline"
                        >
                            Sensores
                        </button>
                        <a
                            href="mailto:fernando.haro.c@gmail.com"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors cursor-pointer hover:underline"
                        >
                            Soporte
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Floating bubbles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-4 h-4 bg-blue-400/20 dark:bg-blue-500/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: 'easeInOut'
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
