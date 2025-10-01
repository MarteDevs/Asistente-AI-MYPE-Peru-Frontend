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
      const errorMessage = err.message || 'Error desconocido'
      error.value = errorMessage
      state.error = errorMessage
      throw err
    } finally {
      loading.value = false
      state.loading = false
    }
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
    clearError,
    reset
  }
}

export default useApi