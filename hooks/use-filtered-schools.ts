"use client"

import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import type { School } from "@/lib/types"

interface UseFilteredSchoolsReturn {
  schools: School[]
  loading: boolean
  error: string | null
  hasSearched: boolean
  totalResults: number
  searchSchools: (searchTerm: string) => Promise<void>
  resetSearch: () => void
}

export function useFilteredSchools(): UseFilteredSchoolsReturn {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const normalizeText = useCallback((text: string): string => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  }, [])

  const extractSchoolPattern = useCallback(
    (searchTerm: string): { type: string; number: string } | null => {
      const term = normalizeText(searchTerm.trim())

      const schoolTypes = [
        "primaria", "secundaria", "jardin", "escuela", "colegio",
        "instituto", "tecnica", "media", "especial", "adultos",
        "bachillerato", "comercial", "industrial", "normal",
        "agropecuaria", "agrotecnica", "estetica", "artistica",
        "musical", "rural", "urbana",
      ]

      for (const type of schoolTypes) {
        const patterns = [
          new RegExp(`^${type}\\s+(\\d+)$`, "i"),
          new RegExp(`^${type}\\s+n°\\s*(\\d+)$`, "i"),
          new RegExp(`^${type}\\s+nº\\s*(\\d+)$`, "i"),
          new RegExp(`^${type}\\s+numero\\s+(\\d+)$`, "i"),
          new RegExp(`^${type}\\s+n°(\\d+)$`, "i"),
          new RegExp(`^${type}\\s+nº(\\d+)$`, "i"),
        ]

        for (const pattern of patterns) {
          const match = term.match(pattern)
          if (match && match[1]) {
            return { type, number: match[1] }
          }
        }

        if (term === type) {
          return { type, number: "" }
        }
      }

      return null
    },
    [normalizeText],
  )

  const isExactSchoolMatch = useCallback(
    (schoolName: string, searchType: string, searchNumber: string): boolean => {
      const name = normalizeText(schoolName)
      const type = normalizeText(searchType)
      const number = searchNumber

      if (!name.includes(type)) return false

      const exactNumberPatterns = [
        new RegExp(`\\b${type}\\s+${number}\\b`, "i"),
        new RegExp(`\\b${type}\\s+n°\\s*${number}\\b`, "i"),
        new RegExp(`\\b${type}\\s+nº\\s*${number}\\b`, "i"),
        new RegExp(`\\b${type}\\s+n°${number}\\b`, "i"),
        new RegExp(`\\b${type}\\s+nº${number}\\b`, "i"),
        new RegExp(`\\b${type}\\s+numero\\s+${number}\\b`, "i"),
      ]

      const hasExactPattern = exactNumberPatterns.some((p) => p.test(name))
      if (!hasExactPattern) return false

      const numbersInName = name.match(/\b\d+\b/g) || []
      return numbersInName.includes(number)
    },
    [normalizeText],
  )

  const generateAccentVariations = useCallback(
    (term: string): string[] => {
      const variations = new Set<string>()

      variations.add(term)
      variations.add(term.toLowerCase())
      variations.add(term.toUpperCase())

      const normalized = normalizeText(term)
      variations.add(normalized)
      variations.add(normalized.toUpperCase())

      const commonWords: Record<string, string[]> = {
        tecnica: ["tecnica", "técnica"],
        estetica: ["estetica", "estética"],
        musica: ["musica", "música"],
        educacion: ["educacion", "educación"],
        matematica: ["matematica", "matemática"],
        fisica: ["fisica", "física"],
        quimica: ["quimica", "química"],
        geografia: ["geografia", "geografía"],
        filosofia: ["filosofia", "filosofía"],
        artistica: ["artistica", "artística"],
        agrotecnica: ["agrotecnica", "agrotécnica"],
      }

      const termLower = term.toLowerCase()
      for (const [key, variants] of Object.entries(commonWords)) {
        if (termLower.includes(key) || termLower.includes(normalizeText(key))) {
          for (const v of variants) {
            variations.add(v)
            variations.add(v.toUpperCase())
            variations.add(v.charAt(0).toUpperCase() + v.slice(1))
          }
        }
      }

      return Array.from(variations)
    },
    [normalizeText],
  )

  // FIX: de N+1 queries a 3 queries totales
  const processSchoolResults = useCallback(async (schools: any[]): Promise<School[]> => {
    if (schools.length === 0) return []

    try {
      const results = schools.map((school) => ({
        ...school,
        contacto: school.contactos?.[0] || null,
        programas_educativos: [] as { programa: string }[],
        sharedPredioSchools: [] as { id: string; nombre: string; cue: number }[],
      }))

      // UNA sola query para todos los programas
      const cues = results.map((s) => s.cue)
      const { data: todosProgramas } = await supabase
        .from("programas_x_cue")
        .select("cue, programa")
        .in("cue", cues)

      const programasByCue = new Map<number, { programa: string }[]>()
      for (const p of todosProgramas || []) {
        if (!programasByCue.has(p.cue)) programasByCue.set(p.cue, [])
        programasByCue.get(p.cue)!.push({ programa: p.programa })
      }

      // UNA sola query para todos los predios compartidos
      const predios = results.map((s) => s.predio).filter(Boolean)
      const ids = results.map((s) => s.id)

      const sharedByPredioCue = new Map<number, { id: string; nombre: string; cue: number }[]>()

      if (predios.length > 0) {
        const { data: todasShared } = await supabase
          .from("establecimientos")
          .select("id, nombre, cue, predio")
          .in("predio", predios)
          .not("id", "in", `(${ids.join(",")})`)

        for (const s of todasShared || []) {
          if (!sharedByPredioCue.has(s.predio)) sharedByPredioCue.set(s.predio, [])
          sharedByPredioCue.get(s.predio)!.push({ id: s.id, nombre: s.nombre, cue: s.cue })
        }
      }

      // Asignar todo de una vez
      for (let i = 0; i < results.length; i++) {
        results[i].programas_educativos = programasByCue.get(results[i].cue) || []
        results[i].sharedPredioSchools = sharedByPredioCue.get(results[i].predio) || []
      }

      return results
    } catch (error) {
      console.error("Error processing results:", error)
      return []
    }
  }, [])

  const searchSchools = useCallback(
    async (searchTerm: string) => {
      const cleanTerm = searchTerm.trim()
      if (!cleanTerm) {
        setError("Por favor ingresa un término de búsqueda")
        return
      }

      setLoading(true)
      setError(null)
      setHasSearched(true)

      try {
        const baseQuery = supabase
          .from("establecimientos")
          .select(`
            id, cue, predio, nombre, distrito, ciudad, direccion,
            tipo_establecimiento, ambito, nivel, modalidad, matricula,
            varones, mujeres, secciones, turnos, fed_a_cargo, lat, lon,
            tipo, cue_anterior, access_id, listado_conexion_internet,
            plan_enlace, subplan_enlace, recurso_primario,
            fecha_inicio_conectividad, reclamos_grupo_1_ani,
            proveedor_asignado_pba, observaciones,
            proveedor_internet_pnce, fecha_instalacion_pnce,
            pnce_tipo_mejora, pnce_fecha_mejora, pnce_estado, mb,
            pba_2019_proveedor_internet, pba_2019_fecha_instalacion,
            pba_2019_estado, pba_grupo_1_proveedor_internet,
            pba_grupo_1_fecha_instalacion, pba_grupo_1_estado,
            pba_grupo_2_a_proveedor_internet, pba_grupo_2_a_fecha_instalacion,
            pba_grupo_2_a_tipo_mejora, pba_grupo_2_a_fecha_mejora,
            pba_grupo_2_a_estado, estado_instalacion_pba,
            plan_piso_tecnologico, tipo_piso_instalado,
            proveedor_piso_tecnologico_cue, fecha_terminado_piso_tecnologico_cue,
            tipo_mejora, fecha_mejora,
            contactos!left(id, nombre, apellido, cargo, telefono, correo)
          `)
          .limit(200)

        let results: any[] = []

        if (/^\d+$/.test(cleanTerm)) {
          if (/^\d{8}$/.test(cleanTerm)) {
            const { data } = await baseQuery.eq("cue", Number.parseInt(cleanTerm))
            results = data || []
          } else if (/^\d{6}$/.test(cleanTerm)) {
            const { data } = await baseQuery.eq("predio", Number.parseInt(cleanTerm))
            results = data || []
          } else if (/^\d{1,3}$/.test(cleanTerm)) {
            const { data } = await baseQuery.ilike("nombre", `%${cleanTerm}%`)
            const exact = (data || []).filter((s) => {
              const nums = (s.nombre as string).match(/\b\d+\b/g) || []
              return nums.includes(cleanTerm)
            })
            results = exact.length > 0 ? exact : data || []
          }
        } else {
          const pattern = extractSchoolPattern(cleanTerm)
          if (pattern) {
            const { type, number } = pattern

            if (number) {
              const typeVariants = generateAccentVariations(type)
              const { data: byNumber } = await baseQuery.ilike("nombre", `%${number}%`).order("nombre")
              const filtered =
                byNumber?.filter((school) =>
                  typeVariants.some((tv) => isExactSchoolMatch(school.nombre, tv, number)),
                ) || []
              results = filtered
            } else {
              const typeVariants = generateAccentVariations(type)
              const orConditions = typeVariants.map((tv) => `nombre.ilike.%${tv}%`).join(",")
              const { data: typeMatches } = await baseQuery.or(orConditions).order("nombre")
              results = typeMatches || []
            }
          } else {
            const variations = generateAccentVariations(cleanTerm)
            const orConditions = variations.map((v) => `nombre.ilike.%${v}%`).join(",")
            const { data: orResults, error: orError } = await baseQuery.or(orConditions).order("nombre")

            if (!orError && orResults && orResults.length > 0) {
              results = orResults
            } else {
              const { data: fallback } = await baseQuery.ilike("nombre", `%${cleanTerm}%`).order("nombre")
              results = fallback || []
            }
          }
        }

        const uniqueResults = results.filter(
          (school, index, self) => index === self.findIndex((s) => s.cue === school.cue),
        )

        const searchNormalized = normalizeText(cleanTerm)
        const sorted = uniqueResults.sort((a, b) => {
          const aName = normalizeText(a.nombre)
          const bName = normalizeText(b.nombre)

          if (aName === searchNormalized && bName !== searchNormalized) return -1
          if (bName === searchNormalized && aName !== searchNormalized) return 1
          if (aName.startsWith(searchNormalized) && !bName.startsWith(searchNormalized)) return -1
          if (bName.startsWith(searchNormalized) && !aName.startsWith(searchNormalized)) return 1

          return a.nombre.localeCompare(b.nombre)
        })

        const processedResults = await processSchoolResults(sorted)
        setSchools(processedResults)
        setTotalResults(processedResults.length)
      } catch (err) {
        console.error("Search error:", err)
        setError(err instanceof Error ? err.message : "Error al realizar la búsqueda")
        setSchools([])
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    },
    [normalizeText, extractSchoolPattern, generateAccentVariations, isExactSchoolMatch, processSchoolResults],
  )

  const resetSearch = useCallback(() => {
    setSchools([])
    setLoading(false)
    setError(null)
    setHasSearched(false)
    setTotalResults(0)
  }, [])

  return {
    schools,
    loading,
    error,
    hasSearched,
    totalResults,
    searchSchools,
    resetSearch,
  }
}