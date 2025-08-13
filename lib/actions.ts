"use server"

import { supabase } from "@/lib/supabase/client"
import type { School } from "./types"

// Function to normalize text removing accents
function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

// Enhanced function to extract school type and number with exact matching
function extractSchoolPattern(searchTerm: string): { type: string; number: string } | null {
  const normalizedTerm = normalizeText(searchTerm.trim())

  // Common school type patterns - EXPANDED LIST
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
    "deportiva",
    "rural",
    "urbana",
  ]

  for (const type of schoolTypes) {
    // More precise patterns for exact number matching
    const patterns = [
      new RegExp(`^${type}\\s+(\\d+)$`, "i"), // "primaria 4"
      new RegExp(`^${type}\\s+n°\\s*(\\d+)$`, "i"), // "primaria n° 4"
      new RegExp(`^${type}\\s+nº\\s*(\\d+)$`, "i"), // "primaria nº 4"
      new RegExp(`^${type}\\s+numero\\s+(\\d+)$`, "i"), // "primaria numero 4"
      new RegExp(`^${type}\\s+n°(\\d+)$`, "i"), // "primaria n°4"
      new RegExp(`^${type}\\s+nº(\\d+)$`, "i"), // "primaria nº4"
    ]

    for (const pattern of patterns) {
      const match = normalizedTerm.match(pattern)
      if (match && match[1]) {
        return { type, number: match[1] }
      }
    }

    // NEW: Check if it's just the school type without number
    if (normalizedTerm === type) {
      return { type, number: "" } // Empty number means search for any school of this type
    }
  }

  return null
}

// Enhanced function to validate exact school matches
function isExactSchoolMatch(schoolName: string, searchType: string, searchNumber: string): boolean {
  const normalizedName = normalizeText(schoolName)
  const normalizedType = normalizeText(searchType)

  // Create patterns for exact matching with word boundaries
  const exactPatterns = [
    new RegExp(`\\b${normalizedType}\\s+${searchNumber}\\b`, "i"), // "primaria 4"
    new RegExp(`\\b${normalizedType}\\s+n°\\s*${searchNumber}\\b`, "i"), // "primaria n° 4"
    new RegExp(`\\b${normalizedType}\\s+nº\\s*${searchNumber}\\b`, "i"), // "primaria nº 4"
    new RegExp(`\\b${normalizedType}\\s+n°${searchNumber}\\b`, "i"), // "primaria n°4"
    new RegExp(`\\b${normalizedType}\\s+nº${searchNumber}\\b`, "i"), // "primaria nº4"
    new RegExp(`\\b${normalizedType}\\s+numero\\s+${searchNumber}\\b`, "i"), // "primaria numero 4"
  ]

  // Check if any pattern matches exactly
  const hasExactMatch = exactPatterns.some((pattern) => pattern.test(normalizedName))

  // Additional validation: ensure it's not a partial match like "primaria 14" when searching for "primaria 4"
  if (hasExactMatch) {
    // Extract all numbers from the school name using word boundaries
    const numbersInName = schoolName.match(/\b\d+\b/g) || []

    // Check if the exact number exists in the school name
    return numbersInName.includes(searchNumber)
  }

  return false
}

export async function searchSchools(searchTerm: string): Promise<School[]> {
  console.log("🔍 Searching for:", searchTerm)

  const cleanTerm = searchTerm.trim()
  if (!cleanTerm) {
    console.log("❌ Empty search term")
    return []
  }

  try {
    // Base query - ALWAYS search from establecimientos table only
    const baseQuery = supabase.from("establecimientos").select(`
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

    // 1. Check if it's a number and apply digit-based logic
    if (/^\d+$/.test(cleanTerm)) {
      console.log("🔢 Searching by number with digit-based logic:", cleanTerm)

      // 8 digits exactly → search by CUE
      if (/^\d{8}$/.test(cleanTerm)) {
        console.log("🎯 8 digits detected - searching by CUE:", cleanTerm)
        const { data: cueMatches, error: cueError } = await baseQuery.eq("cue", Number.parseInt(cleanTerm))

        if (cueError) {
          console.error("❌ Error in CUE search:", cueError)
        } else if (cueMatches && cueMatches.length > 0) {
          console.log("✅ Found exact CUE match:", cueMatches.length)
          return await processSchoolResults(cueMatches)
        }
      }
      // 6 digits exactly → search by predio
      else if (/^\d{6}$/.test(cleanTerm)) {
        console.log("🏢 6 digits detected - searching by predio:", cleanTerm)
        const { data: predioMatches, error: predioError } = await baseQuery.eq("predio", Number.parseInt(cleanTerm))

        if (predioError) {
          console.error("❌ Error in predio search:", predioError)
        } else if (predioMatches && predioMatches.length > 0) {
          console.log("✅ Found predio matches:", predioMatches.length)
          return await processSchoolResults(predioMatches)
        }
      }
      // 1 to 3 digits → search by name using exact number matching
      else if (/^\d{1,3}$/.test(cleanTerm)) {
        console.log("🔍 1-3 digits detected - searching in school names with exact matching:", cleanTerm)
        const { data: nameMatches, error: nameError } = await baseQuery.ilike("nombre", `%${cleanTerm}%`)

        if (nameError) {
          console.error("❌ Error in name search:", nameError)
        } else if (nameMatches && nameMatches.length > 0) {
          // Filter for exact number matches using word boundaries
          const exactMatches = nameMatches.filter((school) => {
            const numbersInName = school.nombre.match(/\b\d+\b/g) || []
            return numbersInName.includes(cleanTerm)
          })

          console.log(`✅ Found ${exactMatches.length} exact matches out of ${nameMatches.length} total matches`)
          return await processSchoolResults(exactMatches.length > 0 ? exactMatches : nameMatches)
        }
      }

      // If no matches found for any digit-based search, continue to text search
      console.log("❌ No matches found with digit-based logic")
    }

    // 2. Check for specific school patterns with exact matching
    const schoolPattern = extractSchoolPattern(cleanTerm)
    if (schoolPattern) {
      console.log("🏫 Searching for school pattern:", schoolPattern)

      const { type, number } = schoolPattern

      if (number) {
        // Search for specific school with number (e.g., "tecnica 1")
        const { data: patternMatches, error: patternError } = await baseQuery.ilike("nombre", `%${type}%${number}%`)

        if (!patternError && patternMatches && patternMatches.length > 0) {
          console.log(`🔍 Found ${patternMatches.length} potential pattern matches, filtering for exact matches...`)

          // Filter for exact matches only
          const exactMatches = patternMatches.filter((school) => isExactSchoolMatch(school.nombre, type, number))

          console.log(`✅ Found ${exactMatches.length} exact pattern matches`)

          if (exactMatches.length > 0) {
            return await processSchoolResults(exactMatches)
          }
        }
      } else {
        // NEW: Search for any school of this type (e.g., just "tecnica")
        console.log(`🔍 Searching for any school of type: ${type}`)
        const { data: typeMatches, error: typeError } = await baseQuery.ilike("nombre", `%${type}%`)

        if (!typeError && typeMatches && typeMatches.length > 0) {
          console.log(`✅ Found ${typeMatches.length} schools of type ${type}`)
          return await processSchoolResults(typeMatches)
        }
      }
    }

    // 3. Enhanced text search with fallback strategy
    console.log("📝 Performing enhanced text search for:", cleanTerm)
    const normalizedTerm = normalizeText(cleanTerm)

    // Split search term into words for better matching
    const searchWords = normalizedTerm.split(/\s+/).filter((word) => word.length > 0)

    if (searchWords.length === 0) {
      return []
    }

    // Create search conditions for each word using safe ILIKE
    let textQuery = baseQuery

    if (searchWords.length === 1) {
      const word = searchWords[0]
      textQuery = textQuery.ilike("nombre", `%${word}%`)
    } else {
      // For multiple words, use AND logic with ILIKE
      let currentQuery = baseQuery
      for (const word of searchWords) {
        currentQuery = currentQuery.ilike("nombre", `%${word}%`)
      }
      textQuery = currentQuery
    }

    const { data: textMatches, error: textError } = await textQuery.order("nombre").limit(50)

    if (textError) {
      console.warn("❌ Error in text search:", textError)

      // Fallback: Try a simpler search with the original term
      console.log("🔄 Trying fallback search with original term")
      const { data: fallbackMatches, error: fallbackError } = await baseQuery
        .ilike("nombre", `%${cleanTerm}%`)
        .order("nombre")
        .limit(50)

      if (!fallbackError && fallbackMatches && fallbackMatches.length > 0) {
        console.log("✅ Fallback search results:", fallbackMatches.length)
        return await processSchoolResults(fallbackMatches)
      }

      return []
    }

    console.log("✅ Text search results:", textMatches?.length || 0)

    if (textMatches && textMatches.length > 0) {
      // Sort results by relevance (exact matches first)
      const sortedResults = textMatches.sort((a, b) => {
        const aName = normalizeText(a.nombre)
        const bName = normalizeText(b.nombre)

        // Exact match gets highest priority
        if (aName === normalizedTerm && bName !== normalizedTerm) return -1
        if (bName === normalizedTerm && aName !== normalizedTerm) return 1

        // Starts with search term gets second priority
        if (aName.startsWith(normalizedTerm) && !bName.startsWith(normalizedTerm)) return -1
        if (bName.startsWith(normalizedTerm) && !aName.startsWith(normalizedTerm)) return 1

        // Alphabetical order for the rest
        return a.nombre.localeCompare(b.nombre)
      })

      return await processSchoolResults(sortedResults)
    }

    console.log("❌ No results found")
    return []
  } catch (error) {
    console.error("❌ Search error:", error)
    return []
  }
}

// Helper function to process results and add educational programs
async function processSchoolResults(schools: any[]): Promise<School[]> {
  console.log("🔄 Processing", schools.length, "results")

  try {
    // Transform data - initialize with empty programs
    const results = schools.map((school) => ({
      ...school,
      contacto: school.contactos?.[0] || null,
      programas_educativos: [], // Will be populated below
      sharedPredioSchools: [] as { id: string; nombre: string; cue: number }[],
    }))

    // Fetch educational programs for each school
    for (let i = 0; i < results.length; i++) {
      const school = results[i]

      try {
        console.log(`📚 Fetching programs for CUE ${school.cue}...`)

        const { data: programas, error: programasError } = await supabase
          .from("programas_x_cue")
          .select("programa")
          .eq("cue", school.cue)

        if (programasError) {
          console.error(`⚠️ Error fetching programs for CUE ${school.cue}:`, programasError)
          results[i].programas_educativos = []
        } else {
          results[i].programas_educativos = programas || []
          console.log(
            `✅ School "${school.nombre}" (CUE: ${school.cue}) has ${programas?.length || 0} programs:`,
            programas?.map((p) => p.programa) || [],
          )
        }
      } catch (error) {
        console.error(`❌ Error querying programs for CUE ${school.cue}:`, error)
        results[i].programas_educativos = []
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
          console.log(
            `🏢 School "${school.nombre}" shares predio ${school.predio} with ${sharedSchools.length} other schools`,
          )
        }
      } catch (error) {
        console.error("⚠️ Error finding shared predios for school", school.id, error)
      }
    }

    console.log("✅ Processed results successfully")
    return results
  } catch (error) {
    console.error("❌ Error processing results:", error)
    return []
  }
}

// Function to search school by CUE
export async function searchSchoolByCUE(cue: number): Promise<School | null> {
  console.log("🔍 Searching school by CUE:", cue)

  try {
    const { data, error } = await supabase
      .from("establecimientos")
      .select(`
      *,
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

    if (error || !data) {
      console.error("❌ Error searching school by CUE:", error)
      return null
    }

    console.log("✅ Found school by CUE:", data.nombre)
    const processedResults = await processSchoolResults([data])
    return processedResults[0] || null
  } catch (error) {
    console.error("❌ Error in searchSchoolByCUE:", error)
    return null
  }
}

function processResults(data: any[]): School[] {
  return data
}
