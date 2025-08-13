"use client"

import { useEffect, useRef } from "react"
import { X, MapPin, Phone, Mail, Globe, Building2, Calendar, Wifi, ExternalLink } from "lucide-react"
import type { School } from "@/lib/types"

interface SchoolDetailsProps {
  school: School
  onClose: () => void
}

export default function SchoolDetails({ school, onClose }: SchoolDetailsProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#417099] to-[#00AEC3] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold pr-12">{school.nombre}</h2>
          <div className="flex items-center gap-4 mt-2 text-white/90">
            <span>CUE: {school.cue}</span>
            {school.predio && <span>Predio: {school.predio}</span>}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información General</h3>

                {school.tipo_establecimiento && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-[#417099] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Tipo de establecimiento</p>
                      <p className="font-medium">{school.tipo_establecimiento}</p>
                    </div>
                  </div>
                )}

                {school.distrito && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#00AEC3] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Distrito</p>
                      <p className="font-medium">{school.distrito}</p>
                    </div>
                  </div>
                )}

                {school.direccion && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#00AEC3] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium">{school.direccion}</p>
                      {school.ciudad && <p className="text-sm">{school.ciudad}</p>}
                    </div>
                  </div>
                )}

                {school.ambito && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#e81f76] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Ámbito</p>
                      <p className="font-medium">{school.ambito}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contacto y Responsables</h3>

                {school.fed_a_cargo && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-[#417099] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">FED a cargo</p>
                      <p className="font-medium">{school.fed_a_cargo}</p>
                    </div>
                  </div>
                )}

                {school.contacto && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#e81f76] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Contacto principal</p>
                        <p className="font-medium">
                          {school.contacto.nombre} {school.contacto.apellido}
                        </p>
                        {school.contacto.cargo && <p className="text-sm text-gray-600">{school.contacto.cargo}</p>}
                      </div>
                    </div>

                    {school.contacto.telefono && (
                      <div className="flex items-start gap-3 ml-8">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm">{school.contacto.telefono}</p>
                      </div>
                    )}

                    {school.contacto.correo && (
                      <div className="flex items-start gap-3 ml-8">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm">{school.contacto.correo}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Connectivity Info */}
            {(school.proveedor_internet_pnce || school.estado_instalacion_pba) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Conectividad</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {school.proveedor_internet_pnce && (
                    <div className="flex items-start gap-3">
                      <Wifi className="w-5 h-5 text-[#00AEC3] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Proveedor Internet</p>
                        <p className="font-medium">{school.proveedor_internet_pnce}</p>
                      </div>
                    </div>
                  )}
                  {school.fecha_instalacion_pnce && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#417099] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Fecha instalación</p>
                        <p className="font-medium">{school.fecha_instalacion_pnce}</p>
                      </div>
                    </div>
                  )}
                  {school.estado_instalacion_pba && (
                    <div className="flex items-start gap-3">
                      <Wifi className="w-5 h-5 text-[#e81f76] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Estado instalación</p>
                        <p className="font-medium">{school.estado_instalacion_pba}</p>
                      </div>
                    </div>
                  )}
                  {school.mb && (
                    <div className="flex items-start gap-3">
                      <Wifi className="w-5 h-5 text-[#00AEC3] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Velocidad</p>
                        <p className="font-medium">{school.mb} MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Infrastructure Info */}
            {(school.plan_piso_tecnologico || school.tipo_piso_instalado || school.proveedor_piso_tecnologico_cue) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Infraestructura Tecnológica</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {school.plan_piso_tecnologico && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#417099] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Plan Piso Tecnológico</p>
                        <p className="font-medium">{school.plan_piso_tecnologico}</p>
                      </div>
                    </div>
                  )}
                  {school.tipo_piso_instalado && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#00AEC3] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Tipo de Piso Instalado</p>
                        <p className="font-medium">{school.tipo_piso_instalado}</p>
                      </div>
                    </div>
                  )}
                  {school.proveedor_piso_tecnologico_cue && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#e81f76] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Proveedor Piso Tecnológico</p>
                        <p className="font-medium">{school.proveedor_piso_tecnologico_cue}</p>
                      </div>
                    </div>
                  )}
                  {school.fecha_terminado_piso_tecnologico_cue && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#417099] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Fecha Terminado</p>
                        <p className="font-medium">{school.fecha_terminado_piso_tecnologico_cue}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Details */}
            {(school.plan_enlace || school.subplan_enlace || school.recurso_primario || school.access_id) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Adicional</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {school.plan_enlace && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-[#417099] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Plan Enlace</p>
                        <p className="font-medium">{school.plan_enlace}</p>
                      </div>
                    </div>
                  )}
                  {school.subplan_enlace && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-[#00AEC3] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Subplan Enlace</p>
                        <p className="font-medium">{school.subplan_enlace}</p>
                      </div>
                    </div>
                  )}
                  {school.recurso_primario && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#e81f76] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Recurso Primario</p>
                        <p className="font-medium">{school.recurso_primario}</p>
                      </div>
                    </div>
                  )}
                  {school.access_id && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#417099] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Access ID</p>
                        <p className="font-medium">{school.access_id}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Info */}
            {school.lat && school.lon && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ubicación</h3>
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Coordenadas</p>
                      <p className="font-medium text-gray-900">
                        {school.lat.toFixed(6)}, {school.lon.toFixed(6)}
                      </p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${school.lat},${school.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#417099] text-white rounded-lg hover:bg-[#365d80] transition-colors"
                      aria-label="Abrir ubicación en Google Maps"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Ver en Google Maps</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {school.observaciones && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Observaciones</h3>
                <p className="text-gray-700">{school.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
