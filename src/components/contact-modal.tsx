import { motion } from 'framer-motion'
import { Mail, X } from 'lucide-react'
import { WaterButton } from './ui/water-button'

interface ContactModalProps {
    isOpen: boolean
    onClose: () => void
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full relative"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center space-y-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">
                        ¡Gracias por tu interés!
                    </h3>

                    <p className="text-gray-600">
                        Actualmente AWITA está en desarrollo y no disponible
                        para compra. Si te interesa el proyecto, no dudes en
                        contactar al desarrollador:
                    </p>

                    <a
                        href="mailto:fernando.haro.c@gmail.com"
                        className="block text-blue-600 hover:text-blue-700 font-medium"
                    >
                        fernando.haro.c@gmail.com
                    </a>

                    <div className="pt-4">
                        <WaterButton onClick={onClose} className="w-full">
                            Entendido
                        </WaterButton>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
