"use client"

import { MapPin, Globe } from "lucide-react"

interface LocationSectionProps {
  address?: string
  city?: string
  district?: string
  ambito?: string
  lat: number
  lng: number
  schoolName: string
}

export function LocationSection({ address, city, district, ambito, lat, lng, schoolName }: LocationSectionProps) {
  // Consolidar dirección en una sola línea
  const formatAddress = () => {
    const parts: string[] = []

    if (address) {
      parts.push(address)
    }

    if (city && district) {
      if (city.toLowerCase() === district.toLowerCase()) {
        parts.push(city)
      } else {
        parts.push(`${city} (${district})`)
      }
    } else if (city) {
      parts.push(city)
    } else if (district) {
      parts.push(district)
    }

    return parts.join(" – ")
  }

  const consolidatedAddress = formatAddress()
  const hasValidCoordinates = lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0

  return (
    <div className="space-y-4">
      {/* Dirección consolidada */}
      {consolidatedAddress && (
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#00AEC3] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Dirección</p>
            <p className="text-base font-medium text-white mt-1">{consolidatedAddress}</p>
          </div>
        </div>
      )}

      {/* Ámbito */}
      {ambito && (
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-[#00AEC3] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Ámbito</p>
            <p className="text-base font-medium text-white mt-1">{ambito}</p>
          </div>
        </div>
      )}

      {/* Mensaje si no hay coordenadas */}
      {!hasValidCoordinates && (
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-500 italic">Coordenadas no disponibles para navegación</p>
          </div>
        </div>
      )}
    </div>
  )
}
