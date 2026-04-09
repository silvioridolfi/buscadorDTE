"use client"

import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Contact } from "@/lib/types"

interface ContactFormData {
  nombre: string
  apellido: string
  cargo: string
  telefono: string
  correo: string
  direccion: string
  lat: string
  lon: string
}

interface UseContactEditReturn {
  saving: boolean
  error: string | null
  saveContact: (
    cue: number,
    existingContactId: string | null,
    data: ContactFormData
  ) => Promise<Contact | null>
}

export function useContactEdit(): UseContactEditReturn {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveContact = useCallback(
    async (
      cue: number,
      existingContactId: string | null,
      data: ContactFormData
    ): Promise<Contact | null> => {
      setSaving(true)
      setError(null)

      try {
        // Actualizar dirección en establecimientos (siempre)
        const { error: direccionError } = await supabase
          .from("establecimientos")
          .update({
            direccion: data.direccion.trim().toUpperCase(),
            lat: data.lat.trim() ? parseFloat(data.lat.trim()) : null,
            lon: data.lon.trim() ? parseFloat(data.lon.trim()) : null,
          })
          .eq("cue", cue)

        if (direccionError) throw new Error(`Error al actualizar dirección: ${direccionError.message}`)

        // Contacto: UPDATE o INSERT
        if (existingContactId) {
          const { data: updated, error: updateError } = await supabase
            .from("contactos")
            .update({
              nombre: data.nombre.trim().toUpperCase(),
              apellido: data.apellido.trim().toUpperCase(),
              cargo: data.cargo.trim().toUpperCase(),
              telefono: data.telefono.trim(),
              correo: data.correo.trim().toLowerCase(),
            })
            .eq("id", existingContactId)
            .select()
            .single()

          if (updateError) throw new Error(updateError.message)
          return updated as Contact
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from("contactos")
            .insert({
              cue,
              nombre: data.nombre.trim().toUpperCase(),
              apellido: data.apellido.trim().toUpperCase(),
              cargo: data.cargo.trim().toUpperCase(),
              telefono: data.telefono.trim(),
              correo: data.correo.trim().toLowerCase(),
            })
            .select()
            .single()

          if (insertError) throw new Error(insertError.message)
          return inserted as Contact
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar"
        setError(msg)
        return null
      } finally {
        setSaving(false)
      }
    },
    []
  )

  return { saving, error, saveContact }
}
