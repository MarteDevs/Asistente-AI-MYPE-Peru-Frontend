import api from './api.js'

/**
 * Servicio de Autenticación para el Frontend
 * Maneja registro, login, logout y gestión de tokens
 */
const authService = {
  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async register(userData) {
    try {
      const { name, email, password } = userData

      // Validaciones básicas del frontend
      if (!name || name.trim().length < 2) {
        return {
          success: false,
          message: 'El nombre debe tener al menos 2 caracteres'
        }
      }

      if (!email || !email.includes('@')) {
        return {
          success: false,
          message: 'Email inválido'
        }
      }

      if (!password || password.length < 6) {
        return {
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        }
      }

      // Verificar que la contraseña tenga mayúscula, minúscula y número
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
      if (!passwordRegex.test(password)) {
        return {
          success: false,
          message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        }
      }

      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      })

      // Guardar token si el registro es exitoso
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user))
        
        return {
          success: true,
          user: response.data.data.user,
          token: response.data.data.token
        }
      }

      return {
        success: false,
        message: response.data.message || 'Error en el registro'
      }
    } catch (error) {
      console.error('Error en registro:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario',
        errors: error.response?.data?.errors
      }
    }
  },

  /**
   * Inicia sesión de usuario
   * @param {Object} credentials - Credenciales de login
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async login(credentials) {
    try {
      const { email, password } = credentials

      // Validaciones básicas del frontend
      if (!email || !email.includes('@')) {
        return {
          success: false,
          message: 'Email inválido'
        }
      }

      if (!password || password.length < 1) {
        return {
          success: false,
          message: 'Contraseña requerida'
        }
      }

      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      })

      // Guardar token si el login es exitoso
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user))
        
        return {
          success: true,
          user: response.data.data.user,
          token: response.data.data.token
        }
      }

      return {
        success: false,
        message: response.data.message || 'Error en el login'
      }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      }
    }
  },

  /**
   * Cierra sesión del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async logout() {
    try {
      // Intentar cerrar sesión en el servidor
      try {
        await api.post('/auth/logout')
      } catch (error) {
        // Continuar con el logout local aunque falle el servidor
        console.warn('Error cerrando sesión en servidor:', error.message)
      }

      // Limpiar datos locales
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')

      return { success: true, message: 'Sesión cerrada exitosamente' }
    } catch (error) {
      console.error('Error en logout:', error.message)
      throw error
    }
  },

  /**
   * Obtiene el perfil del usuario autenticado
   * @returns {Promise<Object>} Datos del usuario
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      
      // Actualizar datos locales del usuario
      if (response.data.success && response.data.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user))
      }

      return response.data
    } catch (error) {
      console.error('Error obteniendo perfil:', error.message)
      
      // Si el token es inválido, limpiar datos locales
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
      
      throw error
    }
  },

  /**
   * Verifica si el token actual es válido
   * @returns {Promise<Object>} Estado de autenticación
   */
  async verifyAuth() {
    try {
      const response = await api.get('/auth/verify')
      return response.data
    } catch (error) {
      console.error('Error verificando autenticación:', error.message)
      
      // Si el token es inválido, limpiar datos locales
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
      
      throw error
    }
  },

  /**
   * Configura el interceptor de autenticación para las peticiones API
   */
  setupAuthInterceptor() {
    // Este método puede configurar interceptores de axios si es necesario
    // Por ahora, simplemente verificamos que el token esté disponible
    const token = this.getToken()
    if (token) {
      // El token se incluye automáticamente en las peticiones a través del api.js
      console.log('Auth interceptor configurado con token existente')
    }
  },

  /**
   * Obtiene el estado del sistema de autenticación
   * @returns {Promise<Object>} Estado del sistema
   */
  async getAuthStatus() {
    try {
      // Si no hay token, retornar estado no autenticado
      if (!this.hasToken()) {
        return {
          data: {
            authenticated: false,
            user: null
          }
        }
      }

      // Verificar el token con el servidor
      const response = await this.verifyAuth()
      return {
        data: {
          authenticated: true,
          user: response.data?.user || this.getUser()
        }
      }
    } catch (error) {
      console.error('Error obteniendo estado de autenticación:', error.message)
      return {
        data: {
          authenticated: false,
          user: null
        }
      }
    }
  },

  /**
   * Obtiene el token almacenado localmente
   * @returns {string|null} Token JWT o null si no existe
   */
  getToken() {
    return localStorage.getItem('auth_token')
  },

  /**
   * Verifica si existe un token almacenado
   * @returns {boolean} True si existe un token
   */
  hasToken() {
    return !!this.getToken()
  },

  /**
   * Obtiene los datos del usuario almacenados localmente
   * @returns {Object|null} Datos del usuario o null si no existen
   */
  getUser() {
    try {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parseando datos de usuario:', error)
      return null
    }
  },

  /**
   * Verifica si el usuario está autenticado (tiene token)
   * @returns {boolean} True si está autenticado
   */
  isAuthenticated() {
    return !!this.getToken()
  },

  /**
   * Verifica si el usuario es premium
   * @returns {boolean} True si es premium
   */
  isPremium() {
    const user = this.getUser()
    return user ? user.isPremium : false
  }
}

export default authService