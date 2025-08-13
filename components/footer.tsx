import Image from "next/image"

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 py-4 sm:py-6 md:py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DGCyE_PBA_Horizontal_2025-QOip6Jvh29ckE4LSN8qyiX1kwUxXzj.png"
              alt="Dirección General de Cultura y Educación - Gobierno de la Provincia de Buenos Aires"
              width={800}
              height={120}
              className="h-8 sm:h-12 md:h-16 lg:h-20 w-auto max-w-full"
              priority
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
