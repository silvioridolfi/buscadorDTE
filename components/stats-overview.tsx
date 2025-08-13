"use client"

import { useEffect, useState } from "react"
import { School, MapPin, Users, X } from "lucide-react"
import { useStatsExtended } from "@/hooks/use-stats-extended"
import type { JSX } from "react"

type MetricType = "establishments" | "districts" | "enrollment" | null

export default function StatsOverview() {
  const { stats, loading, error } = useStatsExtended()
  const [openMetric, setOpenMetric] = useState<MetricType>(null)

  // Close on ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMetric(null)
    }
    document.addEventListener("keydown", onEsc)
    return () => document.removeEventListener("keydown", onEsc)
  }, [])

  const formatNumber = (num: number | null | undefined): string => {
    if (num == null) return "—"
    return num.toLocaleString("es-AR")
  }

  const Card = ({
    icon,
    value,
    title,
    onClick,
  }: {
    icon: JSX.Element
    value: string
    title: string
    onClick: () => void
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-center rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-700 shadow-lg transition-all duration-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEC3] p-6 ${
        loading ? "animate-pulse" : ""
      }`}
      aria-label={`${title} - ver detalle`}
    >
      {/* Icon on top */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-gray-600">
          {icon}
        </div>
      </div>

      {/* Number */}
      <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">{loading ? "—" : value}</div>

      {/* Title below number */}
      <div className="mt-2 text-gray-300 text-sm md:text-base font-medium leading-tight">{title}</div>
    </button>
  )

  const renderModalContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-48 animate-pulse" />
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-700 rounded w-40 animate-pulse" />
            <div className="h-3 bg-gray-700 rounded w-12 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-700 rounded w-52 animate-pulse" />
            <div className="h-3 bg-gray-700 rounded w-10 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-700 rounded w-36 animate-pulse" />
            <div className="h-3 bg-gray-700 rounded w-8 animate-pulse" />
          </div>
        </div>
      )
    }

    if (openMetric === "establishments") {
      return (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">Escuelas por FED</p>
          {stats.fedStats.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Sin datos de FED</p>
          ) : (
            <div className="space-y-2">
              {stats.fedStats.map((fed, idx) => (
                <div key={`${fed.fed_a_cargo}-${idx}`} className="flex items-center justify-between text-sm">
                  <span className="text-gray-200 truncate">{fed.fed_a_cargo}</span>
                  <span className="text-white font-medium ml-3">{formatNumber(fed.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (openMetric === "districts") {
      return (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">Establecimientos por distrito</p>
          {stats.districtStats.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Sin datos de distritos</p>
          ) : (
            <div className="space-y-2">
              {stats.districtStats.map((district, idx) => (
                <div key={`${district.distrito}-${idx}`} className="flex items-center justify-between text-sm">
                  <span className="text-gray-200 truncate">{district.distrito}</span>
                  <span className="text-white font-medium ml-3">{formatNumber(district.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (openMetric === "enrollment") {
      return (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">Distribución por género</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-200">♂ Varones</span>
              <span className="text-white font-medium ml-3">
                {formatNumber(stats.enrollmentByGender?.varones ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-200">♀ Mujeres</span>
              <span className="text-white font-medium ml-3">
                {formatNumber(stats.enrollmentByGender?.mujeres ?? 0)}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-gray-100">Total</span>
                <span className="text-white ml-3">
                  {formatNumber(stats.enrollmentByGender?.total ?? stats.totalEnrollment ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="mb-16 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <Card
          icon={<School className="w-6 h-6 text-[#00AEC3]" />}
          value={formatNumber(stats.totalEstablishments)}
          title="Establecimientos registrados"
          onClick={() => setOpenMetric("establishments")}
        />
        <Card
          icon={<MapPin className="w-6 h-6 text-[#417099]" />}
          value={formatNumber(stats.totalDistricts)}
          title="Distritos con escuelas"
          onClick={() => setOpenMetric("districts")}
        />
        <Card
          icon={<Users className="w-6 h-6 text-[#e81f76]" />}
          value={formatNumber(stats.enrollmentByGender?.total ?? stats.totalEnrollment ?? 0)}
          title="Matrícula total de estudiantes"
          onClick={() => setOpenMetric("enrollment")}
        />
      </div>

      {/* Error state - subtle and non-blocking */}
      {error && !loading && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 opacity-75">Las estadísticas no están disponibles temporalmente</p>
        </div>
      )}

      {/* Data source indicator */}
      {!loading && !error && (
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 opacity-60">Datos actualizados • Región 1 - Provincia de Buenos Aires</p>
        </div>
      )}

      {/* Small window (modal) for metric details */}
      {openMetric && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setOpenMetric(null)}
            aria-hidden="true"
          />
          <div role="dialog" aria-modal="true" className="fixed z-50 inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold text-lg">
                  {openMetric === "establishments" && "Escuelas por FED"}
                  {openMetric === "districts" && "Establecimientos por distrito"}
                  {openMetric === "enrollment" && "Distribución de matrícula"}
                </h3>
                <button
                  onClick={() => setOpenMetric(null)}
                  className="p-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">{renderModalContent()}</div>
              <div className="p-3 border-t border-gray-700 text-right">
                <button
                  onClick={() => setOpenMetric(null)}
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
