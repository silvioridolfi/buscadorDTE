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
  // Loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#e81f76] mb-4"></div>
        <p className="text-gray-300 text-lg">Buscando escuelas...</p>
        <p className="text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // No results state
  if (hasSearched && schools.length === 0) {
    return (
      <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-700 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3">No se encontraron resultados</h2>
        <p className="text-gray-300 mb-4">No se encontraron escuelas que coincidan con tu búsqueda.</p>
        <div className="text-sm text-gray-400 space-y-1">
          <p>• Verifica que el término esté escrito correctamente</p>
          <p>• Intenta con palabras más generales</p>
          <p>• Usa el CUE (8 dígitos) o número de predio (6 dígitos) para búsquedas exactas</p>
          <p>• Los badges amarillos indican "Contexto de encierro"</p>
          <p>• Los badges rojos indican "Escuela cerrada"</p>
        </div>
      </div>
    )
  }

  // Results found
  if (schools.length > 0) {
    return (
      <div className="space-y-6">
        {/* Results header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Resultados <span className="text-[#00AEC3]">({totalResults})</span>
          </h2>
          {totalResults === 50 && <p className="text-sm text-gray-400">Mostrando los primeros 50 resultados</p>}
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <SchoolCardOptimized key={school.id} school={school} onViewDetails={() => onViewDetails(school)} />
          ))}
        </div>

        {/* Results summary */}
        <div className="text-center pt-8">
          <p className="text-gray-400 text-sm">
            {totalResults === 1
              ? "Se encontró 1 establecimiento educativo"
              : `Se encontraron ${totalResults} establecimientos educativos`}
          </p>
        </div>
      </div>
    )
  }

  return null
}
