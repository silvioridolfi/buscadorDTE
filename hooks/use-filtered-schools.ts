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

  // Normalize text: remove accents and lowercase
  const normalizeText = useCallback((text: string): string => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  }, [])

  // Extract school type and number: "tecnica 1", "técnica n° 1", "secundaria nº5", etc.
  const extractSchoolPattern = useCallback(
    (searchTerm: string): { type: string; number: string } | null => {
      const term = normalizeText(searchTerm.trim())

      const schoolTypes = [
        "primaria",
        "secundaria",
        "jardin",
        "escuela",
        "colegio",
        "instituto",
        "tecnica",
        "media",
        "especial",
        "adultos",
        "bachillerato",
        "comercial",
        "industrial",
        "normal",
        "agropecuaria",
        "agrotecnica",
        "estetica",
        "artistica",
        "musical",
        "rural",
        "urbana",
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

        // Only the type without number (e.g., "tecnica")
        if (term === type) {
          return { type, number: "" }
        }
      }

      return null
    },
    [normalizeText],
  )

  // Exact match checker: respects type and exact number boundaries
  const isExactSchoolMatch = useCallback(
    (schoolName: string, searchType: string, searchNumber: string): boolean => {
      const name = normalizeText(schoolName)
      const type = normalizeText(searchType)
      const number = searchNumber

      // Must contain the type
      if (!name.includes(type)) return false

      // Patterns that match exact number, not 10, 11, 12...
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

      // Extra guard: numbers as whole words
      const numbersInName = name.match(/\b\d+\b/g) || []
      return numbersInName.includes(number)
    },
    [normalizeText],
  )

  // Generate accent variations for common Spanish words (bidirectional)
  const generateAccentVariations = useCallback(
    (term: string): string[] => {
      const variations = new Set<string>()

      variations.add(term)
      variations.add(term.toLowerCase())
      variations.add(term.toUpperCase())

      const normalized = normalizeText(term)
      variations.add(normalized)
      variations.add(normalized.toUpperCase())

      // Common words where accents are frequent
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

  // Process school results with additional data
  const processSchoolResults = useCallback(async (schools: any[]): Promise<School[]> => {
    try {
      const results = schools.map((school) => ({
        ...school,
        contacto: school.contactos?.[0] || null,
        programas_educativos: [],
        sharedPredioSchools: [] as { id: string; nombre: string; cue: number }[],
      }))

      // Fetch educational programs for each school
      for (let i = 0; i < results.length; i++) {
        const school = results[i]
        try {
          const { data: programas } = await supabase.from("programas_x_cue").select("programa").eq("cue", school.cue)
          results[i].programas_educativos = programas || []
        } catch (error) {
          console.error(`Error querying programs for CUE ${school.cue}:`, error)
        }
      }

      // Find schools with shared predios
      for (let i = 0; i < results.length; i++) {
        const school = results[i]
        if (!school.predio) continue

        try {
          const { data: sharedSchools } = await supabase
            .from("establecimientos")
            .select("id, nombre, cue")
            .eq("predio", school.predio)
            .neq("id", school.id)

          if (sharedSchools && sharedSchools.length > 0) {
            results[i].sharedPredioSchools = sharedSchools
          }
        } catch (error) {
          console.error("Error finding shared predios for school", school.id, error)
        }
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

      console.log("🔍 Starting search for:", cleanTerm)
      setLoading(true)
      setError(null)
      setHasSearched(true)

      try {
        // Base query with all necessary fields
        const baseQuery = supabase
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
          nivel,
          modalidad,
          matricula,
          varones,
          mujeres,
          secciones,
          turnos,
          fed_a_cargo,
          lat,
          lon,
          tipo,
          cue_anterior,
          access_id,
          listado_conexion_internet,
          plan_enlace,
          subplan_enlace,
          recurso_primario,
          fecha_inicio_conectividad,
          reclamos_grupo_1_ani,
          proveedor_asignado_pba,
          observaciones,
          proveedor_internet_pnce,
          fecha_instalacion_pnce,
          pnce_tipo_mejora,
          pnce_fecha_mejora,
          pnce_estado,
          mb,
          pba_2019_proveedor_internet,
          pba_2019_fecha_instalacion,
          pba_2019_estado,
          pba_grupo_1_proveedor_internet,
          pba_grupo_1_fecha_instalacion,
          pba_grupo_1_estado,
          pba_grupo_2_a_proveedor_internet,
          pba_grupo_2_a_fecha_instalacion,
          pba_grupo_2_a_tipo_mejora,
          pba_grupo_2_a_fecha_mejora,
          pba_grupo_2_a_estado,
          estado_instalacion_pba,
          plan_piso_tecnologico,
          tipo_piso_instalado,
          proveedor_piso_tecnologico_cue,
          fecha_terminado_piso_tecnologico_cue,
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
          .limit(200) // a bit higher to allow post-filtering for exact matches

        let results: any[] = []

        // 1) Numeric-only logic
        if (/^\d+$/.test(cleanTerm)) {
          if (/^\d{8}$/.test(cleanTerm)) {
            const { data } = await baseQuery.eq("cue", Number.parseInt(cleanTerm))
            results = data || []
          } else if (/^\d{6}$/.test(cleanTerm)) {
            const { data } = await baseQuery.eq("predio", Number.parseInt(cleanTerm))
            results = data || []
          } else if (/^\d{1,3}$/.test(cleanTerm)) {
            // exact number in names (avoid matching 1 in 10)
            const { data } = await baseQuery.ilike("nombre", `%${cleanTerm}%`)
            const exact = (data || []).filter((s) => {
              const nums = (s.nombre as string).match(/\b\d+\b/g) || []
              return nums.includes(cleanTerm)
            })
            results = exact.length > 0 ? exact : data || []
          }
        } else {
          // 2) Pattern-based search: e.g. "tecnica 1", "técnica n° 1"
          const pattern = extractSchoolPattern(cleanTerm)
          if (pattern) {
            const { type, number } = pattern

            if (number) {
              // When a number is present, we must enforce exact-match with the number
              // Fetch by number first, then filter strictly with type+number
              // We also consider accent variants of type
              const typeVariants = generateAccentVariations(type)

              // Initial fetch by the number to reduce dataset
              const { data: byNumber } = await baseQuery.ilike("nombre", `%${number}%`).order("nombre")
              const filtered =
                byNumber?.filter((school) =>
                  typeVariants.some((tv) => isExactSchoolMatch(school.nombre, tv, number)),
                ) || []

              results = filtered
            } else {
              // Only type, no number -> broad search by type with accent variations
              const typeVariants = generateAccentVariations(type)
              const orConditions = typeVariants.map((tv) => `nombre.ilike.%${tv}%`).join(",")
              const { data: typeMatches } = await baseQuery.or(orConditions).order("nombre")
              results = typeMatches || []
            }
          } else {
            // 3) Enhanced text search with accent variations (no strict number)
            const variations = generateAccentVariations(cleanTerm)
            const orConditions = variations.map((v) => `nombre.ilike.%${v}%`).join(",")
            const { data: orResults, error: orError } = await baseQuery.or(orConditions).order("nombre")

            if (!orError && orResults && orResults.length > 0) {
              results = orResults
            } else {
              // Fallback to simple ILIKE
              const { data: fallback } = await baseQuery.ilike("nombre", `%${cleanTerm}%`).order("nombre")
              results = fallback || []
            }
          }
        }

        // Deduplicate by CUE
        const uniqueResults = results.filter(
          (school, index, self) => index === self.findIndex((s) => s.cue === school.cue),
        )

        // Sort by relevance
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
        console.error("❌ Search error:", err)
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
