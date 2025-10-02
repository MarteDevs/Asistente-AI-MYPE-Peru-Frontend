import axios from 'axios'
import { config } from '../config/env.js'

// Configuración base de la API desde variables de entorno
const { baseURL: API_BASE_URL, timeout: API_TIMEOUT } = config.api

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT, // Timeout configurable desde .env
})

// Interceptor para manejo de respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Error de conexión con el servidor'
    console.error('API Error:', message)
    return Promise.reject(new Error(message))
  },
)

// Interceptor para manejo de requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  },
)

export default api
