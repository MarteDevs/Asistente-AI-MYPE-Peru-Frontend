import api from './api.js'

/**
 * Servicio para manejar operaciones relacionadas con regímenes tributarios
 */
export const taxRegimeService = {
  /**
   * Calcula el régimen tributario apropiado basado en ingresos mensuales
   * @param {number} monthlyIncome - Ingreso mensual en soles
   * @returns {Promise<Object>} Respuesta con la recomendación del régimen
   */
  async calculate(monthlyIncome) {
    try {
      const response = await api.post('/tax-regime/calculate', { 
        monthlyIncome: Number(monthlyIncome) 
      })
      return response.data
    } catch (error) {
      console.error('Error calculando régimen tributario:', error.message)
      throw error
    }
  },

  /**
   * Obtiene información de todos los regímenes tributarios disponibles
   * @returns {Promise<Object>} Lista de todos los regímenes
   */
  async getAllRegimes() {
    try {
      const response = await api.get('/tax-regime/regimes')
      return response.data
    } catch (error) {
      console.error('Error obteniendo regímenes:', error.message)
      throw error
    }
  },

  /**
   * Verifica el estado del servicio de regímenes tributarios
   * @returns {Promise<Object>} Estado del servicio
   */
  async checkHealth() {
    try {
      const response = await api.get('/tax-regime/health')
      return response.data
    } catch (error) {
      console.error('Error verificando salud del servicio:', error.message)
      throw error
    }
  }
}

export default taxRegimeService