"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import { X, Save, Loader2, User, Phone, Mail, Briefcase, AlertTriangle, MapPin, Navigation } from "lucide-react"
import type { Contact } from "@/lib/types"
import { useContactEdit } from "@/hooks/use-contact-edit"

interface ContactEditModalProps {
  cue: number
  schoolName: string
  contact: Contact | null | undefined
  direccion: string | null | undefined
  lat: number | null | undefined
  lon: number | null | undefined
  onClose: () => void
  onSaved: (updatedContact: Contact, nuevaDireccion: string, nuevaLat: number | null, nuevaLon: number | null) => void
}

interface FieldProps {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ icon, label, value, onChange, placeholder, type = "text" }, ref) => (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
        <span className="text-[#00AEC3]">{icon}</span>
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AEC3] focus:border-transparent transition-all"
      />
    </div>
  )
)
Field.displayName = "Field"

export function ContactEditModal({
  cue,
  schoolName,
  contact,
  direccion,
  lat,
  lon,
  onClose,
  onSaved,
}: ContactEditModalProps) {
  const firstInputRef = useRef<HTMLInputElement>(null)
  const { saving, error, saveContact } = useContactEdit()

  const [form, setForm] = useState({
    nombre: contact?.nombre ?? "",
    apellido: contact?.apellido ?? "",
    cargo: contact?.cargo ?? "",
    telefono: contact?.telefono ?? "",
    correo: contact?.correo ?? "",
    direccion: direccion ?? "",
    lat: lat?.toString() ?? "",
    lon: lon?.toString() ?? "",
  })

  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 80)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await saveContact(cue, contact?.id ?? null, form)
    if (result) {
      const nuevaLat = form.lat.trim() ? parseFloat(form.lat.trim()) : null
      const nuevaLon = form.lon.trim() ? parseFloat(form.lon.trim()) : null
      onSaved(result, form.direccion.trim().toUpperCase(), nuevaLat, nuevaLon)
    }
  }

  const isValid = !!(form.nombre.trim() || form.apellido.trim())

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-edit-title"
        className="fixed z-[70] inset-0 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#417099] to-[#00AEC3] px-6 py-4 flex items-start justify-between">
            <div>
              <h2
                id="contact-edit-title"
                className="text-white font-bold text-lg leading-tight"
              >
                {contact ? "Editar contacto" : "Agregar contacto"}
              </h2>
              <p className="text-white/70 text-sm mt-0.5 truncate max-w-[260px]">{schoolName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Sección establecimiento */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gray-700" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Establecimiento</span>
                <div className="h-px flex-1 bg-gray-700" />
              </div>
              <Field
                ref={firstInputRef}
                icon={<MapPin className="w-4 h-4" />}
                label="Dirección"
                value={form.direccion}
                onChange={handleChange("direccion")}
                placeholder="CALLE 123 E/ 456 Y 789"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  icon={<Navigation className="w-4 h-4" />}
                  label="Latitud"
                  value={form.lat}
                  onChange={handleChange("lat")}
                  placeholder="-34.921453"
                  type="number"
                />
                <Field
                  icon={<Navigation className="w-4 h-4" />}
                  label="Longitud"
                  value={form.lon}
                  onChange={handleChange("lon")}
                  placeholder="-57.954453"
                  type="number"
                />
              </div>
            </div>

            {/* Sección contacto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-700" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Contacto</span>
                <div className="h-px flex-1 bg-gray-700" />
              </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                icon={<User className="w-4 h-4" />}
                label="Nombre"
                value={form.nombre}
                onChange={handleChange("nombre")}
                placeholder="MARÍA"
              />
              <Field
                icon={<User className="w-4 h-4" />}
                label="Apellido"
                value={form.apellido}
                onChange={handleChange("apellido")}
                placeholder="GONZÁLEZ"
              />
            </div>

            <Field
              icon={<Briefcase className="w-4 h-4" />}
              label="Cargo"
              value={form.cargo}
              onChange={handleChange("cargo")}
              placeholder="Directora / Director"
            />

            <Field
              icon={<Phone className="w-4 h-4" />}
              label="Teléfono"
              value={form.telefono}
              onChange={handleChange("telefono")}
              placeholder="221XXXXXXX"
              type="tel"
            />

            <Field
              icon={<Mail className="w-4 h-4" />}
              label="Correo electrónico"
              value={form.correo}
              onChange={handleChange("correo")}
              placeholder="contacto@abc.gob.ar"
              type="email"
            />

            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !isValid}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#417099] to-[#00AEC3] text-white font-semibold text-sm hover:from-[#365d80] hover:to-[#00a0b8] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
