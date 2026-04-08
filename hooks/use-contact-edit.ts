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
        if (existingContactId) {
          const { data: updated, error: updateError } = await supabase
            .from("contactos")
            .update({
              nombre: data.nombre.trim(),
              apellido: data.apellido.trim(),
              cargo: data.cargo.trim(),
              telefono: data.telefono.trim(),
              correo: data.correo.trim(),
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
              nombre: data.nombre.trim(),
              apellido: data.apellido.trim(),
              cargo: data.cargo.trim(),
              telefono: data.telefono.trim(),
              correo: data.correo.trim(),
            })
            .select()
            .single()

          if (insertError) throw new Error(insertError.message)
          return inserted as Contact
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar contacto"
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
