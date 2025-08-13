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

        // Fetch school details
        const { data: schoolData, error: schoolError } = await supabase
          .from("establecimientos")
          .select(`
            id,
            cue,
            predio,
            nombre,
            distrito,
            ciudad,
            direccion,
            tipo_establecimiento,
            ambito,
            lat,
            lon,
            tipo,
            cue_anterior,
            access_id,
            recurso_primario,
            observaciones,
            nivel,
            modalidad,
            matricula,
            varones,
            mujeres,
            secciones,
            turnos,
            fed_a_cargo,
            plan_enlace,
            subplan_enlace,
            fecha_inicio_conectividad,
            proveedor_internet_pnce,
            fecha_instalacion_pnce,
            pnce_tipo_mejora,
            pnce_fecha_mejora,
            pnce_estado,
            mb,
            pba_grupo_1_proveedor_internet,
            pba_grupo_1_fecha_instalacion,
            pba_grupo_1_estado,
            pba_2019_proveedor_internet,
            pba_2019_fecha_instalacion,
            pba_2019_estado,
            pba_grupo_2_a_proveedor_internet,
            pba_grupo_2_a_fecha_instalacion,
            pba_grupo_2_a_tipo_mejora,
            pba_grupo_2_a_fecha_mejora,
            pba_grupo_2_a_estado,
            estado_instalacion_pba,
            proveedor_asignado_pba,
            listado_conexion_internet,
            reclamos_grupo_1_ani,
            plan_piso_tecnologico,
            proveedor_piso_tecnologico_cue,
            fecha_terminado_piso_tecnologico_cue,
            tipo_piso_instalado,
            tipo_mejora,
            fecha_mejora,
            contactos!left(
              id,
              nombre,
              apellido,
              cargo,
              telefono,
              correo
            )
          `)
          .eq("cue", cue)
          .single()

        if (schoolError) {
          throw new Error(`Error al cargar detalles: ${schoolError.message}`)
        }

        if (!schoolData) {
          throw new Error("Establecimiento no encontrado")
        }

        // Process school data
        const processedSchool: School = {
          ...schoolData,
          contacto: schoolData.contactos?.[0] || null,
          programas_educativos: [],
          sharedPredioSchools: [],
        }

        // Fetch educational programs
        try {
          const { data: programas } = await supabase.from("programas_x_cue").select("programa").eq("cue", cue)

          if (programas) {
            processedSchool.programas_educativos = programas
          }
        } catch (error) {
          console.warn("Error fetching programs:", error)
        }

        // Fetch shared predio schools
        if (schoolData.predio) {
          try {
            const { data: sharedSchools } = await supabase
              .from("establecimientos")
              .select("id, nombre, cue")
              .eq("predio", schoolData.predio)
              .neq("id", schoolData.id)

            if (sharedSchools && sharedSchools.length > 0) {
              processedSchool.sharedPredioSchools = sharedSchools
            }
          } catch (error) {
            console.warn("Error fetching shared schools:", error)
          }
        }

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
