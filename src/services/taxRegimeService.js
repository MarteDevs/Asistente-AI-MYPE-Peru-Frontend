import api from './api.js'

/**
 * Servicio para manejar operaciones relacionadas con regímenes tributarios
 */
export const taxRegimeService = {
  /**
   * Calcular el régimen tributario apropiado
   * @param {Object} calculationData - Datos para el cálculo
   * @param {number} calculationData.monthlyIncome - Ingresos mensuales en soles
   * @param {string} calculationData.businessType - Tipo de negocio (opcional)
   * @param {boolean} calculationData.hasEmployees - Si tiene empleados (opcional)
   * @returns {Promise<Object>} Resultado del cálculo
   */
  async calculateTaxRegime(calculationData) {
    try {
      // Validaciones básicas
      if (!calculationData.monthlyIncome || calculationData.monthlyIncome <= 0) {
        throw new Error('Los ingresos mensuales deben ser mayor a 0')
      }

      const response = await api.post('/tax-regime/calculate', calculationData)
      
      if (response.data.success) {
        return {
          success: true,
          recommendedRegime: response.data.data.recommendedRegime,
          calculation: response.data.data.calculation,
          alternatives: response.data.data.alternatives
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al calcular el régimen tributario'
      }
    } catch (error) {
      console.error('Error calculando régimen tributario:', error)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al calcular el régimen tributario'
      }
    }
  },

  /**
   * Calcula el régimen tributario apropiado basado en ingresos mensuales (método legacy)
   * @param {number} monthlyIncome - Ingreso mensual en soles
   * @returns {Promise<Object>} Respuesta con la recomendación del régimen
   */
  async calculate(monthlyIncome) {
    return this.calculateTaxRegime({ monthlyIncome: Number(monthlyIncome) })
  },

  /**
   * Obtiene información de todos los regímenes tributarios disponibles
   * @returns {Promise<Object>} Lista de todos los regímenes
   */
  async getAllRegimes() {
    try {
      const response = await api.get('/tax-regime/regimes')
      
      if (response.data.success) {
        return {
          success: true,
          regimes: response.data.data
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al obtener los regímenes'
      }
    } catch (error) {
      console.error('Error obteniendo regímenes:', error)
      return {
        success: false,
        message: 'Error al obtener los regímenes tributarios'
      }
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