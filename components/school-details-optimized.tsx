"use client"

import { useEffect, useRef, useState } from "react"
import {
  X,
  MapPin,
  Phone,
  Mail,
  Building2,
  User,
  GraduationCap,
  Users,
  Clock,
  Award,
  Share2,
  AlertTriangle,
  Hash,
  Map,
  Globe,
  Calendar,
  Wifi,
  Network,
  Layers,
  FileText,
  Info,
} from "lucide-react"
import { Accordion } from "@/components/ui/accordion"
import { useSchoolDetails } from "@/hooks/use-school-details"
import { DetailSection } from "./school-details/detail-section"
import { KeyValue } from "./school-details/key-value"
import { SkeletonLoader } from "./school-details/skeleton-loader"
import { LocationSection } from "./school-details/location-section"
import { MapSection } from "./school-details/map-section"
import { cn } from "@/lib/utils"
import { KeyValueList } from "./school-details/key-value-list"

interface SchoolDetailsOptimizedProps {
  cue: number | null
  isOpen: boolean
  onClose: () => void
  onNavigateToSchool: (cue: number) => void
}

export default function SchoolDetailsOptimized({
  cue,
  isOpen,
  onClose,
  onNavigateToSchool,
}: SchoolDetailsOptimizedProps) {
  const { school, loading, error } = useSchoolDetails(isOpen ? cue : null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState<string>("ubicacion")
  const [expandedSections, setExpandedSections] = useState<string[]>(["ubicacion"])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Focus header for accessibility
      setTimeout(() => {
        headerRef.current?.focus()
      }, 100)
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose()
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)

    // Expand the section if it's not already expanded
    if (!expandedSections.includes(sectionId)) {
      setExpandedSections((prev) => [...prev, sectionId])
    }

    // Scroll to section after a brief delay to allow accordion to expand
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 150)
  }

  const navigationItems = [
    { id: "ubicacion", label: "Ubicación", icon: MapPin },
    { id: "general", label: "General", icon: Building2 },
    { id: "educativa", label: "Educativa", icon: GraduationCap },
    { id: "conectividad-infraestructura", label: "Conectividad e Infraestructura", icon: Wifi },
    { id: "contactos", label: "Contactos", icon: Phone },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 h-screen w-full sm:w-[500px] md:w-[700px] bg-gray-900 shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="school-details-title"
      >
        {/* Header - Fixed */}
        <div
          ref={headerRef}
          className="bg-gradient-to-r from-[#417099] to-[#00AEC3] text-white p-6 relative flex-shrink-0"
          tabIndex={-1}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Cerrar panel de detalles"
          >
            <X className="w-6 h-6" />
          </button>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-8 bg-white/20 rounded w-3/4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-white/20 rounded w-24"></div>
                <div className="h-6 bg-white/20 rounded w-28"></div>
              </div>
            </div>
          ) : school ? (
            <>
              <h2 id="school-details-title" className="text-2xl font-bold pr-12 mb-3">
                {school.nombre}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                  <Hash className="w-3 h-3 mr-1" />
                  CUE: {school.cue}
                </span>
                {school.predio && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                    <Building2 className="w-3 h-3 mr-1" />
                    Predio: {school.predio}
                  </span>
                )}

                {/* Detectar badges ÚNICAMENTE basados en plan_enlace */}
                {(() => {
                  const planEnlace = school.plan_enlace?.toUpperCase() || ""
                  const isContextoEncierro = planEnlace.includes("CONTEXTO DE ENCIERRO")
                  const isEscuelaCerrada = planEnlace.includes("ESCUELA CERRADA")

                  return (
                    <>
                      {/* Badge amarillo para Contexto de encierro - SOLO UNO */}
                      {isContextoEncierro && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white border border-yellow-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Contexto de encierro
                        </span>
                      )}

                      {/* Badge rojo para Escuela cerrada - SOLO UNO */}
                      {isEscuelaCerrada && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white border border-red-600">
                          <X className="w-3 h-3 mr-1" />
                          Escuela cerrada
                        </span>
                      )}
                    </>
                  )
                })()}
              </div>
            </>
          ) : (
            <div className="text-red-300">Error al cargar detalles</div>
          )}
        </div>

        {/* Navigation - Fixed */}
        {!loading && school && (
          <div className="border-b border-gray-700 bg-gray-900 px-6 py-3 flex-shrink-0">
            <nav className="flex gap-1 overflow-x-auto" role="tablist">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      activeSection === item.id
                        ? "bg-[#00AEC3]/20 text-[#00AEC3] border border-[#00AEC3]/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                    )}
                    role="tab"
                    aria-selected={activeSection === item.id}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {loading && <SkeletonLoader />}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">
                <AlertTriangle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            {school && (
              <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
                {/* Ubicación Section */}
                <DetailSection id="ubicacion" title="Ubicación" icon={<MapPin />}>
                  <div className="space-y-6">
                    {/* Información de ubicación */}
                    <LocationSection
                      address={school.direccion || undefined}
                      city={school.ciudad || undefined}
                      district={school.distrito || undefined}
                      ambito={school.ambito || undefined}
                      lat={school.lat || 0}
                      lng={school.lon || 0}
                      schoolName={school.nombre}
                    />

                    {/* Sección de mapa siempre visible */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Map className="w-5 h-5 text-[#00AEC3]" />
                        <h4 className="text-lg font-semibold text-white">Mapa</h4>
                      </div>
                      <MapSection lat={school.lat || 0} lng={school.lon || 0} schoolName={school.nombre} />
                    </div>
                  </div>
                </DetailSection>

                {/* General Section - EXPANDED */}
                <DetailSection id="general" title="Información General" icon={<Building2 />}>
                  <div className="space-y-6">
                    {/* Información Básica */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-[#00AEC3]" />
                        Información Básica
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <KeyValue
                          label="Tipo de establecimiento"
                          value={school.tipo_establecimiento}
                          icon={<Building2 />}
                        />
                        <KeyValue label="CUE Anterior" value={school.cue_anterior} icon={<Hash />} />
                        <KeyValue label="Ámbito" value={school.ambito} icon={<Globe />} />
                      </div>
                    </div>

                    {/* Shared Predio */}
                    {school.sharedPredioSchools && school.sharedPredioSchools.length > 0 && (
                      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Share2 className="w-5 h-5 text-amber-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
                              Predio Compartido
                            </p>
                            <p className="text-amber-300 font-medium mb-3">
                              Comparte predio con {school.sharedPredioSchools.length} establecimiento
                              {school.sharedPredioSchools.length !== 1 ? "s" : ""}:
                            </p>
                            <div className="space-y-2">
                              {school.sharedPredioSchools.map((sharedSchool) => (
                                <div key={sharedSchool.id} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2"></span>
                                  <div>
                                    <p className="font-medium text-gray-200">{sharedSchool.nombre}</p>
                                    <button
                                      onClick={() => onNavigateToSchool(sharedSchool.cue)}
                                      className="text-sm text-[#00AEC3] hover:text-[#00c8e0] underline transition-colors"
                                    >
                                      CUE: {sharedSchool.cue}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DetailSection>

                {/* Educational Section */}
                <DetailSection id="educativa" title="Información Educativa" icon={<GraduationCap />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <KeyValue label="Nivel" value={school.nivel} icon={<GraduationCap />} />
                    <KeyValue label="Modalidad" value={school.modalidad} icon={<GraduationCap />} />
                    <KeyValue
                      label="Matrícula total"
                      value={school.matricula ? `${school.matricula} estudiantes` : null}
                      icon={<Users />}
                    />
                    <KeyValue label="Secciones" value={school.secciones} icon={<Building2 />} />
                    <KeyValue label="Varones" value={school.varones} icon={<Users />} />
                    <KeyValue label="Mujeres" value={school.mujeres} icon={<Users />} />
                    <KeyValue label="Turnos" value={school.turnos} icon={<Clock />} />
                  </div>

                  {/* Educational Programs */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-[#e81f76]" />
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Programas Educativos</p>
                    </div>
                    {school.programas_educativos && school.programas_educativos.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {school.programas_educativos.map((programa, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-[#e81f76]/20 text-[#e81f76] border border-[#e81f76]/30"
                          >
                            {programa.programa}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 italic">Sin programas registrados</p>
                    )}
                  </div>
                </DetailSection>

                {/* Conectividad e Infraestructura Section - UNIFICADA */}
                <DetailSection id="conectividad-infraestructura" title="Conectividad e Infraestructura" icon={<Wifi />}>
                  <div className="space-y-8">
                    {/* Plan de Enlace */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Network className="w-5 h-5 text-[#00AEC3]" />
                        Plan de Enlace
                      </h4>
                      <KeyValueList
                        items={[
                          {
                            key: "plan_enlace",
                            label: "Plan Enlace",
                            value: school.plan_enlace,
                            icon: <Network />,
                          },
                          {
                            key: "subplan_enlace",
                            label: "Subplan Enlace",
                            value: school.subplan_enlace,
                            icon: <Network />,
                          },
                          {
                            key: "fecha_inicio_conectividad",
                            label: "Fecha inicio conectividad",
                            value: school.fecha_inicio_conectividad,
                            icon: <Calendar />,
                          },
                          {
                            key: "recurso_primario",
                            label: "Recurso Primario",
                            value: school.recurso_primario,
                            icon: <Building2 />,
                          },
                        ]}
                      />
                    </div>

                    {/* PNCE */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-[#417099]" />
                        PNCE (Plan Nacional de Conectividad Escolar)
                      </h4>
                      <KeyValueList
                        items={[
                          {
                            key: "proveedor_internet_pnce",
                            label: "Proveedor Internet PNCE",
                            value: school.proveedor_internet_pnce,
                            icon: <Wifi />,
                          },
                          {
                            key: "fecha_instalacion_pnce",
                            label: "Fecha Instalación PNCE",
                            value: school.fecha_instalacion_pnce,
                            icon: <Calendar />,
                          },
                          {
                            key: "pnce_tipo_mejora",
                            label: "PNCE Tipo de mejora",
                            value: school.pnce_tipo_mejora,
                            icon: <Layers />,
                          },
                          {
                            key: "pnce_fecha_mejora",
                            label: "PNCE Fecha de mejora",
                            value: school.pnce_fecha_mejora,
                            icon: <Calendar />,
                          },
                          {
                            key: "pnce_estado",
                            label: "PNCE Estado",
                            value: school.pnce_estado,
                            icon: <AlertTriangle />,
                          },
                          {
                            key: "mb",
                            label: "Velocidad de conexión",
                            value: school.mb ? `${school.mb} MB` : null,
                            icon: <Wifi />,
                          },
                        ]}
                      />
                    </div>

                    {/* PBA - GRUPO 1 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Network className="w-5 h-5 text-[#e81f76]" />
                        PBA - Grupo 1
                      </h4>
                      <KeyValueList
                        items={[
                          {
                            key: "pba_grupo_1_proveedor_internet",
                            label: "Proveedor Internet PBA - Grupo 1",
                            value: school.pba_grupo_1_proveedor_internet,
                            icon: <Network />,
                          },
                          {
                            key: "pba_grupo_1_fecha_instalacion",
                            label: "Fecha instalación",
                            value: school.pba_grupo_1_fecha_instalacion,
                            icon: <Calendar />,
                          },
                          {
                            key: "pba_grupo_1_estado",
                            label: "Estado PBA - Grupo 1",
                            value: school.pba_grupo_1_estado,
                            icon: <AlertTriangle />,
                          },
                        ]}
                      />
                    </div>

                    {/* PBA 2019 */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Network className="w-5 h-5 text-[#00AEC3]" />
                        PBA 2019
                      </h4>
                      <KeyValueList
                        items={[
                          {
                            key: "pba_2019_proveedor_internet",
                            label: "Proveedor Internet PBA 2019",
                            value: school.pba_2019_proveedor_internet,
                            icon: <Network />,
                          },
                          {
                            key: "pba_2019_fecha_instalacion",
                            label: "Fecha instalación PBA 2019",
                            value: school.pba_2019_fecha_instalacion,
                            icon: <Calendar />,
                          },
                          {
                            key: "pba_2019_estado",
                            label: "Estado PBA 2019",
                            value: school.pba_2019_estado,
                            icon: <AlertTriangle />,
                          },
                        ]}
                      />
                    </div>

                    {/* PBA - GRUPO 2 - A */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Network className="w-5 h-5 text-[#417099]" />
                        PBA - Grupo 2 - A
                      </h4>
                      <KeyValueList
                        items={[
                          {
                            key: "pba_grupo_2_a_proveedor_internet",
                            label: "Proveedor Internet PBA - Grupo 2 - A",
                            value: school.pba_grupo_2_a_proveedor_internet,
                            icon: <Network />,
                          },
                          {
                            key: "pba_grupo_2_a_fecha_instalacion",
                            label: "Fecha instalación PBA - Grupo 2 - A",
                            value: school.pba_grupo_2_a_fecha_instalacion,
                            icon: <Calendar />,
                          },
                          {
                            key: "pba_grupo_2_a_tipo_mejora",
                            label: "Tipo de mejora PBA - Grupo 2 - A",
                            value: school.pba_grupo_2_a_tipo_mejora,
                            icon: <Layers />,
                          },
                          {
                            key: "pba_grupo_2_a_fecha_mejora",
                            label: "Fecha de mejora PBA - Grupo 2 - A",
                            value: school.pba_grupo_2_a_fecha_mejora,
                            icon: <Calendar />,
                          },
                          {
                            key: "pba_grupo_2_a_estado",
                            label: "Estado PBA - Grupo 2 - A",
                            value: school.pba_grupo_2_a_estado,
                            icon: <AlertTriangle />,
                          },
                        ]}
                      />
                    </div>

                    {/* Estado General PBA */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[#e81f76]" />
                        Estado General PBA
                      </h4>
                      <KeyValueList
                        items={[
                          {
                            key: "estado_instalacion_pba",
                            label: "Estado de instalación PBA",
                            value: school.estado_instalacion_pba,
                            icon: <AlertTriangle />,
                          },
                          {
                            key: "proveedor_asignado_pba",
                            label: "Proveedor asignado PBA",
                            value: school.proveedor_asignado_pba,
                            icon: <Network />,
                          },
                          {
                            key: "listado_conexion_internet",
                            label: "Listado por el que se conecta internet",
                            value: school.listado_conexion_internet,
                            icon: <FileText />,
                          },
                          {
                            key: "reclamos_grupo_1_ani",
                            label: "Reclamos Grupo 1 ANI",
                            value: school.reclamos_grupo_1_ani,
                            icon: <AlertTriangle />,
                          },
                          {
                            key: "access_id",
                            label: "Access ID",
                            value: school.access_id,
                            icon: <Hash />,
                          },
                          {
                            key: "tipo",
                            label: "Tipo de establecimiento (técnico)",
                            value: school.tipo,
                            icon: <Building2 />,
                          },
                        ]}
                      />
                    </div>

                    {/* Separador visual */}
                    <div className="border-t border-gray-700 pt-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Layers className="w-6 h-6 text-[#00AEC3]" />
                        <h3 className="text-xl font-semibold text-white">Infraestructura Tecnológica</h3>
                      </div>
                    </div>

                    {/* Plan Piso Tecnológico */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#417099]" />
                        Plan Piso Tecnológico
                      </h4>
                      <KeyValueList
                        items={[
                          {
                            key: "plan_piso_tecnologico",
                            label: "Plan Piso Tecnológico",
                            value: school.plan_piso_tecnologico,
                            icon: <Building2 />,
                          },
                          {
                            key: "proveedor_piso_tecnologico_cue",
                            label: "Proveedor Piso Tecnológico CUE",
                            value: school.proveedor_piso_tecnologico_cue,
                            icon: <Building2 />,
                          },
                          {
                            key: "fecha_terminado_piso_tecnologico_cue",
                            label: "Fecha terminado Piso Tecnológico CUE",
                            value: school.fecha_terminado_piso_tecnologico_cue,
                            icon: <Calendar />,
                          },
                          {
                            key: "tipo_piso_instalado",
                            label: "Tipo de Piso instalado",
                            value: school.tipo_piso_instalado,
                            icon: <Building2 />,
                          },
                        ]}
                      />
                    </div>

                    {/* Mejoras de Infraestructura */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-[#00AEC3]" />
                        Mejoras de Infraestructura
                      </h4>
                      <KeyValueList
                        items={[
                          {
                            key: "tipo_mejora",
                            label: "Tipo de mejora",
                            value: school.tipo_mejora,
                            icon: <Layers />,
                          },
                          {
                            key: "fecha_mejora",
                            label: "Fecha de mejora",
                            value: school.fecha_mejora,
                            icon: <Calendar />,
                          },
                        ]}
                      />
                    </div>

                    {/* Información adicional si no hay datos */}
                    <div className="mt-8 p-4 bg-gray-800/20 rounded-lg border border-gray-700/50">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-[#00AEC3] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400 font-medium mb-1">
                            Información sobre conectividad e infraestructura
                          </p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Esta sección muestra únicamente los datos disponibles en el sistema. Los campos vacíos
                            indican que no hay información registrada para esos aspectos específicos de conectividad o
                            infraestructura tecnológica del establecimiento.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DetailSection>

                {/* Contacts Section */}
                <DetailSection id="contactos" title="Contactos" icon={<Phone />}>
                  <div className="space-y-4">
                    <KeyValue
                      label="FED a cargo"
                      value={school.fed_a_cargo}
                      icon={school.fed_a_cargo === "Sin FED a cargo" ? <AlertTriangle /> : <User />}
                    />

                    {school.contacto && (
                      <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-5 h-5 text-[#e81f76]" />
                          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            {school.contacto.cargo || "Contacto Principal"}
                          </p>
                        </div>
                        <KeyValue
                          label="Nombre completo"
                          value={`${school.contacto.nombre} ${school.contacto.apellido}`}
                        />
                        <KeyValue label="Teléfono" value={school.contacto.telefono} icon={<Phone />} />
                        <KeyValue label="Correo electrónico" value={school.contacto.correo} icon={<Mail />} />
                      </div>
                    )}
                  </div>
                </DetailSection>
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
