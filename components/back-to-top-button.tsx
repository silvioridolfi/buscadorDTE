"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-[#00AEC3] to-[#417099] hover:from-[#00c8e0] hover:to-[#365d80] text-white rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(0,174,195,0.6)] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#00AEC3]/50 group animate-glow-pulse glass-enhanced border border-[#00AEC3]/30"
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      <ChevronUp className="w-7 h-7 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-125 animate-pulse-glow" />

      {/* Pulsing glow ring */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00AEC3]/30 to-[#417099]/30 blur-lg animate-pulse-glow -z-10" />

      {/* Neón effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00AEC3] to-[#417099] opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-glow-pulse" />
    </button>
  )
}
