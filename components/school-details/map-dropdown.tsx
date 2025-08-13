"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ExternalLink, Navigation, MapPin } from "lucide-react"

interface MapDropdownProps {
  lat: number
  lng: number
  schoolName: string
}

export function MapDropdown({ lat, lng, schoolName }: MapDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const mapOptions = [
    {
      name: "Google Maps",
      icon: ExternalLink,
      url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      color: "text-[#417099]",
    },
    {
      name: "OpenStreetMap",
      icon: Navigation,
      url: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`,
      color: "text-[#00AEC3]",
    },
    {
      name: "Apple Maps",
      icon: MapPin,
      url: `https://maps.apple.com/?q=${lat},${lng}`,
      color: "text-[#6b7280]",
    },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-[#417099] text-white rounded-lg hover:bg-[#365d80] transition-colors text-sm font-medium"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Abrir en aplicaciones de mapas"
      >
        <ExternalLink className="w-4 h-4" />
        <span>Abrir en...</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1"
          role="menu"
          aria-orientation="vertical"
        >
          {mapOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <IconComponent className={`w-4 h-4 ${option.color}`} />
                <span>{option.name}</span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
