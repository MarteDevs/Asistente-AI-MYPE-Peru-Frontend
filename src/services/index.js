// Exportar todos los servicios desde un punto central
export { default as api } from './api.js'
export { default as taxRegimeService } from './taxRegimeService.js'
export { default as chatService } from './chatService.js'

// Exportar servicios individuales también
export * from './taxRegimeService.js'
export * from './chatService.js'