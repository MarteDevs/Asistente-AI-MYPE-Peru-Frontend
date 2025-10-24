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

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    
    // Agregar token automáticamente si existe
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  },
)

// Interceptor para manejo de respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar token expirado o inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      // Redirigir al login si estamos en una ruta protegida
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    
    const message = error.response?.data?.message || error.response?.data?.error || 'Error de conexión con el servidor'
    console.error('API Error:', message)
    return Promise.reject(error)
  },
)

export default api
