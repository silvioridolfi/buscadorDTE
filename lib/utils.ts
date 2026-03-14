import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitarias para badges especiales de establecimientos
export function isContextoEncierro(planEnlace: string | null | undefined): boolean {
  return (planEnlace?.toUpperCase() || "").includes("CONTEXTO DE ENCIERRO")
}

export function isEscuelaCerrada(planEnlace: string | null | undefined): boolean {
  return (planEnlace?.toUpperCase() || "").includes("ESCUELA CERRADA")
}