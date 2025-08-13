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
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Buscador de <span className="text-[#00AEC3]">Escuelas</span>
        </h1>
        <p className="text-lg text-gray-300">Región 1</p>
      </div>

      {/* Search Input */}
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
            <div className="mt-12 pt-8 border-t border-gray-700/50">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Estadísticas de la Región</h3>
                <p className="text-sm text-gray-400">Información general de establecimientos educativos</p>
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
