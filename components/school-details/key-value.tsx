"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface KeyValueProps {
  label: string
  value: string | number | null | undefined
  icon?: React.ReactNode
  className?: string
  fallback?: string
}

export function KeyValue({ label, value, icon, className, fallback = "—" }: KeyValueProps) {
  const displayValue = value || fallback
  const isEmpty = !value

  return (
    <div className={cn("flex items-start gap-3", className)}>
      {icon && (
        <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#00AEC3]">
          {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <p className={cn("text-base font-medium mt-1", isEmpty ? "text-gray-600 italic" : "text-white")}>
          {displayValue}
        </p>
      </div>
    </div>
  )
}
