import { ref, computed } from 'vue'
import { useApi } from './useApi.js'
import { taxRegimeService } from '../services/index.js'

/**
 * Composable para manejar operaciones de regímenes tributarios
 * @returns {Object} Estado y funciones para regímenes tributarios
 */
export function useTaxRegime() {
  const { execute, loading, error, clearError, reset } = useApi()
  
  const recommendation = ref(null)
  const regimes = ref([])
  const monthlyIncome = ref('')

  /**
   * Calcula el régimen tributario recomendado
   * @param {number} income - Ingreso mensual
   */
  const calculateRegime = async (income) => {
    try {
      const result = await execute(() => taxRegimeService.calculate(income))
      
      // Mapear la respuesta de la API al formato esperado por el componente
      if (result && result.data) {
        const apiData = result.data
        
        // Calcular impuesto estimado basado en el régimen recomendado
        const monthlyIncome = apiData.details?.monthlyIncome || Number(income)
        const annualIncome = apiData.details?.annualIncome || (Number(income) * 12)
        
        // Estimación básica de impuestos según el régimen
        let estimatedMonthlyTax = 0
        if (apiData.regime?.includes('MYPE')) {
          // MYPE Tributario: aproximadamente 1% de ingresos netos
          estimatedMonthlyTax = monthlyIncome * 0.01
        } else if (apiData.regime?.includes('General')) {
          // Régimen General: aproximadamente 29.5% de utilidades (estimamos 20% de utilidad)
          estimatedMonthlyTax = monthlyIncome * 0.20 * 0.295
        } else {
          // Otros regímenes: estimación conservadora
          estimatedMonthlyTax = monthlyIncome * 0.015
        }
        
        recommendation.value = {
          regime: apiData.regime,
          description: apiData.message,
          monthlyTax: apiData.payment || estimatedMonthlyTax,
          monthlyIncome: monthlyIncome,
          annualIncome: annualIncome,
          taxType: apiData.details?.taxType || 'Pago mensual estimado',
          igvIncluded: apiData.details?.igvIncluded || false,
          benefits: apiData.benefits || [],
          requirements: apiData.requirements || [
            'Llevar contabilidad completa',
            'Presentar declaraciones mensuales',
            'Emitir comprobantes de pago electrónicos'
          ]
        }
      }
      
      return result
    } catch (error) {
      console.error('Error calculando régimen:', error)
      throw error
    }
  }

  /**
   * Obtiene todos los regímenes disponibles
   */
  const fetchAllRegimes = async () => {
    try {
      const result = await execute(() => taxRegimeService.getAllRegimes())
      regimes.value = result.data?.regimes || []
      return result
    } catch (error) {
      console.error('Error obteniendo regímenes:', error)
      throw error
    }
  }

  /**
   * Valida el ingreso mensual
   * @param {string|number} income - Ingreso a validar
   * @returns {Object} Resultado de la validación
   */
  const validateIncome = (income) => {
    // Convertir a string y limpiar espacios
    const incomeStr = String(income || '').trim()
    
    if (!incomeStr || incomeStr === '') {
      return { valid: false, message: 'El ingreso mensual es requerido' }
    }
    
    const numIncome = Number(incomeStr)
    
    if (isNaN(numIncome)) {
      return { valid: false, message: 'El ingreso debe ser un número válido' }
    }
    
    if (numIncome <= 0) {
      return { valid: false, message: 'El ingreso debe ser mayor a 0' }
    }
    
    if (numIncome > 10000000) {
      return { valid: false, message: 'El ingreso no puede exceder S/ 10,000,000' }
    }

    // Verificar máximo 2 decimales
    if (incomeStr.includes('.')) {
      const decimalPlaces = incomeStr.split('.')[1].length
      if (decimalPlaces > 2) {
        return { valid: false, message: 'El ingreso puede tener máximo 2 decimales' }
      }
    }
    
    return { valid: true, message: '' }
  }

  /**
   * Formatea el monto en soles
   * @param {number} amount - Monto a formatear
   * @returns {string} Monto formateado
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  /**
   * Obtiene el color del régimen según el tipo
   * @param {string} regimeName - Nombre del régimen
   * @returns {string} Clase CSS para el color
   */
  const getRegimeColor = (regimeName) => {
    const colors = {
      'Nuevo RUS': 'text-green-600 bg-green-50',
      'RER': 'text-blue-600 bg-blue-50',
      'Régimen General': 'text-purple-600 bg-purple-50',
      'Régimen MYPE Tributario': 'text-orange-600 bg-orange-50'
    }
    return colors[regimeName] || 'text-gray-600 bg-gray-50'
  }

  // Computed properties
  const hasRecommendation = computed(() => recommendation.value !== null)
  const isValidIncome = computed(() => validateIncome(monthlyIncome.value).valid)
  const formattedIncome = computed(() => 
    monthlyIncome.value ? formatCurrency(Number(monthlyIncome.value)) : ''
  )

  /**
   * Limpia la recomendación actual
   */
  const clearRecommendation = () => {
    recommendation.value = null
    reset()
  }

  return {
    // Estado
    recommendation,
    regimes,
    monthlyIncome,
    loading,
    error,
    
    // Computed
    hasRecommendation,
    isValidIncome,
    formattedIncome,
    
    // Funciones
    calculateRegime,
    fetchAllRegimes,
    validateIncome,
    formatCurrency,
    getRegimeColor,
    clearRecommendation,
    clearError,
    reset
  }
}

export default useTaxRegime