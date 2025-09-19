"use client"

import { Search, AlertCircle } from "lucide-react"
import type { School } from "@/lib/types"
import SchoolCardOptimized from "./school-card-optimized"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SearchResultsProps {
  schools: School[]
  loading: boolean
  error: string | null
  hasSearched: boolean
  totalResults: number
  onViewDetails: (school: School) => void
}

export default function SearchResults({
  schools,
  loading,
  error,
  hasSearched,
  totalResults,
  onViewDetails,
}: SearchResultsProps) {
  // Enhanced Loading state with futuristic spinner
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="relative inline-block mb-8">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
          {/* Animated ring with gradient */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#e81f76] border-r-[#00AEC3] rounded-full animate-spin"></div>
          {/* Inner glow */}
          <div className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-r from-[#e81f76]/20 to-[#00AEC3]/20 rounded-full blur-sm animate-pulse"></div>
        </div>

        {/* Typewriter effect for loading text */}
        <div className="space-y-3">
          <p className="text-gray-300 text-xl font-medium">
            <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-[#00AEC3] animate-typewriter">
              Buscando escuelas...
            </span>
          </p>
          <p className="text-gray-400 text-sm">Analizando base de datos • Esto puede tomar unos segundos</p>
        </div>

        {/* Scan lines effect */}
        <div className="mt-8 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-px bg-gradient-to-r from-transparent via-[#00AEC3]/30 to-transparent mx-auto w-64 relative overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00AEC3] to-transparent w-1/4 animate-scanline opacity-60"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Enhanced Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Alert className="bg-red-500/10 border-2 border-red-500/20 text-red-300 rounded-2xl glass-enhanced glow-rosa">
          <AlertCircle className="h-6 w-6 animate-pulse" />
          <AlertDescription className="text-red-200 text-lg font-medium ml-2">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Enhanced No results state
  if (hasSearched && schools.length === 0) {
    return (
      <div className="text-center py-20 glass-enhanced rounded-3xl shadow-2xl border border-gray-700/50 max-w-4xl mx-auto relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 hex-pattern opacity-30"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 mb-8 shadow-2xl border border-gray-600">
            <Search className="w-10 h-10 text-gray-400 animate-float" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">No se encontraron resultados</h2>
          <p className="text-gray-300 text-lg mb-8">No se encontraron escuelas que coincidan con tu búsqueda.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 max-w-2xl mx-auto">
            <div className="glass-enhanced rounded-xl p-4 border border-gray-700/30">
              <h3 className="text-[#00AEC3] font-semibold mb-2">Sugerencias de búsqueda:</h3>
              <ul className="space-y-1 text-left">
                <li>• Verifica la ortografía</li>
                <li>• Usa términos más generales</li>
                <li>• Prueba sin acentos</li>
              </ul>
            </div>

            <div className="glass-enhanced rounded-xl p-4 border border-gray-700/30">
              <h3 className="text-[#e81f76] font-semibold mb-2">Búsquedas específicas:</h3>
              <ul className="space-y-1 text-left">
                <li>• CUE (8 dígitos exactos)</li>
                <li>• Predio (6 dígitos exactos)</li>
                <li>• "Primaria 9", "Técnica 1"</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
              Contexto de encierro
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              Escuela cerrada
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced Results found
  if (schools.length > 0) {
    return (
      <div className="space-y-8">
        {/* Enhanced Results header */}
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#417099] to-[#00AEC3] flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Resultados encontrados</h2>
              <p className="text-gray-400">
                <span className="text-[#00AEC3] font-semibold text-lg">{totalResults}</span> establecimientos educativos
              </p>
            </div>
          </div>

          {totalResults === 50 && (
            <div className="glass-enhanced rounded-xl px-4 py-2 border border-amber-500/30">
              <p className="text-sm text-amber-300 font-medium">Mostrando primeros 50 resultados</p>
            </div>
          )}
        </div>

        {/* Enhanced Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school, index) => (
            <div key={school.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <SchoolCardOptimized school={school} onViewDetails={() => onViewDetails(school)} />
            </div>
          ))}
        </div>

        {/* Enhanced Results summary */}
        <div className="text-center pt-12">
          <div className="inline-block glass-enhanced rounded-2xl px-8 py-4 border border-gray-700/50">
            <p className="text-gray-400">
              {totalResults === 1
                ? "Se encontró 1 establecimiento educativo"
                : `Se encontraron ${totalResults} establecimientos educativos`}
            </p>
            <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#00AEC3]/50 to-transparent"></div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
