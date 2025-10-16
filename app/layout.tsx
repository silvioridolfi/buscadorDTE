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
  manifest: "/manifest.webmanifest",
  themeColor: "#417099",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Escuelas",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={encodeSans.variable}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#417099" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Escuelas" />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <main className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
