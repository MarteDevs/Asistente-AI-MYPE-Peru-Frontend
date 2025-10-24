import { ref, computed, onMounted } from 'vue'
import authService from '../services/authService.js'
import paymentService from '../services/paymentService.js'
import chatService from '../services/chatService.js'

// Estado global de autenticación
const user = ref(null)
const isAuthenticated = ref(false)
const isLoading = ref(false)
const authError = ref(null)

// Estado de límites de consultas
const queryLimits = ref({
  isPremium: false,
  freeQueriesUsed: 0,
  freeQueriesLimit: 5,
  freeQueriesRemaining: 5,
  isAnonymous: true
})

/**
 * Composable para manejar autenticación
 */
export function useAuth() {
  
  // Computed properties
  const isPremium = computed(() => user.value?.isPremium || false)
  const canMakeQuery = computed(() => {
    return isPremium.value || queryLimits.value.freeQueriesRemaining > 0
  })
  const needsUpgrade = computed(() => {
    return !isPremium.value && queryLimits.value.freeQueriesRemaining <= 0
  })

  /**
   * Inicializa el estado de autenticación
   */
  const initAuth = async () => {
    isLoading.value = true
    authError.value = null

    try {
      // Configurar interceptor de auth
      authService.setupAuthInterceptor()

      // Verificar si hay token guardado
      if (authService.hasToken()) {
        const authStatus = await authService.getAuthStatus()
        
        if (authStatus.data?.authenticated) {
          user.value = authStatus.data.user
          isAuthenticated.value = true
          await updateQueryLimits()
        } else {
          // Token inválido, limpiar
          await logout()
        }
      } else {
        // Sin token, actualizar límites para usuario anónimo
        await updateQueryLimits()
      }
    } catch (error) {
      console.error('Error inicializando auth:', error.message)
      authError.value = error.message
      await logout()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registra un nuevo usuario
   */
  const register = async (userData) => {
    isLoading.value = true
    authError.value = null

    try {
      const response = await authService.register(userData)
      
      if (response.success && response.user) {
        user.value = response.user
        isAuthenticated.value = true
        await updateQueryLimits()
      }

      return response
    } catch (error) {
      authError.value = error.message
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Inicia sesión
   */
  const login = async (credentials) => {
    isLoading.value = true
    authError.value = null

    try {
      const response = await authService.login(credentials)
      
      if (response.success && response.user) {
        user.value = response.user
        isAuthenticated.value = true
        await updateQueryLimits()
      }

      return response
    } catch (error) {
      authError.value = error.message
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cierra sesión
   */
  const logout = async () => {
    isLoading.value = true

    try {
      await authService.logout()
    } catch (error) {
      console.error('Error en logout:', error.message)
    } finally {
      user.value = null
      isAuthenticated.value = false
      queryLimits.value = {
        isPremium: false,
        freeQueriesUsed: 0,
        freeQueriesLimit: 0,
        freeQueriesRemaining: 0,
        isAnonymous: true
      }
      isLoading.value = false
    }
  }

  /**
   * Actualiza el perfil del usuario
   */
  const refreshProfile = async () => {
    if (!isAuthenticated.value) return

    try {
      const response = await authService.getProfile()
      if (response.data?.user) {
        user.value = response.data.user
        await updateQueryLimits()
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error.message)
      if (error.message.includes('token') || error.message.includes('autenticación')) {
        await logout()
      }
    }
  }

  /**
   * Actualiza los límites de consultas
   */
  const updateQueryLimits = async () => {
    try {
      const limits = await chatService.getQueryLimits()
      if (limits.success) {
        queryLimits.value = limits.data
      }
    } catch (error) {
      console.error('Error actualizando límites:', error.message)
    }
  }

  /**
   * Alias para updateQueryLimits (para compatibilidad)
   */
  const refreshQueryLimits = updateQueryLimits

  /**
   * Verifica si se puede hacer una consulta
   */
  const checkQueryPermission = async () => {
    await updateQueryLimits()
    
    if (!canMakeQuery.value) {
      throw new Error('Has alcanzado el límite de consultas gratuitas. Regístrate y obtén acceso premium.')
    }
    
    return true
  }

  /**
   * Procesa el resultado de una consulta (actualiza contadores)
   */
  const processQueryResult = async (queryResult) => {
    // Si la respuesta incluye información actualizada del usuario, usarla
    if (queryResult.data?.user) {
      const updatedUser = queryResult.data.user
      if (user.value) {
        user.value.freeQueriesUsed = updatedUser.freeQueriesUsed
        user.value.freeQueriesRemaining = updatedUser.freeQueriesRemaining
      }
    }
    
    // Actualizar límites
    await updateQueryLimits()
  }

  /**
   * Limpia errores de autenticación
   */
  const clearAuthError = () => {
    authError.value = null
  }

  // Escuchar eventos de logout desde otros componentes
  onMounted(() => {
    window.addEventListener('auth:logout', logout)
    
    // Cleanup
    return () => {
      window.removeEventListener('auth:logout', logout)
    }
  })

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    authError,
    queryLimits,
    
    // Computed
    isPremium,
    canMakeQuery,
    needsUpgrade,
    
    // Métodos
    initAuth,
    register,
    login,
    logout,
    refreshProfile,
    updateQueryLimits,
    refreshQueryLimits,
    checkQueryPermission,
    processQueryResult,
    clearAuthError
  }
}

// Instancia singleton para uso global
let authInstance = null

export function useGlobalAuth() {
  if (!authInstance) {
    authInstance = useAuth()
  }
  return authInstance
}