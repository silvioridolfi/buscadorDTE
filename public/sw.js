// SW de limpieza: se desregistra y limpia cachés viejas

const CACHE_NAME = "pwa-static-cleanup-v1"

self.addEventListener("install", (event) => {
  // Activarse inmediatamente
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Borrar TODOS los cachés existentes
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((name) => caches.delete(name)))

        // Desregistrar el service worker
        await self.registration.unregister()

        // Forzar recarga de las pestañas controladas
        const clientsList = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        })

        for (const client of clientsList) {
          client.navigate(client.url)
        }
      } catch (error) {
        console.error("[SW cleanup] Error during cleanup:", error)
      }
    })(),
  )
})

// No interceptar ninguna request
self.addEventListener("fetch", () => {})
