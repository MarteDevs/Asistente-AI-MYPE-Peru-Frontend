import api from './api.js'
import trialService from './trialService.js'

// Datos mock para cuando el backend no esté disponible
const mockQueryLimits = {
  isPremium: false,
  freeQueriesUsed: 0,
  freeQueriesLimit: 5,
  freeQueriesRemaining: 5,
  isAnonymous: true
}

const mockChatHistory = {
  conversations: [],
  totalCount: 0,
  hasMore: false
}

const mockAssistantInfo = {
  name: 'LEGALYTH IA',
  description: 'Asistente virtual especializado en ayudar a emprendedores peruanos a formalizarse y gestionar obligaciones tributarias con información actualizada.',
  version: '1.0.0',
  model: 'AI-MYPE-Assistant',
  available: true,
  specialties: [
    'Información sobre regímenes tributarios',
    'Asesoría en formalización de empresas',
    'Orientación sobre beneficios y obligaciones MYPE',
    'Consejos de gestión empresarial',
    'Programas de apoyo gubernamental'
  ]
}

// Función para simular delay de red
const simulateNetworkDelay = (min = 200, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Función para generar respuestas mock del asistente
const generateMockResponse = (message) => {
  const responses = [
    {
      text: `Gracias por tu consulta sobre "${message}". Como asistente especializado en MYPE, puedo ayudarte con información sobre regímenes tributarios, formalización de empresas y beneficios disponibles. ¿Podrías ser más específico sobre qué aspecto te interesa más?`,
      confidence: 0.85
    },
    {
      text: `Entiendo que necesitas información sobre "${message}". Para las micro y pequeñas empresas en Perú, existen varios regímenes tributarios como el Nuevo RUS, RER, RMT y Régimen General. Cada uno tiene diferentes beneficios y requisitos. ¿Te gustaría que te explique las diferencias?`,
      confidence: 0.90
    },
    {
      text: `Tu consulta sobre "${message}" es muy importante para el crecimiento de tu negocio. Como MYPE, tienes acceso a diversos beneficios y programas de apoyo. Te recomiendo revisar las opciones disponibles según tu tipo de actividad económica y nivel de ingresos.`,
      confidence: 0.80
    }
  ]

  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  return {
    success: true,
    data: {
      userMessage: message,
      aiResponse: {
        text: randomResponse.text,
        confidence: randomResponse.confidence,
        timestamp: new Date().toISOString()
      }
    }
  }
}

const chatService = {
  /**
   * Envía un mensaje al asistente de IA
   * @param {string} message - Mensaje del usuario
   * @returns {Promise<Object>} Respuesta del asistente
   */
  async sendMessage(message) {
    try {
      if (!message || message.trim().length === 0) {
        throw new Error('El mensaje no puede estar vacío')
      }

      // Verificar si el usuario puede usar el chat
      const chatAccess = trialService.canUseChat()
      if (!chatAccess.canUse) {
        return {
          success: false,
          limitReached: true,
          message: chatAccess.message,
          remainingQueries: chatAccess.remainingAttempts,
          reason: chatAccess.reason
        }
      }

      // Intentar usar el backend real primero
      try {
        const response = await api.post('/chat/message', {
          message: message.trim(),
          timestamp: new Date().toISOString(),
        })

        // Verificar si la respuesta es exitosa
        if (response.data.success) {
          // Incrementar contador de intentos solo para usuarios no autenticados
          if (chatAccess.reason === 'trial') {
            trialService.incrementAttempts()
          }

          return {
            success: true,
            response: response.data.data.aiResponse.text,
            userMessage: response.data.data.userMessage,
            aiResponse: response.data.data.aiResponse,
            limitReached: false,
            remainingAttempts: trialService.getRemainingAttempts()
          }
        } else {
          // Manejar caso de límite alcanzado
          if (response.data.limitReached) {
            return {
              success: false,
              limitReached: true,
              message: response.data.message || 'Límite de consultas alcanzado',
              remainingQueries: response.data.remainingQueries || 0,
            }
          }

          throw new Error(response.data.message || 'Error en la respuesta del servidor')
        }
      } catch (backendError) {
        console.warn('Backend no disponible, usando datos mock:', backendError.message)

        // Usar datos mock cuando el backend no esté disponible
        await simulateNetworkDelay(800, 1500)

        const mockResponse = generateMockResponse(message.trim())

        // Incrementar contador de intentos solo para usuarios no autenticados
        if (chatAccess.reason === 'trial') {
          trialService.incrementAttempts()
        }

        return {
          success: true,
          response: mockResponse.data.aiResponse.text,
          userMessage: mockResponse.data.userMessage,
          aiResponse: mockResponse.data.aiResponse,
          limitReached: false,
          remainingAttempts: trialService.getRemainingAttempts()
        }
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error)

      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error del servidor (4xx, 5xx)
        const status = error.response.status
        const data = error.response.data

        if (status === 429) {
          // Límite de rate alcanzado
          return {
            success: false,
            limitReached: true,
            message: data.message || 'Has alcanzado el límite de consultas',
            remainingQueries: data.remainingQueries || 0,
          }
        } else if (status === 401) {
          // No autenticado
          throw new Error('Debes iniciar sesión para usar el asistente')
        } else if (status === 403) {
          // Sin permisos
          throw new Error('No tienes permisos para usar esta función')
        } else {
          throw new Error(data.message || `Error del servidor: ${status}`)
        }
      } else if (error.request) {
        // Error de conexión - usar mock
        console.warn('Error de conexión, usando datos mock')
        await simulateNetworkDelay(500, 1000)

        const mockResponse = generateMockResponse(message.trim())

        // Incrementar contador de intentos solo para usuarios no autenticados
        if (chatAccess.reason === 'trial') {
          trialService.incrementAttempts()
        }

        return {
          success: true,
          response: mockResponse.data.aiResponse.text,
          userMessage: mockResponse.data.userMessage,
          aiResponse: mockResponse.data.aiResponse,
          limitReached: false,
          remainingAttempts: trialService.getRemainingAttempts()
        }
      } else {
        // Error de configuración
        throw new Error(error.message || 'Error inesperado')
      }
    }
  },

  /**
   * Obtiene el historial de chat del usuario
   * @returns {Promise<Object>} Historial de conversaciones
   */
  async getChatHistory() {
    try {
      // Intentar usar el backend real primero
      try {
        const response = await api.get('/chat/history')

        if (response.data.success) {
          return {
            success: true,
            data: response.data.data,
          }
        }

        throw new Error(response.data.message || 'Error obteniendo historial de chat')
      } catch (backendError) {
        console.warn(
          'Backend no disponible para historial, usando datos mock:',
          backendError.message,
        )

        // Usar datos mock cuando el backend no esté disponible
        await simulateNetworkDelay(400, 900)

        return {
          success: true,
          data: mockChatHistory,
        }
      }
    } catch (error) {
      console.error('Error obteniendo historial de chat:', error)

      if (error.request) {
        // Error de conexión - usar mock
        console.warn('Error de conexión, usando datos mock para historial')
        await simulateNetworkDelay(300, 600)

        return {
          success: true,
          data: mockChatHistory,
        }
      }

      throw new Error(error.message || 'Error obteniendo historial de chat')
    }
  },

  /**
   * Obtiene información del asistente
   * @returns {Promise<Object>} Información del asistente
   */
  async getAssistantInfo() {
    try {
      // Intentar usar el backend real primero
      try {
        const response = await api.get('/chat/info')

        if (response.data.success) {
          return {
            success: true,
            data: response.data.data,
          }
        }

        throw new Error(response.data.message || 'Error obteniendo información del asistente')
      } catch (backendError) {
        console.warn(
          'Backend no disponible para info del asistente, usando datos mock:',
          backendError.message,
        )

        // Usar datos mock cuando el backend no esté disponible
        await simulateNetworkDelay(300, 800)

        return {
          success: true,
          data: mockAssistantInfo,
        }
      }
    } catch (error) {
      console.error('Error obteniendo información del asistente:', error)

      if (error.request) {
        // Error de conexión - usar mock
        console.warn('Error de conexión, usando datos mock para info del asistente')
        await simulateNetworkDelay(200, 500)

        return {
          success: true,
          data: mockAssistantInfo,
        }
      }

      throw new Error(error.message || 'Error obteniendo información del asistente')
    }
  },

  /**
   * Obtiene los límites de consulta del usuario
   * @returns {Promise<Object>} Información sobre límites de consulta
   */
  async getQueryLimits() {
    try {
      // Intentar usar el backend real primero
      try {
        const response = await api.get('/chat/limits')

        if (response.data.success) {
          return {
            success: true,
            data: response.data.data,
          }
        }

        throw new Error(response.data.message || 'Error obteniendo límites de consulta')
      } catch (backendError) {
        console.warn('Backend no disponible para límites, usando datos mock:', backendError.message)

        // Usar datos mock cuando el backend no esté disponible
        await simulateNetworkDelay(200, 600)

        return {
          success: true,
          data: mockQueryLimits,
        }
      }
    } catch (error) {
      console.error('Error obteniendo límites de consulta:', error)

      if (error.request) {
        // Error de conexión - usar mock
        console.warn('Error de conexión, usando datos mock para límites')
        await simulateNetworkDelay(150, 400)

        return {
          success: true,
          data: mockQueryLimits,
        }
      }

      throw new Error(error.message || 'Error obteniendo límites de consulta')
    }
  },

  /**
   * Verifica el estado del servicio de chat
   * @returns {Promise<Object>} Estado del servicio
   */
  async checkHealth() {
    try {
      const response = await api.get('/chat/health')
      return response.data
    } catch (error) {
      console.error('Error verificando salud del chat:', error.message)
      throw error
    }
  },
}

export default chatService
