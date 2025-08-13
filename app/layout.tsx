import type React from "react"
import type { Metadata } from "next"
import { encodeSans } from "./fonts"
import "./globals.css"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Buscador de Escuelas - Región 1",
  description: "Buscador de escuelas de la Región 1 - Dirección de Tecnología Educativa",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={encodeSans.variable}>
      <body className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <main className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
