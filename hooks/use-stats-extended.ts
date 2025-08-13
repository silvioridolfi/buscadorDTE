"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

interface FEDStats {
  fed_a_cargo: string
  count: number
}
interface ExtendedStatsData {
  totalEstablishments: number | null
  totalDistricts: number | null
  totalEnrollment: number | null
  enrollmentByGender: { varones: number; mujeres: number; total: number } | null
  districtStats: { distrito: string; count: number }[]
  fedStats: FEDStats[]
}
interface UseStatsExtendedReturn {
  stats: ExtendedStatsData
  loading: boolean
  error: string | null
}

export function useStatsExtended(): UseStatsExtendedReturn {
  const [stats, setStats] = useState<ExtendedStatsData>({
    totalEstablishments: null,
    totalDistricts: null,
    totalEnrollment: null,
    enrollmentByGender: null,
    districtStats: [],
    fedStats: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Single consolidated query to ensure values are always available
        const { data: establishments, error: establishmentsError } = await supabase
          .from("establecimientos")
          .select("id, distrito, fed_a_cargo, matricula, varones, mujeres")

        if (establishmentsError) {
          throw new Error(establishmentsError.message)
        }

        const totalEstablishments = establishments?.length || 0

        // Districts
        const districtMap = new Map<string, number>()
        establishments?.forEach((e) => {
          const d = (e.distrito || "").trim()
          if (!d) return
          districtMap.set(d, (districtMap.get(d) || 0) + 1)
        })
        const districtStats = Array.from(districtMap.entries())
          .map(([distrito, count]) => ({ distrito, count }))
          .sort((a, b) => b.count - a.count)
        const totalDistricts = districtStats.length

        // FEDs
        const fedMap = new Map<string, number>()
        establishments?.forEach((e) => {
          const fed = (e.fed_a_cargo || "Sin FED asignado").trim()
          fedMap.set(fed, (fedMap.get(fed) || 0) + 1)
        })
        const fedStats = Array.from(fedMap.entries())
          .map(([fed_a_cargo, count]) => ({ fed_a_cargo, count }))
          .sort((a, b) => b.count - a.count)

        // Enrollment totals
        let totalVarones = 0
        let totalMujeres = 0
        let totalMatricula = 0

        establishments?.forEach((e) => {
          if (typeof e.matricula === "number" && e.matricula > 0) totalMatricula += e.matricula
          if (typeof e.varones === "number" && e.varones >= 0) totalVarones += e.varones
          if (typeof e.mujeres === "number" && e.mujeres >= 0) totalMujeres += e.mujeres
        })

        const genderTotal = totalVarones + totalMujeres
        const totalEnrollment = genderTotal > 0 ? genderTotal : totalMatricula

        setStats({
          totalEstablishments,
          totalDistricts,
          totalEnrollment,
          enrollmentByGender: { varones: totalVarones, mujeres: totalMujeres, total: totalEnrollment },
          districtStats,
          fedStats,
        })
      } catch (err) {
        console.error("Extended stats fetch error:", err)
        setError("Error al cargar estadísticas")
        setStats({
          totalEstablishments: null,
          totalDistricts: null,
          totalEnrollment: null,
          enrollmentByGender: null,
          districtStats: [],
          fedStats: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
