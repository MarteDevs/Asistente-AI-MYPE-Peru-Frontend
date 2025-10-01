import axios from 'axios'

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3001/api'

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
})

// Interceptor para manejo de respuestas
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error || 'Error de conexión con el servidor'
    console.error('API Error:', message)
    return Promise.reject(new Error(message))
  }
)

// Interceptor para manejo de requests
api.interceptors.request.use(
  config => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

export default api