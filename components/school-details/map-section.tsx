"use client"

import { useState } from "react"
import { Map, AlertTriangle } from "lucide-react"

interface MapSectionProps {
  lat: number
  lng: number
  schoolName: string
}

export function MapSection({ lat, lng, schoolName }: MapSectionProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)

  const hasValidCoordinates = lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0

  if (!hasValidCoordinates) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <AlertTriangle className="w-5 h-5 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Mapa</p>
          <p className="text-base font-medium text-gray-400 italic mt-1">No disponible - coordenadas faltantes</p>
        </div>
      </div>
    )
  }

  const handleMapLoad = () => {
    setMapLoaded(true)
    setMapError(false)
  }

  const handleMapError = () => {
    setMapError(true)
    setMapLoaded(false)
  }

  return (
    <div className="space-y-3">
      {/* Header del mapa */}
      <div className="flex items-center gap-2">
        <Map className="w-4 h-4 text-[#00AEC3]" />
        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Mapa interactivo</p>
      </div>

      {/* Contenedor del mapa */}
      <div className="relative">
        <div className="w-full h-[200px] bg-gray-800 rounded-lg border border-gray-700 overflow-hidden relative">
          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00AEC3] mx-auto"></div>
                <p className="text-gray-400 text-sm">Cargando mapa...</p>
              </div>
            </div>
          )}

          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-gray-500 mx-auto" />
                <p className="text-gray-400 text-sm">Error al cargar el mapa</p>
              </div>
            </div>
          )}

          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.005},${lng + 0.005},${lat + 0.005}&layer=mapnik&marker=${lat},${lng}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title={`Mapa de ubicación de ${schoolName}`}
            className="rounded-lg"
            onLoad={handleMapLoad}
            onError={handleMapError}
          />
        </div>

        {/* Descripción del mapa */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          Mapa embebido de OpenStreetMap • Carga automática al expandir la sección
        </p>
      </div>
    </div>
  )
}
