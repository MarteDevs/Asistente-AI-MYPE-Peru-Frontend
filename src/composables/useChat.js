import { ref, computed, nextTick } from 'vue'
import { useApi } from './useApi.js'
import { chatService } from '../services/index.js'
import trialService from '../services/trialService.js'
import { config } from '../config/env.js'

/**
 * Composable para manejar el chat con IA
 * @returns {Object} Estado y funciones para el chat
 */
export function useChat() {
  const { execute, loading, error, clearError } = useApi()

  const messages = ref([])
  const currentMessage = ref('')
  const assistantInfo = ref(null)
  const chatContainer = ref(null)

  /**
   * Envía un mensaje al asistente de IA
   * @param {string} message - Mensaje a enviar
   */
  const sendMessage = async (message = currentMessage.value) => {
    if (!message || message.trim().length === 0) {
      throw new Error('El mensaje no puede estar vacío')
    }

    // Verificar si el usuario puede usar el chat antes de enviar
    const chatAccess = trialService.canUseChat()
    if (!chatAccess.canUse) {
      // Mostrar mensaje de límite alcanzado
      const limitMessage = {
        id: Date.now(),
        type: 'limit',
        content: `🚫 **Límite de consultas gratuitas alcanzado**

Has alcanzado el límite de ${trialService.getTrialStatus().maxAttempts} consultas gratuitas disponibles. Para continuar usando el asistente de IA:

**💎 Obtén acceso premium:**
• Consultas ilimitadas con la IA
• Calculadora de régimen tributario avanzada
• Soporte prioritario
• Historial completo de consultas

**Precio:** Solo S/15.00 PEN (pago único)

**Mientras tanto, puedes:**
• Usar la calculadora de régimen tributario básica
• Revisar la información en la sección "Información Útil"
• Registrarte o iniciar sesión para obtener acceso premium`,
        timestamp: new Date(),
      }

      messages.value.push(limitMessage)
      await scrollToBottom()
      
      // Emitir evento para mostrar modal de pago
      window.dispatchEvent(new CustomEvent('showPaymentModal'))
      
      return {
        success: false,
        limitReached: true,
        message: chatAccess.message,
        remainingQueries: chatAccess.remainingAttempts
      }
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
    }

    // Agregar mensaje del usuario
    messages.value.push(userMessage)
    currentMessage.value = ''

    // Scroll al final
    await scrollToBottom()

    try {
      // Agregar mensaje de "escribiendo..."
      const typingMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        typing: true,
      }
      messages.value.push(typingMessage)
      await scrollToBottom()

      // Enviar mensaje a la API usando el servicio actualizado
      const result = await chatService.sendMessage(message)

      // Remover mensaje de "escribiendo..."
      messages.value.pop()

      // Verificar si la respuesta fue exitosa
      if (result.success) {
        const assistantMessage = {
          id: Date.now() + 2,
          type: 'assistant',
          content: result.response,
          timestamp: new Date(),
        }

        messages.value.push(assistantMessage)
        await scrollToBottom()

        return result
      } else {
        // Manejar límite de consultas alcanzado
        if (result.limitReached) {
          const limitMessage = {
            id: Date.now() + 3,
            type: 'limit',
            content: `🚫 **Límite de consultas gratuitas alcanzado**

Has alcanzado el límite de consultas gratuitas disponibles. Para continuar usando el asistente de IA:

**💎 Obtén acceso premium:**
• Consultas ilimitadas con la IA
• Calculadora de régimen tributario avanzada
• Soporte prioritario
• Historial completo de consultas

**Precio:** Solo S/15.00 PEN (pago único)

**Mientras tanto, puedes:**
• Usar la calculadora de régimen tributario básica
• Revisar la información en la sección "Información Útil"
• Obtener acceso premium para continuar`,
            timestamp: new Date(),
          }

          messages.value.push(limitMessage)
          await scrollToBottom()
          
          // Emitir evento para mostrar modal de pago
          window.dispatchEvent(new CustomEvent('showPaymentModal'))
          
          return result
        } else {
          // Error general
          throw new Error(result.message || 'Error al enviar el mensaje')
        }
      }
    } catch (error) {
      // Remover mensaje de "escribiendo..." en caso de error
      if (messages.value.length > 0 && messages.value[messages.value.length - 1].typing) {
        messages.value.pop()
      }

      // Determinar el tipo de error y mostrar mensaje apropiado
      let errorContent = ''
      if (
        error.message.includes('conexión') ||
        error.message.includes('Network Error') ||
        error.message.includes('500')
      ) {
        errorContent = `🔌 **Servicio temporalmente no disponible**

Lo siento, el servicio de chat no está disponible en este momento. Esto puede deberse a que:

• El servidor backend no está ejecutándose
• Problemas de conectividad de red
• Mantenimiento del servicio

**Mientras tanto, puedes:**
• Usar la calculadora de régimen tributario
• Revisar la información en la sección "Información Útil"
• Intentar nuevamente en unos minutos

Si eres desarrollador, asegúrate de que el servidor backend esté corriendo en \`${config.api.baseURL.replace('/api', '')}\``
      } else if (error.message.includes('comunicarme con la IA') || error.message.includes('IA')) {
        errorContent = `🤖 **Servicio de IA temporalmente no disponible**

El servidor está funcionando, pero hay un problema con el servicio de inteligencia artificial. Esto puede deberse a:

• Configuración de API keys faltante o incorrecta
• Servicio de IA externo temporalmente no disponible
• Límites de uso alcanzados

**Mientras tanto, puedes:**
• Usar la calculadora de régimen tributario
• Revisar la información en la sección "Información Útil"
• Intentar nuevamente en unos minutos

**Para desarrolladores:** Verifica la configuración de las API keys del servicio de IA en el backend.`
      } else {
        errorContent = `❌ **Error**: ${error.message}`
      }

      const errorMessage = {
        id: Date.now() + 3,
        type: 'error',
        content: errorContent,
        timestamp: new Date(),
      }

      messages.value.push(errorMessage)
      await scrollToBottom()
      throw error
    }
  }

  /**
   * Obtiene información del asistente
   */
  const fetchAssistantInfo = async () => {
    try {
      const result = await execute(() => chatService.getAssistantInfo())
      assistantInfo.value = result.data
      return result
    } catch (error) {
      console.error('Error obteniendo información del asistente:', error)
      throw error
    }
  }

  /**
   * Hace scroll al final del chat
   */
  const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }

  /**
   * Limpia el historial de chat
   */
  const clearChat = () => {
    messages.value = []
    currentMessage.value = ''
    clearError()
  }

  /**
   * Valida el mensaje antes de enviarlo
   * @param {string} message - Mensaje a validar
   * @returns {Object} Resultado de la validación
   */
  const validateMessage = (message) => {
    if (!message || message.trim().length === 0) {
      return { valid: false, message: 'El mensaje no puede estar vacío' }
    }

    if (message.length > 1000) {
      return { valid: false, message: 'El mensaje no puede exceder 1000 caracteres' }
    }

    return { valid: true, message: '' }
  }

  /**
   * Formatea la fecha del mensaje
   * @param {Date|number|string} timestamp - Fecha a formatear
   * @returns {string} Fecha formateada
   */
  const formatMessageTime = (timestamp) => {
    try {
      // Si timestamp es undefined o null, usar fecha actual
      if (!timestamp) {
        timestamp = new Date()
      }

      // Convertir a Date si no lo es ya
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp)

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn('Timestamp inválido:', timestamp)
        return 'Hora inválida'
      }

      return new Intl.DateTimeFormat('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch (error) {
      console.error('Error formateando timestamp:', error, timestamp)
      return 'Hora inválida'
    }
  }

  /**
   * Agrega un mensaje de bienvenida
   */
  const addWelcomeMessage = () => {
    const welcomeMessage = {
      id: 0,
      type: 'assistant',
      content:
        '¡Hola! Soy tu asistente especializado en micro y pequeñas empresas en Perú. Puedo ayudarte con información sobre regímenes tributarios, formalización de empresas, beneficios MYPE y mucho más. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    }

    if (messages.value.length === 0) {
      messages.value.push(welcomeMessage)
    }
  }

  // Computed properties
  const hasMessages = computed(() => messages.value.length > 0)
  const isValidMessage = computed(() => validateMessage(currentMessage.value).valid)
  const messageCount = computed(() => messages.value.length)
  const lastMessage = computed(() => messages.value[messages.value.length - 1])
  const trialStatus = computed(() => trialService.getTrialStatus())
  const canUseChat = computed(() => trialService.canUseChat())

  // Mensajes sugeridos para empezar
  const suggestedMessages = ref([
    '¿Qué beneficios tiene el Nuevo RUS?',
    '¿Cómo me formalizo como MYPE?',
    '¿Cuáles son los regímenes tributarios disponibles?',
    '¿Qué documentos necesito para registrar mi empresa?',
    '¿Cuáles son las obligaciones de una MYPE?',
  ])

  /**
   * Envía un mensaje sugerido
   * @param {string} message - Mensaje sugerido
   */
  const sendSuggestedMessage = (message) => {
    currentMessage.value = message
    return sendMessage()
  }

  /**
   * Obtiene el historial de chat del usuario
   */
  const getChatHistory = async () => {
    try {
      const result = await chatService.getChatHistory()
      
      if (result.success) {
        // Convertir el historial del backend al formato del frontend
        const historyMessages = result.history.map((msg, index) => ({
          id: Date.now() + index,
          type: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }))
        
        messages.value = historyMessages
        await scrollToBottom()
        
        return result
      } else {
        console.error('Error obteniendo historial:', result.message)
        return result
      }
    } catch (error) {
      console.error('Error obteniendo historial de chat:', error)
      throw error
    }
  }

  return {
    // Estado
    messages,
    currentMessage,
    assistantInfo,
    chatContainer,
    loading,
    error,
    suggestedMessages,

    // Computed
    hasMessages,
    isValidMessage,
    messageCount,
    lastMessage,
    trialStatus,
    canUseChat,

    // Funciones
    sendMessage,
    sendSuggestedMessage,
    fetchAssistantInfo,
    getChatHistory,
    clearChat,
    validateMessage,
    formatMessageTime,
    addWelcomeMessage,
    scrollToBottom,
    clearError,
  }
}

export default useChat
