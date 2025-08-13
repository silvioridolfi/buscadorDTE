"use client"

import React from "react"

import { useEffect, useRef } from "react"
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Calendar,
  Wifi,
  ChevronRight,
  ExternalLink,
  User,
  Info,
  FileText,
  Network,
  Layers,
  AlertTriangle,
  Share2,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  Award,
} from "lucide-react"
import type { School } from "@/lib/types"

interface SchoolDetailsSidebarProps {
  school: School | null
  isOpen: boolean
  onClose: () => void
  onNavigateToSchool: (cue: number) => void
}

export default function SchoolDetailsSidebar({
  school,
  isOpen,
  onClose,
  onNavigateToSchool,
}: SchoolDetailsSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Helper function to render a field if it exists
  const renderField = (
    label: string,
    value: string | number | null | undefined,
    icon: React.ReactNode,
    iconBgColor: string,
    iconColor: string,
  ) => {
    if (!value) return null
    return (
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
          {React.cloneElement(icon as React.ReactElement, { className: `w-4 h-4 ${iconColor}` })}
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="font-medium text-gray-200">{value}</p>
        </div>
      </div>
    )
  }

  if (!school) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-screen w-full sm:w-[450px] md:w-[600px] bg-gray-900 shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Detalles de la escuela"
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-[#417099] to-[#00AEC3] text-white p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Cerrar panel de detalles"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold pr-12 mb-3">{school.nombre}</h2>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
              CUE: {school.cue}
            </span>
            {school.predio && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                Predio: {school.predio}
              </span>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-6 pb-24 space-y-8">
            {/* Location Info */}
            {school.lat && school.lon && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#00AEC3]" />
                      Ubicación
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Coordenadas</p>
                      <p className="text-gray-200 font-medium">
                        {school.lat.toFixed(6)}, {school.lon.toFixed(6)}
                      </p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${school.lat},${school.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#417099] text-white rounded-lg hover:bg-[#365d80] transition-colors text-sm"
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

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00AEC3]" />
                Información General
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {renderField(
                  "Tipo de establecimiento",
                  school.tipo_establecimiento,
                  <Building2 />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField("Distrito", school.distrito, <MapPin />, "bg-[#00AEC3]/20", "text-[#00AEC3]")}
                {renderField("Ciudad", school.ciudad, <MapPin />, "bg-[#00AEC3]/20", "text-[#00AEC3]")}
                {renderField("Dirección", school.direccion, <MapPin />, "bg-[#00AEC3]/20", "text-[#00AEC3]")}
                {renderField("Ámbito", school.ambito, <Globe />, "bg-[#e81f76]/20", "text-[#e81f76]")}
                {renderField("Tipo", school.tipo, <Info />, "bg-[#417099]/20", "text-[#00AEC3]")}
                {renderField("CUE Anterior", school.cue_anterior, <FileText />, "bg-[#e81f76]/20", "text-[#e81f76]")}
              </div>
            </div>

            {/* Educational Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#00AEC3]" />
                Información Educativa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField("Nivel", school.nivel, <GraduationCap />, "bg-[#00AEC3]/20", "text-[#00AEC3]")}
                {renderField("Modalidad", school.modalidad, <BookOpen />, "bg-[#417099]/20", "text-[#00AEC3]")}
                {renderField(
                  "Matrícula",
                  school.matricula ? `${school.matricula} estudiantes` : null,
                  <Users />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField("Varones", school.varones, <Users />, "bg-[#00AEC3]/20", "text-[#00AEC3]")}
                {renderField("Mujeres", school.mujeres, <Users />, "bg-[#00AEC3]/20", "text-[#00AEC3]")}
                {renderField("Secciones", school.secciones, <Building2 />, "bg-[#417099]/20", "text-[#00AEC3]")}
                {renderField("Turnos", school.turnos, <Clock />, "bg-[#e81f76]/20", "text-[#e81f76]")}
              </div>
            </div>

            {/* Educational Programs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#e81f76]" />
                Programas Educativos
              </h3>
              {school.programas_educativos && school.programas_educativos.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 mb-3">
                    Esta escuela participa en {school.programas_educativos.length} programa
                    {school.programas_educativos.length !== 1 ? "s" : ""} educativo
                    {school.programas_educativos.length !== 1 ? "s" : ""}:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {school.programas_educativos.map((programa, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-[#e81f76]/10 border border-[#e81f76]/20 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#e81f76]/20 flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-[#e81f76]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-200">{programa.programa}</p>
                          <p className="text-xs text-gray-400 mt-1">Programa educativo registrado</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Sin datos de programas educativos</p>
                    <p className="text-xs text-gray-500 mt-1">
                      No se encontraron programas registrados para esta escuela
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Shared Predio Info */}
            {school.predio && school.sharedPredioSchools && school.sharedPredioSchools.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-amber-400" />
                  Predio Compartido
                </h3>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-300 mb-3">
                    Este predio (#{school.predio}) es compartido con {school.sharedPredioSchools.length} establecimiento
                    {school.sharedPredioSchools.length !== 1 ? "s" : ""} más:
                  </p>
                  <ul className="space-y-3">
                    {school.sharedPredioSchools.map((sharedSchool) => (
                      <li key={sharedSchool.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-200">{sharedSchool.nombre}</p>
                          <p className="text-sm text-gray-400">
                            CUE:{" "}
                            <button
                              onClick={() => onNavigateToSchool(sharedSchool.cue)}
                              className="text-[#00AEC3] hover:text-[#00c8e0] underline font-medium transition-colors"
                              aria-label={`Ver detalles del establecimiento con CUE ${sharedSchool.cue}`}
                            >
                              {sharedSchool.cue}
                            </button>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#e81f76]" />
                Contacto y Responsables
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {renderField("FED a cargo", school.fed_a_cargo, <User />, "bg-[#417099]/20", "text-[#00AEC3]")}

                {school.contacto && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e81f76]/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-[#e81f76]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          {school.contacto.cargo || "Contacto principal"}
                        </p>
                        <p className="font-medium text-gray-200">
                          {school.contacto.nombre} {school.contacto.apellido}
                        </p>
                      </div>
                    </div>

                    {school.contacto.telefono && (
                      <div className="flex items-start gap-3 ml-11">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <p className="text-gray-300">{school.contacto.telefono}</p>
                      </div>
                    )}

                    {school.contacto.correo && (
                      <div className="flex items-start gap-3 ml-11">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <p className="text-gray-300">{school.contacto.correo}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Connectivity Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-[#00AEC3]" />
                Conectividad
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {renderField(
                  "Proveedor Internet PNCE",
                  school.proveedor_internet_pnce,
                  <Wifi />,
                  "bg-[#00AEC3]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Fecha instalación PNCE",
                  school.fecha_instalacion_pnce,
                  <Calendar />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Estado instalación PBA",
                  school.estado_instalacion_pba,
                  <Wifi />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField(
                  "Velocidad",
                  school.mb ? `${school.mb} MB` : null,
                  <Wifi />,
                  "bg-[#00AEC3]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Proveedor Internet PBA 2019",
                  school.pba_2019_proveedor_internet,
                  <Network />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Fecha instalación PBA 2019",
                  school.pba_2019_fecha_instalacion,
                  <Calendar />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Estado PBA 2019",
                  school.pba_2019_estado,
                  <AlertTriangle />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField(
                  "Proveedor Internet Grupo 2A",
                  school.pba_grupo_2_a_proveedor_internet,
                  <Network />,
                  "bg-[#00AEC3]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Fecha instalación Grupo 2A",
                  school.pba_grupo_2_a_fecha_instalacion,
                  <Calendar />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Tipo mejora Grupo 2A",
                  school.pba_grupo_2_a_tipo_mejora,
                  <Layers />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField(
                  "Fecha mejora Grupo 2A",
                  school.pba_grupo_2_a_fecha_mejora,
                  <Calendar />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Estado Grupo 2A",
                  school.pba_grupo_2_a_estado,
                  <AlertTriangle />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField(
                  "Proveedor Internet Grupo 1",
                  school.pba_grupo_1_proveedor_internet,
                  <Network />,
                  "bg-[#00AEC3]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Fecha instalación Grupo 1",
                  school.pba_grupo_1_fecha_instalacion,
                  <Calendar />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Estado Grupo 1",
                  school.pba_grupo_1_estado,
                  <AlertTriangle />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField(
                  "Listado conexión internet",
                  school.listado_conexion_internet,
                  <FileText />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Proveedor asignado PBA",
                  school.proveedor_asignado_pba,
                  <Network />,
                  "bg-[#00AEC3]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Fecha inicio conectividad",
                  school.fecha_inicio_conectividad,
                  <Calendar />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "PNCE tipo mejora",
                  school.pnce_tipo_mejora,
                  <Layers />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField(
                  "PNCE fecha mejora",
                  school.pnce_fecha_mejora,
                  <Calendar />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField("PNCE estado", school.pnce_estado, <AlertTriangle />, "bg-[#e81f76]/20", "text-[#e81f76]")}
                {renderField(
                  "Reclamos grupo 1 ANI",
                  school.reclamos_grupo_1_ani,
                  <AlertTriangle />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
              </div>
            </div>

            {/* Infrastructure Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#417099]" />
                Infraestructura Tecnológica
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {renderField(
                  "Plan Piso Tecnológico",
                  school.plan_piso_tecnologico,
                  <Building2 />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Tipo Piso Instalado",
                  school.tipo_piso_instalado,
                  <Building2 />,
                  "bg-[#00AEC3]/20",
                  "text-[#00AEC3]",
                )}
                {renderField(
                  "Proveedor Piso Tecnológico",
                  school.proveedor_piso_tecnologico_cue,
                  <Building2 />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField(
                  "Fecha Terminado Piso Tecnológico",
                  school.fecha_terminado_piso_tecnologico_cue,
                  <Calendar />,
                  "bg-[#417099]/20",
                  "text-[#00AEC3]",
                )}
                {renderField("Tipo Mejora", school.tipo_mejora, <Layers />, "bg-[#e81f76]/20", "text-[#e81f76]")}
                {renderField("Fecha Mejora", school.fecha_mejora, <Calendar />, "bg-[#417099]/20", "text-[#00AEC3]")}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#e81f76]" />
                Información Adicional
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {renderField("Plan Enlace", school.plan_enlace, <Globe />, "bg-[#417099]/20", "text-[#00AEC3]")}
                {renderField("Subplan Enlace", school.subplan_enlace, <Globe />, "bg-[#00AEC3]/20", "text-[#00AEC3]")}
                {renderField(
                  "Recurso Primario",
                  school.recurso_primario,
                  <Building2 />,
                  "bg-[#e81f76]/20",
                  "text-[#e81f76]",
                )}
                {renderField("Access ID", school.access_id, <Building2 />, "bg-[#417099]/20", "text-[#00AEC3]")}
              </div>
            </div>

            {/* Observations */}
            {school.observaciones && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-[#417099]" />
                  Observaciones
                </h3>
                <p className="text-gray-300 whitespace-pre-line">{school.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
