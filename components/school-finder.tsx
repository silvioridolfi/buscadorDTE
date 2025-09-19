"use client"

import { useState, useEffect } from "react"
import type { School } from "@/lib/types"
import { useFilteredSchools } from "@/hooks/use-filtered-schools"
import SearchInput from "./search-input"
import SearchResults from "./search-results"
import SchoolDetailsOptimized from "./school-details-optimized"
import StatsOverview from "./stats-overview"
import BackToTopButton from "./back-to-top-button"

export default function SchoolFinder() {
  const [selectedSchoolCUE, setSelectedSchoolCUE] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { schools, loading, error, hasSearched, totalResults, searchSchools, resetSearch } = useFilteredSchools()

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSchoolNavigation = (cue: number) => {
    setSelectedSchoolCUE(cue)
  }

  const handleViewDetails = (school: School) => {
    setSelectedSchoolCUE(school.cue)
  }

  const showResults = hasSearched || loading
  const hasResults = schools.length > 0 || loading || error

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Enhanced Header sin scanline effect */}
      <div className="text-center mb-16 relative">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight relative z-10">
          Buscador de{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e81f76] to-[#00AEC3] animate-pulse-glow">
            Escuelas
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-medium">Región 1 • Provincia de Buenos Aires</p>
        <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-[#e81f76] to-[#00AEC3] rounded-full opacity-60"></div>
      </div>

      {/* Enhanced Search Input */}
      <SearchInput onSearch={searchSchools} onClear={resetSearch} loading={loading} hasResults={schools.length > 0} />

      {/* Mobile Layout: Results first, then Stats */}
      {isMobile ? (
        <>
          {showResults && (
            <div className="mb-8">
              <SearchResults
                schools={schools}
                loading={loading}
                error={error}
                hasSearched={hasSearched}
                totalResults={totalResults}
                onViewDetails={handleViewDetails}
              />
            </div>
          )}

          {(!hasSearched || !hasResults) && (
            <div className={hasSearched && !hasResults ? "mt-8" : ""}>
              <StatsOverview />
            </div>
          )}

          {hasSearched && hasResults && !loading && (
            <div className="mt-16 pt-12 border-t border-gray-700/50 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-gradient-to-r from-[#e81f76] to-[#00AEC3] rounded-full opacity-60"></div>
              </div>
              <div className="text-center mb-12">
                <h3 className="text-2xl font-semibold text-gray-300 mb-4">Estadísticas de la Región</h3>
                <p className="text-gray-400">Información general de establecimientos educativos</p>
              </div>
              <StatsOverview />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Stats Overview */}
          <StatsOverview />

          {/* Search Results */}
          <SearchResults
            schools={schools}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
            totalResults={totalResults}
            onViewDetails={handleViewDetails}
          />
        </>
      )}

      {/* School Details Optimized */}
      <SchoolDetailsOptimized
        cue={selectedSchoolCUE}
        isOpen={!!selectedSchoolCUE}
        onClose={() => setSelectedSchoolCUE(null)}
        onNavigateToSchool={handleSchoolNavigation}
      />

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  )
}
