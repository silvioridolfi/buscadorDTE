"use client"

import React from "react"
import { KeyValue } from "./key-value"

interface KeyValueItem {
  key: string
  label: string
  value: string | number | null | undefined
  icon?: React.ReactElement<{ className?: string }>
}

interface KeyValueListProps {
  items: KeyValueItem[]
  columns?: 1 | 2
  className?: string
}

export function KeyValueList({ items, columns = 2, className }: KeyValueListProps) {
  const filteredItems = items.filter((item) => {
    const value = item.value
    return value !== null && value !== undefined && value !== ""
  })

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p className="text-sm italic">No hay información disponible para esta sección</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 ${columns === 2 ? "md:grid-cols-2" : ""} gap-4 ${className || ""}`}>
      {filteredItems.map((item) => (
        <KeyValue key={item.key} label={item.label} value={item.value} icon={item.icon} />
      ))}
    </div>
  )
}