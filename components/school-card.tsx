"use client"

import {
  MapPin,
  Phone,
  User,
  Building,
  ArrowRight,
  Share2,
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  Award,
} from "lucide-react"
import type { School } from "@/lib/types"

interface SchoolCardProps {
  school: School
  onViewDetails: () => void
}

export default function SchoolCard({ school, onViewDetails }: SchoolCardProps) {
  const hasSharedPredio = school.sharedPredioSchools && school.sharedPredioSchools.length > 0
  const hasPrograms = school.programas_educativos && school.programas_educativos.length > 0

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-700 h-full flex flex-col">
      <div className="p-6 space-y-4 flex-1">
        {/* School Name */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00AEC3] transition-colors duration-200">
            {school.nombre}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#417099]/20 text-[#00AEC3] border border-[#417099]/30">
              CUE: {school.cue}
            </span>
            {school.predio && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#00AEC3]/20 text-[#00AEC3] border border-[#00AEC3]/30">
                Predio: {school.predio}
              </span>
            )}
          </div>
        </div>

        {/* District */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#00AEC3] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-100 font-medium">{school.distrito || "Sin distrito"}</p>
            {school.ciudad && <p className="text-sm text-gray-300">{school.ciudad}</p>}
            {school.direccion && <p className="text-sm text-gray-300">{school.direccion}</p>}
          </div>
        </div>

        {/* Educational Programs */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#e81f76]" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">Programas Educativos</p>
          </div>
          {hasPrograms ? (
            <div className="flex flex-wrap gap-1.5">
              {school.programas_educativos!.map((programa, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#e81f76]/20 text-[#e81f76] border border-[#e81f76]/30"
                >
                  {programa.programa}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">Sin datos de programas educativos</p>
          )}
        </div>

        {/* Educational Information Section */}
        <div className="space-y-3 bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
          <div className="grid grid-cols-1 gap-2 text-sm">
            {/* Nivel and Modalidad */}
            <div className="grid grid-cols-2 gap-3">
              {school.nivel && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3 h-3 text-[#00AEC3] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Nivel</p>
                    <p className="text-gray-200 font-medium text-xs">{school.nivel}</p>
                  </div>
                </div>
              )}
              {school.modalidad && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-[#417099] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Modalidad</p>
                    <p className="text-gray-200 font-medium text-xs">{school.modalidad}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Matrícula */}
            {school.matricula && (
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-[#e81f76] flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Matrícula</p>
                  <p className="text-gray-200 font-medium text-xs">{school.matricula} estudiantes</p>
                </div>
              </div>
            )}

            {/* Varones and Mujeres */}
            {(school.varones || school.mujeres) && (
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-[#00AEC3] flex-shrink-0" />
                <div className="flex gap-4">
                  {school.varones && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Varones</p>
                      <p className="text-gray-200 font-medium text-xs">{school.varones}</p>
                    </div>
                  )}
                  {school.mujeres && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Mujeres</p>
                      <p className="text-gray-200 font-medium text-xs">{school.mujeres}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Secciones and Turnos */}
            <div className="grid grid-cols-2 gap-3">
              {school.secciones && (
                <div className="flex items-center gap-2">
                  <Building className="w-3 h-3 text-[#417099] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Secciones</p>
                    <p className="text-gray-200 font-medium text-xs">{school.secciones}</p>
                  </div>
                </div>
              )}
              {school.turnos && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-[#e81f76] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Turnos</p>
                    <p className="text-gray-200 font-medium text-xs">{school.turnos}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shared Predio Alert */}
        {hasSharedPredio && (
          <div className="mt-2 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Share2 className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-300 mb-1">
                  Predio compartido con {school.sharedPredioSchools!.length} establecimiento
                  {school.sharedPredioSchools!.length !== 1 ? "s" : ""}
                </p>
                <ul className="space-y-2">
                  {school.sharedPredioSchools!.map((sharedSchool) => (
                    <li key={sharedSchool.id} className="text-sm text-gray-200">
                      <div className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 mr-2"></span>
                        <div>
                          <p className="font-medium">{sharedSchool.nombre}</p>
                          <p className="text-xs text-gray-400">CUE: {sharedSchool.cue}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FED */}
        {school.fed_a_cargo && (
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-[#417099] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">FED a cargo</p>
              <p className="text-sm text-gray-100 font-medium">{school.fed_a_cargo}</p>
            </div>
          </div>
        )}

        {/* Contact */}
        {school.contacto && (
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-[#e81f76] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{school.contacto.cargo || "Contacto"}</p>
              <p className="text-sm text-gray-100 font-medium">
                {school.contacto.nombre} {school.contacto.apellido}
              </p>
              {school.contacto.telefono && <p className="text-sm text-gray-300">{school.contacto.telefono}</p>}
            </div>
          </div>
        )}

        {/* School Type Badge */}
        {school.tipo_establecimiento && (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded-full border border-gray-700">
              {school.tipo_establecimiento}
            </span>
          </div>
        )}
      </div>

      {/* View Details Button */}
      <button
        onClick={onViewDetails}
        className="w-full py-3 px-4 bg-gray-800/50 text-[#00AEC3] font-medium hover:bg-[#417099] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 border-t border-gray-700 group-hover:border-[#417099]/20"
        aria-label={`Ver detalles de ${school.nombre}`}
      >
        <span>Ver detalles</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  )
}
