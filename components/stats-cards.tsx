"use client"

import { School, MapPin } from "lucide-react"
import { useStats } from "@/hooks/use-stats"

export default function StatsCards() {
  const { stats, loading, error } = useStats()

  const formatNumber = (num: number | null): string => {
    if (num === null) return "—"
    return num.toLocaleString("es-AR")
  }

  const statsData = [
    {
      title: "Establecimientos Educativos",
      value: formatNumber(stats.totalEstablishments),
      icon: School,
      description: "Total registrados en la región",
      color: "text-[#00AEC3]",
      bgColor: "bg-[#00AEC3]/10",
      borderColor: "border-[#00AEC3]/20",
    },
    {
      title: "Distritos",
      value: formatNumber(stats.totalDistricts),
      icon: MapPin,
      description: "Localidades disponibles",
      color: "text-[#417099]",
      bgColor: "bg-[#417099]/10",
      borderColor: "border-[#417099]/20",
    },
  ]

  return (
    <div className="mb-12 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-2xl border ${stat.borderColor} ${stat.bgColor} 
                backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300
                p-6 group hover:scale-[1.02]
              `}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform translate-x-8 -translate-y-8">
                <IconComponent className="w-full h-full" />
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {loading && (
                    <div className="animate-pulse">
                      <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-bold ${stat.color} transition-all duration-300 ${
                        loading ? "animate-pulse" : ""
                      }`}
                    >
                      {loading ? "..." : stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {stat.description}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          )
        })}
      </div>

      {error && !loading && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Las estadísticas no están disponibles en este momento</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Datos actualizados • Región 1 - Provincia de Buenos Aires</p>
        </div>
      )}
    </div>
  )
}
