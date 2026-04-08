"use client"

import { useState } from "react"
import {
  MapPin, Phone, User, Building, ArrowRight, Share2, Users,
  GraduationCap, Clock, Award, AlertTriangle, Hash, Home, X, Pencil,
} from "lucide-react"
import type { School } from "@/lib/types"
import type { Contact } from "@/lib/types"
import { isContextoEncierro, isEscuelaCerrada } from "@/lib/utils"
import { ContactEditModal } from "./contact-edit-modal"

interface SchoolCardOptimizedProps {
  school: School
  onViewDetails: () => void
}

export default function SchoolCardOptimized({ school, onViewDetails }: SchoolCardOptimizedProps) {
  const [editingContact, setEditingContact] = useState(false)
  const [localContact, setLocalContact] = useState<Contact | null | undefined>(school.contacto)

  const handleContactSaved = (updatedContact: Contact) => {
    setLocalContact(updatedContact)
    setEditingContact(false)
  }

  const hasSharedPredio = school.sharedPredioSchools && school.sharedPredioSchools.length > 0
  const hasPrograms = school.programas_educativos && school.programas_educativos.length > 0

  const formatLocation = () => {
    const ciudad = school.ciudad?.trim()
    const distrito = school.distrito?.trim()
    if (!ciudad && !distrito) return null
    if (!ciudad) return distrito
    if (!distrito) return ciudad
    if (ciudad.toLowerCase() === distrito.toLowerCase()) return ciudad
    return `${ciudad} (${distrito})`
  }

  const location = formatLocation()
  const hasFED = school.fed_a_cargo && school.fed_a_cargo !== "Sin FED a cargo"
  const contextEncierro = isContextoEncierro(school.plan_enlace)
  const escuelaCerrada = isEscuelaCerrada(school.plan_enlace)

  return (
    <>
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group border border-gray-700 h-full flex flex-col hover:scale-[1.02]">
      <div className="p-6 space-y-4 flex-1">
        <div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00AEC3] transition-colors duration-200 leading-tight">
            {school.nombre}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#417099]/20 border border-[#417099]/30">
            <Hash className="w-3.5 h-3.5 text-[#00AEC3]" />
            <span className="text-xs font-medium text-[#00AEC3]">CUE: {school.cue}</span>
          </div>
          {school.predio && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00AEC3]/20 border border-[#00AEC3]/30">
              <Building className="w-3.5 h-3.5 text-[#00AEC3]" />
              <span className="text-xs font-medium text-[#00AEC3]">Predio: {school.predio}</span>
            </div>
          )}
          {contextEncierro && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 text-white border border-yellow-600">
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-medium text-white">Contexto de encierro</span>
            </div>
          )}
          {escuelaCerrada && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white border border-red-600">
              <X className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-medium text-white">Escuela cerrada</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {school.direccion && (
            <div className="flex items-start gap-2">
              <Home className="w-4 h-4 text-[#00AEC3] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">DIRECCIÓN</p>
                <p className="text-base font-semibold text-white">{school.direccion}</p>
              </div>
            </div>
          )}
          {location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#00AEC3] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">LOCALIDAD</p>
                <p className="text-base font-semibold text-white">{location}</p>
              </div>
            </div>
          )}
        </div>

        {(school.nivel || school.modalidad) && (
          <div className="flex items-start gap-2">
            <GraduationCap className="w-4 h-4 text-[#417099] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">NIVEL Y MODALIDAD</p>
              <p className="text-base font-semibold text-white">
                {school.nivel && school.modalidad
                  ? `${school.nivel} • ${school.modalidad}`
                  : school.nivel || school.modalidad}
              </p>
            </div>
          </div>
        )}

        {(school.matricula || school.secciones) && (
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-[#e81f76] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">MATRÍCULA Y SECCIONES</p>
              <p className="text-base font-semibold text-white">
                {school.matricula && school.secciones
                  ? `${school.matricula} estudiantes – ${school.secciones} secciones`
                  : school.matricula
                    ? `${school.matricula} estudiantes`
                    : `${school.secciones} secciones`}
              </p>
            </div>
          </div>
        )}

        {(school.varones || school.mujeres) && (
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-[#00AEC3] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">DISTRIBUCIÓN POR GÉNERO</p>
              <p className="text-base font-semibold text-white">
                {school.varones && school.mujeres
                  ? `♂ ${school.varones} varones – ♀ ${school.mujeres} mujeres`
                  : school.varones
                    ? `♂ ${school.varones} varones`
                    : `♀ ${school.mujeres} mujeres`}
              </p>
            </div>
          </div>
        )}

        {school.turnos && (
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-[#417099] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">TURNOS</p>
              <p className="text-base font-semibold text-white">{school.turnos}</p>
            </div>
          </div>
        )}

        {hasSharedPredio && (
          <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Share2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">PREDIO COMPARTIDO</p>
                <p className="text-sm font-medium text-amber-300 mb-2">
                  Comparte predio con {school.sharedPredioSchools!.length} establecimiento
                  {school.sharedPredioSchools!.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-1">
                  {school.sharedPredioSchools!.map((sharedSchool) => (
                    <div key={sharedSchool.id} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 mr-2 flex-shrink-0"></span>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{sharedSchool.nombre}</p>
                        <p className="text-xs text-gray-400">CUE: {sharedSchool.cue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-[#417099] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide">FED A CARGO</p>
            {hasFED ? (
              <p className="text-base font-semibold text-white">{school.fed_a_cargo}</p>
            ) : (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-base font-semibold text-red-300">Sin FED a cargo</p>
              </div>
            )}
          </div>
        </div>

        {/* Bloque de contacto con botón editar */}
        <div className="p-3 bg-gray-800/40 border border-gray-700/60 rounded-xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <Phone className="w-4 h-4 text-[#e81f76] mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-400 uppercase tracking-wide">
                  {localContact?.cargo || "CONTACTO PRINCIPAL"}
                </p>
                {localContact ? (
                  <>
                    <p className="text-base font-semibold text-white truncate">
                      {localContact.nombre} {localContact.apellido}
                    </p>
                    {localContact.telefono && (
                      <p className="text-sm text-gray-300 mt-0.5">{localContact.telefono}</p>
                    )}
                    {localContact.correo && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{localContact.correo}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">Sin contacto registrado</p>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditingContact(true)
              }}
              className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#417099]/20 border border-[#417099]/40 text-[#00AEC3] hover:bg-[#417099]/40 hover:border-[#00AEC3]/60 transition-all duration-200 text-xs font-medium"
              title={localContact ? "Editar contacto" : "Agregar contacto"}
              aria-label={localContact ? "Editar datos de contacto" : "Agregar contacto"}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{localContact ? "Editar" : "Agregar"}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#e81f76]" />
            <p className="text-sm text-gray-400 uppercase tracking-wide">PROGRAMAS EDUCATIVOS</p>
          </div>
          {hasPrograms ? (
            <div className="flex flex-wrap gap-1.5">
              {school.programas_educativos!.slice(0, 3).map((programa, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#e81f76]/20 text-[#e81f76] border border-[#e81f76]/30"
                >
                  {programa.programa}
                </span>
              ))}
              {school.programas_educativos!.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600">
                  +{school.programas_educativos!.length - 3} más
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Sin programas registrados</p>
          )}
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-600">
            DGCyE • Provincia de Buenos Aires
          </span>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="w-full py-4 px-6 bg-gradient-to-r from-[#417099] to-[#00AEC3] text-white font-semibold hover:from-[#365d80] hover:to-[#00a0b8] transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
        aria-label={`Ver detalles de ${school.nombre}`}
      >
        <span>Ver detalles completos</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>

      {editingContact && (
        <ContactEditModal
          cue={school.cue}
          schoolName={school.nombre}
          contact={localContact}
          onClose={() => setEditingContact(false)}
          onSaved={handleContactSaved}
        />
      )}
    </>
  )
}