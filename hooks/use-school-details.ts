"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { School } from "@/lib/types"

interface UseSchoolDetailsReturn {
  school: School | null
  loading: boolean
  error: string | null
}

export function useSchoolDetails(cue: number | null): UseSchoolDetailsReturn {
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cue) {
      setSchool(null)
      setLoading(false)
      setError(null)
      return
    }

    const fetchSchoolDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Query principal de la escuela
        const { data: schoolData, error: schoolError } = await supabase
          .from("establecimientos")
          .select(`
            id, cue, predio, nombre, distrito, ciudad, direccion,
            tipo_establecimiento, ambito, lat, lon, tipo, cue_anterior,
            access_id, recurso_primario, observaciones, nivel, modalidad,
            matricula, varones, mujeres, secciones, turnos, fed_a_cargo,
            plan_enlace, subplan_enlace, fecha_inicio_conectividad,
            proveedor_internet_pnce, fecha_instalacion_pnce,
            pnce_tipo_mejora, pnce_fecha_mejora, pnce_estado, mb,
            pba_grupo_1_proveedor_internet, pba_grupo_1_fecha_instalacion,
            pba_grupo_1_estado, pba_2019_proveedor_internet,
            pba_2019_fecha_instalacion, pba_2019_estado,
            pba_grupo_2_a_proveedor_internet, pba_grupo_2_a_fecha_instalacion,
            pba_grupo_2_a_tipo_mejora, pba_grupo_2_a_fecha_mejora,
            pba_grupo_2_a_estado, estado_instalacion_pba,
            proveedor_asignado_pba, listado_conexion_internet,
            reclamos_grupo_1_ani, plan_piso_tecnologico,
            proveedor_piso_tecnologico_cue, fecha_terminado_piso_tecnologico_cue,
            tipo_piso_instalado, tipo_mejora, fecha_mejora,
            contactos!left(id, nombre, apellido, cargo, telefono, correo)
          `)
          .eq("cue", cue)
          .single()

        if (schoolError) throw new Error(`Error al cargar detalles: ${schoolError.message}`)
        if (!schoolData) throw new Error("Establecimiento no encontrado")

        const processedSchool: School = {
          ...schoolData,
          contacto: schoolData.contactos?.[0] || null,
          programas_educativos: [],
          sharedPredioSchools: [],
        }

        // Queries de programas y predios compartidos en paralelo
        const [programasResult, sharedResult] = await Promise.all([
          supabase
            .from("programas_x_cue")
            .select("programa")
            .eq("cue", cue),
          schoolData.predio
            ? supabase
                .from("establecimientos")
                .select("id, nombre, cue")
                .eq("predio", schoolData.predio)
                .neq("id", schoolData.id)
            : Promise.resolve({ data: [] }),
        ])

        processedSchool.programas_educativos = programasResult.data || []
        processedSchool.sharedPredioSchools = sharedResult.data || []

        setSchool(processedSchool)
      } catch (err) {
        console.error("School details fetch error:", err)
        setError(err instanceof Error ? err.message : "Error al cargar detalles")
        setSchool(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSchoolDetails()
  }, [cue])

  return { school, loading, error }
}