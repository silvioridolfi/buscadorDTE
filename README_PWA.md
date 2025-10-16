# PWA - Buscador de Escuelas (No Invasiva)

## Descripción

Este proyecto ha sido convertido en una Progressive Web App (PWA) de manera **no invasiva**. Esto significa que:

- ✅ La aplicación es instalable en dispositivos móviles y de escritorio
- ✅ Funciona offline para assets estáticos (HTML, CSS, JS, imágenes)
- ✅ NO cachea llamadas a APIs (mantiene datos siempre actualizados)
- ✅ No altera la lógica de negocio ni el routing existente
- ✅ Fácilmente reversible

## Archivos Agregados

### 1. Manifest (`public/manifest.webmanifest`)
Define los metadatos de la PWA: nombre, íconos, colores, modo de visualización.

### 2. Service Worker (`public/sw.js`)
Cachea assets estáticos de forma inteligente:
- **Cache-first** para assets precacheados (manifest, íconos, rutas principales)
- **Network-first** para páginas HTML
- **Network-only** para APIs (no se cachean)

### 3. Registro del SW (`components/pwa-register.tsx`)
Componente cliente que registra el Service Worker solo en producción.

### 4. Íconos PWA (`public/icons/`)
- `icon-192.png` (192×192px)
- `icon-512.png` (512×512px)
- `maskable-512.png` (512×512px con safe zone)

## Instalación / Despliegue

### Requisitos
- **HTTPS obligatorio** (o `http://localhost` en desarrollo)
- Los íconos deben existir en `public/icons/`
- El manifest debe ser accesible en `/manifest.webmanifest`

### Build
\`\`\`bash
npm run build
npm start
\`\`\`

### Verificación
1. Abrir en Chrome DevTools → Application → Manifest
2. Verificar que todos los campos aparecen correctamente
3. Ejecutar Lighthouse audit → PWA
4. Verificar que aparece "Installable" en verde

## Actualización de Versión

Cuando hagas cambios importantes en los assets estáticos:

1. Actualizar `CACHE_NAME` en `public/sw.js`:
\`\`\`javascript
const CACHE_NAME = "pwa-static-v2"; // Incrementar versión
\`\`\`

2. Si usas assets con hash (ej: `app.a1b2c3.js`), agregar a `ASSETS`:
\`\`\`javascript
const ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/_next/static/css/app.abc123.css", // Agregar rutas con hash
  "/_next/static/chunks/app.def456.js"
];
\`\`\`

3. Deployar normalmente. El SW se actualizará automáticamente.

## Rollback (Desactivar PWA)

Si necesitas desactivar la PWA temporalmente:

### Opción 1: Eliminar SW del deploy
1. Eliminar o renombrar `public/sw.js`
2. Redesplegar
3. Los clientes desregistrarán el SW automáticamente

### Opción 2: Desregistrar programáticamente
Agregar en `components/pwa-register.tsx`:
\`\`\`typescript
navigator.serviceWorker.getRegistrations().then((registrations) => {
  for (const registration of registrations) {
    registration.unregister();
  }
});
\`\`\`

## Testing

### En Desarrollo (localhost)
\`\`\`bash
npm run dev
# El SW se registra pero solo en producción por defecto
\`\`\`

### En Producción
\`\`\`bash
npm run build
npm start
# Abrir en https://tu-dominio.com
\`\`\`

### Instalar en Dispositivos

#### Android (Chrome)
1. Abrir la app en Chrome
2. Menú (⋮) → "Agregar a pantalla de inicio"
3. Confirmar instalación

#### iOS (Safari)
1. Abrir la app en Safari
2. Botón compartir (⬆️)
3. "Agregar a pantalla de inicio"

#### Desktop (Chrome/Edge)
1. Icono de instalación en la barra de direcciones (⊕)
2. Click en "Instalar"

## Verificación de Funcionamiento

### Online
- [ ] La app carga normalmente
- [ ] Búsquedas funcionan correctamente
- [ ] Datos se actualizan en tiempo real

### Offline
- [ ] Página principal carga desde cache
- [ ] Íconos y assets estáticos disponibles
- [ ] Búsquedas muestran mensaje de sin conexión (esperado)

### Instalación
- [ ] Prompt de instalación aparece en navegadores compatibles
- [ ] App instalada abre en modo standalone (sin barra de URL)
- [ ] Ícono correcto en launcher
- [ ] Splash screen se muestra al abrir (Android)

## Buenas Prácticas

### ✅ Hacer
- Mantener `ASSETS` actualizado con rutas válidas
- Incrementar `CACHE_NAME` al hacer cambios importantes
- Probar en HTTPS antes de deployar
- Verificar que los íconos existen y son válidos

### ❌ No Hacer
- No cachear endpoints de API
- No cachear requests POST/PUT/DELETE
- No usar `transition-all` en CSS (afecta performance)
- No modificar el SW sin cambiar la versión del cache

## Estructura de Archivos PWA

\`\`\`
public/
├── manifest.webmanifest     # Manifest de la PWA
├── sw.js                     # Service Worker
└── icons/
    ├── icon-192.png         # Ícono 192x192
    ├── icon-512.png         # Ícono 512x512
    └── maskable-512.png     # Ícono adaptable

components/
└── pwa-register.tsx         # Registro del SW

app/
├── layout.tsx               # Incluye links al manifest
└── page.tsx                 # Incluye PWARegister
\`\`\`

## Troubleshooting

### El SW no se registra
- Verificar que estás en HTTPS o localhost
- Verificar que `sw.js` existe en `public/`
- Revisar consola del navegador para errores

### Los assets no se cachean
- Verificar que las rutas en `ASSETS` son correctas
- Limpiar cache del navegador (DevTools → Application → Clear storage)
- Verificar que el SW está activo (DevTools → Application → Service Workers)

### La app no es instalable
- Ejecutar Lighthouse audit para ver qué falta
- Verificar que el manifest es válido
- Asegurar que hay íconos de 192px y 512px
- Verificar que estás en HTTPS

### Datos obsoletos después de instalar
- Verificar que las APIs NO están en `ASSETS`
- Confirmar que el fetch handler no cachea respuestas de API
- Revisar que `url.pathname.includes("/api/")` funciona correctamente

## Recursos Adicionales

- [PWA Documentation - MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Workbox - Google](https://developers.google.com/web/tools/workbox)
- [Web App Manifest - W3C](https://www.w3.org/TR/appmanifest/)
- [Service Worker API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Mejoras Futuras (Opcional)

- [ ] Implementar Workbox para estrategias de cache más avanzadas
- [ ] Agregar más shortcuts en el manifest
- [ ] Implementar notificaciones push
- [ ] Agregar splash screens personalizados
- [ ] Cache selectivo por rutas (sin afectar datos dinámicos)
- [ ] Sincronización en background
- [ ] Compartir contenido nativo

---

**Mantenido por:** Dirección de Tecnología Educativa - Provincia de Buenos Aires  
**Versión PWA:** 1.0.0  
**Última actualización:** 2024
\`\`\`

Now let's create a script to generate the PWA icons (this would be run manually):
