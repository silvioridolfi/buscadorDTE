/* Service Worker - Buscador de Escuelas (No Invasivo) */
const CACHE_NAME = "pwa-static-v1"
const ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  // CSS/JS estáticos con hash se agregan después del build si es necesario
]

// Install: precachear assets estáticos
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(ASSETS)
      })
      .then(() => {
        console.log("[SW] Skip waiting")
        return self.skipWaiting()
      })
      .catch((err) => {
        console.error("[SW] Install failed:", err)
      }),
  )
})

// Activate: limpiar caches antiguos
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Claiming clients")
        return self.clients.claim()
      }),
  )
})

// Fetch: estrategia híbrida (cache-first para assets, network-first para el resto)
self.addEventListener("fetch", (event) => {
  const { request } = event

  // Solo manejar GET requests
  if (request.method !== "GET") {
    return
  }

  event.respondWith(
    (async () => {
      try {
        const url = new URL(request.url)

        // No cachear requests a APIs externas o Supabase
        if (
          url.hostname !== self.location.hostname ||
          url.pathname.includes("/api/") ||
          url.pathname.includes("supabase")
        ) {
          // Network-only para APIs
          return await fetch(request)
        }

        const isPrecached = ASSETS.includes(url.pathname)

        if (isPrecached) {
          // Cache-first para assets precacheados
          const cached = await caches.match(request)
          if (cached) {
            console.log("[SW] Serving from cache:", url.pathname)
            return cached
          }

          // Si no está en cache, intentar fetch y cachear
          try {
            const fresh = await fetch(request)
            if (fresh && fresh.status === 200) {
              const cache = await caches.open(CACHE_NAME)
              cache.put(request, fresh.clone())
            }
            return fresh
          } catch (err) {
            console.error("[SW] Fetch failed for precached asset:", err)
            return cached || new Response("Network error", { status: 408 })
          }
        }

        // Network-first para páginas (no APIs)
        try {
          const networkResponse = await fetch(request)

          // Opcionalmente cachear respuestas HTML exitosas
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            request.headers.get("accept")?.includes("text/html")
          ) {
            const cache = await caches.open(CACHE_NAME)
            cache.put(request, networkResponse.clone())
          }

          return networkResponse
        } catch (err) {
          // Fallback a cache si la red falla
          const cached = await caches.match(request)
          if (cached) {
            console.log("[SW] Network failed, serving from cache:", url.pathname)
            return cached
          }

          console.error("[SW] Network error and no cache:", err)
          return new Response("Offline - No cached version available", {
            status: 503,
            statusText: "Service Unavailable",
          })
        }
      } catch (err) {
        console.error("[SW] Fetch handler error:", err)
        return new Response("Error processing request", { status: 500 })
      }
    })(),
  )
})

// Mensaje de actualización
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
