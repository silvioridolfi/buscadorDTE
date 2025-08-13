"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

interface StatsData {
  totalEstablishments: number | null
  totalDistricts: number | null
  totalSections: number | null // used to display total enrollment
}
interface UseStatsReturn {
  stats: StatsData
  loading: boolean
  error: string | null
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<StatsData>({
    totalEstablishments: null,
    totalDistricts: null,
    totalSections: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Consolidated fetch for robust values
        const { data: establishments, error: establishmentsError } = await supabase
          .from("establecimientos")
          .select("distrito, matricula")

        if (establishmentsError) {
          throw new Error(establishmentsError.message)
        }

        const totalEstablishments = establishments?.length || 0

        const uniqueDistricts = new Set(
          establishments?.map((e) => (e.distrito ? String(e.distrito).trim() : "")).filter(Boolean) || [],
        )
        const totalDistricts = uniqueDistricts.size

        const totalEnrollment =
          establishments?.reduce((sum, e) => sum + (typeof e.matricula === "number" ? e.matricula : 0), 0) || 0

        setStats({
          totalEstablishments,
          totalDistricts,
          totalSections: totalEnrollment,
        })
      } catch (err) {
        console.error("Stats fetch error:", err)
        setError("Error al cargar estadísticas")
        setStats({
          totalEstablishments: null,
          totalDistricts: null,
          totalSections: null,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
