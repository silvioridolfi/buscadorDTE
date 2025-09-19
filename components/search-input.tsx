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
    <div className="mb-12 max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <Search className="w-5 h-5" />
          </div>
          <Input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nombre de escuela, CUE o número de predio..."
            className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AEC3] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-white placeholder-gray-400"
            disabled={loading}
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="flex-1 sm:flex-none px-6 py-4 bg-[#417099] text-white font-medium rounded-xl hover:bg-[#365d80] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>Buscar</span>
          </Button>
          {(searchTerm || hasResults) && (
            <Button
              type="button"
              onClick={handleClear}
              variant="outline"
              className="flex-1 sm:flex-none px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-600 shadow-sm hover:shadow-md"
            >
              <X className="w-5 h-5" />
              <span>Limpiar</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
