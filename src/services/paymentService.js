import api from './api.js'

/**
 * Servicio para manejar operaciones de pagos
 */
export const paymentService = {
  /**
   * Crear una orden de pago
   * @param {Object} orderData - Datos de la orden
   * @param {number} orderData.amount - Monto del pago
   * @param {string} orderData.currency - Moneda (PEN, USD, etc.)
   * @param {string} orderData.description - Descripción del pago
   * @returns {Promise<Object>} Respuesta con los datos de la orden creada
   */
  async createOrder(orderData) {
    console.log('🔧 PaymentService.createOrder called with:', orderData) // Debug log
    
    try {
      console.log('📡 Making API call to /payments/create-order...') // Debug log
      const response = await api.post('/payments/create-order', orderData)
      console.log('✅ API response received:', response) // Debug log
      
      if (response.data && response.data.success) {
        console.log('✅ API response is successful') // Debug log
        const result = {
          success: true,
          data: {
            orderId: response.data.data.orderId,
            amount: response.data.data.amount,
            currency: response.data.data.currency,
            paymentData: response.data.data.paymentData
          }
        }
        console.log('✅ Returning result:', result) // Debug log
        return result
      }
      
      console.log('❌ API response not successful:', response.data) // Debug log
      return {
        success: false,
        message: response.data.message || 'Error al crear la orden'
      }
    } catch (error) {
      console.error('❌ Error creando orden de pago:', error) // Debug log
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear la orden de pago'
      }
    }
  },

  /**
   * Procesar un pago (simulado)
   * @param {Object} paymentData - Datos del pago
   * @param {string} paymentData.orderId - ID de la orden
   * @param {string} paymentData.paymentMethod - Método de pago ("card", "bank_transfer", "wallet")
   * @returns {Promise<Object>} Respuesta con los datos del pago procesado
   */
  async processPayment(paymentData) {
    console.log('💳 PaymentService.processPayment called with:', paymentData) // Debug log
    
    try {
      console.log('📡 Making API call to /payments/process...') // Debug log
      const response = await api.post('/payments/process', paymentData)
      console.log('✅ API response received:', response) // Debug log
      
      if (response.data && response.data.success) {
        console.log('✅ Payment processed successfully') // Debug log
        const result = {
          success: true,
          paymentId: response.data.data.transactionId, // Usar transactionId como paymentId
          status: response.data.data.status,
          transactionId: response.data.data.transactionId
        }
        console.log('✅ Returning payment result:', result) // Debug log
        return result
      }
      
      console.log('❌ Payment processing not successful:', response.data) // Debug log
      return {
        success: false,
        message: response.data.message || 'Error al procesar el pago'
      }
    } catch (error) {
      console.error('❌ Error procesando pago:', error) // Debug log
      return {
        success: false,
        message: error.response?.data?.message || 'Error al procesar el pago'
      }
    }
  },

  /**
   * Obtener el estado de un pago
   * @param {string} paymentId - ID del pago
   * @returns {Promise<Object>} Estado del pago
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}/status`)
      
      if (response.data.success) {
        return {
          success: true,
          payment: response.data.data
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al obtener el estado del pago'
      }
    } catch (error) {
      console.error('Error obteniendo estado del pago:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el estado del pago'
      }
    }
  },

  /**
   * Obtener historial de pagos del usuario
   * @returns {Promise<Object>} Historial de pagos
   */
  async getPaymentHistory() {
    try {
      const response = await api.get('/payments/history')
      
      if (response.data.success) {
        return {
          success: true,
          payments: response.data.data
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al obtener el historial'
      }
    } catch (error) {
      console.error('Error obteniendo historial de pagos:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el historial de pagos'
      }
    }
  },

  /**
   * Generar código QR para el pago
   * @param {Object} paymentData - Datos para el QR
   * @param {string} paymentData.orderId - ID de la orden
   * @param {number} paymentData.amount - Monto
   * @param {string} paymentData.currency - Moneda
   * @returns {string} Datos para generar el código QR
   */
  generateQRData(paymentData) {
    const qrData = {
      type: 'payment',
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      timestamp: new Date().toISOString(),
      merchant: 'LEGALYTH-MYPE'
    }
    
    return JSON.stringify(qrData)
  }
}

export default paymentService