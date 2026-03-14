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

        // Una sola llamada a la función SQL en lugar de traer todas las filas
        const { data, error: rpcError } = await supabase.rpc("get_stats")

        if (rpcError) throw new Error(rpcError.message)
        if (!data) throw new Error("No se pudieron cargar las estadísticas")

        const varones = Number(data.totalVarones) || 0
        const mujeres = Number(data.totalMujeres) || 0
        const totalMatricula = Number(data.totalMatricula) || 0
        const totalEnrollment = varones + mujeres > 0 ? varones + mujeres : totalMatricula

        setStats({
          totalEstablishments: Number(data.totalEstablecimientos) || 0,
          totalDistricts: Number(data.totalDistritos) || 0,
          totalEnrollment,
          enrollmentByGender: { varones, mujeres, total: totalEnrollment },
          districtStats: data.porDistrito || [],
          fedStats: data.porFed || [],
        })
      } catch (err) {
        console.error("Stats fetch error:", err)
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