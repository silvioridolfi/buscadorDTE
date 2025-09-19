"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
  onSearch: (term: string) => void
  onClear: () => void
  loading: boolean
  hasResults: boolean
}

export default function SearchInput({ onSearch, onClear, loading, hasResults }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
    }
  }

  const handleClear = () => {
    setSearchTerm("")
    onClear()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="mb-16 max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          {/* Glow effect container */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-[#e81f76]/20 to-[#00AEC3]/20 rounded-2xl blur-xl transition-opacity duration-300 ${
              isFocused ? "opacity-100 animate-glow-pulse" : "opacity-0"
            }`}
          />

          {/* Search icon with enhanced styling */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 group-hover:text-[#00AEC3] transition-colors duration-300">
            <Search className="w-6 h-6" />
          </div>

          <Input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar por nombre de escuela, CUE o número de predio..."
            className={`
              w-full pl-14 pr-6 py-5 text-lg font-medium
              bg-white/5 backdrop-blur-md border-2 border-gray-600/50 
              rounded-2xl text-white placeholder-gray-400
              transition-all duration-300 shadow-2xl
              hover:shadow-[0_0_30px_rgba(0,174,195,0.2)]
              focus:outline-none focus:ring-0 focus:border-[#00AEC3]
              focus:shadow-[0_0_40px_rgba(0,174,195,0.4)]
              glass-enhanced
              ${isFocused ? "border-[#00AEC3] glow-cian" : "hover:border-gray-500"}
            `}
            disabled={loading}
          />

          {/* Animated typing cursor effect */}
          {!searchTerm && isFocused && (
            <div className="absolute left-14 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-[#00AEC3] animate-pulse" />
          )}
        </div>

        <div className="flex gap-3 sm:gap-4">
          <Button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className={`
              flex-1 sm:flex-none px-8 py-5 font-semibold rounded-2xl
              bg-gradient-to-r from-[#417099] to-[#00AEC3]
              text-white shadow-2xl
              transition-all duration-300 transform
              hover:scale-105 hover:shadow-[0_0_30px_rgba(65,112,153,0.5)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              flex items-center justify-center gap-3
              holographic-sheen laser-border
              relative overflow-hidden
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="text-lg">Buscar</span>

            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>

          {(searchTerm || hasResults) && (
            <Button
              type="button"
              onClick={handleClear}
              className={`
                flex-1 sm:flex-none px-8 py-5 font-semibold rounded-2xl
                bg-white/5 backdrop-blur-md text-white
                border-2 border-gray-600/50 shadow-2xl
                transition-all duration-300 transform
                hover:scale-105 hover:bg-white/10 hover:border-[#00AEC3]/50
                hover:shadow-[0_0_20px_rgba(0,174,195,0.3)]
                flex items-center justify-center gap-3
                glass-enhanced
              `}
            >
              <X className="w-5 h-5" />
              <span className="text-lg">Limpiar</span>
            </Button>
          )}
        </div>
      </form>

      {/* Subtle scan line effect */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#00AEC3]/30 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00AEC3] to-transparent w-1/3 animate-scanline opacity-60" />
      </div>
    </div>
  )
}
