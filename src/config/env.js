/**
 * Configuración de variables de entorno
 *
 * Este archivo centraliza el acceso a las variables de entorno
 * de la aplicación. Todas las variables de entorno deben empezar
 * con VITE_ para ser accesibles en el cliente.
 */

export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  },

  // App Configuration
  app: {
    env: import.meta.env.MODE || 'development',
    isDev: import.meta.env.DEV || false,
    isProd: import.meta.env.PROD || false,
  },

  // Logs
  logging: {
    enabled: import.meta.env.DEV || false,
  },
}

/**
 * Función helper para validar que todas las variables requeridas existen
 */
export function validateEnvConfig() {
  const requiredVars = ['VITE_API_BASE_URL']
  const missing = requiredVars.filter((varName) => !import.meta.env[varName])

  if (missing.length > 0) {
    console.warn(
      `⚠️ Variables de entorno faltantes: ${missing.join(', ')}\n` +
        'Usando valores por defecto. Crea un archivo .env basado en .env.example',
    )
  }
}

export default config
