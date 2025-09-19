"use client"

import {
  MapPin,
  Phone,
  User,
  Building,
  ArrowRight,
  Share2,
  Users,
  GraduationCap,
  Clock,
  Award,
  AlertTriangle,
  Hash,
  Home,
  X,
} from "lucide-react"
import type { School } from "@/lib/types"

interface SchoolCardOptimizedProps {
  school: School
  onViewDetails: () => void
}

export default function SchoolCardOptimized({ school, onViewDetails }: SchoolCardOptimizedProps) {
  const hasSharedPredio = school.sharedPredioSchools && school.sharedPredioSchools.length > 0
  const hasPrograms = school.programas_educativos && school.programas_educativos.length > 0

  // Helper function to format location (avoid repetition)
  const formatLocation = () => {
    const ciudad = school.ciudad?.trim()
    const distrito = school.distrito?.trim()

    if (!ciudad && !distrito) return null
    if (!ciudad) return distrito
    if (!distrito) return ciudad

    // If city and district are the same (case insensitive), show only one
    if (ciudad.toLowerCase() === distrito.toLowerCase()) {
      return ciudad
    }

    // If different, show: City (District)
    return `${ciudad} (${distrito})`
  }

  const location = formatLocation()
  const hasFED = school.fed_a_cargo && school.fed_a_cargo !== "Sin FED a cargo"

  // Detectar badges especiales ÚNICAMENTE basados en plan_enlace
  const planEnlace = school.plan_enlace?.toUpperCase() || ""
  const isContextoEncierro = planEnlace.includes("CONTEXTO DE ENCIERRO")
  const isEscuelaCerrada = planEnlace.includes("ESCUELA CERRADA")

  return (
    <div className="group relative h-full flex flex-col transform transition-all duration-500 hover:scale-105 laser-border">
      {/* Enhanced card background with glassmorphism */}
      <div className="glass-enhanced rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50 h-full flex flex-col hover:shadow-[0_0_50px_rgba(0,174,195,0.3)] transition-all duration-500">
        {/* Animated background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e81f76]/5 to-[#00AEC3]/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl" />

        <div className="relative z-10 p-8 space-y-6 flex-1">
          {/* 🏫 Enhanced School Name with glow effect */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#e81f76] group-hover:to-[#00AEC3] transition-all duration-300 leading-tight">
              {school.nombre}
            </h3>
          </div>

          {/* 🔢 Enhanced CUE and Predio with icon animations */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#417099]/20 border border-[#417099]/40 glass-enhanced">
              <Hash className="w-4 h-4 text-[#00AEC3] group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-semibold text-[#00AEC3]">CUE: {school.cue}</span>
            </div>
            {school.predio && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00AEC3]/20 border border-[#00AEC3]/40 glass-enhanced">
                <Building className="w-4 h-4 text-[#00AEC3] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-semibold text-[#00AEC3]">Predio: {school.predio}</span>
              </div>
            )}

            {/* Enhanced badges with glow effects */}
            {isContextoEncierro && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 text-white border-2 border-yellow-400 shadow-lg glow-yellow">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-semibold">Contexto de encierro</span>
              </div>
            )}

            {isEscuelaCerrada && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white border-2 border-red-400 shadow-lg glow-rosa">
                <X className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-semibold">Escuela cerrada</span>
              </div>
            )}
          </div>

          {/* Enhanced data sections with icon animations */}
          <div className="space-y-5">
            {/* 📍 Address, Location and District */}
            {school.direccion && (
              <div className="flex items-start gap-3 group/item hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-300">
                <Home className="w-5 h-5 text-[#00AEC3] mt-1 flex-shrink-0 group-hover/item:scale-110 group-hover/item:text-[#e81f76] transition-all duration-300" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">DIRECCIÓN</p>
                  <p className="text-base font-semibold text-white group-hover/item:text-[#00AEC3] transition-colors duration-300">
                    {school.direccion}
                  </p>
                </div>
              </div>
            )}

            {location && (
              <div className="flex items-start gap-3 group/item hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-300">
                <MapPin className="w-5 h-5 text-[#00AEC3] mt-1 flex-shrink-0 group-hover/item:scale-110 group-hover/item:text-[#e81f76] transition-all duration-300" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">LOCALIDAD</p>
                  <p className="text-base font-semibold text-white group-hover/item:text-[#00AEC3] transition-colors duration-300">
                    {location}
                  </p>
                </div>
              </div>
            )}

            {/* 🎓 Level + Modality */}
            {(school.nivel || school.modalidad) && (
              <div className="flex items-start gap-3 group/item hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-300">
                <GraduationCap className="w-5 h-5 text-[#417099] mt-1 flex-shrink-0 group-hover/item:scale-110 group-hover/item:text-[#00AEC3] transition-all duration-300" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">NIVEL Y MODALIDAD</p>
                  <p className="text-base font-semibold text-white group-hover/item:text-[#417099] transition-colors duration-300">
                    {school.nivel && school.modalidad
                      ? `${school.nivel} • ${school.modalidad}`
                      : school.nivel || school.modalidad}
                  </p>
                </div>
              </div>
            )}

            {/* 👥 Enhanced enrollment section */}
            {(school.matricula || school.secciones) && (
              <div className="flex items-start gap-3 group/item hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-300">
                <Users className="w-5 h-5 text-[#e81f76] mt-1 flex-shrink-0 group-hover/item:scale-110 group-hover/item:text-[#00AEC3] transition-all duration-300" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                    MATRÍCULA Y SECCIONES
                  </p>
                  <p className="text-base font-semibold text-white group-hover/item:text-[#e81f76] transition-colors duration-300">
                    {school.matricula && school.secciones
                      ? `${school.matricula} estudiantes – ${school.secciones} secciones`
                      : school.matricula
                        ? `${school.matricula} estudiantes`
                        : `${school.secciones} secciones`}
                  </p>
                </div>
              </div>
            )}

            {/* ♂ Boys / ♀ Girls with enhanced styling */}
            {(school.varones || school.mujeres) && (
              <div className="flex items-start gap-3 group/item hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-300">
                <Users className="w-5 h-5 text-[#00AEC3] mt-1 flex-shrink-0 group-hover/item:scale-110 group-hover/item:text-[#e81f76] transition-all duration-300" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                    DISTRIBUCIÓN POR GÉNERO
                  </p>
                  <div className="flex items-center gap-4">
                    {school.varones && (
                      <span className="text-base font-semibold text-blue-400 group-hover/item:text-blue-300 transition-colors duration-300">
                        ♂ {school.varones}
                      </span>
                    )}
                    {school.mujeres && (
                      <span className="text-base font-semibold text-pink-400 group-hover/item:text-pink-300 transition-colors duration-300">
                        ♀ {school.mujeres}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ⏰ Shifts */}
            {school.turnos && (
              <div className="flex items-start gap-3 group/item hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-300">
                <Clock className="w-5 h-5 text-[#417099] mt-1 flex-shrink-0 group-hover/item:scale-110 group-hover/item:text-[#00AEC3] transition-all duration-300" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">TURNOS</p>
                  <p className="text-base font-semibold text-white group-hover/item:text-[#417099] transition-colors duration-300">
                    {school.turnos}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Shared Predio Alert */}
          {hasSharedPredio && (
            <div className="p-5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/40 rounded-2xl glass-enhanced glow-yellow">
              <div className="flex items-start gap-3">
                <Share2 className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0 animate-pulse-glow" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">PREDIO COMPARTIDO</p>
                  <p className="text-sm font-semibold text-amber-300 mb-3">
                    Comparte predio con {school.sharedPredioSchools!.length} establecimiento
                    {school.sharedPredioSchools!.length !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2">
                    {school.sharedPredioSchools!.map((sharedSchool) => (
                      <div key={sharedSchool.id} className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0 animate-pulse"></span>
                        <div>
                          <p className="text-sm font-medium text-gray-200 hover:text-amber-200 transition-colors">
                            {sharedSchool.nombre}
                          </p>
                          <p className="text-xs text-gray-400">CUE: {sharedSchool.cue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced FED section */}
          <div className="flex items-start gap-3 group/item hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-300">
            <User className="w-5 h-5 text-[#417099] mt-1 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">FED A CARGO</p>
              {hasFED ? (
                <p className="text-base font-semibold text-white group-hover/item:text-[#417099] transition-colors duration-300">
                  {school.fed_a_cargo}
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  <p className="text-base font-semibold text-red-300">Sin FED a cargo</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Contact */}
          {school.contacto && (
            <div className="flex items-start gap-3 group/item hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-300">
              <Phone className="w-5 h-5 text-[#e81f76] mt-1 flex-shrink-0 group-hover/item:scale-110 group-hover/item:text-[#00AEC3] transition-all duration-300" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  {school.contacto.cargo || "CONTACTO PRINCIPAL"}
                </p>
                <p className="text-base font-semibold text-white group-hover/item:text-[#e81f76] transition-colors duration-300">
                  {school.contacto.nombre} {school.contacto.apellido}
                </p>
                {school.contacto.telefono && (
                  <p className="text-sm text-gray-300 mt-1 group-hover/item:text-gray-200 transition-colors duration-300">
                    {school.contacto.telefono}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Educational Programs */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#e81f76] group-hover:scale-110 transition-transform duration-300" />
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">PROGRAMAS EDUCATIVOS</p>
            </div>
            {hasPrograms ? (
              <div className="flex flex-wrap gap-2">
                {school.programas_educativos!.slice(0, 3).map((programa, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-[#e81f76]/20 text-[#e81f76] border border-[#e81f76]/40 hover:bg-[#e81f76]/30 transition-all duration-300 glass-enhanced"
                  >
                    {programa.programa}
                  </span>
                ))}
                {school.programas_educativos!.length > 3 && (
                  <span className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold bg-gray-700/60 text-gray-300 border border-gray-600/50 glass-enhanced">
                    +{school.programas_educativos!.length - 3} más
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Sin programas registrados</p>
            )}
          </div>

          {/* Enhanced Institutional Tag */}
          <div className="pt-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-gray-300 border border-gray-600/50 glass-enhanced">
              <span className="w-2 h-2 bg-gradient-to-r from-[#e81f76] to-[#00AEC3] rounded-full mr-2 animate-pulse"></span>
              DGCyE • Provincia de Buenos Aires
            </span>
          </div>
        </div>

        {/* Enhanced View Details Button */}
        <button
          onClick={onViewDetails}
          className="w-full py-6 px-8 bg-gradient-to-r from-[#417099] to-[#00AEC3] text-white font-bold text-lg hover:from-[#365d80] hover:to-[#00a0b8] transition-all duration-300 flex items-center justify-center gap-3 group/btn relative overflow-hidden holographic-sheen"
          aria-label={`Ver detalles de ${school.nombre}`}
        >
          <span>Ver detalles completos</span>
          <ArrowRight className="w-6 h-6 transition-all duration-300 group-hover/btn:translate-x-2 group-hover/btn:scale-110" />

          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
        </button>
      </div>
    </div>
  )
}
