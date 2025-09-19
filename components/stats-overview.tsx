"use client"

import { useEffect, useState } from "react"
import { School, MapPin, Users, X, TrendingUp } from "lucide-react"
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
    gradient,
    glowColor,
  }: {
    icon: JSX.Element
    value: string
    title: string
    onClick: () => void
    gradient: string
    glowColor: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-center rounded-3xl glass-enhanced border-2 border-gray-700/50 shadow-2xl transition-all duration-500 hover:shadow-[${glowColor}] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00AEC3]/50 p-8 transform hover:scale-105 laser-border relative overflow-hidden ${
        loading ? "animate-pulse" : ""
      }`}
      aria-label={`${title} - ver detalle`}
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}
      />

      {/* Hex pattern overlay */}
      <div className="absolute inset-0 hex-pattern opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Enhanced Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center border-2 border-gray-600/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 animate-pulse-glow`}
          >
            {icon}
          </div>
        </div>

        {/* Enhanced Number with gradient text */}
        <div
          className={`text-5xl md:text-6xl font-black tracking-tight mb-4 ${loading ? "text-gray-500" : "text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-[#e81f76] group-hover:to-[#00AEC3]"} transition-all duration-500`}
        >
          {loading ? "..." : value}
        </div>

        {/* Enhanced Title */}
        <div className="text-gray-300 text-base md:text-lg font-semibold leading-tight group-hover:text-white transition-colors duration-300">
          {title}
        </div>

        {/* Animated progress bar */}
        <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradient} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}
          />
        </div>
      </div>
    </button>
  )

  const renderModalContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      )
    }

    if (openMetric === "establishments") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-[#00AEC3]" />
            <p className="text-sm uppercase tracking-wider text-gray-400 font-semibold">Escuelas por FED</p>
          </div>
          {stats.fedStats.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-8">Sin datos de FED disponibles</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {stats.fedStats.map((fed, idx) => (
                <div
                  key={`${fed.fed_a_cargo}-${idx}`}
                  className="flex items-center justify-between text-sm glass-enhanced rounded-lg p-3 border border-gray-700/30 hover:border-[#00AEC3]/30 transition-colors"
                >
                  <span className="text-gray-200 truncate font-medium">{fed.fed_a_cargo}</span>
                  <span className="text-[#00AEC3] font-bold ml-4 text-lg">{formatNumber(fed.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (openMetric === "districts") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-[#417099]" />
            <p className="text-sm uppercase tracking-wider text-gray-400 font-semibold">
              Establecimientos por distrito
            </p>
          </div>
          {stats.districtStats.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-8">Sin datos de distritos disponibles</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {stats.districtStats.map((district, idx) => (
                <div
                  key={`${district.distrito}-${idx}`}
                  className="flex items-center justify-between text-sm glass-enhanced rounded-lg p-3 border border-gray-700/30 hover:border-[#417099]/30 transition-colors"
                >
                  <span className="text-gray-200 truncate font-medium">{district.distrito}</span>
                  <span className="text-[#417099] font-bold ml-4 text-lg">{formatNumber(district.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (openMetric === "enrollment") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-[#e81f76]" />
            <p className="text-sm uppercase tracking-wider text-gray-400 font-semibold">Distribución por género</p>
          </div>
          <div className="space-y-4">
            <div className="glass-enhanced rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-blue-300 font-medium">♂ Varones</span>
                <span className="text-white font-bold text-xl">
                  {formatNumber(stats.enrollmentByGender?.varones ?? 0)}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-pulse"
                  style={{
                    width: `${((stats.enrollmentByGender?.varones ?? 0) / (stats.enrollmentByGender?.total ?? 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="glass-enhanced rounded-lg p-4 border border-pink-500/30">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-pink-300 font-medium">♀ Mujeres</span>
                <span className="text-white font-bold text-xl">
                  {formatNumber(stats.enrollmentByGender?.mujeres ?? 0)}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-600 to-pink-400 rounded-full animate-pulse"
                  style={{
                    width: `${((stats.enrollmentByGender?.mujeres ?? 0) / (stats.enrollmentByGender?.total ?? 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="border-t border-gray-700/50 pt-4">
              <div className="flex items-center justify-between text-lg font-bold glass-enhanced rounded-lg p-4 border border-[#00AEC3]/30">
                <span className="text-[#00AEC3]">Total</span>
                <span className="text-white">
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
    <div className="mb-20 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <Card
          icon={<School className="w-8 h-8 text-white" />}
          value={formatNumber(stats.totalEstablishments)}
          title="Establecimientos registrados"
          onClick={() => setOpenMetric("establishments")}
          gradient="from-[#00AEC3] to-[#417099]"
          glowColor="0_0_40px_rgba(0,174,195,0.4)"
        />
        <Card
          icon={<MapPin className="w-8 h-8 text-white" />}
          value={formatNumber(stats.totalDistricts)}
          title="Distritos con escuelas"
          onClick={() => setOpenMetric("districts")}
          gradient="from-[#417099] to-[#00AEC3]"
          glowColor="0_0_40px_rgba(65,112,153,0.4)"
        />
        <Card
          icon={<Users className="w-8 h-8 text-white" />}
          value={formatNumber(stats.enrollmentByGender?.total ?? stats.totalEnrollment ?? 0)}
          title="Matrícula total de estudiantes"
          onClick={() => setOpenMetric("enrollment")}
          gradient="from-[#e81f76] to-[#00AEC3]"
          glowColor="0_0_40px_rgba(232,31,118,0.4)"
        />
      </div>

      {/* Error state - subtle and non-blocking */}
      {error && !loading && (
        <div className="mt-8 text-center">
          <div className="glass-enhanced rounded-2xl px-6 py-3 border border-red-500/30 inline-block">
            <p className="text-red-300 text-sm opacity-75">Las estadísticas no están disponibles temporalmente</p>
          </div>
        </div>
      )}

      {/* Data source indicator */}
      {!loading && !error && (
        <div className="mt-12 text-center">
          <div className="glass-enhanced rounded-2xl px-8 py-4 border border-gray-700/30 inline-block">
            <p className="text-gray-400 opacity-60 font-medium">
              Datos actualizados • Región 1 - Provincia de Buenos Aires
            </p>
            <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#00AEC3]/50 to-transparent"></div>
          </div>
        </div>
      )}

      {/* Enhanced Modal for metric details */}
      {openMetric && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-lg z-40 animate-fadeIn"
            onClick={() => setOpenMetric(null)}
            aria-hidden="true"
          />
          <div role="dialog" aria-modal="true" className="fixed z-50 inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl glass-modal rounded-3xl border-2 border-gray-700/50 shadow-2xl glow-cian transform animate-fadeIn">
              {/* Enhanced Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-[#417099]/20 to-[#00AEC3]/20 rounded-t-3xl">
                <h3 className="text-white font-bold text-xl flex items-center gap-3">
                  {openMetric === "establishments" && <School className="w-6 h-6 text-[#00AEC3]" />}
                  {openMetric === "districts" && <MapPin className="w-6 h-6 text-[#417099]" />}
                  {openMetric === "enrollment" && <Users className="w-6 h-6 text-[#e81f76]" />}
                  {openMetric === "establishments" && "Escuelas por FED"}
                  {openMetric === "districts" && "Establecimientos por distrito"}
                  {openMetric === "enrollment" && "Distribución de matrícula"}
                </h3>
                <button
                  onClick={() => setOpenMetric(null)}
                  className="p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors glass-enhanced"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">{renderModalContent()}</div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-700/50 text-right bg-gradient-to-r from-transparent to-gray-800/20 rounded-b-3xl">
                <button
                  onClick={() => setOpenMetric(null)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#417099] to-[#00AEC3] hover:from-[#365d80] hover:to-[#00a0b8] text-white font-semibold transition-all duration-300 transform hover:scale-105 holographic-sheen"
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
