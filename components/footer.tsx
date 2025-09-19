import Image from "next/image"

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50 py-6 sm:py-8 md:py-12 mt-auto group hover:bg-gradient-to-br hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 transition-all duration-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex-shrink-0 relative">
            {/* Glow effect container */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#e81f76]/20 to-[#00AEC3]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DGCyE_PBA_Horizontal_2025-QOip6Jvh29ckE4LSN8qyiX1kwUxXzj.png"
              alt="Dirección General de Cultura y Educación - Gobierno de la Provincia de Buenos Aires"
              width={800}
              height={120}
              className="h-10 sm:h-16 md:h-20 lg:h-24 w-auto max-w-full filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 relative z-10"
              priority
            />
          </div>
        </div>

        {/* Enhanced footer text */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
            Sistema de búsqueda de establecimientos educativos
          </p>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-gray-600 group-hover:via-[#00AEC3]/50 to-transparent transition-all duration-500" />
        </div>
      </div>
    </footer>
  )
}
