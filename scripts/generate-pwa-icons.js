/**
 * Script para generar íconos PWA desde el logo existente
 * Requiere: npm install sharp
 * Uso: node scripts/generate-pwa-icons.js
 */

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const INPUT_LOGO = path.join(__dirname, "../app/icon.png")
const OUTPUT_DIR = path.join(__dirname, "../public/icons")

// Crear directorio de salida si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function generateIcons() {
  try {
    console.log("🎨 Generando íconos PWA...")

    // Verificar que existe el logo fuente
    if (!fs.existsSync(INPUT_LOGO)) {
      console.error("❌ No se encontró el logo fuente en:", INPUT_LOGO)
      console.log("💡 Asegúrate de tener app/icon.png")
      return
    }

    // Generar icon-192.png
    await sharp(INPUT_LOGO)
      .resize(192, 192, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(OUTPUT_DIR, "icon-192.png"))
    console.log("✅ Generado: icon-192.png")

    // Generar icon-512.png
    await sharp(INPUT_LOGO)
      .resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(OUTPUT_DIR, "icon-512.png"))
    console.log("✅ Generado: icon-512.png")

    // Generar maskable-512.png (con padding para safe zone)
    await sharp(INPUT_LOGO)
      .resize(410, 410, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .extend({
        top: 51,
        bottom: 51,
        left: 51,
        right: 51,
        background: { r: 65, g: 112, b: 153, alpha: 1 }, // Color PBA #417099
      })
      .png()
      .toFile(path.join(OUTPUT_DIR, "maskable-512.png"))
    console.log("✅ Generado: maskable-512.png (con safe zone)")

    console.log("🎉 Todos los íconos PWA generados correctamente en:", OUTPUT_DIR)
    console.log("\n📋 Próximos pasos:")
    console.log("1. Verificar que los íconos se ven bien")
    console.log("2. Actualizar public/manifest.webmanifest si es necesario")
    console.log("3. Desplegar en HTTPS")
    console.log("4. Probar instalación en dispositivos móviles")
  } catch (error) {
    console.error("❌ Error generando íconos:", error)
  }
}

generateIcons()
