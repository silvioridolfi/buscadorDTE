export interface Contact {
  id: string
  nombre: string
  apellido: string
  cargo: string
  telefono: string
  correo: string
}

export interface SharedSchool {
  id: string
  nombre: string
  cue: number
}

export interface EducationalProgram {
  programa: string
}

export interface School {
  id: string
  cue: number
  predio: number | null
  nombre: string
  distrito: string
  ciudad: string | null
  direccion: string | null
  fed_a_cargo: string | null
  tipo_establecimiento: string | null
  ambito: string | null
  lat: number | null
  lon: number | null

  // Campos de conectividad PNCE
  proveedor_internet_pnce: string | null
  fecha_instalacion_pnce: string | null
  pnce_tipo_mejora: string | null
  pnce_fecha_mejora: string | null
  pnce_estado: string | null
  mb: string | null

  // Campos PBA
  estado_instalacion_pba: string | null
  proveedor_asignado_pba: string | null
  pba_2019_proveedor_internet: string | null
  pba_2019_fecha_instalacion: string | null
  pba_2019_estado: string | null
  pba_grupo_1_proveedor_internet: string | null
  pba_grupo_1_fecha_instalacion: string | null
  pba_grupo_1_estado: string | null
  pba_grupo_2_a_proveedor_internet: string | null
  pba_grupo_2_a_fecha_instalacion: string | null
  pba_grupo_2_a_tipo_mejora: string | null
  pba_grupo_2_a_fecha_mejora: string | null
  pba_grupo_2_a_estado: string | null

  // Campos de infraestructura
  plan_piso_tecnologico: string | null
  proveedor_piso_tecnologico_cue: string | null
  fecha_terminado_piso_tecnologico_cue: string | null
  tipo_piso_instalado: string | null
  tipo_mejora: string | null
  fecha_mejora: string | null

  // Campos adicionales
  plan_enlace: string | null
  subplan_enlace: string | null
  fecha_inicio_conectividad: string | null
  recurso_primario: string | null
  access_id: string | null
  tipo: string | null
  listado_conexion_internet: string | null
  cue_anterior: string | null
  reclamos_grupo_1_ani: string | null
  observaciones: string | null

  // Campos educativos
  nivel: string | null
  modalidad: string | null
  matricula: number | null
  varones: number | null
  mujeres: number | null
  secciones: number | null
  turnos: string | null

  // Relaciones
  contacto?: Contact | null
  sharedPredioSchools?: SharedSchool[]
  programas_educativos?: EducationalProgram[]
}
