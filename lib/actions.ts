"use server"

import { supabase } from "@/lib/supabase/client"
import type { School } from "./types"

export async function searchSchoolByCUE(cue: number): Promise<School | null> {
  try {
    const { data, error } = await supabase
      .from("establecimientos")
      .select(`
        *,
        contactos!left(id, nombre, apellido, cargo, telefono, correo)
      `)
      .eq("cue", cue)
      .single()

    if (error || !data) return null

    return {
      ...data,
      contacto: data.contactos?.[0] || null,
      programas_educativos: [],
      sharedPredioSchools: [],
    }
  } catch (error) {
    console.error("Error in searchSchoolByCUE:", error)
    return null
  }
}