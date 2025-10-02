import { ref, computed, nextTick } from 'vue'
import { useApi } from './useApi.js'
import { chatService } from '../services/index.js'
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

      // Enviar mensaje a la API
      const result = await execute(() => chatService.sendMessage(message))

      // Remover mensaje de "escribiendo..." y agregar respuesta real
      messages.value.pop()

      // Manejar diferentes formatos de respuesta del backend
      let messageContent, messageTimestamp

      if (result.data.reply) {
        // Nuevo formato: { data: { reply: { text, timestamp } } }
        messageContent = result.data.reply.text
        messageTimestamp = result.data.reply.timestamp
      } else if (result.data.message) {
        // Formato documentado: { data: { message, timestamp } }
        messageContent = result.data.message
        messageTimestamp = result.data.timestamp
      } else {
        throw new Error('Formato de respuesta inválido')
      }

      const assistantMessage = {
        id: Date.now() + 2,
        type: 'assistant',
        content: messageContent,
        timestamp: new Date(messageTimestamp),
      }

      messages.value.push(assistantMessage)
      await scrollToBottom()

      return result
    } catch (error) {
      // Remover mensaje de "escribiendo..." en caso de error
      messages.value.pop()

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

    // Funciones
    sendMessage,
    sendSuggestedMessage,
    fetchAssistantInfo,
    clearChat,
    validateMessage,
    formatMessageTime,
    addWelcomeMessage,
    scrollToBottom,
    clearError,
  }
}

export default useChat
