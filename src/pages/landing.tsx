import { SignInButton } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import Wave from 'react-wavify'
import {
    CheckCircle2,
    ChevronRight,
    Github,
    Mail,
    HomeIcon,
    Building2Icon
} from 'lucide-react'
import { WaterButton } from '../components/ui/water-button'

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50">
                <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo_light_transparent.png"
                            alt="AWITA"
                            className="h-8 w-auto"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <SignInButton mode="modal">
                            <WaterButton variant="outline" size="default">
                                Iniciar Sesión
                            </WaterButton>
                        </SignInButton>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0">
                    {/* Enhanced Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />

                    {/* Animated Waves */}
                    <Wave
                        className="absolute bottom-0 opacity-20"
                        fill="#3B82F6"
                        paused={false}
                        options={{
                            height: 40,
                            amplitude: 40,
                            speed: 0.15,
                            points: 3
                        }}
                    />
                    <Wave
                        className="absolute bottom-0 opacity-10"
                        fill="#6366F1"
                        paused={false}
                        options={{
                            height: 30,
                            amplitude: 30,
                            speed: 0.2,
                            points: 4
                        }}
                    />
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-8 -left-8 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />
                </div>

                <div className="relative">
                    <div className="container mx-auto px-4 pt-32 pb-48">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial="initial"
                                animate="animate"
                                variants={staggerContainer}
                                className="space-y-6"
                            >
                                <motion.div
                                    variants={fadeInUp}
                                    className="inline-flex items-center rounded-full px-4 py-1 text-sm leading-6 text-blue-700 ring-1 ring-blue-900/10 hover:ring-blue-900/20 bg-blue-50 backdrop-blur-sm"
                                >
                                    <span>Versión Beta Disponible</span>
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </motion.div>

                                <motion.div
                                    variants={fadeInUp}
                                    className="flex justify-center"
                                >
                                    <img
                                        src="/hero_logo.svg"
                                        alt="AWITA"
                                        className="h-24 md:h-32 w-auto p-4"
                                    />
                                </motion.div>

                                <motion.p
                                    variants={fadeInUp}
                                    className="mt-6 text-lg md:text-xl leading-8 text-gray-600 max-w-2xl mx-auto rounded-2xl p-4"
                                >
                                    Monitorea el nivel y consumo de agua de tus
                                    tanques en tiempo real.
                                </motion.p>

                                <motion.div
                                    variants={fadeInUp}
                                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0"
                                >
                                    <WaterButton
                                        size="lg"
                                        className="w-full sm:w-auto text-lg shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-shadow duration-500"
                                        onClick={() => {
                                            const preciosSection =
                                                document.getElementById(
                                                    'precios'
                                                )
                                            preciosSection?.scrollIntoView({
                                                behavior: 'smooth'
                                            })
                                        }}
                                    >
                                        <span className="flex items-center gap-2">
                                            Comprar Ahora
                                        </span>
                                    </WaterButton>
                                    <WaterButton
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto"
                                        onClick={() => {
                                            const demoSection =
                                                document.getElementById('demo')
                                            demoSection?.scrollIntoView({
                                                behavior: 'smooth'
                                            })
                                        }}
                                    >
                                        Ver Demo
                                    </WaterButton>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Fancy Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="container mx-auto px-4">
                        <div className="relative h-px w-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-100" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Demo Section */}
            <div
                id="demo"
                className="py-24 sm:py-32 bg-white relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Beneficios de AWITA
                                    </h2>
                                    <p className="text-lg text-gray-600">
                                        Visualiza, analiza y recibe alertas
                                        desde cualquier dispositivo.
                                    </p>
                                </motion.div>

                                <div className="space-y-6">
                                    {[
                                        {
                                            title: 'Monitoreo en Tiempo Real',
                                            description:
                                                'Visualiza el nivel actual y tendencias de consumo'
                                        },
                                        {
                                            title: 'Alertas Automáticas',
                                            description:
                                                'Recibe notificaciones cuando el nivel esté bajo'
                                        },
                                        {
                                            title: 'Análisis de Consumo',
                                            description:
                                                'Reportes detallados y estadísticas de uso'
                                        },
                                        {
                                            title: 'Predicciones con IA',
                                            description:
                                                'Anticipa tu consumo y recibe recomendaciones de ahorro'
                                        }
                                    ].map((feature, index) => (
                                        <motion.div
                                            key={feature.title}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.2 }}
                                            className="flex items-start gap-4"
                                        >
                                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                                                <CheckCircle2 className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Demo Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative rounded-2xl bg-white shadow-2xl shadow-blue-100/50 overflow-hidden"
                            >
                                <div className="aspect-[4/3] relative">
                                    <img
                                        src="/demo_dashboard.png"
                                        alt="Dashboard AWITA"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-sm font-medium">
                                        Dashboard en tiempo real con datos de
                                        tus tanques
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="relative h-24 bg-white">
                <Wave
                    className="absolute w-full h-full"
                    fill="url(#gradient-2)"
                    paused={false}
                    options={{
                        height: 40,
                        amplitude: 30,
                        speed: 0.15,
                        points: 4
                    }}
                >
                    <defs>
                        <linearGradient
                            id="gradient-2"
                            gradientTransform="rotate(90)"
                        >
                            <stop
                                offset="0%"
                                stopColor="rgba(239, 246, 255, 0.5)"
                            />
                            <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                    </defs>
                </Wave>
            </div>

            {/* Use Cases */}
            <div className="py-24 sm:py-32 bg-gradient-to-b from-white to-blue-50/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center space-y-4 mb-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider"
                            >
                                Casos de Uso
                            </motion.h2>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl"
                            >
                                Soluciones para cada necesidad
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
                            >
                                Solución flexible que se adapta a diferentes
                                necesidades de monitoreo de agua
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    icon: HomeIcon,
                                    title: 'Residencial',
                                    description:
                                        'Ideal para casas y departamentos que quieran tener control sobre su consumo de agua.',
                                    examples: [
                                        'Casas',
                                        'Departamentos',
                                        'Condominios',
                                        'Residencias'
                                    ]
                                },
                                {
                                    icon: Building2Icon,
                                    title: 'Comercial',
                                    description:
                                        'Perfecto para negocios que necesiten monitorear su consumo de agua de manera eficiente.',
                                    examples: [
                                        'Hoteles',
                                        'Restaurantes',
                                        'Oficinas',
                                        'Comercios'
                                    ]
                                }
                            ].map((useCase, index) => (
                                <motion.div
                                    key={useCase.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="group relative bg-white rounded-2xl p-6 shadow-lg shadow-blue-100/20 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            <useCase.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                            {useCase.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 text-sm">
                                            {useCase.description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {useCase.examples.map((example) => (
                                                <div
                                                    key={example}
                                                    className="flex items-center gap-2 text-sm text-gray-600"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                    <span className="text-sm">
                                                        {example}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="precios" className="py-24 sm:py-32 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider"
                        >
                            Planes Accesibles
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                        >
                            Soluciones a tu medida
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 text-lg leading-8 text-gray-600"
                        >
                            Elige el plan que mejor se adapte a tus necesidades
                            y comienza a optimizar la gestión de tu agua hoy.
                        </motion.p>
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    name: 'Dispositivo',
                                    price: '499',
                                    description:
                                        'Hardware necesario para monitorear cada tanque',
                                    features: [
                                        'Sensor de nivel de agua',
                                        'Instalación y configuración',
                                        'Garantía de 1 año',
                                        'Soporte técnico',
                                        'Nivel de agua de manera local'
                                    ],
                                    buttonText: 'Comprar dispositivo'
                                },
                                {
                                    name: 'Suscripción',
                                    price: '99',
                                    description:
                                        'Acceso a la plataforma por un año',
                                    features: [
                                        'Acceso desde cualquier lugar',
                                        'Dashboard en tiempo real',
                                        'Alertas personalizadas',
                                        'Reportes y análisis',
                                        'Actualizaciones gratuitas'
                                    ],
                                    buttonText: 'Suscribirse'
                                }
                            ].map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="flex flex-col p-8 rounded-3xl bg-white border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300"
                                >
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {plan.name}
                                    </h3>
                                    <p className="mt-4 text-sm text-gray-600">
                                        {plan.description}
                                    </p>
                                    <div className="mt-6 flex items-baseline gap-x-1">
                                        <span className="text-4xl font-bold tracking-tight text-gray-900">
                                            ${plan.price}
                                        </span>
                                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                                            {index === 0 ? ' MXN' : '/año MXN'}
                                        </span>
                                    </div>
                                    <ul className="mt-8 space-y-3 flex-1">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-center gap-3"
                                            >
                                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-500" />
                                                <span className="text-sm text-gray-600">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-8">
                                        <WaterButton
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                window.location.href =
                                                    index === 0
                                                        ? 'https://github.com/Scalaptia/awita-app'
                                                        : 'mailto:fernando.haro.c@gmail.com'
                                            }}
                                        >
                                            {plan.buttonText}
                                        </WaterButton>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a
                            href="https://github.com/Scalaptia/awita-app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">GitHub</span>
                            <Github className="h-6 w-6" />
                        </a>
                        <a
                            href="mailto:fernando.haro.c@gmail.com"
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Email</span>
                            <Mail className="h-6 w-6" />
                        </a>
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-sm leading-5 text-gray-500">
                            &copy; {new Date().getFullYear()} AWITA. Todos los
                            derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
