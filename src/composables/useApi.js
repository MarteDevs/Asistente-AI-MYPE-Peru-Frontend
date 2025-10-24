import { ref, reactive } from 'vue'

/**
 * Composable para manejar llamadas a la API con estado de carga y errores
 * @returns {Object} Estado y funciones para manejar API calls
 */
export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  
  const state = reactive({
    loading: false,
    error: null,
    data: null
  })

  /**
   * Ejecuta una función de API y maneja el estado
   * @param {Function} apiCall - Función que retorna una promesa
   * @returns {Promise} Resultado de la llamada a la API
   */
  const execute = async (apiCall) => {
    loading.value = true
    state.loading = true
    error.value = null
    state.error = null
    state.data = null

    try {
      const result = await apiCall()
      state.data = result
      return result
    } catch (err) {
      // Mejorar manejo de errores según la guía
      let errorMessage = 'Error desconocido'
      
      if (err.response) {
        // Error de respuesta del servidor
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Error ${err.response.status}: ${err.response.statusText}`
      } else if (err.request) {
        // Error de red/conexión
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.'
      } else {
        // Error en la configuración de la petición
        errorMessage = err.message || 'Error en la petición'
      }
      
      error.value = errorMessage
      state.error = errorMessage
      
      // Re-lanzar el error con el mensaje mejorado
      const enhancedError = new Error(errorMessage)
      enhancedError.originalError = err
      enhancedError.response = err.response
      throw enhancedError
    } finally {
      loading.value = false
      state.loading = false
    }
  }

  /**
   * Ejecuta múltiples llamadas a la API en paralelo
   * @param {Array<Function>} apiCalls - Array de funciones que retornan promesas
   * @returns {Promise<Array>} Array con los resultados
   */
  const executeParallel = async (apiCalls) => {
    loading.value = true
    state.loading = true
    error.value = null
    state.error = null

    try {
      const results = await Promise.all(apiCalls.map(call => call()))
      state.data = results
      return results
    } catch (err) {
      const errorMessage = err.message || 'Error en operaciones paralelas'
      error.value = errorMessage
      state.error = errorMessage
      throw err
    } finally {
      loading.value = false
      state.loading = false
    }
  }

  /**
   * Ejecuta una llamada con reintentos automáticos
   * @param {Function} apiCall - Función que retorna una promesa
   * @param {number} maxRetries - Número máximo de reintentos (default: 3)
   * @param {number} delay - Delay entre reintentos en ms (default: 1000)
   * @returns {Promise} Resultado de la llamada a la API
   */
  const executeWithRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
    let lastError = null
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await execute(apiCall)
      } catch (err) {
        lastError = err
        
        // Si es el último intento o es un error que no debe reintentarse, lanzar error
        if (attempt === maxRetries || 
            (err.response && err.response.status >= 400 && err.response.status < 500)) {
          throw err
        }
        
        // Esperar antes del siguiente intento
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)))
        }
      }
    }
    
    throw lastError
  }

  /**
   * Limpia el estado de error
   */
  const clearError = () => {
    error.value = null
    state.error = null
  }

  /**
   * Limpia todos los estados
   */
  const reset = () => {
    loading.value = false
    error.value = null
    state.loading = false
    state.error = null
    state.data = null
  }

  return {
    // Estados individuales (para compatibilidad)
    loading,
    error,
    
    // Estado reactivo completo
    state,
    
    // Funciones
    execute,
    executeParallel,
    executeWithRetry,
    clearError,
    reset
  }
}

export default useApi